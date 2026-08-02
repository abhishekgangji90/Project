import os
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import AsyncGroq
from gtts import gTTS
from utils.auth import get_current_user
from models.user import UserModel

router = APIRouter(prefix="/voice", tags=["voice"])

class TTSRequest(BaseModel):
    text: str
    language: str = "English"

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")
    return AsyncGroq(api_key=api_key)

LANGUAGE_MAP = {
    "English": "en",
    "Hindi": "hi",
    "Marathi": "mr"
}

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user)
):
    if not file.filename.endswith((".wav", ".mp3", ".m4a", ".webm", ".ogg")):
        raise HTTPException(status_code=400, detail="Unsupported audio format")
    
    client = get_groq_client()
    
    try:
        # Read the uploaded file into memory
        audio_content = await file.read()
        
        # We need to pass a tuple (filename, bytes) to Groq
        audio_tuple = (file.filename, audio_content)
        
        transcription = await client.audio.transcriptions.create(
            file=audio_tuple,
            model="whisper-large-v3",
            response_format="json"
        )
        
        return {"text": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Speech-to-Text Error: {str(e)}")

@router.post("/speak")
async def generate_speech(
    request: TTSRequest,
    current_user: UserModel = Depends(get_current_user)
):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    lang_code = LANGUAGE_MAP.get(request.language, "en")
    
    try:
        # Generate speech using gTTS
        tts = gTTS(text=request.text, lang=lang_code, slow=False)
        
        # Save to a bytes buffer
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        
        # Return as streaming response
        return StreamingResponse(audio_fp, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-Speech Error: {str(e)}")
