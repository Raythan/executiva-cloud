import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Event, Executive, EventType, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface AgendaViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
  selectedExecutive: Executive | undefined;
}

const AgendaView: React.FC<AgendaViewProps> = ({ allData, setAllData, selectedExecutive }) => {
  const { events, executives, eventTypes } = allData;
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.executiveId) {
        alert("Por favor, selecione um executivo.");
        return;
    }
    const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        eventTypeId: formData.eventTypeId || undefined
    };

    if (editingEvent) {
        const updatedEvents = events.map(ev => 
            ev.id === editingEvent.id ? { ...ev, ...payload } : ev
        );
        setAllData({ ...allData, events: updatedEvents });
    } else {
        const newEvent: Event = {
            id: uuidv4(),
            ...payload,
        };
        setAllData({ ...allData, events: [...events, newEvent]});
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = () => {
      if (!eventToDelete) return;
      const updatedEvents = events.filter(ev => ev.id !== eventToDelete.id);
      setAllData({ ...allData, events: updatedEvents });
      setEventToDelete(null);
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
         <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
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
                        <label className="form-label">Executivo</label>
                        <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="form-select" required>
                            <option value="" disabled>Selecione...</option>
                            {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="form-label">Tipo de Evento</label>
                        <select value={formData.eventTypeId} onChange={e => setFormData({...formData, eventTypeId: e.target.value})} className="form-select">
                            <option value="">Nenhum</option>
                            {eventTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="form-label">Título</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="form-input" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Início</label>
                        <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="form-input" required />
                    </div>
                    <div>
                        <label className="form-label">Fim</label>
                        <input type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="form-input" required />
                    </div>
                </div>
                <div>
                    <label className="form-label">Local</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="form-input" />
                </div>
                 <div>
                    <label className="form-label">Descrição</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-textarea" rows={3}></textarea>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!eventToDelete} onClose={() => setEventToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o evento "${eventToDelete?.title}"?`} />

    </div>
  );
};

export default AgendaView;