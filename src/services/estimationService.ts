import { Estimation, ApiResponse, PaginatedResponse } from '../types';
import { mockEstimations } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class EstimationService {
  static async getEstimationsByProject(projectId: string): Promise<Estimation[]> {
    if (USE_MOCK) {
      await delay(500);
      return mockEstimations.filter(e => e.project === projectId);
    }
    
    const response = await apiClient.get<PaginatedResponse<Estimation>>(API_ENDPOINTS.ESTIMATIONS.LIST(projectId));
    return response.results;
  }

  static async createEstimation(estimationData: Omit<Estimation, 'id' | 'created_at' | 'updated_at'>): Promise<Estimation> {
    if (USE_MOCK) {
      await delay(1000);
      const newEstimation: Estimation = {
        ...estimationData,
        id: `estimation-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockEstimations.push(newEstimation);
      return newEstimation;
    }
    
    return await apiClient.post<Estimation>(API_ENDPOINTS.ESTIMATIONS.CREATE, estimationData);
  }

  static async updateEstimation(id: string, estimationData: Partial<Estimation>): Promise<Estimation> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockEstimations.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Estimation not found');
      
      mockEstimations[index] = {
        ...mockEstimations[index],
        ...estimationData,
        updated_at: new Date().toISOString()
      };
      return mockEstimations[index];
    }
    
    return await apiClient.put<Estimation>(API_ENDPOINTS.ESTIMATIONS.UPDATE(id), estimationData);
  }

  static async deleteEstimation(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      const index = mockEstimations.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Estimation not found');
      mockEstimations.splice(index, 1);
      return;
    }
    
    await apiClient.delete(API_ENDPOINTS.ESTIMATIONS.DELETE(id));
  }
}