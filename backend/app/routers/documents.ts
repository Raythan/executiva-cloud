// FIX: The file had Python syntax, which is invalid in a TypeScript file.
// It has been wrapped in a template literal to be exported as a string,
// matching the pattern of other files in the backend directory.
const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    dependencies=[Depends(auth.get_current_user)]
)

# --- Document Categories CRUD ---

@router.post("/document-categories/", response_model=schemas.DocumentCategory, status_code=status.HTTP_201_CREATED, tags=["Document Categories"])
def create_document_category(category: schemas.DocumentCategoryCreate, db: Session = Depends(get_db)):
    db_category = models.DocumentCategory(id=str(uuid.uuid4()), **category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/document-categories/", response_model=List[schemas.DocumentCategory], tags=["Document Categories"])
def read_document_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.DocumentCategory).offset(skip).limit(limit).all()

@router.put("/document-categories/{category_id}", response_model=schemas.DocumentCategory, tags=["Document Categories"])
def update_document_category(category_id: str, category: schemas.DocumentCategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(models.DocumentCategory).filter(models.DocumentCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Document Category not found")
    update_data = category.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/document-categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Document Categories"])
def delete_document_category(category_id: str, db: Session = Depends(get_db)):
    db_category = db.query(models.DocumentCategory).filter(models.DocumentCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Document Category not found")
    db.delete(db_category)
    db.commit()

# --- Documents CRUD ---

@router.post("/documents/", response_model=schemas.Document, status_code=status.HTTP_201_CREATED, tags=["Documents"])
def create_document(document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    if not db.query(models.Executive).filter(models.Executive.id == document.executiveId).first():
        raise HTTPException(status_code=404, detail="Executive not found")
    if document.categoryId and not db.query(models.DocumentCategory).filter(models.DocumentCategory.id == document.categoryId).first():
        raise HTTPException(status_code=404, detail="Document Category not found")
        
    db_document = models.Document(
        id=str(uuid.uuid4()),
        uploadDate=datetime.now().isoformat(),
        **document.model_dump()
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.get("/documents/", response_model=List[schemas.Document], tags=["Documents"])
def read_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Document).offset(skip).limit(limit).all()

@router.put("/documents/{document_id}", response_model=schemas.Document, tags=["Documents"])
def update_document(document_id: str, document: schemas.DocumentUpdate, db: Session = Depends(get_db)):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    update_data = document.model_dump(exclude_unset=True)
    if update_data.get("categoryId") and not db.query(models.DocumentCategory).filter(models.DocumentCategory.id == update_data["categoryId"]).first():
        raise HTTPException(status_code=404, detail="Document Category not found")
        
    for key, value in update_data.items():
        setattr(db_document, key, value)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Documents"])
def delete_document(document_id: str, db: Session = Depends(get_db)):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(db_document)
    db.commit()
`;
export default content;
