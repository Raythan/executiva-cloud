
const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/", response_model=schemas.Department, status_code=status.HTTP_201_CREATED)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    # Verify if organization exists
    db_org = db.query(models.Organization).filter(models.Organization.id == department.organizationId).first()
    if not db_org:
        raise HTTPException(status_code=400, detail="Organization not found")
        
    db_department = models.Department(
        id=str(uuid.uuid4()), 
        name=department.name,
        organizationId=department.organizationId
    )
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@router.get("/", response_model=List[schemas.Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    departments = db.query(models.Department).offset(skip).limit(limit).all()
    return departments

@router.get("/{dept_id}", response_model=schemas.Department)
def read_department(dept_id: str, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@router.put("/{dept_id}", response_model=schemas.Department)
def update_department(dept_id: str, department: schemas.DepartmentUpdate, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    update_data = department.model_dump(exclude_unset=True)
    if "organizationId" in update_data:
        db_org = db.query(models.Organization).filter(models.Organization.id == update_data["organizationId"]).first()
        if not db_org:
            raise HTTPException(status_code=400, detail="Organization not found")

    for key, value in update_data.items():
        setattr(db_department, key, value)
        
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@router.delete("/{dept_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(dept_id: str, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(db_department)
    db.commit()
    return
`;
export default content;
