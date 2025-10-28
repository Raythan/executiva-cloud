
const content = `
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

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
`;
export default content;
