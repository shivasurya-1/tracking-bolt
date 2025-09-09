import { AdditionalRequest, ApiResponse, PaginatedResponse } from '../types';
import { mockAdditionalRequests } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class RequestService {
  static async getRequests(): Promise<AdditionalRequest[]> {
    if (USE_MOCK) {
      await delay(500);
      return [...mockAdditionalRequests];
    }
    
    const response = await apiClient.get<PaginatedResponse<AdditionalRequest>>(API_ENDPOINTS.ADDITIONAL_REQUESTS.LIST);
    return response.results;
  }

  static async getRequestsByProject(projectId: string): Promise<AdditionalRequest[]> {
    if (USE_MOCK) {
      await delay(500);
      return mockAdditionalRequests.filter(r => r.project === projectId);
    }
    
    const response = await apiClient.get<PaginatedResponse<AdditionalRequest>>(`${API_ENDPOINTS.ADDITIONAL_REQUESTS.LIST}?project=${projectId}`);
    return response.results;
  }

  static async createRequest(requestData: Omit<AdditionalRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'approved_by' | 'approved_at' | 'rejection_reason'>): Promise<AdditionalRequest> {
    if (USE_MOCK) {
      await delay(1000);
      const newRequest: AdditionalRequest = {
        ...requestData,
        id: `request-${Date.now()}`,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockAdditionalRequests.push(newRequest);
      return newRequest;
    }
    
    return await apiClient.post<AdditionalRequest>(API_ENDPOINTS.ADDITIONAL_REQUESTS.CREATE, requestData);
  }

  static async approveRequest(id: string, approvedBy: string): Promise<AdditionalRequest> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockAdditionalRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      mockAdditionalRequests[index] = {
        ...mockAdditionalRequests[index],
        status: 'Approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockAdditionalRequests[index];
    }
    
    return await apiClient.post<AdditionalRequest>(API_ENDPOINTS.ADDITIONAL_REQUESTS.APPROVE(id), { approved_by: approvedBy });
  }

  static async rejectRequest(id: string, rejectionReason: string): Promise<AdditionalRequest> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockAdditionalRequests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      
      mockAdditionalRequests[index] = {
        ...mockAdditionalRequests[index],
        status: 'Rejected',
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString()
      };
      return mockAdditionalRequests[index];
    }
    
    return await apiClient.post<AdditionalRequest>(API_ENDPOINTS.ADDITIONAL_REQUESTS.REJECT(id), { rejection_reason: rejectionReason });
  }
}