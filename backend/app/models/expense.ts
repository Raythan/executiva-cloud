
const content = `
from sqlalchemy import Column, String, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import enum

class ExpenseType(str, enum.Enum):
    pagar = 'A pagar'
    receber = 'A receber'

class ExpenseEntityType(str, enum.Enum):
    fisica = 'Pessoa Física'
    juridica = 'Pessoa Jurídica'

class ExpenseStatus(str, enum.Enum):
    pendente = 'Pendente'
    pago = 'Pago'
    recebida = 'Recebida'

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    expenseDate = Column("expense_date", String)
    type = Column(Enum(ExpenseType))
    entityType = Column("entity_type", Enum(ExpenseEntityType))
    categoryId = Column("category_id", String, ForeignKey("expense_categories.id"), nullable=True)
    status = Column(Enum(ExpenseStatus))
    receiptUrl = Column("receipt_url", String, nullable=True)
    executiveId = Column("executive_id", String, ForeignKey("executives.id"))

    executive = relationship("Executive", back_populates="expenses")
`;
export default content;
