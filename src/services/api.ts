import { AuthResponse, User, Project, Task, Payment, Milestone, Estimation } from '../types';
import { mockUsers, mockProjects, mockTasks, mockPayments, mockEstimations, mockMilestones } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock localStorage for tokens
const getToken = () => localStorage.getItem('auth-token');
const setToken = (token: string) => localStorage.setItem('auth-token', token);
const removeToken = () => localStorage.removeItem('auth-token');

// Auth Service
export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    await delay(1000);
    
    // Mock validation - in real app, this would be server-side
    if (email === 'admin@company.com' && password === 'admin123') {
      const user = mockUsers.find(u => u.email === email)!;
      const token = `mock-token-${Date.now()}`;
      setToken(token);
      return { token, user };
    }
    
    throw new Error('Invalid credentials');
  }

  static async signup(email: string, password: string, name: string, role: User['role'], module: User['module']): Promise<AuthResponse> {
    await delay(1000);
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      module,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    const token = `mock-token-${Date.now()}`;
    setToken(token);
    return { token, user: newUser };
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    await delay(1000);
    
    if (!mockUsers.find(u => u.email === email)) {
      throw new Error('User not found');
    }

    return { message: 'Password reset email sent' };
  }

  static async resetPassword(token: string, password: string): Promise<{ message: string }> {
    await delay(1000);
    
    // Mock token validation
    if (!token.startsWith('reset-token-')) {
      throw new Error('Invalid reset token');
    }

    return { message: 'Password reset successfully' };
  }

  static logout(): void {
    removeToken();
  }

  static getCurrentUser(): User | null {
    const token = getToken();
    if (!token) return null;
    
    // In a real app, you'd validate the token with the server
    return mockUsers[0]; // Return admin user for demo
  }
}

// Tracking Service
export class TrackingService {
  static async getUsers(): Promise<User[]> {
    await delay(500);
    return [...mockUsers];
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await delay(1000);
    
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    return newUser;
  }

  static async getProjects(): Promise<Project[]> {
    await delay(500);
    // Projects come from Budgeting service
    return [...mockProjects];
  }

  static async getTasks(): Promise<Task[]> {
    await delay(500);
    return [...mockTasks];
  }

  static async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await delay(1000);
    
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    mockTasks.push(newTask);
    return newTask;
  }

  static async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    await delay(500);
    
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    task.status = status;
    return task;
  }
}

// Budgeting Service
export class BudgetingService {
  static async getProjects(): Promise<Project[]> {
    await delay(500);
    return [...mockProjects];
  }

  static async createProject(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    await delay(1000);
    
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    mockProjects.push(newProject);
    return newProject;
  }

  static async getProjectDetail(projectId: string): Promise<{
    project: Project;
    estimations: Estimation[];
    payments: Payment[];
  }> {
    await delay(500);
    
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const estimations = mockEstimations.filter(e => e.projectId === projectId);
    const payments = mockPayments.filter(p => p.projectId === projectId);

    return { project, estimations, payments };
  }

  static async createEstimation(estimationData: Omit<Estimation, 'id' | 'createdAt'>): Promise<Estimation> {
    await delay(1000);
    
    const newEstimation: Estimation = {
      ...estimationData,
      id: `estimation-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    mockEstimations.push(newEstimation);
    return newEstimation;
  }

  static async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'milestones'>): Promise<Payment> {
    await delay(1000);
    
    const newPayment: Payment = {
      ...paymentData,
      id: `payment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      milestones: []
    };

    mockPayments.push(newPayment);
    return newPayment;
  }

  static async createMilestone(paymentId: string, milestoneData: Omit<Milestone, 'id' | 'paymentId'>): Promise<Milestone> {
    await delay(1000);
    
    const newMilestone: Milestone = {
      ...milestoneData,
      id: `milestone-${Date.now()}`,
      paymentId
    };

    mockMilestones.push(newMilestone);
    
    // Update the payment's milestones
    const payment = mockPayments.find(p => p.id === paymentId);
    if (payment) {
      payment.milestones.push(newMilestone);
    }

    return newMilestone;
  }
}