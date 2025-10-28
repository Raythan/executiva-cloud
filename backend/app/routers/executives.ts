
const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/executives",
    tags=["Executives"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/", response_model=schemas.Executive, status_code=status.HTTP_201_CREATED)
def create_executive(executive: schemas.ExecutiveCreate, db: Session = Depends(get_db)):
    # Optional: Verify organization and department exist
    if executive.organizationId:
        db_org = db.query(models.Organization).filter(models.Organization.id == executive.organizationId).first()
        if not db_org:
            raise HTTPException(status_code=400, detail="Organization not found")
    if executive.departmentId:
        db_dept = db.query(models.Department).filter(models.Department.id == executive.departmentId).first()
        if not db_dept:
            raise HTTPException(status_code=400, detail="Department not found")

    db_executive = models.Executive(
        id=str(uuid.uuid4()), 
        **executive.model_dump()
    )
    db.add(db_executive)
    db.commit()
    db.refresh(db_executive)
    return db_executive

@router.get("/", response_model=List[schemas.Executive])
def read_executives(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    executives = db.query(models.Executive).offset(skip).limit(limit).all()
    return executives

@router.get("/{exec_id}", response_model=schemas.Executive)
def read_executive(exec_id: str, db: Session = Depends(get_db)):
    db_executive = db.query(models.Executive).filter(models.Executive.id == exec_id).first()
    if db_executive is None:
        raise HTTPException(status_code=404, detail="Executive not found")
    return db_executive

@router.put("/{exec_id}", response_model=schemas.Executive)
def update_executive(exec_id: str, executive: schemas.ExecutiveUpdate, db: Session = Depends(get_db)):
    db_executive = db.query(models.Executive).filter(models.Executive.id == exec_id).first()
    if db_executive is None:
        raise HTTPException(status_code=404, detail="Executive not found")
    
    update_data = executive.model_dump(exclude_unset=True)
    
    # Optional: Verify organization and department exist if they are being updated
    if "organizationId" in update_data and update_data["organizationId"]:
        db_org = db.query(models.Organization).filter(models.Organization.id == update_data["organizationId"]).first()
        if not db_org:
            raise HTTPException(status_code=400, detail="Organization not found")
    if "departmentId" in update_data and update_data["departmentId"]:
        db_dept = db.query(models.Department).filter(models.Department.id == update_data["departmentId"]).first()
        if not db_dept:
            raise HTTPException(status_code=400, detail="Department not found")

    for key, value in update_data.items():
        setattr(db_executive, key, value)
        
    db.add(db_executive)
    db.commit()
    db.refresh(db_executive)
    return db_executive

@router.delete("/{exec_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_executive(exec_id: str, db: Session = Depends(get_db)):
    db_executive = db.query(models.Executive).filter(models.Executive.id == exec_id).first()
    if db_executive is None:
        raise HTTPException(status_code=404, detail="Executive not found")
    db.delete(db_executive)
    db.commit()
    return
`;
export default content;
