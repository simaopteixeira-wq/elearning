
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  completed: boolean;
  type?: 'text' | 'video' | 'project';
  externalUrl?: string;
  rating?: number;
  score?: number; // Added score property
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  thumbnail: string;
  progress: number;
  lessons: Lesson[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

export type AppView = 'login' | 'dashboard' | 'course-detail' | 'admin' | 'my-courses';
