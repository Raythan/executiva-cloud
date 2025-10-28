const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, subqueryload
from typing import List
import uuid

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/secretaries",
    tags=["Secretaries"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/", response_model=schemas.Secretary, status_code=status.HTTP_201_CREATED)
def create_secretary(secretary: schemas.SecretaryCreate, db: Session = Depends(get_db)):
    # Find all executives to be associated
    executives = db.query(models.Executive).filter(models.Executive.id.in_(secretary.executiveIds)).all()
    if len(executives) != len(secretary.executiveIds):
        raise HTTPException(status_code=404, detail="One or more executives not found")

    db_secretary = models.Secretary(
        id=str(uuid.uuid4()),
        fullName=secretary.fullName,
        email=secretary.email,
        executives=executives
    )
    db.add(db_secretary)
    db.commit()
    db.refresh(db_secretary)
    
    # Prepare response
    response_secretary = schemas.Secretary.from_orm(db_secretary)
    response_secretary.executiveIds = [exec.id for exec in db_secretary.executives]
    return response_secretary

@router.get("/", response_model=List[schemas.Secretary])
def read_secretaries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    secretaries_query = db.query(models.Secretary).options(subqueryload(models.Secretary.executives)).offset(skip).limit(limit).all()
    
    response_list = []
    for sec in secretaries_query:
        sec_schema = schemas.Secretary.from_orm(sec)
        sec_schema.executiveIds = [exec.id for exec in sec.executives]
        response_list.append(sec_schema)
        
    return response_list

@router.get("/{secretary_id}", response_model=schemas.Secretary)
def read_secretary(secretary_id: str, db: Session = Depends(get_db)):
    db_secretary = db.query(models.Secretary).options(subqueryload(models.Secretary.executives)).filter(models.Secretary.id == secretary_id).first()
    if db_secretary is None:
        raise HTTPException(status_code=404, detail="Secretary not found")
        
    response_secretary = schemas.Secretary.from_orm(db_secretary)
    response_secretary.executiveIds = [exec.id for exec in db_secretary.executives]
    return response_secretary

@router.put("/{secretary_id}", response_model=schemas.Secretary)
def update_secretary(secretary_id: str, secretary: schemas.SecretaryUpdate, db: Session = Depends(get_db)):
    db_secretary = db.query(models.Secretary).filter(models.Secretary.id == secretary_id).first()
    if db_secretary is None:
        raise HTTPException(status_code=404, detail="Secretary not found")
    
    update_data = secretary.model_dump(exclude_unset=True)
    
    if 'fullName' in update_data:
        db_secretary.fullName = update_data['fullName']
    if 'email' in update_data:
        db_secretary.email = update_data['email']
        
    if 'executiveIds' in update_data:
        # Find all executives to be associated
        executives = db.query(models.Executive).filter(models.Executive.id.in_(update_data['executiveIds'])).all()
        if len(executives) != len(update_data['executiveIds']):
            raise HTTPException(status_code=404, detail="One or more executives not found")
        db_secretary.executives = executives
        
    db.add(db_secretary)
    db.commit()
    db.refresh(db_secretary)
    
    response_secretary = schemas.Secretary.from_orm(db_secretary)
    response_secretary.executiveIds = [exec.id for exec in db_secretary.executives]
    return response_secretary

@router.delete("/{secretary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_secretary(secretary_id: str, db: Session = Depends(get_db)):
    db_secretary = db.query(models.Secretary).filter(models.Secretary.id == secretary_id).first()
    if db_secretary is None:
        raise HTTPException(status_code=404, detail="Secretary not found")
    db.delete(db_secretary)
    db.commit()
    return
`;
export default content;