import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Secretary, Executive, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface SecretariesViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
}

const SecretariesView: React.FC<SecretariesViewProps> = ({ allData, setAllData }) => {
    const { secretaries, executives } = allData;
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSec) {
            const updatedSecs = secretaries.map(s => 
                s.id === editingSec.id ? { ...s, ...formData } : s
            );
            setAllData({ ...allData, secretaries: updatedSecs });
        } else {
            const newSec: Secretary = { id: uuidv4(), ...formData };
            setAllData({ ...allData, secretaries: [...secretaries, newSec] });
        }
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (!secToDelete) return;
        const updatedSecs = secretaries.filter(s => s.id !== secToDelete.id);
        setAllData({ ...allData, secretaries: updatedSecs });
        setSecToDelete(null);
    };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Secretárias</h2>
            <p className="text-slate-500 mt-1">Gerencie as secretárias e suas associações com executivos.</p>
        </div>
         <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
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
                    <label className="form-label">Nome Completo</label>
                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="form-input" required />
                </div>
                 <div>
                    <label className="form-label">E-mail</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="form-input" />
                </div>
                <div>
                    <label className="form-label mb-2">Executivos Associados</label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-md p-3 space-y-2">
                        {executives.map(exec => (
                            <div key={exec.id} className="flex items-center">
                                <input type="checkbox" id={`exec-${exec.id}`} checked={formData.executiveIds.includes(exec.id)} onChange={() => handleExecIdChange(exec.id)} className="form-checkbox" />
                                <label htmlFor={`exec-${exec.id}`} className="ml-3 block text-sm text-slate-700">{exec.fullName}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}
       <ConfirmationModal isOpen={!!secToDelete} onClose={() => setSecToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a secretária "${secToDelete?.fullName}"?`} />
    </div>
  );
};

export default SecretariesView;