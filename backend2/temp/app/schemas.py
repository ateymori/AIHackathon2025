# app/schemas.py
from typing import List, Literal, Optional
from pydantic import BaseModel

Role = Literal["user", "agent"]

class ChatMessage(BaseModel):
    role: Role
    content: str

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

class ChatResponse(BaseModel):
    session_id: str
    messages: List[ChatMessage]
