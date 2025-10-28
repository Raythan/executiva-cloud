
import React, { useState } from 'react';
import { Organization, Department } from '../types';
import { api } from '../services/api';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface OrganizationsViewProps {
  organizations: Organization[];
  departments: Department[];
  refreshData: () => Promise<void>;
}

const OrganizationsView: React.FC<OrganizationsViewProps> = ({ organizations, departments, refreshData }) => {
    // Organization State
    const [isOrgModalOpen, setOrgModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);
    const [orgFormData, setOrgFormData] = useState({ name: '' });

    // Department State
    const [isDeptModalOpen, setDeptModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
    const [deptFormData, setDeptFormData] = useState({ name: '', organizationId: '' });
    
    // Organization Handlers
    const handleOpenOrgModal = (org: Organization | null) => {
        setEditingOrg(org);
        setOrgFormData({ name: org ? org.name : '' });
        setOrgModalOpen(true);
    };
    
    const handleSaveOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingOrg) {
                await api.put(`/organizations/${editingOrg.id}`, orgFormData);
            } else {
                await api.post('/organizations', orgFormData);
            }
            await refreshData();
            setOrgModalOpen(false);
        } catch (error) {
            console.error("Erro ao salvar organização:", error);
            alert("Não foi possível salvar a organização.");
        }
    };
    
    const handleDeleteOrg = async () => {
        if (!orgToDelete) return;
        try {
            await api.delete(`/organizations/${orgToDelete.id}`);
            await refreshData();
            setOrgToDelete(null);
        } catch (error) {
            console.error("Erro ao deletar organização:", error);
            alert("Não foi possível deletar a organização.");
        }
    };

    // Department Handlers
    const handleOpenDeptModal = (dept: Department | null) => {
        setEditingDept(dept);
        setDeptFormData({ 
            name: dept ? dept.name : '',
            organizationId: dept ? dept.organizationId : (organizations[0]?.id || '')
        });
        setDeptModalOpen(true);
    };

    const handleSaveDept = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await api.put(`/departments/${editingDept.id}`, deptFormData);
            } else {
                await api.post('/departments', deptFormData);
            }
            await refreshData();
            setDeptModalOpen(false);
        } catch (error) {
            console.error("Erro ao salvar departamento:", error);
            alert("Não foi possível salvar o departamento.");
        }
    };

    const handleDeleteDept = async () => {
        if (!deptToDelete) return;
        try {
            await api.delete(`/departments/${deptToDelete.id}`);
            await refreshData();
            setDeptToDelete(null);
        } catch (error) {
            console.error("Erro ao deletar departamento:", error);
            alert("Não foi possível deletar o departamento.");
        }
    };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Organizações e Departamentos</h2>
        <p className="text-slate-500 mt-1">Gerencie a estrutura da sua empresa.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organizations Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-700">Organizações</h3>
            <button onClick={() => handleOpenOrgModal(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition text-sm">
                <PlusIcon /> Adicionar
            </button>
          </div>
          <ul className="space-y-2">
            {organizations.map(org => (
              <li key={org.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                <span>{org.name}</span>
                <div className="space-x-2">
                    <button onClick={() => handleOpenOrgModal(org)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                    <button onClick={() => setOrgToDelete(org)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Departments Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-700">Departamentos</h3>
             <button onClick={() => handleOpenDeptModal(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition text-sm">
                <PlusIcon /> Adicionar
            </button>
          </div>
          <ul className="space-y-2">
            {departments.map(dep => {
              const org = organizations.find(o => o.id === dep.organizationId);
              return (
                <li key={dep.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{dep.name}</p>
                    <p className="text-sm text-slate-500">{org?.name || 'Organização não encontrada'}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleOpenDeptModal(dep)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                    <button onClick={() => setDeptToDelete(dep)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      {/* Organization Modal */}
      {isOrgModalOpen && (
        <Modal title={editingOrg ? "Editar Organização" : "Nova Organização"} onClose={() => setOrgModalOpen(false)}>
            <form onSubmit={handleSaveOrg} className="space-y-4">
                <div>
                    <label htmlFor="orgName" className="block text-sm font-medium text-slate-700">Nome da Organização</label>
                    <input type="text" id="orgName" value={orgFormData.name} onChange={e => setOrgFormData({...orgFormData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setOrgModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      {/* Department Modal */}
       {isDeptModalOpen && (
        <Modal title={editingDept ? "Editar Departamento" : "Novo Departamento"} onClose={() => setDeptModalOpen(false)}>
            <form onSubmit={handleSaveDept} className="space-y-4">
                <div>
                    <label htmlFor="deptName" className="block text-sm font-medium text-slate-700">Nome do Departamento</label>
                    <input type="text" id="deptName" value={deptFormData.name} onChange={e => setDeptFormData({...deptFormData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                </div>
                 <div>
                    <label htmlFor="deptOrg" className="block text-sm font-medium text-slate-700">Organização</label>
                    <select id="deptOrg" value={deptFormData.organizationId} onChange={e => setDeptFormData({...deptFormData, organizationId: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                        {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setDeptModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal isOpen={!!orgToDelete} onClose={() => setOrgToDelete(null)} onConfirm={handleDeleteOrg} title="Confirmar Exclusão" message={`Tem certeza de que deseja excluir a organização "${orgToDelete?.name}"? Esta ação não pode ser desfeita.`} />
      <ConfirmationModal isOpen={!!deptToDelete} onClose={() => setDeptToDelete(null)} onConfirm={handleDeleteDept} title="Confirmar Exclusão" message={`Tem certeza de que deseja excluir o departamento "${deptToDelete?.name}"?`} />
    </div>
  );
};

export default OrganizationsView;
