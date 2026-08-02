import os
import json
from fastapi import APIRouter, Depends, HTTPException
from groq import AsyncGroq
from schemas.advisory import AdvisoryRequest, AdvisoryResponse, AdvisoryHistoryResponse
from utils.auth import get_current_user
from database.connection import get_db
from models.user import UserModel
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/advisory", tags=["advisory"])

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")
    return AsyncGroq(api_key=api_key)

SYSTEM_PROMPT = """You are an expert agricultural AI. Provide comprehensive, practical, and easy-to-understand crop advisory based on the user's situation.
CRITICAL INSTRUCTIONS:
- Use simple language suitable for farmers.
- Always provide the response in the language specified by the user. If they request Marathi or Hindi, translate your entire response (all values) into that language perfectly.
- DO NOT translate the JSON keys. The keys must remain exactly in English as shown below. Only translate the values.
- Provide the output STRICTLY in the following JSON format without any markdown blocks or extra text.
{
    "crop_care": "General crop care advice for the current stage.",
    "irrigation": "Irrigation guidance.",
    "disease_prevention": "Advice on preventing common diseases.",
    "pest_prevention": "Advice on preventing or managing pests.",
    "nutrient_guidance": "General nutrient guidance.",
    "harvest_prep": "Advice on preparing for harvest (if applicable, otherwise general future prep)."
}"""

@router.post("", response_model=AdvisoryResponse)
async def get_advisory(
    request: AdvisoryRequest,
    current_user: UserModel = Depends(get_current_user)
):
    db = get_db()
    client = get_groq_client()
    
    user_prompt = f"""
Please provide crop advisory for the following scenario:
- Crop Name: {request.crop_name}
- Location: {request.location}
- Soil Type: {request.soil_type}
- Sowing Date: {request.sowing_date}
- Current Crop Stage: {request.current_stage}
- Symptoms (if any): {request.symptoms if request.symptoms else 'None'}
- Weather Conditions: {request.weather_conditions if request.weather_conditions else 'Normal'}

IMPORTANT: You MUST write your response entirely in {request.language}. All JSON values must be in {request.language}. DO NOT translate the JSON keys.
    """
    
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        ai_reply = chat_completion.choices[0].message.content
        result_dict = json.loads(ai_reply)
        
        # Sanitize LLM dict to string to avoid Pydantic validation errors
        string_keys = ["crop_care", "irrigation", "disease_prevention", "pest_prevention", "nutrient_guidance", "harvest_prep"]
        for key in string_keys:
            if key in result_dict and not isinstance(result_dict[key], str):
                if isinstance(result_dict[key], dict):
                    result_dict[key] = "\n".join([f"{str(k).capitalize()}: {v}" for k, v in result_dict[key].items()])
                elif isinstance(result_dict[key], list):
                    result_dict[key] = "\n".join([str(x) for x in result_dict[key]])
                else:
                    result_dict[key] = str(result_dict[key])
                    
        result = AdvisoryResponse(**result_dict)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid data format.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI Service Error: {str(e)}")

    # Save history
    await db["crop_advisory_history"].insert_one({
        "user_id": ObjectId(current_user.id),
        "request": request.model_dump(),
        "result": result.model_dump(),
        "created_at": datetime.utcnow()
    })

    return result

@router.get("/history", response_model=AdvisoryHistoryResponse)
async def get_history(current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    
    cursor = db["crop_advisory_history"].find(
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
