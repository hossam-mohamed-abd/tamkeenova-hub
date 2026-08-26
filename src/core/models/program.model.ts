export type ProgramLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgramFormat = 'onsite' | 'online' | 'hybrid';

export interface Program {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: string;
  level: ProgramLevel;
  format: ProgramFormat;
  durationHours: number;
  coverImage: string;
  isOpen: boolean;
  seatsLeft?: number;
}

/*
  مثال لشكل البيانات لما الـ backend يجهز:

  {
    id: 'prog-001',
    slug: 'digital-transformation-basics',
    title: { ar: 'أساسيات التحول الرقمي', en: 'Digital Transformation Basics' },
    description: { ar: 'وصف مختصر للبرنامج...', en: 'Short program description...' },
    category: 'digital',
    level: 'beginner',
    format: 'hybrid',
    durationHours: 24,
    coverImage: '/images/programs/digital-transformation.jpg',
    isOpen: true,
    seatsLeft: 12
  }
*/