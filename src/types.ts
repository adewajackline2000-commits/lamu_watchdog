export interface Department {
  name: string;
  allocation: string;
  description?: string;
}

export interface Ward {
  name: string;
  projects?: string[];
}

export interface KeyProject {
  title: string;
  cost: string;
  description: string;
}

export interface BudgetAnalysis {
  summary: string;
  departments: Department[];
  wards: Ward[];
  keyProjects: KeyProject[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
