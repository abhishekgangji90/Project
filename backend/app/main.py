from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from database.connection import connect_to_mongo, close_mongo_connection, db_config
from routes import auth
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="AgriMitra AI API",
    description="API for AgriMitra AI - AI Agriculture Advisor",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

from routes import auth, chat, crop, fertilizer, advisory, voice, dashboard
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(crop.router)
app.include_router(fertilizer.router)
app.include_router(advisory.router)
app.include_router(voice.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriMitra AI API"}

@app.get("/health")
async def health_check():
    db_status = "disconnected"
    try:
        if db_config.client is not None:
            # Ping the database
            await db_config.client.admin.command('ping')
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok", 
        "message": "API is running smoothly",
        "database": db_status
    }
