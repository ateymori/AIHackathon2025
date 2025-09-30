# app/server.py
import uuid
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from .agent import runner
from .schemas import ChatRequest, ChatResponse, ChatMessage
from .sessions import get_history, append

app = FastAPI(title="ADK Minimal Chat API")

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message is required")
    sid = req.session_id or str(uuid.uuid4())
    append(sid, ChatMessage(role="user", content=req.message))
    try:
        # One-shot run (no partials)
        reply_text = await runner.run(input=req.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"agent error: {e}")
    append(sid, ChatMessage(role="agent", content=reply_text))
    return ChatResponse(session_id=sid, messages=get_history(sid))

@app.get("/chat/stream")
async def chat_stream(message: str, session_id: str | None = None):
    if not message.strip():
        raise HTTPException(status_code=400, detail="message is required")
    sid = session_id or str(uuid.uuid4())
    append(sid, ChatMessage(role="user", content=message))

    async def gen():
        try:
            # Yield partials as the model streams (SSE)
            async for chunk in runner.stream(input=message):
                # 'chunk' is typically partial text; send as SSE data
                yield f"data:{chunk}\n\n"
            # Mark completion so UI can stop "typing"
            yield "event:done\ndata:{}\n\n"
        except Exception as e:
            yield f"event:error\ndata:{str(e)}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")
