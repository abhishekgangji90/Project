from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CropAnalysisResult(BaseModel):
    crop_name: str
    disease: str
    confidence: str
    symptoms: List[str]
    causes: List[str]
    actions: List[str]
    prevention: List[str]

class CropAnalysisHistoryItem(BaseModel):
    id: str
    image_url: Optional[str]
    result: CropAnalysisResult
    created_at: datetime

class CropAnalysisHistoryResponse(BaseModel):
    history: List[CropAnalysisHistoryItem]
