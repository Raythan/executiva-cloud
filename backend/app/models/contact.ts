
const content = `
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

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
`;
export default content;
