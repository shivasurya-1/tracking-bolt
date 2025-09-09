import { Payment, Hold, ApiResponse, PaginatedResponse } from '../types';
import { mockPayments } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class PaymentService {
  static async getPaymentsByProject(projectId: string): Promise<Payment[]> {
    if (USE_MOCK) {
      await delay(500);
      return mockPayments.filter(p => p.project === projectId);
    }
    
    const response = await apiClient.get<PaginatedResponse<Payment>>(API_ENDPOINTS.PAYMENTS.LIST(projectId));
    return response.results;
  }

  static async createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    if (USE_MOCK) {
      await delay(1000);
      const newPayment: Payment = {
        ...paymentData,
        id: `payment-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockPayments.push(newPayment);
      return newPayment;
    }
    
    return await apiClient.post<Payment>(API_ENDPOINTS.PAYMENTS.CREATE, paymentData);
  }

  static async updatePayment(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockPayments.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Payment not found');
      
      mockPayments[index] = {
        ...mockPayments[index],
        ...paymentData,
        updated_at: new Date().toISOString()
      };
      return mockPayments[index];
    }
    
    return await apiClient.put<Payment>(API_ENDPOINTS.PAYMENTS.UPDATE(id), paymentData);
  }

  static async deletePayment(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      const index = mockPayments.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Payment not found');
      mockPayments.splice(index, 1);
      return;
    }
    
    await apiClient.delete(API_ENDPOINTS.PAYMENTS.DELETE(id));
  }

  static async addHold(projectId: string, holdData: { reason: string; amount: number }): Promise<Hold> {
    if (USE_MOCK) {
      await delay(1000);
      const newHold: Hold = {
        id: `hold-${Date.now()}`,
        project: projectId,
        reason: holdData.reason,
        amount: holdData.amount,
        created_at: new Date().toISOString(),
        is_active: true
      };
      return newHold;
    }
    
    return await apiClient.post<Hold>(API_ENDPOINTS.HOLDS.ADD(projectId), holdData);
  }

  static async releaseHold(holdId: string): Promise<Hold> {
    if (USE_MOCK) {
      await delay(1000);
      // Mock hold release
      return {
        id: holdId,
        project: 'mock-project',
        reason: 'Mock reason',
        amount: 1000,
        created_at: new Date().toISOString(),
        released_at: new Date().toISOString(),
        is_active: false
      };
    }
    
    return await apiClient.post<Hold>(API_ENDPOINTS.HOLDS.RELEASE(holdId));
  }
}