
const content = `
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/users",
)

@router.get("", response_model=List[schemas.UserWithExecutiveIds])
def read_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    
    users_with_exec_ids = []
    for user in users:
        user_data = schemas.UserWithExecutiveIds.from_orm(user)
        if user.role == 'secretary' and user.secretary:
            user_data.executiveIds = [exec.id for exec in user.secretary.executives]
        users_with_exec_ids.append(user_data)
        
    return users_with_exec_ids
`;
export default content;
