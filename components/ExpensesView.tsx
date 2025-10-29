import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Executive, ExpenseCategory, ExpenseStatus, ExpenseType, ExpenseEntityType, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface ExpensesViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
  selectedExecutive: Executive | undefined;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ allData, setAllData, selectedExecutive }) => {
  const { expenses, executives, expenseCategories } = allData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  
  const [formData, setFormData] = useState({
      description: '',
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      type: ExpenseType.APagar,
      entityType: ExpenseEntityType.PessoaJuridica,
      categoryId: '',
      status: ExpenseStatus.Pendente,
      executiveId: ''
  });

  const filteredExpenses = selectedExecutive
    ? expenses.filter(expense => expense.executiveId === selectedExecutive.id)
    : expenses;
    
  const handleOpenModal = (expense: Expense | null) => {
    setEditingExpense(expense);
    if (expense) {
        setFormData({
            description: expense.description,
            amount: expense.amount,
            expenseDate: expense.expenseDate,
            type: expense.type,
            entityType: expense.entityType,
            categoryId: expense.categoryId || '',
            status: expense.status,
            executiveId: expense.executiveId,
        });
    } else {
        setFormData({
            description: '',
            amount: 0,
            expenseDate: new Date().toISOString().split('T')[0],
            type: ExpenseType.APagar,
            entityType: ExpenseEntityType.PessoaJuridica,
            categoryId: expenseCategories[0]?.id || '',
            status: ExpenseStatus.Pendente,
            executiveId: selectedExecutive?.id || executives[0]?.id || ''
        });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.executiveId) {
        alert("Por favor, selecione um executivo.");
        return;
    }
    const payload = {
        ...formData,
        amount: Number(formData.amount),
        categoryId: formData.categoryId || undefined
    };

    if (editingExpense) {
      const updatedExpenses = expenses.map(ex => 
        ex.id === editingExpense.id ? { ...ex, ...payload } : ex
      );
      setAllData({ ...allData, expenses: updatedExpenses });
    } else {
      const newExpense: Expense = {
        id: uuidv4(),
        ...payload,
        receiptUrl: '', // Default value
      };
      setAllData({ ...allData, expenses: [...expenses, newExpense]});
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
      if (!expenseToDelete) return;
      const updatedExpenses = expenses.filter(ex => ex.id !== expenseToDelete.id);
      setAllData({ ...allData, expenses: updatedExpenses });
      setExpenseToDelete(null);
  };
    
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Finanças</h2>
            <p className="text-slate-500 mt-1">
            {selectedExecutive 
                ? `Visualizando finanças de ${selectedExecutive.fullName}.` 
                : 'Visualizando finanças de todos os executivos.'}
            </p>
        </div>
        <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
            <PlusIcon /> Adicionar Despesa
        </button>
      </header>

       <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Registro de Despesas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm text-slate-500">
                <th className="p-3">Descrição</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Data</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Status</th>
                <th className="p-3">Executivo</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => {
                const executive = executives.find(e => e.id === expense.executiveId);
                const category = expenseCategories.find(c => c.id === expense.categoryId);
                return (
                  <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                    <td className="p-3 font-semibold text-slate-800">{expense.description}</td>
                    <td className="p-3 text-slate-600 font-medium">{formatCurrency(expense.amount)}</td>
                    <td className="p-3 text-slate-600">{new Date(expense.expenseDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td className="p-3 text-slate-600">{category?.name || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{expense.status}</td>
                    <td className="p-3 text-slate-600">{executive?.fullName || 'N/A'}</td>
                    <td className="p-3">
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(expense)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                            <button onClick={() => setExpenseToDelete(expense)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredExpenses.length === 0 && (
            <p className="text-center p-6 text-slate-500">Nenhuma despesa encontrada para os filtros selecionados.</p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal title={editingExpense ? 'Editar Despesa' : 'Nova Despesa'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                 <div>
                    <label className="form-label">Executivo</label>
                    <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="form-select" required>
                        {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Descrição</label>
                    <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Valor</label>
                        <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="form-input" required />
                    </div>
                     <div>
                        <label className="form-label">Data da Despesa</label>
                        <input type="date" value={formData.expenseDate} onChange={e => setFormData({...formData, expenseDate: e.target.value})} className="form-input" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Categoria</label>
                        <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="form-select">
                             <option value="">Nenhuma</option>
                             {expenseCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="form-label">Status</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ExpenseStatus})} className="form-select">
                            {Object.values(ExpenseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}
      <ConfirmationModal isOpen={!!expenseToDelete} onClose={() => setExpenseToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a despesa "${expenseToDelete?.description}"?`} />
    </div>
  );
};

export default ExpensesView;