import React, { useState, useMemo, useEffect } from 'react';
import { Expense, ExpenseStatus, LayoutView } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import Pagination from './Pagination';
import ViewSwitcher from './ViewSwitcher';
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
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    const [layout, setLayout] = useLocalStorage<LayoutView>('expensesViewLayout', 'table');
    const [limit, setLimit] = useLocalStorage('expensesViewLimit', 10);
    const [currentPage, setCurrentPage] = useState(1);

    const sortedExpenses = useMemo(() => 
        [...expenses].sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()), 
    [expenses]);

    const paginatedExpenses = useMemo(() => {
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        return sortedExpenses.slice(start, end);
    }, [sortedExpenses, currentPage, limit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit, expenses, layout]);

    const handleAddExpense = () => {
        setEditingExpense({ executiveId });
        setModalOpen(true);
    };

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setModalOpen(true);
    };

    const handleDeleteExpense = (expense: Expense) => {
        setExpenseToDelete(expense);
    };
    
    const confirmDelete = () => {
        if (expenseToDelete) {
            setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
            setExpenseToDelete(null);
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
          case 'Aprovada': return 'bg-blue-100 text-blue-800 border-blue-500';
          case 'Reembolsada': return 'bg-green-100 text-green-800 border-green-500';
          case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
          default: return 'bg-slate-100 text-slate-800 border-slate-500';
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

    const renderItems = () => {
        if (paginatedExpenses.length === 0) {
             return (
                <div className="col-span-full text-center p-6 bg-white rounded-xl shadow-md">
                    <p className="text-slate-500">Nenhuma despesa registrada para este executivo.</p>
                </div>
            );
        }

        switch (layout) {
            case 'card':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedExpenses.map(expense => (
                            <div key={expense.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <p className="font-bold text-slate-800 text-lg">{expense.description}</p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadgeClass(expense.status)}`}>{expense.status}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-indigo-600 mt-2">{formatCurrency(expense.amount)}</p>
                                    <p className="text-sm text-slate-500">{formatDate(expense.expenseDate)}</p>
                                    <p className="text-sm text-slate-400">{expense.category}</p>
                                </div>
                                <div className="flex justify-end items-center gap-1 mt-4">
                                    <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition"><EditIcon /></button>
                                    <button onClick={() => handleDeleteExpense(expense)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'list':
                 return (
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4">
                        {paginatedExpenses.map(expense => (
                            <div key={expense.id} className={`flex items-start space-x-4 p-4 rounded-lg bg-slate-50 border-l-4 ${getStatusBadgeClass(expense.status)}`}>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-800">{expense.description}</h3>
                                        <p className="font-bold text-indigo-700 text-lg">{formatCurrency(expense.amount)}</p>
                                    </div>
                                    <p className="text-sm text-slate-500">{formatDate(expense.expenseDate)} - {expense.category}</p>
                                    <span className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClass(expense.status)}`}>{expense.status}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-1">
                                    <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition"><EditIcon /></button>
                                    <button onClick={() => handleDeleteExpense(expense)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'table':
            default:
                return (
                    <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
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
                                {paginatedExpenses.map(expense => (
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
                                                <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar despesa"><EditIcon /></button>
                                                <button onClick={() => handleDeleteExpense(expense)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir despesa"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
        }
    };


    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Controle de Despesas</h2>
                    <p className="text-slate-500 mt-1">Registre e acompanhe todas as despesas.</p>
                </div>
                <button onClick={handleAddExpense} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition duration-150">
                    <PlusIcon />
                    Nova Despesa
                </button>
            </header>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-white rounded-xl shadow-md">
                <ViewSwitcher layout={layout} setLayout={setLayout} />
                <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="limit" className="text-slate-600">Itens por página:</label>
                    <select id="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-2 py-1 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

             <div>
                {renderItems()}
                {sortedExpenses.length > 0 && (
                     <div className={layout !== 'table' ? "mt-6" : "bg-white p-4 rounded-b-xl shadow-md"}>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={sortedExpenses.length}
                            itemsPerPage={limit}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal title={editingExpense?.id ? 'Editar Despesa' : 'Nova Despesa'} onClose={() => setModalOpen(false)}>
                    <ExpenseForm expense={editingExpense || {}} onSave={handleSaveExpense} onCancel={() => { setModalOpen(false); setEditingExpense(null); }} />
                </Modal>
            )}

            {expenseToDelete && (
                 <ConfirmationModal
                    isOpen={!!expenseToDelete}
                    onClose={() => setExpenseToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir a despesa "${expenseToDelete.description}"?`}
                />
            )}
        </div>
    );
};

export default ExpensesView;