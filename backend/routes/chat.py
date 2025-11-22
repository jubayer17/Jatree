from fastapi import APIRouter
from pydantic import BaseModel
from backend.utils.rag import generate_answer

router = APIRouter(tags=["Chat"])

class ChatIn(BaseModel):
    q: str

@router.post("/ask")
async def ask_chat(payload: ChatIn):
    answer = generate_answer(payload.q)
    return {"answer": answer}
