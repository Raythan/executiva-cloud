
const content = `
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, subqueryload
from typing import List

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/data",
)

@router.get("/all", response_model=schemas.AllDataBackup)
def get_all_data(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    organizations = db.query(models.Organization).all()
    departments = db.query(models.Department).all()
    executives = db.query(models.Executive).all()
    
    secretaries_query = db.query(models.Secretary).options(subqueryload(models.Secretary.executives)).all()
    secretaries = []
    for sec in secretaries_query:
        sec_schema = schemas.Secretary.from_orm(sec)
        sec_schema.executiveIds = [exec.id for exec in sec.executives]
        secretaries.append(sec_schema)

    users_query = db.query(models.User).options(subqueryload(models.User.secretary).subqueryload(models.Secretary.executives)).all()
    users = []
    for user in users_query:
        user_schema = schemas.UserWithExecutiveIds.from_orm(user)
        if user.role == 'secretary' and user.secretary:
            user_schema.executiveIds = [exec.id for exec in user.secretary.executives]
        users.append(user_schema)
    
    event_types = db.query(models.EventType).all()
    events = db.query(models.Event).all()
    contact_types = db.query(models.ContactType).all()
    contacts = db.query(models.Contact).all()
    expense_categories = db.query(models.ExpenseCategory).all()
    expenses = db.query(models.Expense).all()
    tasks = db.query(models.Task).all()
    document_categories = db.query(models.DocumentCategory).all()
    documents = db.query(models.Document).all()

    return schemas.AllDataBackup(
        organizations=organizations,
        departments=departments,
        executives=executives,
        secretaries=secretaries,
        users=users,
        eventTypes=event_types,
        events=events,
        contactTypes=contact_types,
        contacts=contacts,
        expenses=expenses,
        expenseCategories=expense_categories,
        tasks=tasks,
        documentCategories=document_categories,
        documents=documents,
    )
`;
export default content;
