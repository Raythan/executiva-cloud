
const content = `
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    organizationId = Column("organization_id", String, ForeignKey("organizations.id"))

    organization = relationship("Organization", back_populates="departments")
    executives = relationship("Executive", back_populates="department")
`;
export default content;
