import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Executive, Task, Priority, Status, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface TasksViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
  selectedExecutive: Executive | undefined;
}

const TasksView: React.FC<TasksViewProps> = ({ allData, setAllData, selectedExecutive }) => {
  const { tasks, executives } = allData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: Priority.Medium,
      status: Status.Todo,
      executiveId: ''
  });

  const filteredTasks = selectedExecutive
    ? tasks.filter(task => task.executiveId === selectedExecutive.id)
    : tasks;
  
  const handleOpenModal = (task: Task | null) => {
    setEditingTask(task);
    if (task) {
        setFormData({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            executiveId: task.executiveId
        });
    } else {
        setFormData({
            title: '',
            description: '',
            dueDate: new Date().toISOString().split('T')[0],
            priority: Priority.Medium,
            status: Status.Todo,
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
    
    if (editingTask) {
        const updatedTasks = tasks.map(t => 
            t.id === editingTask.id ? { ...t, ...formData } : t
        );
        setAllData({ ...allData, tasks: updatedTasks });
    } else {
        const newTask: Task = {
            id: uuidv4(),
            ...formData,
        };
        setAllData({ ...allData, tasks: [...tasks, newTask]});
    }
    setIsModalOpen(false);
  };
  
  const handleDelete = () => {
      if (!taskToDelete) return;
      const updatedTasks = tasks.filter(t => t.id !== taskToDelete.id);
      setAllData({ ...allData, tasks: updatedTasks });
      setTaskToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Tarefas</h2>
            <p className="text-slate-500 mt-1">
            {selectedExecutive 
                ? `Visualizando tarefas de ${selectedExecutive.fullName}.` 
                : 'Visualizando tarefas de todos os executivos.'}
            </p>
        </div>
         <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
            <PlusIcon /> Adicionar Tarefa
        </button>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Lista de Tarefas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-sm text-slate-500">
                <th className="p-3">Título</th>
                <th className="p-3">Executivo</th>
                <th className="p-3">Data de Vencimento</th>
                <th className="p-3">Prioridade</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const executive = executives.find(e => e.id === task.executiveId);
                return (
                  <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                    <td className="p-3 font-semibold text-slate-800">{task.title}</td>
                    <td className="p-3 text-slate-600">{executive?.fullName || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td className="p-3 text-slate-600">{task.priority}</td>
                    <td className="p-3 text-slate-600">{task.status}</td>
                    <td className="p-3">
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenModal(task)} className="p-1 text-slate-500 hover:text-indigo-600"><EditIcon /></button>
                            <button onClick={() => setTaskToDelete(task)} className="p-1 text-slate-500 hover:text-red-600"><DeleteIcon /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <p className="text-center p-6 text-slate-500">Nenhuma tarefa encontrada para os filtros selecionados.</p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                 <div>
                    <label className="form-label">Executivo</label>
                    <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="form-select" required>
                        {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Título</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="form-input" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label">Data de Vencimento</label>
                        <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="form-input" required />
                    </div>
                     <div>
                        <label className="form-label">Prioridade</label>
                        <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})} className="form-select">
                            {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="form-label">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Status})} className="form-select">
                        {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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

      <ConfirmationModal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.title}"?`} />

    </div>
  );
};

export default TasksView;