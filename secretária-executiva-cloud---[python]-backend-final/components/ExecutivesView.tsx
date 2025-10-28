import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Executive, Organization, Department, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface ExecutivesViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
}

const ExecutivesView: React.FC<ExecutivesViewProps> = ({ allData, setAllData }) => {
  const { executives, organizations, departments } = allData;
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        ...formData,
        organizationId: formData.organizationId || undefined,
        departmentId: formData.departmentId || undefined,
    };

    if (editingExec) {
      const updatedExecs = executives.map(e => 
        e.id === editingExec.id ? { ...e, ...payload } : e
      );
      setAllData({ ...allData, executives: updatedExecs });
    } else {
      const newExec: Executive = {
        id: uuidv4(),
        ...payload
      };
      setAllData({ ...allData, executives: [...executives, newExec]});
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!execToDelete) return;
    const updatedExecs = executives.filter(e => e.id !== execToDelete.id);
    setAllData({ ...allData, executives: updatedExecs });
    setExecToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Executivos</h2>
            <p className="text-slate-500 mt-1">Gerencie os executivos da sua organização.</p>
        </div>
        <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
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
                    <label className="form-label">Nome Completo</label>
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="form-input" required />
                </div>
                 <div>
                    <label className="form-label">Cargo</label>
                    <input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="form-input" />
                </div>
                <div>
                    <label className="form-label">E-mail de Trabalho</label>
                    <input type="email" value={formData.workEmail} onChange={e => setFormData({...formData, workEmail: e.target.value})} className="form-input" />
                </div>
                 <div>
                    <label className="form-label">Organização</label>
                    <select value={formData.organizationId} onChange={e => setFormData({...formData, organizationId: e.target.value})} className="form-select">
                        <option value="">Nenhuma</option>
                        {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="form-label">Departamento</label>
                    <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="form-select">
                        <option value="">Nenhum</option>
                        {departments.filter(d => d.organizationId === formData.organizationId).map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!execToDelete} onClose={() => setExecToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o executivo "${execToDelete?.fullName}"?`} />
    </div>
  );
};

export default ExecutivesView;