from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.auth import router as AuthRouter
from backend.routes.tickets import router as tickets_router
from backend.routes.chat import router as chat_router  # 🔥 Add chat router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routers
app.include_router(AuthRouter, prefix="/auth")
app.include_router(tickets_router, prefix="/tickets")

# Chat API router
app.include_router(chat_router, prefix="/chat")
