import React, { useState } from 'react';
import { ChecklistItem, Role } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Wand2, Loader2 } from 'lucide-react';
import { generateSuggestedObjectives } from '../services/geminiService';

interface ChecklistSectionProps {
  title: string;
  items: ChecklistItem[];
  role: Role;
  canEdit: boolean; // Controls if user can add/remove/edit text
  onUpdate: (items: ChecklistItem[]) => void;
  // Optional context for AI generation
  isAIEnabled?: boolean;
  studentContext?: {
    language: string;
    level: string;
    classType: string;
  };
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  title,
  items,
  role,
  canEdit,
  onUpdate,
  isAIEnabled = false,
  studentContext
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleComplete = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate(updated);
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false
    };
    onUpdate([...items, newItem]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const handleGenerateAI = async () => {
    if (!studentContext) return;
    setIsGenerating(true);
    const suggestions = await generateSuggestedObjectives(
      studentContext.language,
      studentContext.level,
      studentContext.classType
    );
    
    const newItems: ChecklistItem[] = suggestions.map((text, idx) => ({
      id: `ai-${Date.now()}-${idx}`,
      text,
      completed: false
    }));

    onUpdate([...items, ...newItems]);
    setIsGenerating(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        
        {isAIEnabled && canEdit && (
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-50"
            title="Generar objetivos con IA"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            {isGenerating ? 'Generando...' : 'Sugerir con IA'}
          </button>
        )}
      </div>

      <div className="space-y-3 flex-1">
        {items.length === 0 && (
          <p className="text-slate-400 italic text-sm text-center py-4">No hay elementos todavía.</p>
        )}
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-3 group">
            <button
              onClick={() => toggleComplete(item.id)}
              className={`mt-0.5 flex-shrink-0 transition-colors ${
                item.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
            <span className={`flex-1 text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {item.text}
            </span>
            {canEdit && (
              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Añadir nuevo..."
            className="flex-1 text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addItem}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};