import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Document, Executive, DocumentCategory, AllDataBackup } from '../types';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, EditIcon, DeleteIcon } from './Icons';

interface DocumentsViewProps {
  allData: AllDataBackup;
  setAllData: (data: AllDataBackup) => void;
  selectedExecutive: Executive | undefined;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ allData, setAllData, selectedExecutive }) => {
  const { documents, executives, documentCategories } = allData;
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.executiveId || !formData.imageUrl) {
        alert("Executivo e imagem do documento são obrigatórios.");
        return;
    }
     const payload = {
        ...formData,
        categoryId: formData.categoryId || undefined,
    };
    
    if (editingDoc) {
      const updatedDocs = documents.map(d => 
        d.id === editingDoc.id ? { ...d, ...payload } : d
      );
      setAllData({ ...allData, documents: updatedDocs });
    } else {
      const newDoc: Document = {
        id: uuidv4(),
        ...payload,
        uploadDate: new Date().toISOString()
      };
      setAllData({ ...allData, documents: [...documents, newDoc]});
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
      if (!docToDelete) return;
      const updatedDocs = documents.filter(d => d.id !== docToDelete.id);
      setAllData({ ...allData, documents: updatedDocs });
      setDocToDelete(null);
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
         <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
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
                    <label className="form-label">Executivo</label>
                    <select value={formData.executiveId} onChange={e => setFormData({...formData, executiveId: e.target.value})} className="form-select" required>
                        {executives.map(exec => <option key={exec.id} value={exec.id}>{exec.fullName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Nome do Documento</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" required />
                </div>
                 <div>
                    <label className="form-label">Categoria</label>
                    <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="form-select">
                        <option value="">Nenhuma</option>
                        {documentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="form-label">Arquivo de Imagem</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-file" required={!editingDoc} />
                    {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-4 max-h-40 rounded-md" />}
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
      )}

      <ConfirmationModal isOpen={!!docToDelete} onClose={() => setDocToDelete(null)} onConfirm={handleDelete} title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o documento "${docToDelete?.name}"?`} />

    </div>
  );
};

export default DocumentsView;