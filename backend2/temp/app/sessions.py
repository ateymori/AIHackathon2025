# app/sessions.py
from collections import defaultdict
from typing import List
from .schemas import ChatMessage

_store: dict[str, List[ChatMessage]] = defaultdict(list)

def get_history(session_id: str) -> List[ChatMessage]:
    return _store[session_id]

def append(session_id: str, msg: ChatMessage):
    _store[session_id].append(msg)
