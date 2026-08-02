import os
from fastapi import APIRouter, Depends, HTTPException, status
from groq import AsyncGroq
from schemas.chat import ChatRequest, ChatResponse, ConversationListResponse, ConversationDetailResponse, RenameRequest
from utils.auth import get_current_user
from database.connection import get_db
from models.user import UserModel
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

# System prompt to enforce the agriculture persona
SYSTEM_PROMPT = """You are AgriMitra AI, an intelligent, helpful, and friendly agricultural assistant. 
You answer questions related ONLY to:
- Crop diseases
- Fertilizers
- Irrigation
- Soil
- Crop management
- Pest control
- General agriculture

Do not answer queries outside of the agricultural domain. If asked about something else, politely guide the user back to farming topics. Keep your answers concise, practical, and easy to understand for farmers. Use clean formatting."""

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")
    return AsyncGroq(api_key=api_key)

@router.post("", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    client = get_groq_client()
    
    conversation_id = request.conversation_id
    
    dynamic_system_prompt = SYSTEM_PROMPT + f"\n\nIMPORTANT: You must respond entirely in the {request.language} language. Do not use any other language."
    
    messages_history = [{"role": "system", "content": dynamic_system_prompt}]
    
    # 1. Manage Conversation Context
    if conversation_id:
        # Verify conversation exists and belongs to user
        conv = await db["conversations"].find_one({"_id": ObjectId(conversation_id), "user_id": ObjectId(current_user.id)})
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
            
        # Fetch previous messages
        past_messages = await db["messages"].find({"conversation_id": ObjectId(conversation_id)}).sort("created_at", 1).to_list(length=50)
        for msg in past_messages:
            messages_history.append({"role": msg["role"], "content": msg["content"]})
    else:
        # Create a new conversation
        title = request.message[:30] + "..." if len(request.message) > 30 else request.message
        conv_dict = {
            "user_id": ObjectId(current_user.id),
            "title": title,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        conv_result = await db["conversations"].insert_one(conv_dict)
        conversation_id = str(conv_result.inserted_id)

    # Append the new user message to the context
    messages_history.append({"role": "user", "content": request.message})
    
    # 2. Save user message to DB
    await db["messages"].insert_one({
        "conversation_id": ObjectId(conversation_id),
        "role": "user",
        "content": request.message,
        "created_at": datetime.utcnow()
    })
    
    # 3. Call Groq API
    try:
        chat_completion = await client.chat.completions.create(
            messages=messages_history,
            model="llama-3.1-8b-instant",  # Using a fast, standard model
            temperature=0.7,
            max_tokens=1000,
        )
        ai_reply = chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Chat AI Service Error: {str(e)}")
        raise HTTPException(status_code=502, detail="AI Chat Service is currently unavailable. Please try again later.")

    # 4. Save AI response to DB
    await db["messages"].insert_one({
        "conversation_id": ObjectId(conversation_id),
        "role": "assistant",
        "content": ai_reply,
        "created_at": datetime.utcnow()
    })
    
    # Update conversation updated_at
    await db["conversations"].update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"updated_at": datetime.utcnow()}}
    )

    return ChatResponse(ai_message=ai_reply, conversation_id=conversation_id)

@router.get("/history", response_model=ConversationListResponse)
async def get_history(current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    cursor = db["conversations"].find({"user_id": ObjectId(current_user.id)}).sort("updated_at", -1)
    conversations = await cursor.to_list(length=100)
    
    formatted_conversations = []
    for conv in conversations:
        formatted_conversations.append({
            "id": str(conv["_id"]),
            "title": conv["title"],
            "updated_at": conv["updated_at"]
        })
        
    return ConversationListResponse(conversations=formatted_conversations)

@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation_details(conversation_id: str, current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    
    conv = await db["conversations"].find_one({"_id": ObjectId(conversation_id), "user_id": ObjectId(current_user.id)})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    messages = await db["messages"].find({"conversation_id": ObjectId(conversation_id)}).sort("created_at", 1).to_list(length=100)
    
    formatted_messages = []
    for msg in messages:
        formatted_messages.append({
            "id": str(msg["_id"]),
            "role": msg["role"],
            "content": msg["content"],
            "created_at": msg["created_at"]
        })
        
    return ConversationDetailResponse(
        id=str(conv["_id"]),
        title=conv["title"],
        messages=formatted_messages
    )

@router.put("/{conversation_id}", response_model=dict)
async def rename_conversation(conversation_id: str, req: RenameRequest, current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    result = await db["conversations"].update_one(
        {"_id": ObjectId(conversation_id), "user_id": ObjectId(current_user.id)},
        {"$set": {"title": req.title, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found or not updated")
        
    return {"message": "Conversation renamed successfully"}

@router.delete("/{conversation_id}", response_model=dict)
async def delete_conversation(conversation_id: str, current_user: UserModel = Depends(get_current_user)):
    db = get_db()
    result = await db["conversations"].delete_one({"_id": ObjectId(conversation_id), "user_id": ObjectId(current_user.id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    await db["messages"].delete_many({"conversation_id": ObjectId(conversation_id)})
    
    return {"message": "Conversation deleted successfully"}
