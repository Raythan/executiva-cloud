// FIX: The file had Python syntax, which is invalid in a TypeScript file.
// It has been wrapped in a template literal to be exported as a string,
// matching the pattern of other files in the backend directory.
const content = `
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    dependencies=[Depends(auth.get_current_user)]
)

# --- Expense Categories CRUD ---

@router.post("/expense-categories/", response_model=schemas.ExpenseCategory, status_code=status.HTTP_201_CREATED, tags=["Expense Categories"])
def create_expense_category(category: schemas.ExpenseCategoryCreate, db: Session = Depends(get_db)):
    db_category = models.ExpenseCategory(id=str(uuid.uuid4()), **category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/expense-categories/", response_model=List[schemas.ExpenseCategory], tags=["Expense Categories"])
def read_expense_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.ExpenseCategory).offset(skip).limit(limit).all()

@router.put("/expense-categories/{category_id}", response_model=schemas.ExpenseCategory, tags=["Expense Categories"])
def update_expense_category(category_id: str, category: schemas.ExpenseCategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(models.ExpenseCategory).filter(models.ExpenseCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Expense Category not found")
    update_data = category.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/expense-categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Expense Categories"])
def delete_expense_category(category_id: str, db: Session = Depends(get_db)):
    db_category = db.query(models.ExpenseCategory).filter(models.ExpenseCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Expense Category not found")
    db.delete(db_category)
    db.commit()

# --- Expenses CRUD ---

@router.post("/expenses/", response_model=schemas.Expense, status_code=status.HTTP_201_CREATED, tags=["Expenses"])
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    if not db.query(models.Executive).filter(models.Executive.id == expense.executiveId).first():
        raise HTTPException(status_code=404, detail="Executive not found")
    if expense.categoryId and not db.query(models.ExpenseCategory).filter(models.ExpenseCategory.id == expense.categoryId).first():
        raise HTTPException(status_code=404, detail="Expense Category not found")
        
    db_expense = models.Expense(id=str(uuid.uuid4()), **expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/expenses/", response_model=List[schemas.Expense], tags=["Expenses"])
def read_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Expense).offset(skip).limit(limit).all()

@router.put("/expenses/{expense_id}", response_model=schemas.Expense, tags=["Expenses"])
def update_expense(expense_id: str, expense: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    update_data = expense.model_dump(exclude_unset=True)
    if update_data.get("categoryId") and not db.query(models.ExpenseCategory).filter(models.ExpenseCategory.id == update_data["categoryId"]).first():
        raise HTTPException(status_code=404, detail="Expense Category not found")
        
    for key, value in update_data.items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Expenses"])
def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(db_expense)
    db.commit()
`;
export default content;
