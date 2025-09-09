import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, FolderOpen } from 'lucide-react';
import { Project, Client, POC } from '../../types';
import { ProjectService } from '../../services/projectService';
import { ClientService } from '../../services/clientService';
import { POCService } from '../../services/pocService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Table } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { ProjectForm } from './ProjectForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [pocs, setPocs] = useState<POC[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, clientsData, pocsData] = await Promise.all([
        ProjectService.getProjects(),
        ClientService.getClients(),
        POCService.getPOCs()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setPocs(pocsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'client_name' | 'poc_name'>) => {
    try {
      const newProject = await ProjectService.createProject(projectData);
      setProjects([...projects, newProject]);
      setShowModal(false);
      toast.success('Project created successfully');
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdateProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'client_name' | 'poc_name'>) => {
    if (!editingProject) return;
    
    try {
      const updatedProject = await ProjectService.updateProject(editingProject.id, projectData);
      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
      setShowModal(false);
      setEditingProject(null);
      toast.success('Project updated successfully');
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await ProjectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Failed to delete project:', error);
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'success';
      case 'Planning': return 'info';
      case 'On Hold': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'project_name',
      header: 'Project',
      render: (project: Project) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FolderOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{project.project_name}</div>
            <div className="text-sm text-gray-500">{project.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'client_name',
      header: 'Client',
      render: (project: Project) => (
        <div>
          <div className="text-sm text-gray-900">{project.client_name}</div>
          <div className="text-sm text-gray-500">{project.poc_name}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.type}</span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (project: Project) => (
        <StatusBadge 
          status={project.priority} 
          variant={getPriorityColor(project.priority)}
        />
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (project: Project) => (
        <StatusBadge 
          status={project.status} 
          variant={getStatusColor(project.status)}
        />
      )
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (project: Project) => new Date(project.start_date).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project: Project) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project.id}`);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              setEditingProject(project);
              setShowModal(true);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProject(project.id);
            }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Create Project
        </Button>
      </div>

      <Card>
        <Table
          data={projects}
          columns={columns}
          loading={loading}
          emptyMessage="No projects found"
          onRowClick={(project) => navigate(`/projects/${project.id}`)}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        maxWidth="lg"
      >
        <ProjectForm
          project={editingProject}
          clients={clients}
          pocs={pocs}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
        />
      </Modal>
    </div>
  );
};