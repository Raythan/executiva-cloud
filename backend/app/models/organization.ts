
const content = `
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from ..database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)

    departments = relationship("Department", back_populates="organization", cascade="all, delete-orphan")
    executives = relationship("Executive", back_populates="organization")
`;
export default content;
