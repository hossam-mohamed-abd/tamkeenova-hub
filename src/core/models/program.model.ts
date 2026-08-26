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
