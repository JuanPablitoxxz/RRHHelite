export type View = 'dashboard' | 'candidates' | 'detail';

export interface Candidate {
  id: string;
  name: string;
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
