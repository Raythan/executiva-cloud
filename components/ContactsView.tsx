import React, { useState } from 'react';
import { Contact, ContactType } from '../types';
import Modal from './Modal';
import { EditIcon, DeleteIcon, PlusIcon, EmailIcon, PhoneIcon } from './Icons';

interface ContactsViewProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  contactTypes: ContactType[];
  executiveId: string;
}

const ContactForm: React.FC<{ contact: Partial<Contact>, onSave: (contact: Contact) => void, onCancel: () => void, contactTypes: ContactType[] }> = ({ contact, onSave, onCancel, contactTypes }) => {
    const [fullName, setFullName] = useState(contact.fullName || '');
    const [company, setCompany] = useState(contact.company || '');
    const [role, setRole] = useState(contact.role || '');
    const [email, setEmail] = useState(contact.email || '');
    const [phone, setPhone] = useState(contact.phone || '');
    const [notes, setNotes] = useState(contact.notes || '');
    const [contactTypeId, setContactTypeId] = useState(contact.contactTypeId || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !contact.executiveId) return;
        onSave({
            id: contact.id || new Date().toISOString(),
            executiveId: contact.executiveId,
            fullName,
            company,
            role,
            email,
            phone,
            notes,
            contactTypeId,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nome Completo</label>
                    <input type="text" id="name" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="contactType" className="block text-sm font-medium text-slate-700">Tipo de Contato</label>
                  <select id="contactType" value={contactTypeId} onChange={e => setContactTypeId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="">Sem tipo</option>
                      {contactTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                  </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700">Empresa</label>
                    <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700">Cargo</label>
                    <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
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
             <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Anotações</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar Contato</button>
            </div>
        </form>
    );
};

const ContactsView: React.FC<ContactsViewProps> = ({ contacts, setContacts, contactTypes, executiveId }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Partial<Contact> | null>(null);

    const handleAddContact = () => {
        setEditingContact({ executiveId });
        setModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setEditingContact(contact);
        setModalOpen(true);
    };

    const handleDeleteContact = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este contato?')) {
            setContacts(contacts.filter(c => c.id !== id));
        }
    };
    
    const handleSaveContact = (contact: Contact) => {
        if (editingContact && editingContact.id) {
            setContacts(contacts.map(c => c.id === contact.id ? contact : c));
        } else {
            setContacts([...contacts, contact]);
        }
        setModalOpen(false);
        setEditingContact(null);
    };

    const sortedContacts = [...contacts].sort((a, b) => a.fullName.localeCompare(b.fullName));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Lista de Contatos</h2>
                    <p className="text-slate-500 mt-1">Sua rede profissional, sempre à mão.</p>
                </div>
                <button onClick={handleAddContact} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition duration-150">
                    <PlusIcon />
                    Novo Contato
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedContacts.length > 0 ? sortedContacts.map(contact => (
                    <div key={contact.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                                        {contact.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{contact.fullName}</h3>
                                        <p className="text-sm text-slate-500">{contact.company}</p>
                                    </div>
                                </div>
                                {contact.contactTypeId && (
                                    <span className="text-xs bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                                        {contactTypes.find(ct => ct.id === contact.contactTypeId)?.name}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 space-y-2 text-sm">
                                {contact.email && <p className="flex items-center text-slate-600 truncate">
                                    <EmailIcon /> <a href={`mailto:${contact.email}`} className="ml-2 hover:underline">{contact.email}</a>
                                </p>}
                                {contact.phone && <p className="flex items-center text-slate-600">
                                    <PhoneIcon /> <span className="ml-2">{contact.phone}</span>
                                </p>}
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-1 mt-4">
                            <button onClick={() => handleEditContact(contact)} className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-200 transition" aria-label="Editar contato">
                                <EditIcon />
                            </button>
                            <button onClick={() => handleDeleteContact(contact.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition" aria-label="Excluir contato">
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center p-6 bg-white rounded-xl shadow-md">
                        <p className="text-slate-500">Nenhum contato adicionado para este executivo.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal title={editingContact?.id ? 'Editar Contato' : 'Novo Contato'} onClose={() => setModalOpen(false)}>
                    <ContactForm 
                        contact={editingContact || {}} 
                        onSave={handleSaveContact} 
                        onCancel={() => { setModalOpen(false); setEditingContact(null); }}
                        contactTypes={contactTypes}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ContactsView;
