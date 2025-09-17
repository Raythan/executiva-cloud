import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Expense, ExpenseStatus, LayoutView, ExpenseCategory, ExpenseType, ExpenseEntityType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import Pagination from './Pagination';
import ViewSwitcher from './ViewSwitcher';
import { EditIcon, DeleteIcon, PlusIcon, SettingsIcon, ChevronDownIcon } from './Icons';

interface FinancesViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  expenseCategories: ExpenseCategory[];
  setExpenseCategories: React.Dispatch<React.SetStateAction<ExpenseCategory[]>>;
  executiveId: string;
}

type ChartData = {
    [month: string]: {
        'Pessoa Física': { 'A pagar': number; 'A receber': number; };
        'Pessoa Jurídica': { 'A pagar': number; 'A receber': number; };
    }
};

// --- Category Management Components ---
const CategoryForm: React.FC<{ category: Partial<ExpenseCategory>, onSave: (cat: ExpenseCategory) => void, onCancel: () => void }> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category.name || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSave({ id: category.id || `ec_${new Date().getTime()}`, name });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-slate-700">Nome da Categoria</label>
                <input type="text" id="cat-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
            </div>
        </form>
    );
};

const CategorySettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    categories: ExpenseCategory[];
    setCategories: React.Dispatch<React.SetStateAction<ExpenseCategory[]>>;
}> = ({ isOpen, onClose, categories, setCategories }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<ExpenseCategory> | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<ExpenseCategory | null>(null);

    const handleSave = (category: ExpenseCategory) => {
        setCategories(prev => editingCategory?.id ? prev.map(c => c.id === category.id ? category : c) : [...prev, category]);
        setFormOpen(false);
        setEditingCategory(null);
    };

    const confirmDelete = () => {
        if (!categoryToDelete) return;
        setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
        setCategoryToDelete(null);
    };

    if (!isOpen) return null;
    return (
        <Modal title="Gerenciar Categorias de Finanças" onClose={onClose}>
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button onClick={() => { setEditingCategory({}); setFormOpen(true); }} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition text-sm">
                        <PlusIcon /> Adicionar Categoria
                    </button>
                </div>
                <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {categories.map(cat => (
                       <li key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="font-medium text-slate-800">{cat.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingCategory(cat); setFormOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><EditIcon /></button>
                                <button onClick={() => setCategoryToDelete(cat)} className="p-2 text-slate-400 hover:text-red-600"><DeleteIcon /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {isFormOpen && (
                <Modal title={editingCategory?.id ? 'Editar Categoria' : 'Nova Categoria'} onClose={() => setFormOpen(false)}>
                    <CategoryForm category={editingCategory || {}} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditingCategory(null); }} />
                </Modal>
            )}
            {categoryToDelete && <ConfirmationModal isOpen={!!categoryToDelete} onClose={() => setCategoryToDelete(null)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a categoria "${categoryToDelete.name}"?`} />}
        </Modal>
    );
};

const ExpenseForm: React.FC<{ expense: Partial<Expense>, onSave: (expense: Expense) => void, onCancel: () => void, categories: ExpenseCategory[] }> = ({ expense, onSave, onCancel, categories }) => {
    const [description, setDescription] = useState(expense.description || '');
    const [amount, setAmount] = useState(expense.amount || 0);
    const [expenseDate, setExpenseDate] = useState(expense.expenseDate || new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<ExpenseType>(expense.type || 'A pagar');
    const [entityType, setEntityType] = useState<ExpenseEntityType>(expense.entityType || 'Pessoa Jurídica');
    const [categoryId, setCategoryId] = useState(expense.categoryId || '');
    const [status, setStatus] = useState<ExpenseStatus>(expense.status || 'Pendente');
    const [receiptUrl, setReceiptUrl] = useState(expense.receiptUrl || '');

    const statusOptions = useMemo(() => {
        if (type === 'A pagar') {
            return ['Pendente', 'Pago'];
        }
        return ['Pendente', 'Recebida'];
    }, [type]);

    useEffect(() => {
        // Reset status if it becomes invalid for the current type
        if (!statusOptions.includes(status)) {
            setStatus(statusOptions[0] as ExpenseStatus);
        }
    }, [status, type, statusOptions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount <= 0 || !expense.executiveId) return;
        onSave({
            id: expense.id || `exp_${new Date().toISOString()}`,
            executiveId: expense.executiveId,
            description, amount, expenseDate, type, entityType, categoryId, status, receiptUrl,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Lançamento</label>
                <div className="flex gap-4">
                    {(['A pagar', 'A receber'] as ExpenseType[]).map(t => (
                        <label key={t} className="flex items-center">
                            <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-sm text-slate-600">{t}</span>
                        </label>
                    ))}
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Origem</label>
                <div className="flex gap-4">
                    {(['Pessoa Jurídica', 'Pessoa Física'] as ExpenseEntityType[]).map(e => (
                        <label key={e} className="flex items-center">
                            <input type="radio" name="entityType" value={e} checked={entityType === e} onChange={() => setEntityType(e)} className="h-4 w-4 text-indigo-600" />
                            <span className="ml-2 text-sm text-slate-600">{e}</span>
                        </label>
                    ))}
                </div>
            </div>
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
                    <label htmlFor="expenseDate" className="block text-sm font-medium text-slate-700">Data</label>
                    <input type="date" id="expenseDate" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoria</label>
                    <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Sem categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as ExpenseStatus)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="receiptUrl" className="block text-sm font-medium text-slate-700">URL do Recibo</label>
                <input type="url" id="receiptUrl" value={receiptUrl} onChange={e => setReceiptUrl(e.target.value)} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar Lançamento</button>
            </div>
        </form>
    );
};

const FinancesView: React.FC<FinancesViewProps> = ({ expenses, setExpenses, expenseCategories, setExpenseCategories, executiveId }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Partial<Expense> | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    
    // Filters
    const [filterType, setFilterType] = useState<ExpenseType | 'all'>('all');
    const [filterEntityType, setFilterEntityType] = useState<ExpenseEntityType | 'all'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    
    const [layout, setLayout] = useLocalStorage<LayoutView>('financesViewLayout', 'table');
    const [limit, setLimit] = useLocalStorage('financesViewLimit', 10);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Dashboard State
    const [isDashboardOpen, setDashboardOpen] = useState(true);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const [chartStartDate, setChartStartDate] = useState(firstDayOfMonth);
    const [chartEndDate, setChartEndDate] = useState(today.toISOString().split('T')[0]);
    const [chartData, setChartData] = useState<ChartData | null>(null);

    const generateChartData = useCallback(() => {
        const filtered = expenses.filter(e => {
            const expenseDate = new Date(e.expenseDate + 'T00:00:00'); 
            const start = new Date(chartStartDate + 'T00:00:00');
            const end = new Date(chartEndDate + 'T00:00:00');
            return expenseDate >= start && expenseDate <= end;
        });

        const data: ChartData = {};

        filtered.forEach(expense => {
            const month = expense.expenseDate.substring(0, 7); // "YYYY-MM"
            if (!data[month]) {
                data[month] = {
                    'Pessoa Física': { 'A pagar': 0, 'A receber': 0 },
                    'Pessoa Jurídica': { 'A pagar': 0, 'A receber': 0 }
                };
            }
            data[month][expense.entityType][expense.type] += expense.amount;
        });
        
        const sortedData: ChartData = Object.keys(data).sort().reduce(
            (obj, key) => { obj[key] = data[key]; return obj; }, {} as ChartData
        );

        setChartData(sortedData);
    }, [expenses, chartStartDate, chartEndDate]);
    
    useEffect(() => {
        generateChartData();
    }, [generateChartData]);


    const filteredExpenses = useMemo(() => {
      return [...expenses]
        .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
        .filter(e => filterType === 'all' || e.type === filterType)
        .filter(e => filterEntityType === 'all' || e.entityType === filterEntityType)
        .filter(e => filterCategory === 'all' || e.categoryId === filterCategory);
    }, [expenses, filterType, filterEntityType, filterCategory]);

    const paginatedExpenses = useMemo(() => {
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        return filteredExpenses.slice(start, end);
    }, [filteredExpenses, currentPage, limit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit, expenses, layout, filterType, filterEntityType, filterCategory]);

    const handleAddExpense = () => {
        setEditingExpense({ executiveId });
        setModalOpen(true);
    };

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        if (expenseToDelete) {
            setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
            setExpenseToDelete(null);
        }
    };
    
    const handleSaveExpense = (expense: Expense) => {
        setExpenses(prev => editingExpense?.id ? prev.map(e => e.id === expense.id ? expense : e) : [...prev, expense]);
        setModalOpen(false);
        setEditingExpense(null);
    };

    const getStatusBadgeClass = (status: ExpenseStatus) => ({
      'Pago': 'bg-green-100 text-green-800 border-green-500',
      'Recebida': 'bg-emerald-100 text-emerald-800 border-emerald-500',
      'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-500',
    }[status] || 'bg-slate-100 text-slate-800 border-slate-500');
    
    const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
    const formatCurrency = (amount: number) => amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const maxChartValue = useMemo(() => {
        if (!chartData) return 1;
        const max = Math.max(1, ...Object.values(chartData).flatMap(d => [
            d['Pessoa Física']['A pagar'] + d['Pessoa Física']['A receber'], 
            d['Pessoa Jurídica']['A pagar'] + d['Pessoa Jurídica']['A receber']
        ]));
        return max;
    }, [chartData]);
    
    const formatMonthForChart = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    };

    const renderItems = () => {
        if (paginatedExpenses.length === 0) return <div className="col-span-full text-center p-6 bg-white rounded-xl shadow-md"><p className="text-slate-500">Nenhum lançamento encontrado para os filtros aplicados.</p></div>;
        switch (layout) {
            case 'card': return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedExpenses.map(expense => {
                        const categoryName = expenseCategories.find(c => c.id === expense.categoryId)?.name;
                        return (
                        <div key={expense.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between">
                                    <p className="font-bold text-slate-800 text-lg break-words pr-2">{expense.description}</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadgeClass(expense.status)}`}>{expense.status}</span>
                                </div>
                                <p className={`font-bold text-2xl mt-2 ${expense.type === 'A receber' ? 'text-green-600' : 'text-red-600'}`}>
                                    {expense.type === 'A receber' ? '+' : '-'} {formatCurrency(expense.amount)}
                                </p>
                                <div className="text-sm text-slate-500 mt-3 space-y-1 border-t pt-3">
                                    <p><strong>Data:</strong> {formatDate(expense.expenseDate)}</p>
                                    <p><strong>Categoria:</strong> {categoryName || 'N/A'}</p>
                                    <p><strong>Origem:</strong> {expense.entityType}</p>
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-1 mt-4">
                                <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar"><EditIcon /></button>
                                <button onClick={() => setExpenseToDelete(expense)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir"><DeleteIcon /></button>
                            </div>
                        </div>
                    )})}
                </div>
            );
             case 'list': return (
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4">
                    {paginatedExpenses.map(expense => {
                        const categoryName = expenseCategories.find(c => c.id === expense.categoryId)?.name;
                        return (
                        <div key={expense.id} className={`flex items-center space-x-4 p-4 rounded-lg bg-slate-50 border-l-4 ${expense.type === 'A receber' ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="flex-1">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <h3 className="text-lg font-semibold text-slate-800">{expense.description}</h3>
                                    <p className={`font-bold text-lg ${expense.type === 'A receber' ? 'text-green-600' : 'text-red-600'}`}>
                                       {expense.type === 'A receber' ? '+' : '-'} {formatCurrency(expense.amount)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-slate-500 mt-1">
                                    <span>{formatDate(expense.expenseDate)}</span>
                                    <span className="text-slate-300 hidden sm:inline">|</span>
                                    <span>{categoryName || 'N/A'}</span>
                                    <span className="text-slate-300 hidden sm:inline">|</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClass(expense.status)}`}>{expense.status}</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-1">
                                <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar"><EditIcon /></button>
                                <button onClick={() => setExpenseToDelete(expense)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir"><DeleteIcon /></button>
                            </div>
                        </div>
                    )})}
                </div>
            );
            case 'table': return (
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
                            {paginatedExpenses.map(expense => {
                                const categoryName = expenseCategories.find(c => c.id === expense.categoryId)?.name;
                                return (
                                <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-800">
                                        {expense.description}
                                        <p className="font-normal text-xs text-slate-500">{expense.entityType} - {expense.type}</p>
                                    </td>
                                    <td className="p-3 hidden md:table-cell text-slate-600">{formatDate(expense.expenseDate)}</td>
                                    <td className="p-3 hidden lg:table-cell text-slate-600">{categoryName}</td>
                                    <td className={`p-3 font-medium ${expense.type === 'A receber' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(expense.amount)}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(expense.status)}`}>{expense.status}</span></td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => handleEditExpense(expense)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar"><EditIcon /></button>
                                            <button onClick={() => setExpenseToDelete(expense)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
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
                    <h2 className="text-3xl font-bold text-slate-800">Controle Financeiro</h2>
                    <p className="text-slate-500 mt-1">Registre e acompanhe suas finanças.</p>
                </div>
                 <div className="flex items-center gap-2">
                    <button onClick={handleAddExpense} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition duration-150">
                        <PlusIcon />
                        Novo Lançamento
                    </button>
                    <button onClick={() => setCategoryModalOpen(true)} className="p-2 bg-indigo-100 text-indigo-700 rounded-md shadow-sm hover:bg-indigo-200 transition" aria-label="Gerenciar Categorias">
                        <SettingsIcon />
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-md">
                <button onClick={() => setDashboardOpen(!isDashboardOpen)} className="w-full flex justify-between items-center p-4">
                    <h3 className="text-xl font-bold text-slate-700">Dashboard Financeiro</h3>
                    <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform ${isDashboardOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDashboardOpen && (
                    <div className="p-4 border-t border-slate-200 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="chart-start-date" className="block text-sm font-medium text-slate-700">De</label>
                                <input type="date" id="chart-start-date" value={chartStartDate} onChange={e => setChartStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="chart-end-date" className="block text-sm font-medium text-slate-700">Até</label>
                                <input type="date" id="chart-end-date" value={chartEndDate} onChange={e => setChartEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm" />
                            </div>
                            <div className="self-end">
                                <button onClick={generateChartData} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition">Atualizar Gráfico</button>
                            </div>
                        </div>
                        
                        {chartData && Object.keys(chartData).length > 0 ? (
                            <div className="pt-4">
                                <div className="flex justify-center items-center gap-6 mb-4 text-sm">
                                     <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-500 rounded-sm"></span> A Pagar</div>
                                     <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-sm"></span> A Receber</div>
                                     <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-300 rounded-sm"></span> Pessoa Física</div>
                                     <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-500 rounded-sm"></span> Pessoa Jurídica</div>
                                </div>
                                <div className="flex h-80 space-x-2 md:space-x-4 items-end p-4 border rounded-lg bg-slate-50 overflow-x-auto">
                                    {Object.entries(chartData).map(([month, data]) => {
                                        const pfTotal = data['Pessoa Física']['A pagar'] + data['Pessoa Física']['A receber'];
                                        const pjTotal = data['Pessoa Jurídica']['A pagar'] + data['Pessoa Jurídica']['A receber'];
                                        return (
                                        <div key={month} className="flex flex-col items-center flex-1 min-w-[100px]">
                                            <div className="flex items-end h-full gap-1 w-full justify-center">
                                                {/* Bar for Pessoa Física */}
                                                <div className="w-full rounded-t-md relative group bg-slate-300" style={{ height: `${(pfTotal / maxChartValue) * 100}%` }}>
                                                    <div className="absolute bottom-0 w-full flex flex-col justify-end">
                                                        <div className="bg-green-500" style={{ height: `${pfTotal > 0 ? (data['Pessoa Física']['A receber'] / pfTotal) * 100 : 0}%` }}></div>
                                                        <div className="bg-red-500" style={{ height: `${pfTotal > 0 ? (data['Pessoa Física']['A pagar'] / pfTotal) * 100 : 0}%` }}></div>
                                                    </div>
                                                    <div className="absolute bottom-full mb-2 w-48 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                                        <p className="font-bold">Pessoa Física</p>
                                                        <p>A Receber: {formatCurrency(data['Pessoa Física']['A receber'])}</p>
                                                        <p>A Pagar: {formatCurrency(data['Pessoa Física']['A pagar'])}</p>
                                                    </div>
                                                </div>
                                                {/* Bar for Pessoa Jurídica */}
                                                <div className="w-full rounded-t-md relative group bg-slate-500" style={{ height: `${(pjTotal / maxChartValue) * 100}%` }}>
                                                    <div className="absolute bottom-0 w-full flex flex-col justify-end">
                                                        <div className="bg-green-500" style={{ height: `${pjTotal > 0 ? (data['Pessoa Jurídica']['A receber'] / pjTotal) * 100 : 0}%` }}></div>
                                                        <div className="bg-red-500" style={{ height: `${pjTotal > 0 ? (data['Pessoa Jurídica']['A pagar'] / pjTotal) * 100 : 0}%` }}></div>
                                                    </div>
                                                    <div className="absolute bottom-full mb-2 w-48 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                                        <p className="font-bold">Pessoa Jurídica</p>
                                                        <p>A Receber: {formatCurrency(data['Pessoa Jurídica']['A receber'])}</p>
                                                        <p>A Pagar: {formatCurrency(data['Pessoa Jurídica']['A pagar'])}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500 mt-2 whitespace-nowrap">{formatMonthForChart(month)}</span>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-slate-500 py-10">Nenhum dado financeiro encontrado para o período selecionado.</p>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 bg-white rounded-xl shadow-md">
                <ViewSwitcher layout={layout} setLayout={setLayout} />
                <div className="flex items-center gap-2 text-sm">
                    <label htmlFor="limit" className="text-slate-600">Itens por página:</label>
                    <select id="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="px-2 py-1 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value={10}>10</option><option value={30}>30</option><option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="filter-type" className="block text-sm font-medium text-slate-700">Tipo</label>
                        <select id="filter-type" value={filterType} onChange={e => setFilterType(e.target.value as any)} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                            <option value="all">Todos</option><option value="A pagar">A pagar</option><option value="A receber">A receber</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filter-entity" className="block text-sm font-medium text-slate-700">Origem</label>
                        <select id="filter-entity" value={filterEntityType} onChange={e => setFilterEntityType(e.target.value as any)} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                            <option value="all">Todas</option><option value="Pessoa Jurídica">Pessoa Jurídica</option><option value="Pessoa Física">Pessoa Física</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filter-category" className="block text-sm font-medium text-slate-700">Categoria</label>
                        <select id="filter-category" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm">
                            <option value="all">Todas</option>
                            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

             <div>
                {renderItems()}
                {filteredExpenses.length > 0 && (
                     <div className="mt-6">
                        <Pagination currentPage={currentPage} totalItems={filteredExpenses.length} itemsPerPage={limit} onPageChange={setCurrentPage} />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal title={editingExpense?.id ? 'Editar Lançamento' : 'Novo Lançamento'} onClose={() => setModalOpen(false)}>
                    <ExpenseForm expense={editingExpense || {}} onSave={handleSaveExpense} onCancel={() => { setModalOpen(false); setEditingExpense(null); }} categories={expenseCategories} />
                </Modal>
            )}
            
            <CategorySettingsModal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} categories={expenseCategories} setCategories={setExpenseCategories} />

            {expenseToDelete && <ConfirmationModal isOpen={!!expenseToDelete} onClose={() => setExpenseToDelete(null)} onConfirm={confirmDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o lançamento "${expenseToDelete.description}"?`} />}
        </div>
    );
};

export default FinancesView;