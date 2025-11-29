import React from 'react';
import { Role } from '../types';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarSectionProps {
  calendarUrl?: string;
  role: Role;
  onUpdateUrl: (url: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarUrl, role, onUpdateUrl }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="text-blue-500" /> Calendario
        </h3>
        {role === Role.TEACHER && (
          <button 
            onClick={() => {
              const url = prompt("Introduce la URL pública (embed) del Google Calendar:", calendarUrl);
              if (url !== null) onUpdateUrl(url);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Configurar URL
          </button>
        )}
      </div>
      
      <div className="aspect-[4/3] bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative flex-1">
        {calendarUrl ? (
          <iframe 
            src={calendarUrl} 
            style={{border: 0}} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no"
            title="Calendario de Clases"
            className="absolute inset-0 w-full h-full"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <CalendarIcon className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">El profesor aún no ha vinculado el calendario.</p>
          </div>
        )}
      </div>
    </div>
  );
};