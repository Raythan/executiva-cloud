
const content = `
from sqlalchemy import Table, Column, String, ForeignKey, Integer, Float, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum

# From association_tables.py
secretary_executives_table = Table(
    'secretary_executives',
    Base.metadata,
    Column('secretary_id', String, ForeignKey('secretaries.id'), primary_key=True),
    Column('executive_id', String, ForeignKey('executives.id'), primary_key=True)
)

# From organization.py
class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)

    departments = relationship("Department", back_populates="organization", cascade="all, delete-orphan")
    executives = relationship("Executive", back_populates="organization")

# From department.py
class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    organizationId = Column("organization_id", String, ForeignKey("organizations.id"))

    organization = relationship("Organization", back_populates="departments")
    executives = relationship("Executive", back_populates="department")

# From user.py
class UserRole(str, enum.Enum):
    master = 'master'
    admin = 'admin'
    secretary = 'secretary'
    executive = 'executive'

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    fullName = Column("full_name", String)
    role = Column(Enum(UserRole))
    organizationId = Column("organization_id", String, ForeignKey("organizations.id"), nullable=True)
    executiveId = Column("executive_id", String, ForeignKey("executives.id"), nullable=True)
    secretaryId = Column("secretary_id", String, ForeignKey("secretaries.id"), nullable=True)

    executive = relationship("Executive", back_populates="user", uselist=False)
    secretary = relationship("Secretary", back_populates="user", uselist=False)

# From executive.py
class Executive(Base):
    __tablename__ = "executives"

    id = Column(String, primary_key=True, index=True)
    fullName = Column("full_name", String)
    
    # Relações
    organizationId = Column("organization_id", String, ForeignKey("organizations.id"), nullable=True)
    departmentId = Column("department_id", String, ForeignKey("departments.id"), nullable=True)
    
    # Relacionamentos
    organization = relationship("Organization", back_populates="executives")
    department = relationship("Department", back_populates="executives")
    user = relationship("User", back_populates="executive", cascade="all, delete-orphan", uselist=False)

    secretaries = relationship("Secretary", secondary="secretary_executives", back_populates="executives")
    events = relationship("Event", back_populates="executive", cascade="all, delete-orphan")
    contacts = relationship("Contact", back_populates="executive", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="executive", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="executive", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="executive", cascade="all, delete-orphan")

    # Campos de texto simples
    cpf = Column(String, nullable=True)
    rg = Column(String, nullable=True)
    rgIssuer = Column("rg_issuer", String, nullable=True)
    rgIssueDate = Column("rg_issue_date", String, nullable=True)
    birthDate = Column("birth_date", String, nullable=True)
    nationality = Column(String, nullable=True)
    placeOfBirth = Column("place_of_birth", String, nullable=True)
    motherName = Column("mother_name", String, nullable=True)
    fatherName = Column("father_name", String, nullable=True)
    civilStatus = Column("civil_status", String, nullable=True)
    workEmail = Column("work_email", String, nullable=True)
    workPhone = Column("work_phone", String, nullable=True)
    extension = Column(String, nullable=True)
    personalEmail = Column("personal_email", String, nullable=True)
    personalPhone = Column("personal_phone", String, nullable=True)
    address = Column(String, nullable=True)
    linkedinProfileUrl = Column("linkedin_profile_url", String, nullable=True)
    jobTitle = Column("job_title", String, nullable=True)
    costCenter = Column("cost_center", String, nullable=True)
    employeeId = Column("employee_id", String, nullable=True)
    reportsToExecutiveId = Column("reports_to_executive_id", String, nullable=True)
    hireDate = Column("hire_date", String, nullable=True)
    workLocation = Column("work_location", String, nullable=True)
    photoUrl = Column("photo_url", String, nullable=True)
    bio = Column(String, nullable=True)
    education = Column(String, nullable=True)
    languages = Column(String, nullable=True)
    emergencyContactName = Column("emergency_contact_name", String, nullable=True)
    emergencyContactPhone = Column("emergency_contact_phone", String, nullable=True)
    emergencyContactRelation = Column("emergency_contact_relation", String, nullable=True)
    dependentsInfo = Column("dependents_info", String, nullable=True)
    bankInfo = Column("bank_info", String, nullable=True)
    compensationInfo = Column("compensation_info", String, nullable=True)
    systemAccessLevels = Column("system_access_levels", String, nullable=True)

# From secretary.py
class Secretary(Base):
    __tablename__ = "secretaries"

    id = Column(String, primary_key=True, index=True)
    fullName = Column("full_name", String)
    email = Column(String, nullable=True)
    
    user = relationship("User", back_populates="secretary", cascade="all, delete-orphan", uselist=False)
    executives = relationship("Executive", secondary=secretary_executives_table, back_populates="secretaries")

# From event.py
class EventType(Base):
    __tablename__ = "event_types"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    color = Column(String)

class Event(Base):
    __tablename__ = "events"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    startTime = Column("start_time", String)
    endTime = Column("end_time", String)
    location = Column(String, nullable=True)
    eventTypeId = Column("event_type_id", String, ForeignKey("event_types.id"), nullable=True)
    executiveId = Column("executive_id", String, ForeignKey("executives.id"))
    reminderMinutes = Column("reminder_minutes", Integer, nullable=True)
    recurrenceId = Column("recurrence_id", String, nullable=True)
    
    executive = relationship("Executive", back_populates="events")

# From contact.py
class ContactType(Base):
    __tablename__ = "contact_types"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(String, primary_key=True, index=True)
    fullName = Column("full_name", String)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    role = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    contactTypeId = Column("contact_type_id", String, ForeignKey("contact_types.id"), nullable=True)
    executiveId = Column("executive_id", String, ForeignKey("executives.id"))

    executive = relationship("Executive", back_populates="contacts")

# From expense.py
class ExpenseType(str, enum.Enum):
    pagar = 'A pagar'
    receber = 'A receber'

class ExpenseEntityType(str, enum.Enum):
    fisica = 'Pessoa Física'
    juridica = 'Pessoa Jurídica'

class ExpenseStatus(str, enum.Enum):
    pendente = 'Pendente'
    pago = 'Pago'
    recebida = 'Recebida'

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    expenseDate = Column("expense_date", String)
    type = Column(Enum(ExpenseType))
    entityType = Column("entity_type", Enum(ExpenseEntityType))
    categoryId = Column("category_id", String, ForeignKey("expense_categories.id"), nullable=True)
    status = Column(Enum(ExpenseStatus))
    receiptUrl = Column("receipt_url", String, nullable=True)
    executiveId = Column("executive_id", String, ForeignKey("executives.id"))

    executive = relationship("Executive", back_populates="expenses")

# From task.py
class Priority(str, enum.Enum):
    High = 'Alta'
    Medium = 'Média'
    Low = 'Baixa'

class Status(str, enum.Enum):
    Todo = 'A Fazer'
    InProgress = 'Em Andamento'
    Done = 'Concluído'

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    dueDate = Column("due_date", String)
    priority = Column(Enum(Priority))
    status = Column(Enum(Status))
    executiveId = Column("executive_id", String, ForeignKey("executives.id"))
    recurrenceId = Column("recurrence_id", String, nullable=True)

    executive = relationship("Executive", back_populates="tasks")

# From document.py
class DocumentCategory(Base):
    __tablename__ = "document_categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    imageUrl = Column("image_url", String)
    categoryId = Column("category_id", String, ForeignKey("document_categories.id"), nullable=True)
    executiveId = Column("executive_id", String, ForeignKey("executives.id"))
    uploadDate = Column("upload_date", String)

    executive = relationship("Executive", back_populates="documents")
\`;
export default content;
