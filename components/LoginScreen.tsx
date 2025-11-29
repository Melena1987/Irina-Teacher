import React from 'react';
import { Role, StudentProfile } from '../types';
import { Users } from 'lucide-react';

interface LoginScreenProps { 
  students: StudentProfile[]; 
  onLogin: (role: Role, studentId?: string) => void; 
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ students, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Bienvenido</h1>
          <p className="text-slate-500">IrinaTeacher - Portal de Clases</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onLogin(Role.TEACHER)}
            className="w-full bg-slate-900 text-white p-4 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Users className="w-5 h-5" /> Acceso Profesor
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">O selecciona tu perfil</span></div>
          </div>

          <div className="space-y-2">
            {students.map(student => (
              <button 
                key={student.id}
                onClick={() => onLogin(Role.STUDENT, student.id)}
                className="w-full bg-white border border-slate-200 text-slate-700 p-3 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {student.name.substring(0,2).toUpperCase()}
                </div>
                <span>{student.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};