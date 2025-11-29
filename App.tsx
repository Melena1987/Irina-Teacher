import React, { useState, useEffect } from 'react';
import { AppState, Role, StudentProfile } from './types';
import { INITIAL_STUDENTS } from './services/mockData';
import { ChecklistSection } from './components/ChecklistSection';
import { LoginScreen } from './components/LoginScreen';
import { MobileHeader } from './components/MobileHeader';
import { Sidebar } from './components/Sidebar';
import { StudentHeader } from './components/StudentHeader';
import { CalendarSection } from './components/CalendarSection';
import { ResourcesSection } from './components/ResourcesSection';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('irinaTeacherAppState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentUserRole: null,
      currentStudentId: null,
      students: INITIAL_STUDENTS
    };
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('irinaTeacherAppState', JSON.stringify(state));
  }, [state]);

  const handleLogin = (role: Role, studentId?: string) => {
    setState(prev => ({
      ...prev,
      currentUserRole: role,
      currentStudentId: studentId || (role === Role.TEACHER ? prev.students[0].id : null)
    }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUserRole: null, currentStudentId: null }));
    setIsMobileMenuOpen(false);
  };

  const updateStudentData = (studentId: string, updates: Partial<StudentProfile>) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, ...updates } : s)
    }));
  };

  const handleNavigate = (sectionId?: string) => {
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // --- RENDER LOGIC ---

  if (!state.currentUserRole) {
    return <LoginScreen students={state.students} onLogin={handleLogin} />;
  }

  const currentStudent = state.students.find(s => s.id === state.currentStudentId);

  if (!currentStudent) {
    return (
      <div className="p-10 text-center">
        Error: Estudiante no encontrado. <button onClick={handleLogout} className="text-blue-500 underline">Reiniciar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

      {/* OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentUserRole={state.currentUserRole}
        students={state.students}
        currentStudentId={state.currentStudentId}
        currentStudentName={currentStudent.name}
        onStudentChange={(id) => setState(prev => ({ ...prev, currentStudentId: id }))}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full md:ml-64">
        
        <StudentHeader 
          student={currentStudent} 
          role={state.currentUserRole}
          onUpdateLevel={(newLevel) => updateStudentData(currentStudent.id, { level: newLevel })}
        />

        {/* TOP ROW: OBJECTIVES, NOTES AND CALENDAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-6">
          
          {/* LEFT COLUMN: OBJECTIVES & NOTES */}
          <div className="md:col-span-7 space-y-6">
            
            <ChecklistSection 
              title="Objetivos del Curso"
              items={currentStudent.objectives}
              role={state.currentUserRole!}
              canEdit={state.currentUserRole === Role.TEACHER} 
              isAIEnabled={state.currentUserRole === Role.TEACHER}
              studentContext={{
                language: currentStudent.language,
                level: currentStudent.level,
                classType: currentStudent.classType
              }}
              onUpdate={(newItems) => updateStudentData(currentStudent.id, { objectives: newItems })}
            />

            <ChecklistSection 
              title="Observaciones / Ideas / Necesidades"
              items={currentStudent.notes}
              role={state.currentUserRole!}
              canEdit={true} 
              onUpdate={(newItems) => updateStudentData(currentStudent.id, { notes: newItems })}
            />
          </div>

          {/* RIGHT COLUMN: CALENDAR ONLY */}
          <div className="md:col-span-5 h-full">
            <CalendarSection 
              calendarUrl={currentStudent.calendarUrl}
              role={state.currentUserRole}
              onUpdateUrl={(url) => updateStudentData(currentStudent.id, { calendarUrl: url })}
            />
          </div>
        </div>

        {/* FULL WIDTH ROW: RESOURCES */}
        <div id="resources-section">
          <ResourcesSection 
            resources={currentStudent.resources}
            role={state.currentUserRole!}
            onUpdate={(newResources) => updateStudentData(currentStudent.id, { resources: newResources })}
          />
        </div>

      </main>
    </div>
  );
}