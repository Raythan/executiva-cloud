import React, { useState } from 'react';
import { EventType, ContactType } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { EditIcon, DeleteIcon, PlusIcon } from './Icons';

// --- Event Type Management ---
const EventTypeForm: React.FC<{ eventType: Partial<EventType>, onSave: (et: EventType) => void, onCancel: () => void }> = ({ eventType, onSave, onCancel }) => {
    const [name, setName] = useState(eventType.name || '');
    const [color, setColor] = useState(eventType.color || '#3b82f6');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSave({ id: eventType.id || new Date().toISOString(), name, color });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="et-name" className="block text-sm font-medium text-slate-700">Nome do Tipo</label>
                <input type="text" id="et-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="et-color" className="block text-sm font-medium text-slate-700">Cor</label>
                <div className="flex items-center gap-2">
                    <input type="color" id="et-color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10 w-10 block bg-white border border-slate-300 rounded-md cursor-pointer" />
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
            </div>
        </form>
    );
};

// --- Contact Type Management ---
const ContactTypeForm: React.FC<{ contactType: Partial<ContactType>, onSave: (ct: ContactType) => void, onCancel: () => void }> = ({ contactType, onSave, onCancel }) => {
    const [name, setName] = useState(contactType.name || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSave({ id: contactType.id || new Date().toISOString(), name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="ct-name" className="block text-sm font-medium text-slate-700">Nome do Tipo</label>
                <input type="text" id="ct-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
            </div>
        </form>
    );
};


// --- Main Settings View ---
interface SettingsViewProps {
  eventTypes: EventType[];
  setEventTypes: React.Dispatch<React.SetStateAction<EventType[]>>;
  contactTypes: ContactType[];
  setContactTypes: React.Dispatch<React.SetStateAction<ContactType[]>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ eventTypes, setEventTypes, contactTypes, setContactTypes }) => {
    const [isEventTypeModalOpen, setEventTypeModalOpen] = useState(false);
    const [editingEventType, setEditingEventType] = useState<Partial<EventType> | null>(null);
    const [eventTypeToDelete, setEventTypeToDelete] = useState<EventType | null>(null);

    const [isContactTypeModalOpen, setContactTypeModalOpen] = useState(false);
    const [editingContactType, setEditingContactType] = useState<Partial<ContactType> | null>(null);
    const [contactTypeToDelete, setContactTypeToDelete] = useState<ContactType | null>(null);

    // Event Type Handlers
    const handleSaveEventType = (eventType: EventType) => {
        setEventTypes(prev => editingEventType?.id ? prev.map(et => et.id === eventType.id ? eventType : et) : [...prev, eventType]);
        setEventTypeModalOpen(false);
        setEditingEventType(null);
    };
    const confirmDeleteEventType = () => {
        if (!eventTypeToDelete) return;
        setEventTypes(prev => prev.filter(et => et.id !== eventTypeToDelete.id));
        setEventTypeToDelete(null);
    };

    // Contact Type Handlers
    const handleSaveContactType = (contactType: ContactType) => {
        setContactTypes(prev => editingContactType?.id ? prev.map(ct => ct.id === contactType.id ? contactType : ct) : [...prev, contactType]);
        setContactTypeModalOpen(false);
        setEditingContactType(null);
    };
    const confirmDeleteContactType = () => {
        if (!contactTypeToDelete) return;
        setContactTypes(prev => prev.filter(ct => ct.id !== contactTypeToDelete.id));
        setContactTypeToDelete(null);
    };


    return (
        <div className="space-y-8 animate-fade-in">
             <header>
                <h2 className="text-3xl font-bold text-slate-800">Configurações</h2>
                <p className="text-slate-500 mt-1">Personalize as categorias e tipos para organizar seu trabalho.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Types Panel */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-700">Tipos de Evento</h3>
                        <button onClick={() => { setEditingEventType({}); setEventTypeModalOpen(true); }} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition text-sm">
                            <PlusIcon /> Adicionar
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {eventTypes.map(et => (
                            <li key={et.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: et.color }}></span>
                                    <span className="font-medium text-slate-800">{et.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setEditingEventType(et); setEventTypeModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><EditIcon /></button>
                                    <button onClick={() => setEventTypeToDelete(et)} className="p-2 text-slate-400 hover:text-red-600"><DeleteIcon /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Types Panel */}
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-700">Tipos de Contato</h3>
                        <button onClick={() => { setEditingContactType({}); setContactTypeModalOpen(true); }} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition text-sm">
                            <PlusIcon /> Adicionar
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {contactTypes.map(ct => (
                           <li key={ct.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-800">{ct.name}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setEditingContactType(ct); setContactTypeModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><EditIcon /></button>
                                    <button onClick={() => setContactTypeToDelete(ct)} className="p-2 text-slate-400 hover:text-red-600"><DeleteIcon /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isEventTypeModalOpen && (
                <Modal title={editingEventType?.id ? 'Editar Tipo de Evento' : 'Novo Tipo de Evento'} onClose={() => setEventTypeModalOpen(false)}>
                    <EventTypeForm eventType={editingEventType || {}} onSave={handleSaveEventType} onCancel={() => { setEventTypeModalOpen(false); setEditingEventType(null); }} />
                </Modal>
            )}

            {isContactTypeModalOpen && (
                <Modal title={editingContactType?.id ? 'Editar Tipo de Contato' : 'Novo Tipo de Contato'} onClose={() => setContactTypeModalOpen(false)}>
                    <ContactTypeForm contactType={editingContactType || {}} onSave={handleSaveContactType} onCancel={() => { setContactTypeModalOpen(false); setEditingContactType(null); }} />
                </Modal>
            )}

            {eventTypeToDelete && (
                <ConfirmationModal
                    isOpen={!!eventTypeToDelete}
                    onClose={() => setEventTypeToDelete(null)}
                    onConfirm={confirmDeleteEventType}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o tipo de evento "${eventTypeToDelete.name}"?`}
                />
            )}

            {contactTypeToDelete && (
                 <ConfirmationModal
                    isOpen={!!contactTypeToDelete}
                    onClose={() => setContactTypeToDelete(null)}
                    onConfirm={confirmDeleteContactType}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o tipo de contato "${contactTypeToDelete.name}"?`}
                />
            )}
        </div>
    );
};

export default SettingsView;