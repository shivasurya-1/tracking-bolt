import { AuthResponse, User } from '../types';
import { mockUsers } from '../data/mockData';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    await delay(1000);
    
    // Mock validation
    if (email === 'admin@company.com' && password === 'admin123') {
      const user = mockUsers.find(u => u.email === email)!;
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('auth-token', token);
      return { token, user };
    }
    
    throw new Error('Invalid credentials');
  }

  static async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    await delay(1000);
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'User',
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('auth-token', token);
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
    localStorage.removeItem('auth-token');
  }

  static getCurrentUser(): User | null {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;
    
    // In a real app, you'd validate the token with the server
    return mockUsers[0]; // Return admin user for demo
  }
}