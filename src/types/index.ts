// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'User';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Client Types
export interface Client {
  id: string;
  company: string;
  client_name: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// POC Types
export interface POC {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  client: string;
  client_name?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Project Types
export interface Project {
  id: string;
  project_name: string;
  code: string;
  client: string;
  client_name?: string;
  poc: string;
  poc_name?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Fixed Price' | 'Time & Material' | 'Retainer';
  start_date: string;
  end_date?: string;
  description?: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

// Estimation Types
export interface Estimation {
  id: string;
  project: string;
  version: string;
  date: string;
  provider: string;
  review_date?: string;
  client_review_date?: string;
  development_amount: number;
  testing_amount: number;
  project_management_amount: number;
  total_amount: number;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  po_status: 'Not Received' | 'Received' | 'Partial';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  id: string;
  project: string;
  payment_type: 'Development' | 'Testing' | 'Project Management' | 'Other';
  resource: string;
  currency: 'USD' | 'EUR' | 'INR';
  approved_budget: number;
  additional_amount: number;
  payout: number;
  retention: number;
  penalty: number;
  utilization_percentage: number;
  is_exceeded: boolean;
  created_at: string;
  updated_at: string;
}

// Hold Types
export interface Hold {
  id: string;
  project: string;
  reason: string;
  amount: number;
  created_at: string;
  released_at?: string;
  is_active: boolean;
}

// Milestone Types
export interface Milestone {
  id: string;
  payment: string;
  name: string;
  amount: number;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Additional Budget Request Types
export interface AdditionalRequest {
  id: string;
  project: string;
  requested_amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}