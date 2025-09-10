import React, { useState } from 'react';
import { Expense, ExpenseStatus } from '../types';
import Modal from './Modal';
import { EditIcon, DeleteIcon, PlusIcon } from './Icons';

interface ExpensesViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  executiveId: string;
}

const ExpenseForm: React.FC<{ expense: Partial<Expense>, onSave: (expense: Expense) => void, onCancel: () => void }> = ({ expense, onSave, onCancel }) => {
    const [description, setDescription] = useState(expense.description || '');
    const [amount, setAmount] = useState(expense.amount || 0);
    const [expenseDate, setExpenseDate] = useState(expense.expenseDate || new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState(expense.category || '');
    const [status, setStatus] = useState<ExpenseStatus>(expense.status || 'Pendente');
    const [receiptUrl, setReceiptUrl] = useState(expense.receiptUrl || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount <= 0 || !expense.executiveId) return;
        onSave({
            id: expense.id || new Date().toISOString(),
            executiveId: expense.executiveId,
            description,
            amount,
            expenseDate,
            category,
            status,
            receiptUrl,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrição</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Valor (R$)</label>
                  <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
               <div>
                  <label htmlFor="expenseDate" className="block text-sm font-medium text-slate-700">Data da Despesa</label>
                  <input type="date" id="expenseDate" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoria</label>
                  <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Transporte, Alimentação" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                  <select id="status" value={status} onChange={e => setStatus(e.target.value as ExpenseStatus)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {(['Pendente', 'Aprovada', 'Reembolsada'] as ExpenseStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
              </div>
            </div>
             <div>
                <label htmlFor="receiptUrl" className="block text-sm font-medium text-slate-700">URL do Recibo</label>
                <input type="url" id="receiptUrl" value={receiptUrl} onChange={e => setReceiptUrl(e.target.value)} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar Despesa</button>
            </div>
        </form>
    );
};

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, setExpenses, executiveId }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Partial<Expense> | null>(null);

    const handleAddExpense = () => {
        setEditingExpense({ executiveId });
        setModalOpen(true);
    };

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setModalOpen(true);
    };

    const handleDeleteExpense = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
            setExpenses(prev => prev.filter(e => e.id !== id));
        }
    };
    
    const handleSaveExpense = (expense: Expense) => {
        setExpenses(prev => {
            if (editingExpense && editingExpense.id) {
                return prev.map(e => e.id === expense.id ? expense : e);
            } else {
                return [...prev, expense];
            }
        });
        setModalOpen(false);
        setEditingExpense(null);
    };

    const getStatusBadgeClass = (status: ExpenseStatus) => {
        switch(status) {
          case 'Aprovada': return 'bg-blue-100 text-blue-800';
          case 'Reembolsada': return 'bg-green-100 text-green-800';
          case 'Pendente': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-slate-100 text-slate-800';
        }
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const timeZoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + timeZoneOffset);
        return adjustedDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

     const formatCurrency = (amount: number) => {
        return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Controle de Despesas</h2>
                    <p className="text-slate-500 mt-1">Registre e acompanhe todas as despesas.</p>
                </div>
                <button onClick={handleAddExpense} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition duration-150">
                    <PlusIcon />
                    Nova Despesa
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200 text-sm text-slate-500">
                            <tr>
                                <th className="p-3">Descrição</th>
                                <th className="p-3 hidden md:table-cell">Data</th>
                                <th className="p-3 hidden lg:table-cell">Categoria</th>
                                <th className="p-3">Valor</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-800">{expense.description}</td>
                                    <td className="p-3 hidden md:table-cell text-slate-600">{formatDate(expense.expenseDate)}</td>
                                    <td className="p-3 hidden lg:table-cell text-slate-600">{expense.category}</td>
                                    <td className="p-3 font-medium text-slate-800">{formatCurrency(expense.amount)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(expense.status)}`}>{expense.status}</span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar despesa">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir despesa">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {expenses.length === 0 && <p className="text-center p-6 text-slate-500">Nenhuma despesa registrada para este executivo.</p>}
                </div>
            </div>

            {isModalOpen && (
                <Modal title={editingExpense?.id ? 'Editar Despesa' : 'Nova Despesa'} onClose={() => setModalOpen(false)}>
                    <ExpenseForm expense={editingExpense || {}} onSave={handleSaveExpense} onCancel={() => { setModalOpen(false); setEditingExpense(null); }} />
                </Modal>
            )}
        </div>
    );
};

export default ExpensesView;
