import React, { useState, useEffect } from 'react';
import { FolderOpen, Calendar, DollarSign } from 'lucide-react';
import { Project } from '../../types';
import { TrackingService } from '../../services/api';
import { Card } from '../common/Card';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await TrackingService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-sm text-gray-600">Projects are managed in the Budgeting module</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} hoverable className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Started: {new Date(project.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-500">
                <DollarSign className="w-4 h-4 mr-2" />
                Budget: ${project.budget.toLocaleString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};