from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: str = "English"

class ChatResponse(BaseModel):
    ai_message: str
    conversation_id: str

class MessageItem(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

class ConversationItem(BaseModel):
    id: str
    title: str
    updated_at: datetime

class ConversationListResponse(BaseModel):
    conversations: List[ConversationItem]

class ConversationDetailResponse(BaseModel):
    id: str
    title: str
    messages: List[MessageItem]

class RenameRequest(BaseModel):
    title: str
