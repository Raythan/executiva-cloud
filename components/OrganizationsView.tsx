import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Organization, Department, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface OrganizationsViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
}

const OrganizationsView: React.FC<OrganizationsViewProps> = ({ allData, setAllData }) => {
    const { organizations, departments } = allData;
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
    
    const handleSaveOrg = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOrg) {
            const updatedOrgs = organizations.map(o => 
                o.id === editingOrg.id ? { ...o, name: orgFormData.name } : o
            );
            setAllData({ ...allData, organizations: updatedOrgs });
        } else {
            const newOrg: Organization = { id: uuidv4(), name: orgFormData.name };
            setAllData({ ...allData, organizations: [...organizations, newOrg] });
        }
        setOrgModalOpen(false);
    };
    
    const handleDeleteOrg = () => {
        if (!orgToDelete) return;
        const updatedOrgs = organizations.filter(o => o.id !== orgToDelete.id);
        // Also delete associated departments
        const updatedDepts = departments.filter(d => d.organizationId !== orgToDelete.id);
        setAllData({ ...allData, organizations: updatedOrgs, departments: updatedDepts });
        setOrgToDelete(null);
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

    const handleSaveDept = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDept) {
            const updatedDepts = departments.map(d => 
                d.id === editingDept.id ? { ...d, ...deptFormData } : d
            );
            setAllData({ ...allData, departments: updatedDepts });
        } else {
            const newDept: Department = { id: uuidv4(), ...deptFormData };
            setAllData({ ...allData, departments: [...departments, newDept] });
        }
        setDeptModalOpen(false);
    };

    const handleDeleteDept = () => {
        if (!deptToDelete) return;
        const updatedDepts = departments.filter(d => d.id !== deptToDelete.id);
        setAllData({ ...allData, departments: updatedDepts });
        setDeptToDelete(null);
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
            <button onClick={() => handleOpenOrgModal(null)} className="btn btn-primary btn-sm">
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
             <button onClick={() => handleOpenDeptModal(null)} className="btn btn-primary btn-sm">
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
                    <label htmlFor="orgName" className="form-label">Nome da Organização</label>
                    <input type="text" id="orgName" value={orgFormData.name} onChange={e => setOrgFormData({...orgFormData, name: e.target.value})} className="form-input" required />
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setOrgModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      {/* Department Modal */}
       {isDeptModalOpen && (
        <Modal title={editingDept ? "Editar Departamento" : "Novo Departamento"} onClose={() => setDeptModalOpen(false)}>
            <form onSubmit={handleSaveDept} className="space-y-4">
                <div>
                    <label htmlFor="deptName" className="form-label">Nome do Departamento</label>
                    <input type="text" id="deptName" value={deptFormData.name} onChange={e => setDeptFormData({...deptFormData, name: e.target.value})} className="form-input" required />
                </div>
                 <div>
                    <label htmlFor="deptOrg" className="form-label">Organização</label>
                    <select id="deptOrg" value={deptFormData.organizationId} onChange={e => setDeptFormData({...deptFormData, organizationId: e.target.value})} className="form-select" required>
                        {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setDeptModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal isOpen={!!orgToDelete} onClose={() => setOrgToDelete(null)} onConfirm={handleDeleteOrg} title="Confirmar Exclusão" message={`Tem certeza de que deseja excluir a organização "${orgToDelete?.name}"? Todos os departamentos associados também serão excluídos.`} />
      <ConfirmationModal isOpen={!!deptToDelete} onClose={() => setDeptToDelete(null)} onConfirm={handleDeleteDept} title="Confirmar Exclusão" message={`Tem certeza de que deseja excluir o departamento "${deptToDelete?.name}"?`} />
    </div>
  );
};

export default OrganizationsView;