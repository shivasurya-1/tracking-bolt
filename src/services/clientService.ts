import { Client, ApiResponse, PaginatedResponse } from '../types';
import { mockClients } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class ClientService {
  static async getClients(): Promise<Client[]> {
    if (USE_MOCK) {
      await delay(500);
      return [...mockClients];
    }
    
    const response = await apiClient.get<PaginatedResponse<Client>>(API_ENDPOINTS.CLIENTS.LIST);
    return response.results;
  }

  static async getClient(id: string): Promise<Client> {
    if (USE_MOCK) {
      await delay(500);
      const client = mockClients.find(c => c.id === id);
      if (!client) throw new Error('Client not found');
      return client;
    }
    
    return await apiClient.get<Client>(API_ENDPOINTS.CLIENTS.DETAIL(id));
  }

  static async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    if (USE_MOCK) {
      await delay(1000);
      const newClient: Client = {
        ...clientData,
        id: `client-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockClients.push(newClient);
      return newClient;
    }
    
    return await apiClient.post<Client>(API_ENDPOINTS.CLIENTS.CREATE, clientData);
  }

  static async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Client not found');
      
      mockClients[index] = {
        ...mockClients[index],
        ...clientData,
        updated_at: new Date().toISOString()
      };
      return mockClients[index];
    }
    
    return await apiClient.put<Client>(API_ENDPOINTS.CLIENTS.UPDATE(id), clientData);
  }

  static async deleteClient(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Client not found');
      mockClients.splice(index, 1);
      return;
    }
    
    await apiClient.delete(API_ENDPOINTS.CLIENTS.DELETE(id));
  }
}