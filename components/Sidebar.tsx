import React from 'react';
import { Role, StudentProfile } from '../types';
import { 
  User, 
  BookOpen, 
  X, 
  MessageCircle, 
  Mail, 
  LogOut,
  Target,
  Lightbulb,
  Calendar,
  UserPlus,
  Bell
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: Role;
  students: StudentProfile[];
  currentStudentId: string | null;
  currentStudentName: string;
  onStudentChange: (id: string) => void;
  onAddStudentClick?: () => void;
  onLogout: () => void;
  onNavigate: (sectionId?: string) => void;
  notificationCount?: number;
}

const MiniCalendar = () => {
  const date = new Date();
  const monthName = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, date.getMonth(), 1).getDay();
  // Adjust for Monday start
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="px-6 py-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="text-center text-xs font-semibold text-slate-400 mb-3 capitalize tracking-wide">
          {monthName} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500 mb-1">
          {['L','M','X','J','V','S','D'].map(d => (
            <div key={d} className="text-center font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === date.getDate();
            return (
              <div 
                key={day} 
                className={`
                  aspect-square flex items-center justify-center rounded-full text-[10px] font-medium transition-all
                  ${isToday 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-110' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 cursor-default'}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  students,
  currentStudentId,
  currentStudentName,
  onStudentChange,
  onAddStudentClick,
  onLogout,
  onNavigate,
  notificationCount
}) => {
  const navItems = [
    { icon: <User size={20} />, label: 'Perfil', id: undefined },
    { icon: <Target size={20} />, label: 'Objetivos', id: 'objectives-section' },
    { icon: <Lightbulb size={20} />, label: 'Observaciones', id: 'notes-section' },
    { icon: <Calendar size={20} />, label: 'Calendario', id: 'calendar-section' },
    { icon: <BookOpen size={20} />, label: 'Recursos', id: 'resources-section' },
  ];

  return (
    <>
      <style>{`
        .sidebar-scroll-area::-webkit-scrollbar {
          display: none;
        }
        .sidebar-scroll-area {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col shadow-xl flex-shrink-0
          transform transition-transform duration-300 ease-in-out md:translate-x-0
          overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* HEADER SECTION - FIXED */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                IrinaTeacher
              </h1>
              {notificationCount !== undefined && notificationCount > 0 && (
                <button
                  onClick={() => onNavigate('notes-section')}
                  className="relative group animate-pulse hover:animate-none transition-transform hover:scale-110"
                  title={`${notificationCount} nuevas observaciones`}
                >
                  <Bell className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                    {notificationCount}
                  </span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
              {currentUserRole === Role.TEACHER ? 'Portal Profesor' : 'Área Alumno'}
            </p>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* MIDDLE SCROLLABLE SECTION */}
        <div className="flex-1 overflow-y-auto sidebar-scroll-area flex flex-col min-h-0">
          
          {/* Teacher Selection */}
          {currentUserRole === Role.TEACHER && (
            <div className="p-4 border-b border-slate-800 flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-500 block uppercase">Seleccionar Alumno</label>
                <button 
                  onClick={onAddStudentClick}
                  className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="Añadir nuevo alumno"
                >
                  <UserPlus size={14} /> Añadir
                </button>
              </div>
              <select 
                value={currentStudentId || ''}
                onChange={(e) => onStudentChange(e.target.value)}
                className="w-full bg-slate-800 border-none rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 text-white"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Nav Grid */}
          <nav className="p-4 flex-shrink-0">
            <div className="grid grid-cols-3 gap-3">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.id)}
                  className="group relative flex items-center justify-center p-3 rounded-xl bg-slate-800/40 text-slate-400 hover:bg-slate-700 hover:text-white transition-all aspect-square border border-slate-800 hover:border-slate-600 shadow-sm"
                  aria-label={item.label}
                >
                  {item.icon}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl z-50">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </nav>

          {/* Mini Calendar Widget */}
          <div className="flex-shrink-0">
            <MiniCalendar />
          </div>

          {/* Contact Section - Pushed to bottom of scroll area if space permits */}
          <div className="p-4 border-t border-slate-800 space-y-1 flex-shrink-0 mt-auto">
            <p className="px-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Contacto</p>
            <a 
              href="https://wa.me/34672290571" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm group"
            >
              <MessageCircle size={18} className="group-hover:text-emerald-400 transition-colors" />
              <span className="truncate">+34 672 290 571</span>
            </a>
            <a 
              href="mailto:hello@irinateacher.com" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm group"
            >
              <Mail size={18} className="group-hover:text-blue-400 transition-colors" />
              <span className="truncate">hello@irinateacher.com</span>
            </a>
          </div>
        </div>

        {/* FOOTER SECTION - FIXED */}
        <div className="p-4 border-t border-slate-800 flex-shrink-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              {currentUserRole === Role.TEACHER ? 'IT' : currentStudentName.substring(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentUserRole === Role.TEACHER ? 'Irina Teacher' : currentStudentName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentUserRole === Role.TEACHER ? 'Administrador' : 'Estudiante'}
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-2 py-2 rounded hover:bg-slate-800"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}