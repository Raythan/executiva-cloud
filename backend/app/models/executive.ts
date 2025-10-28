
const content = `
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

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
`;
export default content;
