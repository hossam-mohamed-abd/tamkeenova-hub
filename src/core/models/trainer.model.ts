export interface Trainer {
  id: string;
  slug: string;
  name: string;
  specialization: string;
  bio: string;
  avatar: string;
  rating: number; 
  sessionsCount?: number;
}