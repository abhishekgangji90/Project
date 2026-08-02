from fastapi import APIRouter, Depends, HTTPException, status
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, UserLanguageUpdate
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from database.connection import get_db
from models.user import UserModel
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_password,
        "preferred_language": "English",
        "created_at": datetime.utcnow()
    }
    
    result = await db["users"].insert_one(user_dict)
    
    # Return response
    return UserResponse(
        id=str(result.inserted_id),
        name=user.name,
        email=user.email,
        preferred_language="English"
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    # Find user by email
    user = await db["users"].find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Verify password
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Create token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        preferred_language=getattr(current_user, "preferred_language", "English")
    )

@router.put("/me/language", response_model=UserResponse)
async def update_language(
    update_data: UserLanguageUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    db = get_db()
    from bson import ObjectId
    
    await db["users"].update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"preferred_language": update_data.preferred_language}}
    )
    
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        preferred_language=update_data.preferred_language
    )
