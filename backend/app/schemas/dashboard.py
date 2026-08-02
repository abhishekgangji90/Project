from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DashboardStats(BaseModel):
    total_questions: int
    crop_images_analyzed: int
    documents_uploaded: int
    conversations_created: int

class RecentChat(BaseModel):
    id: str
    title: str
    created_at: datetime

class RecentCropAnalysis(BaseModel):
    id: str
    crop_name: str
    disease_status: str
    created_at: datetime

class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_chats: List[RecentChat]
    recent_crop_analyses: List[RecentCropAnalysis]
