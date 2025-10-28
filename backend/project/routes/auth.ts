
const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import auth, schemas, models
from ..database import get_db
from ..config import settings

router = APIRouter(
    prefix="/auth",
)

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(login_request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == login_request.userId).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )

    user_response = schemas.UserWithExecutiveIds.from_orm(user)
    if user.role == "secretary" and user.secretary:
        user_response.executiveIds = [exec.id for exec in user.secretary.executives]

    return {"access_token": access_token, "token_type": "bearer", "user": user_response}

@router.get("/profile", response_model=schemas.UserWithExecutiveIds)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    user_response = schemas.UserWithExecutiveIds.from_orm(current_user)
    if current_user.role == "secretary" and current_user.secretary:
        user_response.executiveIds = [exec.id for exec in current_user.secretary.executives]
    return user_response
`;
export default content;
