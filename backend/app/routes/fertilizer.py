import os
import json
from fastapi import APIRouter, Depends, HTTPException
from groq import AsyncGroq
from schemas.fertilizer import FertilizerRequest, FertilizerResponse, FertilizerHistoryResponse
from utils.auth import get_current_user
from database.connection import get_db
from models.user import UserModel
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/fertilizer", tags=["fertilizer"])

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")
    return AsyncGroq(api_key=api_key)

SYSTEM_PROMPT = """You are an expert agricultural AI specializing in soil science and crop nutrition.
Provide accurate, practical, and safe fertilizer recommendations based on the user's input.
CRITICAL INSTRUCTIONS:
- Do NOT give dangerous, excessive, or overly confident fertilizer quantities that could burn crops or harm the environment.
- When exact soil tests are missing, emphasize that recommendations are general estimates.
- Always encourage sustainable practices and soil health.
- Provide the output STRICTLY in the following JSON format without any markdown blocks or extra text:
{
    "nutrient_requirements": "General nutrient needs for this crop at this stage.",
    "fertilizer_guidance": "Specific guidance on what fertilizers to use and estimated safe quantities.",
    "application_timing": "When to apply the fertilizers.",
    "application_method": "How to apply them (e.g., broadcasting, side-dressing).",
    "precautions": ["Precaution 1", "Precaution 2"],
    "soil_health": "Tips to maintain long-term soil health."
}"""

@router.post("/recommend", response_model=FertilizerResponse)
async def recommend_fertilizer(
    request: FertilizerRequest,
    current_user: UserModel = Depends(get_current_user)
):
    db = get_db()
    client = get_groq_client()
    
    user_prompt = f"""
Please provide a fertilizer recommendation for the following scenario:
- Crop Name: {request.crop_name}
- Soil Type: {request.soil_type}
- Location: {request.location}
- Crop Growth Stage: {request.growth_stage}
- Soil Test Values (N-P-K, pH, etc.): {request.soil_test_values if request.soil_test_values else 'Not provided'}
- Available Fertilizer: {request.available_fertilizer if request.available_fertilizer else 'Not specified'}
    """
    
    dynamic_system_prompt = SYSTEM_PROMPT + f"\n\nIMPORTANT: You must translate ALL the JSON values into the {request.language} language. The JSON keys MUST remain in English as requested, but the values (sentences, lists) MUST be entirely in {request.language}."
    
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": dynamic_system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        ai_reply = chat_completion.choices[0].message.content
        result_dict = json.loads(ai_reply)
        
        # Fix LLM returning dicts/lists instead of strings
        string_keys = ["nutrient_requirements", "fertilizer_guidance", "application_timing", "application_method", "soil_health"]
        for key in string_keys:
            if key in result_dict and not isinstance(result_dict[key], str):
                if isinstance(result_dict[key], dict):
                    result_dict[key] = "\n".join([f"{str(k).capitalize()}: {v}" for k, v in result_dict[key].items()])
                elif isinstance(result_dict[key], list):
                    result_dict[key] = "\n".join([str(x) for x in result_dict[key]])
                else:
                    result_dict[key] = str(result_dict[key])
                    
        result = FertilizerResponse(**result_dict)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid data format.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI Service Error: {str(e)}")

    # Save history
    await db["fertilizer_history"].insert_one({
        "user_id": ObjectId(current_user.id),
        "request": request.model_dump(),
        "result": result.model_dump(),
        "created_at": datetime.utcnow()
    })

    return result

@router.get("/history", response_model=FertilizerHistoryResponse)
async def get_history(current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    
    cursor = db["fertilizer_history"].find(
        {"user_id": ObjectId(current_user.id)}
    ).sort("created_at", -1)
    
    history = []
    async for doc in cursor:
        history.append({
            "id": str(doc["_id"]),
            "request": doc["request"],
            "result": doc["result"],
            "created_at": doc["created_at"]
        })
        
    return {"history": history}
