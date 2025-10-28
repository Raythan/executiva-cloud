
import React, { useState } from 'react';
import { Document, Executive, DocumentCategory } from '../types';
import { api } from '../services/api';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface DocumentsViewProps {
  documents: Document[];
  executives: Executive[];
  selectedExecutive: Executive | undefined;
  documentCategories: DocumentCategory[];
  refreshData: () => Promise<void>;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ documents, executives, selectedExecutive, documentCategories, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  
  const [formData, setFormData] = useState({
      name: '',
      imageUrl: '', // Base64
      categoryId: '',
      executiveId: ''
  });

  const filteredDocuments = selectedExecutive
    ? documents.filter(doc => doc.executiveId === selectedExecutive.id)
    : documents;
    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (doc: Document | null) => {
    setEditingDoc(doc);
    if (doc) {
        setFormData({
            name: doc.name,
            imageUrl: doc.imageUrl,
            categoryId: doc.categoryId || '',
            executiveId: doc.executiveId
        });
    } else {
        setFormData({
            name: '',
            imageUrl: '',
            categoryId: documentCategories[0]?.id || '',
            executiveId: selectedExecutive?.id || executives[0]?.id || ''
        });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.executiveId || !formData.imageUrl) {
        alert("Executivo e imagem do documento são obrigatórios.");
        return;
    }
     const payload = {
        ...formData,
        categoryId: formData.categoryId || null,
    };
    try {
        if (editingDoc) {
            await api.put(`/documents/${editingDoc.id}`, payload);
        } else {
            await api.post('/documents/', payload);
        }
        await refreshData();
        setIsModalOpen(false);
    } catch (error) {
        console.error("Erro ao salvar documento:", error);
        alert("Não foi possível salvar o documento.");
    }
  };

  const handleDelete = async () => {
      if (!docToDelete) return;
      try {
          await api.delete(`/documents/${docToDelete.id}`);
          await refreshData();
          setDocToDelete(null);
      } catch (error) {
          console.error("Erro ao deletar documento:", error);
          alert("Não foi possível deletar o documento.");
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Documentos</h2>
            <p className="text-slate-500 mt-1">
            {selectedExecutive 
                ? `Visualizando documentos de ${selectedExecutive.fullName}.` 
                : 'Visualizando documentos de todos os executivos.'}
            </p>
        </div>
         <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition">
            <PlusIcon /> Adicionar Documento
        </button>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Lista de Documentos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDocuments.map(doc => {
            const category = documentCategories.find(c => c.id === doc.categoryId);
            return (
              <div key={doc.id} className="border rounded-lg overflow-hidden shadow-sm group relative">
                <img src={doc.imageUrl} alt={doc.name} className="h-40 w-full object-cover"/>
                <div className="p-4">
                  <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                  <p className="text-sm text-slate-500">{category?.name || 'Sem categoria'}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(doc)} className="p-2 bg-white/80 rounded-full text-slate-600 hover:bg-white hover:text-indigo-600 shadow-md"><EditIcon /></button>
                    <button onClick={() => setDocToDelete(doc)} className="p-2 bg-white/80 rounded-full text-slate-600 hover:bg-white hover:text-red-600 shadow-md"><DeleteIcon /></button>
                </div>
              </div>
            );
          })}
        </div>
        {filteredDocuments.length === 0 && (
          <p className="text-center p-6 text-slate-500">Nenhum documento encontrado para os filtros selecionados.</p>
        )}
      </div>

       {isModalOpen && (
        <Modal title={editingDoc ? 'Editar Documento' : 'Novo Documento'} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Executivo</label>
                    <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="mt-1 block w-full input" required>
                        {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Nome do Documento</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full input" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Categoria</label>
                    <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="mt-1 block w-full input">
                        <option value="">Nenhuma</option>
                        {documentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Arquivo de Imagem</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required={!editingDoc} />
                    {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-4 max-h-40 rounded-md" />}
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Salvar</button>
                </div>
            </form>
            <style>{`.input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }`}</style>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!docToDelete} onClose={() => setDocToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o documento "${docToDelete?.name}"?`} />

    </div>
  );
};

export default DocumentsView;
