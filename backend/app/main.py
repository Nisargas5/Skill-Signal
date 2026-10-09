import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SkillSignal API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "SkillSignal API"}