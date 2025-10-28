
import React, { useState } from 'react';
import { Executive, Organization, Department } from '../types';
import { api } from '../services/api';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface ExecutivesViewProps {
  executives: Executive[];
  organizations: Organization[];
  departments: Department[];
  refreshData: () => Promise<void>;
}

const ExecutivesView: React.FC<ExecutivesViewProps> = ({ executives, organizations, departments, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExec, setEditingExec] = useState<Executive | null>(null);
  const [execToDelete, setExecToDelete] = useState<Executive | null>(null);
  
  // A simplified form data for create/edit
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    workEmail: '',
    organizationId: '',
    departmentId: ''
  });

  const handleOpenModal = (exec: Executive | null) => {
    setEditingExec(exec);
    if (exec) {
      setFormData({
        fullName: exec.fullName,
        jobTitle: exec.jobTitle || '',
        workEmail: exec.workEmail || '',
        organizationId: exec.organizationId || '',
        departmentId: exec.departmentId || ''
      });
    } else {
      setFormData({
        fullName: '',
        jobTitle: '',
        workEmail: '',
        organizationId: organizations[0]?.id || '',
        departmentId: departments[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        ...formData,
        organizationId: formData.organizationId || null,
        departmentId: formData.departmentId || null,
    };

    try {
      if (editingExec) {
        await api.put(`/executives/${editingExec.id}`, payload);
      } else {
        await api.post('/executives', payload);
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar executivo:", error);
      alert("Não foi possível salvar o executivo.");
    }
  };

  const handleDelete = async () => {
    if (!execToDelete) return;
    try {
      await api.delete(`/executives/${execToDelete.id}`);
      await refreshData();
      setExecToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar executivo:", error);
      alert("Não foi possível deletar o executivo.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Executivos</h2>
            <p className="text-slate-500 mt-1">Gerencie os executivos da sua organização.</p>
        </div>
        <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition">
            <PlusIcon /> Adicionar Executivo
        </button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Lista de Executivos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm text-slate-500">
                <th className="p-3">Nome Completo</th>
                <th className="p-3">Cargo</th>
                <th className="p-3">Organização</th>
                <th className="p-3">E-mail de Trabalho</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {executives.map(exec => {
                const org = organizations.find(o => o.id === exec.organizationId);
                return (
                  <tr key={exec.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                    <td className="p-3 font-semibold text-slate-800">{exec.fullName}</td>
                    <td className="p-3 text-slate-600">{exec.jobTitle || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{org?.name || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{exec.workEmail || 'N/A'}</td>
                    <td className="p-3">
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(exec)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                            <button onClick={() => setExecToDelete(exec)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal title={editingExec ? 'Editar Executivo' : 'Novo Executivo'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="mt-1 block w-full input" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Cargo</label>
                    <input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="mt-1 block w-full input" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">E-mail de Trabalho</label>
                    <input type="email" value={formData.workEmail} onChange={e => setFormData({...formData, workEmail: e.target.value})} className="mt-1 block w-full input" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Organização</label>
                    <select value={formData.organizationId} onChange={e => setFormData({...formData, organizationId: e.target.value})} className="mt-1 block w-full input">
                        <option value="">Nenhuma</option>
                        {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Departamento</label>
                    <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="mt-1 block w-full input">
                        <option value="">Nenhum</option>
                        {departments.filter(d => d.organizationId === formData.organizationId).map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
                </div>
            </form>
            <style>{`.input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }`}</style>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!execToDelete} onClose={() => setExecToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o executivo "${execToDelete?.fullName}"?`} />
    </div>
  );
};

export default ExecutivesView;
