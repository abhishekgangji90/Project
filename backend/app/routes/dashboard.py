from fastapi import APIRouter, Depends
from bson import ObjectId
from database.connection import get_db
from models.user import UserModel
from utils.auth import get_current_user
from schemas.dashboard import DashboardResponse, DashboardStats, RecentChat, RecentCropAnalysis

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardResponse)
async def get_dashboard_stats(current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    user_id = ObjectId(current_user.id)
    
    # 1. Fetch Conversations Count & Recent
    conversations_cursor = db["conversations"].find({"user_id": user_id}).sort("updated_at", -1)
    conversations = await conversations_cursor.to_list(length=None)
    convo_ids = [c["_id"] for c in conversations]
    
    recent_chats = []
    for c in conversations[:3]:
        recent_chats.append(RecentChat(
            id=str(c["_id"]),
            title=c.get("title", "New Conversation"),
            created_at=c.get("updated_at")
        ))
        
    # 2. Fetch Messages Count (Questions)
    total_questions = 0
    if convo_ids:
        total_questions = await db["messages"].count_documents({
            "conversation_id": {"$in": convo_ids},
            "role": "user"
        })
        
    # 3. Fetch Crop Analyses Count & Recent
    crop_analyses_cursor = db["crop_analysis"].find({"user_id": user_id}).sort("created_at", -1)
    crop_analyses = await crop_analyses_cursor.to_list(length=None)
    
    recent_crop_analyses = []
    for ca in crop_analyses[:3]:
        # Extract disease status from result
        disease_status = "Unknown"
        result = ca.get("result", {})
        if isinstance(result, dict):
            disease_status = result.get("disease", "Healthy")
            
        recent_crop_analyses.append(RecentCropAnalysis(
            id=str(ca["_id"]),
            crop_name="Crop Analysis", # The schema doesn't store crop_name easily, fallback to generic
            disease_status=disease_status,
            created_at=ca.get("created_at")
        ))
        
    # 4. Fetch Documents Count (Stub for now)
    documents_uploaded = 0
    
    stats = DashboardStats(
        total_questions=total_questions,
        crop_images_analyzed=len(crop_analyses),
        documents_uploaded=documents_uploaded,
        conversations_created=len(conversations)
    )
    
    return DashboardResponse(
        stats=stats,
        recent_chats=recent_chats,
        recent_crop_analyses=recent_crop_analyses
    )
