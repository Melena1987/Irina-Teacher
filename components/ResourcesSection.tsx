import React, { useState } from 'react';
import { Resource, Role } from '../types';
import { BookOpen, X, Plus, ExternalLink } from 'lucide-react';

interface ResourcesSectionProps { 
  resources: Resource[]; 
  role: Role; 
  onUpdate: (r: Resource[]) => void; 
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ 
  resources, 
  role, 
  onUpdate 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRes, setNewRes] = useState<Partial<Resource>>({ category: 'website' });

  const addResource = () => {
    if (!newRes.title || !newRes.url) return;
    const resource: Resource = {
      id: Date.now().toString(),
      title: newRes.title,
      url: newRes.url.startsWith('http') ? newRes.url : `https://${newRes.url}`,
      category: newRes.category as any,
      description: newRes.description
    };
    onUpdate([...resources, resource]);
    setIsAdding(false);
    setNewRes({ category: 'website' });
  };

  const deleteResource = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm('¿Borrar este recurso?')) {
      onUpdate(resources.filter(r => r.id !== id));
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      // Increased size to 256 for better quality on full-button view
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`;
    } catch (e) {
      return '';
    }
  };

  const getPlatformName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      const name = hostname.replace('www.', '').split('.')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {
      return 'Web';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-emerald-500" /> Recursos
        </h3>
        {role === Role.TEACHER && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium hover:bg-emerald-100 flex items-center gap-1"
          >
            {isAdding ? <X size={14} /> : <Plus size={14} />} {isAdding ? 'Cancelar' : 'Añadir Recurso'}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
          <div className="grid grid-cols-1 gap-4">
             <input 
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="Título del recurso" 
              value={newRes.title || ''} 
              onChange={e => setNewRes({...newRes, title: e.target.value})}
            />
            <input 
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
              placeholder="URL (ej. youtube.com/...)" 
              value={newRes.url || ''} 
              onChange={e => setNewRes({...newRes, url: e.target.value})}
            />
            <button onClick={addResource} className="bg-emerald-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
              Guardar
            </button>
          </div>
        </div>
      )}

      {resources.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No hay recursos compartidos todavía.</p>
        </div>
      )}
      
      {/* Grid for Resources */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {resources.map(res => (
          <a 
            key={res.id} 
            href={res.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center justify-center aspect-square bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden"
          >
            {/* Full Size Icon */}
            <div className="w-full h-full p-4 flex items-center justify-center">
              <img 
                src={getFaviconUrl(res.url)} 
                alt={res.title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=google.com';
                }}
              />
            </div>
            
            {/* Overlay Title on Hover */}
            <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                {getPlatformName(res.url)}
              </span>
              <span className="text-white text-xs font-medium line-clamp-3 leading-tight">
                {res.title}
              </span>
              <ExternalLink className="text-slate-400 mt-2 w-4 h-4" />
            </div>

            {/* Delete Button (Teacher only) */}
            {role === Role.TEACHER && (
              <button 
                onClick={(e) => deleteResource(e, res.id)} 
                className="absolute top-1 right-1 z-10 p-1 bg-white/90 rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-100"
                title="Eliminar recurso"
              >
                <X size={14} />
              </button>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};