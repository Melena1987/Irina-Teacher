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

  const handleAddStudent = (name: string) => {
    const newStudent: StudentProfile = {
      id: Date.now().toString(),
      name: name,
      classType: 'Individual',
      level: 'A1',
      language: 'Inglés',
      objectives: [],
      notes: [],
      resources: []
    };

    setState(prev => ({
      ...prev,
      students: [...prev.students, newStudent],
      currentStudentId: newStudent.id
    }));
  };

  const handleNavigate = (sectionId?: string) => {
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Offset for sticky headers if necessary
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
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

  // Calculate uncompleted notes for the notification badge
  const pendingNotesCount = currentStudent.notes.filter(n => !n.completed).length;

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
        onAddStudent={handleAddStudent}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        notificationCount={pendingNotesCount}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 min-w-0">
        
        {/* MAIN GRID LAYOUT: Left Column (Profile + Resources) | Right Column (Calendar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
          
          {/* LEFT COLUMN: Student Header and Resources */}
          <div className="space-y-6">
            <StudentHeader 
              student={currentStudent} 
              role={state.currentUserRole}
              onUpdateLevel={(newLevel) => updateStudentData(currentStudent.id, { level: newLevel })}
            />

            <div id="resources-section" className="w-full">
              <ResourcesSection 
                resources={currentStudent.resources}
                role={state.currentUserRole!}
                onUpdate={(newResources) => updateStudentData(currentStudent.id, { resources: newResources })}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Calendar (Full Height of the column) */}
          <div id="calendar-section" className="w-full">
            <CalendarSection 
              calendarUrl={currentStudent.calendarUrl}
              role={state.currentUserRole}
              onUpdateUrl={(url) => updateStudentData(currentStudent.id, { calendarUrl: url })}
            />
          </div>

        </div>

        {/* BOTTOM ROW: OBJECTIVES & NOTES (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="objectives-section">
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
          </div>

          <div id="notes-section">
            <ChecklistSection 
              title="Observaciones / Ideas"
              items={currentStudent.notes}
              role={state.currentUserRole!}
              canEdit={true} 
              onUpdate={(newItems) => updateStudentData(currentStudent.id, { notes: newItems })}
            />
          </div>
        </div>

      </main>
    </div>
  );
}