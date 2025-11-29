import React from 'react';
import { Role, StudentProfile } from '../types';
import { Badge } from './Badge';
import { getLanguageInfo } from '../utils/helpers';
import { GraduationCap, Users, Settings } from 'lucide-react';

interface StudentHeaderProps {
  student: StudentProfile;
  role: Role;
  onUpdateLevel: (newLevel: string) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ student, role, onUpdateLevel }) => {
  const langInfo = getLanguageInfo(student.language);

  return (
    <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">{student.name}</h2>
        <div className="flex flex-wrap gap-3 mt-2">
          <Badge 
            color="blue" 
            label={langInfo.country} 
            icon={<span className="text-base">{langInfo.flag}</span>} 
          />
          <Badge color="purple" label={`Nivel ${student.level}`} icon={<GraduationCap size={14} />} />
          <Badge color="emerald" label={`Clase ${student.classType}`} icon={<Users size={14} />} />
        </div>
      </div>
      {role === Role.TEACHER && (
         <div className="flex gap-2">
            <button 
              onClick={() => {
                 const newLevel = prompt("Nuevo nivel:", student.level);
                 if(newLevel) onUpdateLevel(newLevel);
              }}
              className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg"
            >
              <Settings size={14}/> Editar Perfil
            </button>
         </div>
      )}
    </header>
  );
};