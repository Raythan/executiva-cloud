
const content = `
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

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
`;
export default content;
