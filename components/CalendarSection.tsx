import React from 'react';
import { Role } from '../types';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarSectionProps {
  calendarUrl?: string;
  role: Role;
  onUpdateUrl: (url: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarUrl, role, onUpdateUrl }) => {
  
  // Helper to ensure weekly view
  const getWeeklyUrl = (url: string) => {
    try {
      if (!url) return '';
      // If it's already an embed URL, append mode=WEEK if not present
      if (url.includes('calendar.google.com/calendar/embed')) {
        if (!url.includes('mode=')) {
          return `${url}&mode=WEEK`;
        }
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const finalUrl = getWeeklyUrl(calendarUrl || '');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
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
      
      {/* 
        Updated Container for Layout:
        - Height is calculated to fit viewport minus header/margins approximately (calc(100vh - 80px)).
        - This fits well because the calendar now starts at the top of the main content area.
      */}
      <div className="w-full flex-1">
        <div className="h-[calc(100vh-80px)] min-h-[500px] w-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative">
          {finalUrl ? (
            <iframe 
              src={finalUrl} 
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
    </div>
  );
};