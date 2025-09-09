import { Milestone, ApiResponse, PaginatedResponse } from '../types';
import { mockMilestones } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class MilestoneService {
  static async getMilestones(): Promise<Milestone[]> {
    if (USE_MOCK) {
      await delay(500);
      return [...mockMilestones];
    }
    
    const response = await apiClient.get<PaginatedResponse<Milestone>>(API_ENDPOINTS.MILESTONES.LIST);
    return response.results;
  }

  static async getMilestonesByPayment(paymentId: string): Promise<Milestone[]> {
    if (USE_MOCK) {
      await delay(500);
      return mockMilestones.filter(m => m.payment === paymentId);
    }
    
    const response = await apiClient.get<PaginatedResponse<Milestone>>(`${API_ENDPOINTS.MILESTONES.LIST}?payment=${paymentId}`);
    return response.results;
  }

  static async createMilestone(milestoneData: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>): Promise<Milestone> {
    if (USE_MOCK) {
      await delay(1000);
      const newMilestone: Milestone = {
        ...milestoneData,
        id: `milestone-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockMilestones.push(newMilestone);
      return newMilestone;
    }
    
    return await apiClient.post<Milestone>(API_ENDPOINTS.MILESTONES.CREATE, milestoneData);
  }

  static async updateMilestone(id: string, milestoneData: Partial<Milestone>): Promise<Milestone> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockMilestones.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Milestone not found');
      
      mockMilestones[index] = {
        ...mockMilestones[index],
        ...milestoneData,
        updated_at: new Date().toISOString()
      };
      return mockMilestones[index];
    }
    
    return await apiClient.put<Milestone>(API_ENDPOINTS.MILESTONES.UPDATE(id), milestoneData);
  }

  static async deleteMilestone(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      const index = mockMilestones.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Milestone not found');
      mockMilestones.splice(index, 1);
      return;
    }
    
    await apiClient.delete(API_ENDPOINTS.MILESTONES.DELETE(id));
  }
}