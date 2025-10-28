
const content = `
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from ..database import Base
from .association_tables import secretary_executives_table

class Secretary(Base):
    __tablename__ = "secretaries"

    id = Column(String, primary_key=True, index=True)
    fullName = Column("full_name", String)
    email = Column(String, nullable=True)
    
    user = relationship("User", back_populates="secretary", cascade="all, delete-orphan", uselist=False)
    executives = relationship("Executive", secondary=secretary_executives_table, back_populates="secretaries")
`;
export default content;
