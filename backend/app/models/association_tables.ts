
const content = `
from sqlalchemy import Table, Column, String, ForeignKey
from ..database import Base

secretary_executives_table = Table(
    'secretary_executives',
    Base.metadata,
    Column('secretary_id', String, ForeignKey('secretaries.id'), primary_key=True),
    Column('executive_id', String, ForeignKey('executives.id'), primary_key=True)
)
`;
export default content;
