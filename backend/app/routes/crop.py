import os
import base64
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from groq import AsyncGroq
from schemas.crop import CropAnalysisResult, CropAnalysisHistoryResponse
from utils.auth import get_current_user
from database.connection import get_db
from models.user import UserModel
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/crop", tags=["crop"])

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")
    return AsyncGroq(api_key=api_key)

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

def encode_image(file_bytes):
    return base64.b64encode(file_bytes).decode('utf-8')

PROMPT = """You are an expert agricultural AI. Analyze this image of a crop or leaf.
Provide the output strictly in the following JSON format without any markdown or extra text:
{
    "crop_name": "Name of the crop",
    "disease": "Name of the disease (or 'Healthy')",
    "confidence": "High/Medium/Low",
    "symptoms": ["symptom 1", "symptom 2"],
    "causes": ["cause 1", "cause 2"],
    "actions": ["action 1", "action 2"],
    "prevention": ["prevention 1", "prevention 2"]
}"""

@router.post("/analyze", response_model=CropAnalysisResult)
async def analyze_crop(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user)
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Invalid image type. Please upload JPEG, PNG, or WEBP.")

    db = get_db()
    client = get_groq_client()
    
    try:
        file_bytes = await file.read()
        if len(file_bytes) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
        base64_image = encode_image(file_bytes)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read uploaded image.")
        
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{file.content_type};base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model="qwen/qwen3.6-27b",
            temperature=0.2,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        ai_reply = chat_completion.choices[0].message.content
        result_dict = json.loads(ai_reply)
        result = CropAnalysisResult(**result_dict)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid data format.")
    except Exception as e:
        # Log the actual error internally (assuming logger is set up in real app)
        print(f"Vision Service Error: {str(e)}")
        raise HTTPException(status_code=502, detail="AI Vision Service is currently unavailable. Please try again later.")

    # Save history
    await db["crop_analysis"].insert_one({
        "user_id": ObjectId(current_user.id),
        "result": result.model_dump(),
        "created_at": datetime.utcnow()
    })

    return result

@router.get("/history", response_model=CropAnalysisHistoryResponse)
async def get_history(current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    
    cursor = db["crop_analysis"].find(
        {"user_id": ObjectId(current_user.id)}
    ).sort("created_at", -1)
    
    history = []
    async for doc in cursor:
        history.append({
            "id": str(doc["_id"]),
            "image_url": None, # Storing image URLs requires a storage service (like S3/Cloudinary), so we skip it for now
            "result": doc["result"],
            "created_at": doc["created_at"]
        })
        
    return {"history": history}
