import { Project, ApiResponse, PaginatedResponse } from '../types';
import { mockProjects } from '../data/mockData';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Mock implementation - replace with real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const USE_MOCK = true; // Set to false when connecting to real API

export class ProjectService {
  static async getProjects(): Promise<Project[]> {
    if (USE_MOCK) {
      await delay(500);
      return [...mockProjects];
    }
    
    const response = await apiClient.get<PaginatedResponse<Project>>(API_ENDPOINTS.PROJECTS.LIST);
    return response.results;
  }

  static async getProject(id: string): Promise<Project> {
    if (USE_MOCK) {
      await delay(500);
      const project = mockProjects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      return project;
    }
    
    return await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.DETAIL(id));
  }

  static async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'client_name' | 'poc_name'>): Promise<Project> {
    if (USE_MOCK) {
      await delay(1000);
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        client_name: 'Mock Client Name', // In real implementation, populated by backend
        poc_name: 'Mock POC Name', // In real implementation, populated by backend
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockProjects.push(newProject);
      return newProject;
    }
    
    return await apiClient.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, projectData);
  }

  static async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    if (USE_MOCK) {
      await delay(1000);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Project not found');
      
      mockProjects[index] = {
        ...mockProjects[index],
        ...projectData,
        updated_at: new Date().toISOString()
      };
      return mockProjects[index];
    }
    
    return await apiClient.put<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), projectData);
  }

  static async deleteProject(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Project not found');
      mockProjects.splice(index, 1);
      return;
    }
    
    await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  }
}