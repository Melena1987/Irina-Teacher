import React from 'react';
import { Role, StudentProfile } from '../types';
import { NavItem } from './NavItem';
import { 
  User, 
  BookOpen, 
  X, 
  MessageCircle, 
  Mail, 
  LogOut,
  Target,
  Lightbulb,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: Role;
  students: StudentProfile[];
  currentStudentId: string | null;
  currentStudentName: string;
  onStudentChange: (id: string) => void;
  onLogout: () => void;
  onNavigate: (sectionId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  students,
  currentStudentId,
  currentStudentName,
  onStudentChange,
  onLogout,
  onNavigate
}) => {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col shadow-xl flex-shrink-0
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            IrinaTeacher
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            {currentUserRole === Role.TEACHER ? 'Portal Profesor' : 'Área Alumno'}
          </p>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {currentUserRole === Role.TEACHER && (
        <div className="p-4 border-b border-slate-800">
          <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase">Seleccionar Alumno</label>
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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem 
          icon={<User size={20} />} 
          label="Perfil" 
          onClick={() => onNavigate()} 
        />
        <NavItem 
          icon={<Target size={20} />} 
          label="Objetivos" 
          onClick={() => onNavigate('objectives-section')}
        />
        <NavItem 
          icon={<Lightbulb size={20} />} 
          label="Observaciones" 
          onClick={() => onNavigate('notes-section')}
        />
        <NavItem 
          icon={<Calendar size={20} />} 
          label="Calendario" 
          onClick={() => onNavigate('calendar-section')}
        />
        <NavItem 
          icon={<BookOpen size={20} />} 
          label="Recursos" 
          onClick={() => onNavigate('resources-section')}
        />
      </nav>

      {/* CONTACT SECTION */}
      <div className="p-4 border-t border-slate-800 space-y-1">
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

      <div className="p-4 border-t border-slate-800">
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
  );
}