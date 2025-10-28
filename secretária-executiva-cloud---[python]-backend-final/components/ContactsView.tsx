import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Contact, Executive, ContactType, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface ContactsViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
  selectedExecutive: Executive | undefined;
}

const ContactsView: React.FC<ContactsViewProps> = ({ allData, setAllData, selectedExecutive }) => {
  const { contacts, executives, contactTypes } = allData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      role: '',
      notes: '',
      contactTypeId: '',
      executiveId: '',
  });

  const filteredContacts = selectedExecutive
    ? contacts.filter(contact => contact.executiveId === selectedExecutive.id)
    : contacts;
    
  const handleOpenModal = (contact: Contact | null) => {
    setEditingContact(contact);
    if (contact) {
        setFormData({
            fullName: contact.fullName,
            email: contact.email || '',
            phone: contact.phone || '',
            company: contact.company || '',
            role: contact.role || '',
            notes: contact.notes || '',
            contactTypeId: contact.contactTypeId || '',
            executiveId: contact.executiveId,
        });
    } else {
        setFormData({
            fullName: '', email: '', phone: '', company: '', role: '', notes: '',
            contactTypeId: contactTypes[0]?.id || '',
            executiveId: selectedExecutive?.id || executives[0]?.id || ''
        });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.executiveId) {
        alert("Por favor, selecione um executivo.");
        return;
    }
     const payload = {
        ...formData,
        contactTypeId: formData.contactTypeId || undefined,
    };
    
    if (editingContact) {
      const updatedContacts = contacts.map(c => 
        c.id === editingContact.id ? { ...c, ...payload } : c
      );
      setAllData({ ...allData, contacts: updatedContacts });
    } else {
      const newContact: Contact = {
        id: uuidv4(),
        ...payload,
      };
      setAllData({ ...allData, contacts: [...contacts, newContact]});
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = () => {
      if (!contactToDelete) return;
      const updatedContacts = contacts.filter(c => c.id !== contactToDelete.id);
      setAllData({ ...allData, contacts: updatedContacts });
      setContactToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Contatos</h2>
            <p className="text-slate-500 mt-1">
            {selectedExecutive 
                ? `Visualizando contatos de ${selectedExecutive.fullName}.` 
                : 'Visualizando contatos de todos os executivos.'}
            </p>
        </div>
        <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
            <PlusIcon /> Adicionar Contato
        </button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Lista de Contatos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm text-slate-500">
                <th className="p-3">Nome Completo</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">Executivo</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => {
                const executive = executives.find(e => e.id === contact.executiveId);
                return (
                  <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                    <td className="p-3 font-semibold text-slate-800">{contact.fullName}</td>
                    <td className="p-3 text-slate-600">{contact.company || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{contact.email || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{contact.phone || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{executive?.fullName || 'N/A'}</td>
                    <td className="p-3">
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(contact)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                            <button onClick={() => setContactToDelete(contact)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <p className="text-center p-6 text-slate-500">Nenhum contato encontrado para os filtros selecionados.</p>
          )}
        </div>
      </div>
       {isModalOpen && (
        <Modal title={editingContact ? 'Editar Contato' : 'Novo Contato'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                 <div>
                    <label className="form-label">Executivo</label>
                    <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="form-select" required>
                        <option value="" disabled>Selecione...</option>
                        {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Nome Completo</label>
                        <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="form-input" required />
                    </div>
                     <div>
                        <label className="form-label">Tipo de Contato</label>
                        <select value={formData.contactTypeId} onChange={e => setFormData({...formData, contactTypeId: e.target.value})} className="form-select">
                            <option value="">Nenhum</option>
                            {contactTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">E-mail</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Telefone</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="form-input" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Empresa</label>
                        <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Cargo</label>
                        <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="form-input" />
                    </div>
                </div>
                 <div>
                    <label className="form-label">Notas</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="form-textarea" rows={3}></textarea>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!contactToDelete} onClose={() => setContactToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o contato "${contactToDelete?.fullName}"?`} />

    </div>
  );
};

export default ContactsView;