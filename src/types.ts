export type View = 'dashboard' | 'candidates' | 'jobs' | 'interviews' | 'evaluations' | 'settings' | 'detail';

export type UserRole = 'admin' | 'interviewer' | 'user' | 'applicant';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  position: string;
  stage: string;
  rating: number;
  avatar: string;
  location?: string;
  phone?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  type: 'postulation' | 'interview' | 'evaluation' | 'system';
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateId: string;
  position: string;
  time: string;
  type: 'video' | 'in-person';
  initials: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Abierta' | 'Cerrada' | 'En Pausa';
  description?: string;
  created_at: string;
}
