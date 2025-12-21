export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: {
    latitude?: number;
    longitude?: number;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  photos?: string[];
  images?: string[];
  reportedBy?: {
    id: string;
    name: string;
    email: string;
  };
  submittedBy?: string;
  assignedTo?: {
    id: string;
    name: string;
    department: string;
  } | string;
  assignedDepartment?: string;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: Date;
  resolvedAt?: string | Date;
  actualResolution?: Date;
  department?: string;
  estimatedResolution?: string | Date;
  updates: IssueUpdate[];
}

export interface IssueUpdate {
  id: string;
  message: string;
  author: {
    name: string;
    role: 'citizen' | 'admin';
  };
  timestamp: string;
}

export type IssueCategory = 
  | 'pothole'
  | 'streetlight'
  | 'trash'
  | 'graffiti'
  | 'signage'
  | 'water'
  | 'sidewalk'
  | 'other';

export type IssueStatus = 
  | 'submitted'
  | 'acknowledged'
  | 'in-progress'
  | 'resolved'
  | 'closed';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'central-admin';
  department?: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  categories: IssueCategory[];
}

export interface Analytics {
  totalReports: number;
  resolvedReports: number;
  averageResolutionTime: number;
  reportsByCategory: Record<IssueCategory, number>;
  reportsByStatus: Record<IssueStatus, number>;
  reportsByDepartment: Record<string, number>;
  trendsData: {
    date: string;
    reports: number;
    resolved: number;
  }[];
  totalIssues?: number;
  resolvedIssues?: number;
  issuesByCategory?: Record<IssueCategory, number>;
  issuesByStatus?: Record<IssueStatus, number>;
  issuesByPriority?: Record<IssuePriority, number>;
  departmentPerformance?: Array<{
    department: string;
    totalAssigned: number;
    resolved: number;
    averageTime: number;
  }>;
  monthlyTrends?: Array<{
    month: string;
    submitted: number;
    resolved: number;
  }>;
}
