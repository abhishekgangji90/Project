from pydantic import BaseModel, Field
from typing import List,Dict, Optional
from datetime import datetime

class FertilizerRequest(BaseModel):
    crop_name: str
    soil_type: str
    location: str
    growth_stage: str
    soil_test_values: Optional[str] = None
    available_fertilizer: Optional[str] = None
    language: str = "English"

class FertilizerResponse(BaseModel):
    nutrient_requirements: str
    fertilizer_guidance: str
    application_timing: str
    application_method: str
    precautions: List[str]
    soil_health: str

class FertilizerHistoryItem(BaseModel):
    id: str
    request: FertilizerRequest
    result: FertilizerResponse
    created_at: datetime

class FertilizerHistoryResponse(BaseModel):
    history: List[FertilizerHistoryItem]
