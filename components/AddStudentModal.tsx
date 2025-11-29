import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  onSave: (data: { name: string; language: string; level: string; classType: 'Individual' | 'Grupo' }) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    language: 'Inglés',
    level: '',
    classType: 'Individual' as 'Individual' | 'Grupo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            Nuevo Alumno
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              autoFocus
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. María González"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Idioma</label>
            <select
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.language}
              onChange={e => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="Inglés">Inglés 🇬🇧</option>
              <option value="Alemán">Alemán 🇩🇪</option>
              <option value="Francés">Francés 🇫🇷</option>
              <option value="Italiano">Italiano 🇮🇹</option>
              <option value="Español">Español 🇪🇸</option>
              <option value="Chino">Chino 🇨🇳</option>
              <option value="Japonés">Japonés 🇯🇵</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nivel Inicial</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej. B1.2, Avanzado..."
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Clase</label>
              <select
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.classType}
                onChange={e => setFormData({ ...formData, classType: e.target.value as any })}
              >
                <option value="Individual">Individual</option>
                <option value="Grupo">Grupo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.level.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};