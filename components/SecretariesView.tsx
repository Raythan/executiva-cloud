
import React, { useState } from 'react';
import { Secretary, Executive } from '../types';
import { api } from '../services/api';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface SecretariesViewProps {
  secretaries: Secretary[];
  executives: Executive[];
  refreshData: () => Promise<void>;
}

const SecretariesView: React.FC<SecretariesViewProps> = ({ secretaries, executives, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSec, setEditingSec] = useState<Secretary | null>(null);
    const [secToDelete, setSecToDelete] = useState<Secretary | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        executiveIds: [] as string[]
    });

    const handleOpenModal = (sec: Secretary | null) => {
        setEditingSec(sec);
        if (sec) {
            setFormData({
                fullName: sec.fullName,
                email: sec.email || '',
                executiveIds: sec.executiveIds
            });
        } else {
            setFormData({ fullName: '', email: '', executiveIds: [] });
        }
        setIsModalOpen(true);
    };

    const handleExecIdChange = (execId: string) => {
        setFormData(prev => ({
            ...prev,
            executiveIds: prev.executiveIds.includes(execId)
                ? prev.executiveIds.filter(id => id !== execId)
                : [...prev.executiveIds, execId]
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSec) {
                await api.put(`/secretaries/${editingSec.id}`, formData);
            } else {
                await api.post('/secretaries', formData);
            }
            await refreshData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao salvar secretária:", error);
            alert("Não foi possível salvar a secretária.");
        }
    };

    const handleDelete = async () => {
        if (!secToDelete) return;
        try {
            await api.delete(`/secretaries/${secToDelete.id}`);
            await refreshData();
            setSecToDelete(null);
        } catch (error) {
            console.error("Erro ao deletar secretária:", error);
            alert("Não foi possível deletar a secretária.");
        }
    };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Secretárias</h2>
            <p className="text-slate-500 mt-1">Gerencie as secretárias e suas associações com executivos.</p>
        </div>
         <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition">
            <PlusIcon /> Adicionar Secretária
        </button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Lista de Secretárias</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm text-slate-500">
                <th className="p-3">Nome Completo</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Executivos Associados</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {secretaries.map(sec => {
                const associatedExecutives = executives
                  .filter(exec => sec.executiveIds.includes(exec.id))
                  .map(exec => exec.fullName)
                  .join(', ');

                return (
                  <tr key={sec.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                    <td className="p-3 font-semibold text-slate-800">{sec.fullName}</td>
                    <td className="p-3 text-slate-600">{sec.email || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{associatedExecutives || 'Nenhum'}</td>
                    <td className="p-3">
                         <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(sec)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                            <button onClick={() => setSecToDelete(sec)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
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
        <Modal title={editingSec ? 'Editar Secretária' : 'Nova Secretária'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="mt-1 block w-full input" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">E-mail</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full input" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Executivos Associados</label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-md p-3 space-y-2">
                        {executives.map(exec => (
                            <div key={exec.id} className="flex items-center">
                                <input type="checkbox" id={`exec-${exec.id}`} checked={formData.executiveIds.includes(exec.id)} onChange={() => handleExecIdChange(exec.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label htmlFor={`exec-${exec.id}`} className="ml-3 block text-sm text-slate-700">{exec.fullName}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
                </div>
            </form>
            <style>{`.input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }`}</style>
        </Modal>
      )}
       <ConfirmationModal isOpen={!!secToDelete} onClose={() => setSecToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a secretária "${secToDelete?.fullName}"?`} />
    </div>
  );
};

export default SecretariesView;
