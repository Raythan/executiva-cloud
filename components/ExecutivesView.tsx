import React, { useState, useMemo, useEffect } from 'react';
import { Executive, Organization, Department, Event, Contact, Expense, Task, User, Secretary } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { EditIcon, DeleteIcon, PlusIcon, EmailIcon, PhoneIcon } from './Icons';

interface ExecutivesViewProps {
  executives: Executive[];
  setExecutives: React.Dispatch<React.SetStateAction<Executive[]>>;
  organizations: Organization[];
  departments: Department[];
  secretaries: Secretary[];
  setSecretaries: React.Dispatch<React.SetStateAction<Secretary[]>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const ExecutiveForm: React.FC<{ executive: Partial<Executive>, onSave: (executive: Executive) => void, onCancel: () => void, organizations: Organization[], departments: Department[] }> = ({ executive, onSave, onCancel, organizations, departments }) => {
    const [fullName, setFullName] = useState(executive.fullName || '');
    const [email, setEmail] = useState(executive.email || '');
    const [phone, setPhone] = useState(executive.phone || '');
    const [organizationId, setOrganizationId] = useState(executive.organizationId || '');
    const [departmentId, setDepartmentId] = useState(executive.departmentId || '');

    const filteredDepartments = useMemo(() => {
        if (!organizationId) return [];
        return departments.filter(d => d.organizationId === organizationId);
    }, [organizationId, departments]);
    
    useEffect(() => {
        if (organizationId && departmentId) {
            const isValid = filteredDepartments.some(d => d.id === departmentId);
            if (!isValid) {
                setDepartmentId('');
            }
        }
    }, [organizationId, departmentId, filteredDepartments]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName) return;
        onSave({
            id: executive.id || `exec_${new Date().getTime()}`,
            fullName,
            email,
            phone,
            organizationId,
            departmentId,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefone</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="organizationId" className="block text-sm font-medium text-slate-700">Organização</label>
                    <select id="organizationId" value={organizationId} onChange={e => {setOrganizationId(e.target.value); setDepartmentId('');}} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Sem Organização</option>
                        {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="departmentId" className="block text-sm font-medium text-slate-700">Departamento</label>
                    <select id="departmentId" value={departmentId} onChange={e => setDepartmentId(e.target.value)} disabled={!organizationId || filteredDepartments.length === 0} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-slate-50 disabled:cursor-not-allowed">
                        <option value="">Sem Departamento</option>
                        {filteredDepartments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar Executivo</button>
            </div>
        </form>
    );
};

const ExecutivesView: React.FC<ExecutivesViewProps> = ({ executives, setExecutives, organizations, departments, secretaries, setSecretaries, setEvents, setContacts, setExpenses, setTasks, setUsers }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingExecutive, setEditingExecutive] = useState<Partial<Executive> | null>(null);
    const [executiveToDelete, setExecutiveToDelete] = useState<Executive | null>(null);

    const handleAddExecutive = () => {
        setEditingExecutive({});
        setModalOpen(true);
    };

    const handleEditExecutive = (executive: Executive) => {
        setEditingExecutive(executive);
        setModalOpen(true);
    };

    const handleDeleteClick = (executive: Executive) => {
        setExecutiveToDelete(executive);
    };

    const confirmDelete = () => {
        if (executiveToDelete) {
            const id = executiveToDelete.id;
            // Delete the executive
            setExecutives(execs => execs.filter(e => e.id !== id));
            // Delete the user
            setUsers(users => users.filter(u => u.executiveId !== id));
            // Unlink from secretaries
            setSecretaries(secs => secs.map(sec => ({
                ...sec,
                executiveIds: sec.executiveIds.filter(execId => execId !== id)
            })));
            // Cascade delete for all related data
            setEvents(prev => prev.filter(item => item.executiveId !== id));
            setContacts(prev => prev.filter(item => item.executiveId !== id));
            setExpenses(prev => prev.filter(item => item.executiveId !== id));
            setTasks(prev => prev.filter(item => item.executiveId !== id));
            setExecutiveToDelete(null);
        }
    };
    
    const handleSaveExecutive = (executive: Executive) => {
        if (editingExecutive && editingExecutive.id) {
            setExecutives(execs => execs.map(e => e.id === executive.id ? executive : e));
            setUsers(users => users.map(u => u.executiveId === executive.id ? { ...u, fullName: executive.fullName } : u));
        } else {
            setExecutives(execs => [...execs, executive]);
            setUsers(users => [...users, {
                id: `user_exec_${executive.id}`,
                fullName: executive.fullName,
                role: 'executive',
                executiveId: executive.id,
            }]);
        }
        setModalOpen(false);
        setEditingExecutive(null);
    };

    const getExecutiveDetails = (exec: Executive) => {
        const org = organizations.find(o => o.id === exec.organizationId);
        const dept = departments.find(d => d.id === exec.departmentId);
        return `${org ? org.name : 'N/A'}${dept ? ` / ${dept.name}` : ''}`;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Gerenciar Executivos</h2>
                    <p className="text-slate-500 mt-1">Adicione, edite e visualize os executivos que você gerencia.</p>
                </div>
                <button onClick={handleAddExecutive} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition duration-150">
                    <PlusIcon />
                    Novo Executivo
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200 text-sm text-slate-500">
                            <tr>
                                <th className="p-3">Nome</th>
                                <th className="p-3 hidden md:table-cell">Organização / Departamento</th>
                                <th className="p-3 hidden lg:table-cell">Contato</th>
                                <th className="p-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {executives.map(exec => (
                                <tr key={exec.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-800">{exec.fullName}</td>
                                    <td className="p-3 hidden md:table-cell text-slate-600">{getExecutiveDetails(exec)}</td>
                                    <td className="p-3 hidden lg:table-cell text-slate-600 text-sm">
                                        {exec.email && <p className="flex items-center gap-2"><EmailIcon /> {exec.email}</p>}
                                        {exec.phone && <p className="flex items-center gap-2 mt-1"><PhoneIcon /> {exec.phone}</p>}
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => handleEditExecutive(exec)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar executivo">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDeleteClick(exec)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir executivo">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {executives.length === 0 && <p className="text-center p-6 text-slate-500">Nenhum executivo cadastrado.</p>}
                </div>
            </div>

            {isModalOpen && (
                <Modal title={editingExecutive?.id ? 'Editar Executivo' : 'Novo Executivo'} onClose={() => setModalOpen(false)}>
                    <ExecutiveForm 
                        executive={editingExecutive || {}} 
                        onSave={handleSaveExecutive} 
                        onCancel={() => { setModalOpen(false); setEditingExecutive(null); }}
                        organizations={organizations}
                        departments={departments}
                    />
                </Modal>
            )}

            {executiveToDelete && (
                 <ConfirmationModal
                    isOpen={!!executiveToDelete}
                    onClose={() => setExecutiveToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o executivo ${executiveToDelete.fullName}? Todos os seus dados (eventos, contatos, etc), vínculos com secretárias e seu acesso de usuário serão perdidos.`}
                />
            )}
        </div>
    );
};

export default ExecutivesView;