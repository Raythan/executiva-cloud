
import React, { useState } from 'react';
import { Event, Executive, EventType } from '../types';
import { api } from '../services/api';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface AgendaViewProps {
  events: Event[];
  executives: Executive[];
  eventTypes: EventType[];
  selectedExecutive: Executive | undefined;
  refreshData: () => Promise<void>;
}

const AgendaView: React.FC<AgendaViewProps> = ({ events, executives, eventTypes, selectedExecutive, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      eventTypeId: '',
      executiveId: '',
  });

  const filteredEvents = (selectedExecutive 
    ? events.filter(event => event.executiveId === selectedExecutive.id) 
    : events
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const toDatetimeLocal = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const handleOpenModal = (event: Event | null) => {
    setEditingEvent(event);
    if (event) {
        setFormData({
            title: event.title,
            description: event.description || '',
            startTime: toDatetimeLocal(event.startTime),
            endTime: toDatetimeLocal(event.endTime),
            location: event.location || '',
            eventTypeId: event.eventTypeId || '',
            executiveId: event.executiveId,
        });
    } else {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const startTime = now.toISOString().slice(0, 16);
        now.setHours(now.getHours() + 1);
        const endTime = now.toISOString().slice(0, 16);
        
        setFormData({
            title: '',
            description: '',
            startTime: startTime,
            endTime: endTime,
            location: '',
            eventTypeId: eventTypes[0]?.id || '',
            executiveId: selectedExecutive?.id || executives[0]?.id || ''
        });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.executiveId) {
        alert("Por favor, selecione um executivo.");
        return;
    }
    const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        eventTypeId: formData.eventTypeId || null
    };

    try {
        if (editingEvent) {
            await api.put(`/events/${editingEvent.id}`, payload);
        } else {
            await api.post('/events/', payload);
        }
        await refreshData();
        setIsModalOpen(false);
    } catch (error) {
        console.error("Erro ao salvar evento:", error);
        alert("Não foi possível salvar o evento.");
    }
  };
  
  const handleDelete = async () => {
      if (!eventToDelete) return;
      try {
          await api.delete(`/events/${eventToDelete.id}`);
          await refreshData();
          setEventToDelete(null);
      } catch (error) {
          console.error("Erro ao deletar evento:", error);
          alert("Não foi possível deletar o evento.");
      }
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Agenda</h2>
            <p className="text-slate-500 mt-1">
            {selectedExecutive 
                ? `Visualizando agenda de ${selectedExecutive.fullName}.`
                : 'Visualizando agenda de todos os executivos.'}
            </p>
        </div>
         <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition">
            <PlusIcon /> Adicionar Evento
        </button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Próximos Eventos</h3>
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => {
              const executive = executives.find(e => e.id === event.executiveId);
              return (
                <div key={event.id} className="p-4 rounded-lg bg-slate-50 border-l-4 border-indigo-500 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-slate-800">{event.title}</p>
                        <p className="text-sm text-slate-600">
                            {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
                        </p>
                        <p className="text-sm text-slate-500">Local: {event.location || 'Não especificado'}</p>
                        {!selectedExecutive && (
                            <p className="text-sm text-slate-500 mt-1">
                            Executivo: {executive?.fullName || 'N/A'}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(event)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                        <button onClick={() => setEventToDelete(event)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                    </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500 text-center py-4">Nenhum evento agendado.</p>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <Modal title={editingEvent ? 'Editar Evento' : 'Novo Evento'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Executivo</label>
                        <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="mt-1 block w-full input" required>
                            <option value="" disabled>Selecione...</option>
                            {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Tipo de Evento</label>
                        <select value={formData.eventTypeId} onChange={e => setFormData({...formData, eventTypeId: e.target.value})} className="mt-1 block w-full input">
                            <option value="">Nenhum</option>
                            {eventTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full input" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Início</label>
                        <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="mt-1 block w-full input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fim</label>
                        <input type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="mt-1 block w-full input" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Local</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full input" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Descrição</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full input" rows={3}></textarea>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
                </div>
            </form>
            <style>{`.input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }`}</style>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o evento "${eventToDelete?.title}"?`} />

    </div>
  );
};

export default AgendaView;
