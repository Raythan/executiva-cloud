
const content = `
from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import enum

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
`;
export default content;
