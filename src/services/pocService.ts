import { POC, ApiResponse, PaginatedResponse } from '../types';
import { mockPOCs } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class POCService {
  static async getPOCs(): Promise<POC[]> {
    if (USE_MOCK) {
      await delay(500);
      return [...mockPOCs];
    }
    
    const response = await apiClient.get<PaginatedResponse<POC>>(API_ENDPOINTS.POCS.LIST);
    return response.results;
  }

  static async getPOC(id: string): Promise<POC> {
    if (USE_MOCK) {
      await delay(500);
      const poc = mockPOCs.find(p => p.id === id);
      if (!poc) throw new Error('POC not found');
      return poc;
    }
    
    return await apiClient.get<POC>(API_ENDPOINTS.POCS.DETAIL(id));
  }

  static async getPOCsByClient(clientId: string): Promise<POC[]> {
    if (USE_MOCK) {
      await delay(500);
      return mockPOCs.filter(p => p.client === clientId);
    }
    
    const response = await apiClient.get<PaginatedResponse<POC>>(`${API_ENDPOINTS.POCS.LIST}?client=${clientId}`);
    return response.results;
  }

  static async createPOC(pocData: Omit<POC, 'id' | 'created_at' | 'updated_at' | 'client_name'>): Promise<POC> {
    if (USE_MOCK) {
      await delay(1000);
      const newPOC: POC = {
        ...pocData,
        id: `poc-${Date.now()}`,
        client_name: 'Mock Client Name', // In real implementation, this would be populated by the backend
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockPOCs.push(newPOC);
      return newPOC;
    }
    
    return await apiClient.post<POC>(API_ENDPOINTS.POCS.CREATE, pocData);
  }

  static async updatePOC(id: string, pocData: Partial<POC>): Promise<POC> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockPOCs.findIndex(p => p.id === id);
      if (index === -1) throw new Error('POC not found');
      
      mockPOCs[index] = {
        ...mockPOCs[index],
        ...pocData,
        updated_at: new Date().toISOString()
      };
      return mockPOCs[index];
    }
    
    return await apiClient.put<POC>(API_ENDPOINTS.POCS.UPDATE(id), pocData);
  }

  static async deletePOC(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      const index = mockPOCs.findIndex(p => p.id === id);
      if (index === -1) throw new Error('POC not found');
      mockPOCs.splice(index, 1);
      return;
    }
    
    await apiClient.delete(API_ENDPOINTS.POCS.DELETE(id));
  }
}