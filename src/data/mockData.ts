import { Client, POC, Project, Estimation, Payment, Milestone, AdditionalRequest, User, Task } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'John Admin',
    role: 'Admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: 'Jane Manager',
    role: 'Manager',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    client_name: 'Michael Johnson',
    email: 'michael@techcorp.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    company: 'Digital Innovations Inc',
    client_name: 'Sarah Williams',
    email: 'sarah@digitalinnovations.com',
    phone: '+1-555-0456',
    address: '456 Innovation Ave, New York, NY',
    active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    company: 'StartupXYZ',
    client_name: 'David Chen',
    email: 'david@startupxyz.com',
    phone: '+1-555-0789',
    address: '789 Startup Blvd, Austin, TX',
    active: false,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  }
];

// Mock POCs
export const mockPOCs: POC[] = [
  {
    id: '1',
    name: 'Alice Cooper',
    email: 'alice@techcorp.com',
    phone: '+1-555-0111',
    designation: 'Technical Lead',
    client: '1',
    client_name: 'TechCorp Solutions',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Bob Martinez',
    email: 'bob@techcorp.com',
    phone: '+1-555-0222',
    designation: 'Project Manager',
    client: '1',
    client_name: 'TechCorp Solutions',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@digitalinnovations.com',
    phone: '+1-555-0333',
    designation: 'Product Owner',
    client: '2',
    client_name: 'Digital Innovations Inc',
    active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    project_name: 'E-Commerce Platform',
    code: 'TECH-001',
    client: '1',
    client_name: 'TechCorp Solutions',
    poc: '1',
    poc_name: 'Alice Cooper',
    priority: 'High',
    type: 'Fixed Price',
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-06-15T00:00:00Z',
    description: 'Modern e-commerce platform with React and Node.js',
    status: 'Active',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    project_name: 'Mobile Banking App',
    code: 'DIG-002',
    client: '2',
    client_name: 'Digital Innovations Inc',
    poc: '3',
    poc_name: 'Carol Davis',
    priority: 'Critical',
    type: 'Time & Material',
    start_date: '2024-02-01T00:00:00Z',
    description: 'Secure mobile banking application for iOS and Android',
    status: 'Planning',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    project_name: 'CRM System',
    code: 'TECH-003',
    client: '1',
    client_name: 'TechCorp Solutions',
    poc: '2',
    poc_name: 'Bob Martinez',
    priority: 'Medium',
    type: 'Retainer',
    start_date: '2024-01-01T00:00:00Z',
    description: 'Customer relationship management system',
    status: 'On Hold',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  }
];

// Mock Estimations
export const mockEstimations: Estimation[] = [
  {
    id: '1',
    project: '1',
    version: 'v1.0',
    date: '2024-01-10T00:00:00Z',
    provider: 'TechTeam Solutions',
    review_date: '2024-01-15T00:00:00Z',
    client_review_date: '2024-01-20T00:00:00Z',
    development_amount: 80000,
    testing_amount: 15000,
    project_management_amount: 10000,
    total_amount: 105000,
    approval_status: 'Approved',
    po_status: 'Received',
    notes: 'Initial estimation for e-commerce platform',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    project: '2',
    version: 'v1.0',
    date: '2024-01-25T00:00:00Z',
    provider: 'Mobile Dev Team',
    development_amount: 120000,
    testing_amount: 25000,
    project_management_amount: 15000,
    total_amount: 160000,
    approval_status: 'Pending',
    po_status: 'Not Received',
    notes: 'Mobile banking app estimation',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z'
  }
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: '1',
    project: '1',
    payment_type: 'Development',
    resource: 'Frontend Team',
    currency: 'USD',
    approved_budget: 50000,
    additional_amount: 5000,
    payout: 45000,
    retention: 5000,
    penalty: 0,
    utilization_percentage: 90,
    is_exceeded: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    project: '1',
    payment_type: 'Testing',
    resource: 'QA Team',
    currency: 'USD',
    approved_budget: 15000,
    additional_amount: 0,
    payout: 12000,
    retention: 3000,
    penalty: 0,
    utilization_percentage: 80,
    is_exceeded: false,
    created_at: '2024-01-16T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  }
];

// Mock Milestones
export const mockMilestones: Milestone[] = [
  {
    id: '1',
    payment: '1',
    name: 'Frontend Setup Complete',
    amount: 15000,
    due_date: '2024-02-15T00:00:00Z',
    status: 'Completed',
    completion_date: '2024-02-10T00:00:00Z',
    notes: 'React setup with routing and state management',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  },
  {
    id: '2',
    payment: '1',
    name: 'User Authentication Module',
    amount: 20000,
    due_date: '2024-03-01T00:00:00Z',
    status: 'In Progress',
    notes: 'Login, signup, and password reset functionality',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z'
  },
  {
    id: '3',
    payment: '1',
    name: 'Product Catalog',
    amount: 10000,
    due_date: '2024-03-15T00:00:00Z',
    status: 'Pending',
    notes: 'Product listing and search functionality',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
];

// Mock Additional Requests
export const mockAdditionalRequests: AdditionalRequest[] = [
  {
    id: '1',
    project: '1',
    requested_amount: 10000,
    reason: 'Additional payment gateway integration required',
    status: 'Approved',
    approved_by: 'John Admin',
    approved_at: '2024-02-01T00:00:00Z',
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    project: '1',
    requested_amount: 5000,
    reason: 'Enhanced security features implementation',
    status: 'Pending',
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z'
  },
  {
    id: '3',
    project: '2',
    requested_amount: 15000,
    reason: 'Additional mobile platform support',
    status: 'Rejected',
    rejection_reason: 'Not within project scope',
    created_at: '2024-02-05T00:00:00Z',
    updated_at: '2024-02-08T00:00:00Z'
  }
];