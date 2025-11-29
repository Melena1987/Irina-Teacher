export enum Role {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  seen?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: 'video' | 'document' | 'website' | 'other';
}

export interface StudentProfile {
  id: string;
  name: string;
  classType: 'Individual' | 'Grupo';
  level: string; // e.g., A1, B2, C1
  language: string; // e.g., Inglés, Alemán
  calendarUrl?: string; // Google Calendar Embed URL
  objectives: ChecklistItem[];
  notes: ChecklistItem[];
  resources: Resource[];
}

export interface AppState {
  currentUserRole: Role | null;
  currentStudentId: string | null; // If student logs in, this is them. If teacher, this is the selected student.
  students: StudentProfile[];
}