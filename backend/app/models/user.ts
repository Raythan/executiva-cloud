
const content = `
from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import enum

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
`;
export default content;
