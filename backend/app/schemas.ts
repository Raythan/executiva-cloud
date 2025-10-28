// FIX: The file had Python syntax, which is invalid in a TypeScript file.
// It has been wrapped in a template literal to be exported as a string,
// matching the pattern of other files in the backend directory.
const content = `
from pydantic import BaseModel
from typing import List, Optional, Union
import enum

# --- Base Schemas (Responses) ---

class Organization(BaseModel):
    id: str
    name: str
    class Config:
        from_attributes = True

class Department(BaseModel):
    id: str
    name: str
    organizationId: str
    class Config:
        from_attributes = True

class Executive(BaseModel):
    id: str
    fullName: str
    cpf: Optional[str] = None
    rg: Optional[str] = None
    rgIssuer: Optional[str] = None
    rgIssueDate: Optional[str] = None
    birthDate: Optional[str] = None
    nationality: Optional[str] = None
    placeOfBirth: Optional[str] = None
    motherName: Optional[str] = None
    fatherName: Optional[str] = None
    civilStatus: Optional[str] = None
    workEmail: Optional[str] = None
    workPhone: Optional[str] = None
    extension: Optional[str] = None
    personalEmail: Optional[str] = None
    personalPhone: Optional[str] = None
    address: Optional[str] = None
    linkedinProfileUrl: Optional[str] = None
    jobTitle: Optional[str] = None
    organizationId: Optional[str] = None
    departmentId: Optional[str] = None
    costCenter: Optional[str] = None
    employeeId: Optional[str] = None
    reportsToExecutiveId: Optional[str] = None
    hireDate: Optional[str] = None
    workLocation: Optional[str] = None
    photoUrl: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    languages: Optional[str] = None
    emergencyContactName: Optional[str] = None
    emergencyContactPhone: Optional[str] = None
    emergencyContactRelation: Optional[str] = None
    dependentsInfo: Optional[str] = None
    bankInfo: Optional[str] = None
    compensationInfo: Optional[str] = None
    systemAccessLevels: Optional[str] = None
    class Config:
        from_attributes = True

class Secretary(BaseModel):
    id: str
    fullName: str
    email: Optional[str] = None
    executiveIds: List[str]
    class Config:
        from_attributes = True

class UserRoleEnum(str, enum.Enum):
    master = 'master'
    admin = 'admin'
    secretary = 'secretary'
    executive = 'executive'

class User(BaseModel):
    id: str
    fullName: str
    role: UserRoleEnum
    organizationId: Optional[str] = None
    executiveId: Optional[str] = None
    secretaryId: Optional[str] = None
    class Config:
        from_attributes = True

class UserWithExecutiveIds(User):
    executiveIds: Optional[List[str]] = None

class EventType(BaseModel):
    id: str
    name: str
    color: str
    class Config:
        from_attributes = True

class RecurrenceRule(BaseModel):
    frequency: str
    interval: int
    daysOfWeek: Optional[List[int]] = None
    endDate: Optional[str] = None
    count: Optional[int] = None

class Event(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    startTime: str
    endTime: str
    location: Optional[str] = None
    eventTypeId: Optional[str] = None
    executiveId: str
    reminderMinutes: Optional[int] = None
    recurrenceId: Optional[str] = None
    class Config:
        from_attributes = True

class ContactType(BaseModel):
    id: str
    name: str
    class Config:
        from_attributes = True

class Contact(BaseModel):
    id: str
    fullName: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    notes: Optional[str] = None
    contactTypeId: Optional[str] = None
    executiveId: str
    class Config:
        from_attributes = True

class ExpenseCategory(BaseModel):
    id: str
    name: str
    class Config:
        from_attributes = True

class Expense(BaseModel):
    id: str
    description: str
    amount: float
    expenseDate: str
    type: str
    entityType: str
    categoryId: Optional[str] = None
    status: str
    receiptUrl: Optional[str] = None
    executiveId: str
    class Config:
        from_attributes = True

class PriorityEnum(str, enum.Enum):
    High = 'Alta'
    Medium = 'Média'
    Low = 'Baixa'

class StatusEnum(str, enum.Enum):
    Todo = 'A Fazer'
    InProgress = 'Em Andamento'
    Done = 'Concluído'

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    dueDate: str
    priority: PriorityEnum
    status: StatusEnum
    executiveId: str
    recurrenceId: Optional[str] = None
    class Config:
        from_attributes = True

class DocumentCategory(BaseModel):
    id: str
    name: str
    class Config:
        from_attributes = True

class Document(BaseModel):
    id: str
    name: str
    imageUrl: str
    categoryId: Optional[str] = None
    executiveId: str
    uploadDate: str
    class Config:
        from_attributes = True

class AllDataBackup(BaseModel):
    version: str = "1.0.0"
    organizations: List[Organization]
    departments: List[Department]
    executives: List[Executive]
    secretaries: List[Secretary]
    users: List[UserWithExecutiveIds]
    eventTypes: List[EventType]
    events: List[Event]
    contactTypes: List[ContactType]
    contacts: List[Contact]
    expenses: List[Expense]
    expenseCategories: List[ExpenseCategory]
    tasks: List[Task]
    documentCategories: List[DocumentCategory]
    documents: List[Document]

# --- Auth Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserWithExecutiveIds

class TokenData(BaseModel):
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    userId: str

# --- CRUD Schemas ---

# Organization
class OrganizationCreate(BaseModel):
    name: str

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None

# Department
class DepartmentCreate(BaseModel):
    name: str
    organizationId: str

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    organizationId: Optional[str] = None

# Executive
class ExecutiveCreate(BaseModel):
    fullName: str
    jobTitle: Optional[str] = None
    organizationId: Optional[str] = None
    departmentId: Optional[str] = None
    workEmail: Optional[str] = None
    # Adicione outros campos necessários para a criação
    photoUrl: Optional[str] = None

class ExecutiveUpdate(BaseModel):
    fullName: Optional[str] = None
    cpf: Optional[str] = None
    rg: Optional[str] = None
    rgIssuer: Optional[str] = None
    rgIssueDate: Optional[str] = None
    birthDate: Optional[str] = None
    nationality: Optional[str] = None
    placeOfBirth: Optional[str] = None
    motherName: Optional[str] = None
    fatherName: Optional[str] = None
    civilStatus: Optional[str] = None
    workEmail: Optional[str] = None
    workPhone: Optional[str] = None
    extension: Optional[str] = None
    personalEmail: Optional[str] = None
    personalPhone: Optional[str] = None
    address: Optional[str] = None
    linkedinProfileUrl: Optional[str] = None
    jobTitle: Optional[str] = None
    organizationId: Optional[str] = None
    departmentId: Optional[str] = None
    costCenter: Optional[str] = None
    employeeId: Optional[str] = None
    reportsToExecutiveId: Optional[str] = None
    hireDate: Optional[str] = None
    workLocation: Optional[str] = None
    photoUrl: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    languages: Optional[str] = None
    emergencyContactName: Optional[str] = None
    emergencyContactPhone: Optional[str] = None
    emergencyContactRelation: Optional[str] = None
    dependentsInfo: Optional[str] = None
    bankInfo: Optional[str] = None
    compensationInfo: Optional[str] = None
    systemAccessLevels: Optional[str] = None

# Secretary
class SecretaryCreate(BaseModel):
    fullName: str
    email: Optional[str] = None
    executiveIds: List[str] = []

class SecretaryUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    executiveIds: Optional[List[str]] = None

# EventType
class EventTypeCreate(BaseModel):
    name: str
    color: str

class EventTypeUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

# Event
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    startTime: str
    endTime: str
    location: Optional[str] = None
    eventTypeId: Optional[str] = None
    executiveId: str
    reminderMinutes: Optional[int] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    location: Optional[str] = None
    eventTypeId: Optional[str] = None
    reminderMinutes: Optional[int] = None

# ContactType
class ContactTypeCreate(BaseModel):
    name: str

class ContactTypeUpdate(BaseModel):
    name: Optional[str] = None

# Contact
class ContactCreate(BaseModel):
    fullName: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    notes: Optional[str] = None
    contactTypeId: Optional[str] = None
    executiveId: str

class ContactUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    notes: Optional[str] = None
    contactTypeId: Optional[str] = None

# ExpenseCategory
class ExpenseCategoryCreate(BaseModel):
    name: str

class ExpenseCategoryUpdate(BaseModel):
    name: Optional[str] = None

# Expense
class ExpenseCreate(BaseModel):
    description: str
    amount: float
    expenseDate: str
    type: str
    entityType: str
    categoryId: Optional[str] = None
    status: str
    receiptUrl: Optional[str] = None
    executiveId: str

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    expenseDate: Optional[str] = None
    type: Optional[str] = None
    entityType: Optional[str] = None
    categoryId: Optional[str] = None
    status: Optional[str] = None
    receiptUrl: Optional[str] = None

# Task
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    dueDate: str
    priority: PriorityEnum
    status: StatusEnum
    executiveId: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    dueDate: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None

# DocumentCategory
class DocumentCategoryCreate(BaseModel):
    name: str

class DocumentCategoryUpdate(BaseModel):
    name: Optional[str] = None

# Document
class DocumentCreate(BaseModel):
    name: str
    imageUrl: str # Base64
    categoryId: Optional[str] = None
    executiveId: str

class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    imageUrl: Optional[str] = None
    categoryId: Optional[str] = None
`;
export default content;
