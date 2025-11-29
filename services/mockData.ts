import { StudentProfile } from "../types";

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: '1',
    name: 'Ana García',
    classType: 'Individual',
    level: 'B2',
    language: 'Inglés',
    calendarUrl: 'https://calendar.google.com/calendar/embed?src=en.spanish%23holiday%40group.v.calendar.google.com&ctz=Europe%2FMadrid', // Generic holiday calendar as example
    objectives: [
      { id: 'o1', text: 'Mejorar pronunciación de los tiempos pasados', completed: false },
      { id: 'o2', text: 'Escribir 3 ensayos formales', completed: true },
    ],
    notes: [
      { id: 'n1', text: 'Me gustaría repasar phrasal verbs la próxima clase', completed: false },
    ],
    resources: [
      { id: 'r1', title: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish/', category: 'website', description: 'Noticias y gramática' },
      { id: 'r2', title: 'TED Talk: The power of introverts', url: 'https://www.ted.com', category: 'video' }
    ]
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    classType: 'Grupo',
    level: 'A2',
    language: 'Alemán',
    objectives: [
      { id: 'o1', text: 'Aprender vocabulario de la casa', completed: false },
    ],
    notes: [],
    resources: []
  }
];