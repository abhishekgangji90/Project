from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AdvisoryRequest(BaseModel):
    crop_name: str
    location: str
    soil_type: str
    sowing_date: str
    current_stage: str
    symptoms: Optional[str] = None
    weather_conditions: Optional[str] = None
    language: str = "English"

class AdvisoryResponse(BaseModel):
    crop_care: str
    irrigation: str
    disease_prevention: str
    pest_prevention: str
    nutrient_guidance: str
    harvest_prep: str

class AdvisoryHistoryItem(BaseModel):
    id: str
    request: AdvisoryRequest
    result: AdvisoryResponse
    created_at: datetime

class AdvisoryHistoryResponse(BaseModel):
    history: List[AdvisoryHistoryItem]
