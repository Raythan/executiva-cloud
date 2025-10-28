
const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/organizations",
    tags=["Organizations"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/", response_model=schemas.Organization, status_code=status.HTTP_201_CREATED)
def create_organization(organization: schemas.OrganizationCreate, db: Session = Depends(get_db)):
    db_organization = models.Organization(id=str(uuid.uuid4()), name=organization.name)
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization

@router.get("/", response_model=List[schemas.Organization])
def read_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    organizations = db.query(models.Organization).offset(skip).limit(limit).all()
    return organizations

@router.get("/{org_id}", response_model=schemas.Organization)
def read_organization(org_id: str, db: Session = Depends(get_db)):
    db_organization = db.query(models.Organization).filter(models.Organization.id == org_id).first()
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_organization

@router.put("/{org_id}", response_model=schemas.Organization)
def update_organization(org_id: str, organization: schemas.OrganizationUpdate, db: Session = Depends(get_db)):
    db_organization = db.query(models.Organization).filter(models.Organization.id == org_id).first()
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    update_data = organization.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_organization, key, value)
        
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization

@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(org_id: str, db: Session = Depends(get_db)):
    db_organization = db.query(models.Organization).filter(models.Organization.id == org_id).first()
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    db.delete(db_organization)
    db.commit()
    return
`;
export default content;
