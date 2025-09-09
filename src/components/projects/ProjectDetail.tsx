import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Edit, Building2, UserCheck, Calendar, FileText } from 'lucide-react';
import { Project, Estimation, Payment, AdditionalRequest } from '../../types';
import { ProjectService } from '../../services/projectService';
import { EstimationService } from '../../services/estimationService';
import { PaymentService } from '../../services/paymentService';
import { RequestService } from '../../services/requestService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { Tabs } from '../common/Tabs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EstimationTab } from './tabs/EstimationTab';
import { PaymentTab } from './tabs/PaymentTab';
import { MilestoneTab } from './tabs/MilestoneTab';
import { RequestTab } from './tabs/RequestTab';
import toast from 'react-hot-toast';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [requests, setRequests] = useState<AdditionalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('estimations');

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    if (!id) return;
    
    try {
      const [projectData, estimationsData, paymentsData, requestsData] = await Promise.all([
        ProjectService.getProject(id),
        EstimationService.getEstimationsByProject(id),
        PaymentService.getPaymentsByProject(id),
        RequestService.getRequestsByProject(id)
      ]);
      
      setProject(projectData);
      setEstimations(estimationsData);
      setPayments(paymentsData);
      setRequests(requestsData);
    } catch (error) {
      toast.error('Failed to load project data');
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const tabs = [
    {
      id: 'estimations',
      label: 'Estimations',
      badge: estimations.length,
      content: (
        <EstimationTab 
          projectId={project.id} 
          estimations={estimations}
          onEstimationsChange={setEstimations}
        />
      )
    },
    {
      id: 'payments',
      label: 'Payments',
      badge: payments.length,
      content: (
        <PaymentTab 
          projectId={project.id} 
          payments={payments}
          onPaymentsChange={setPayments}
        />
      )
    },
    {
      id: 'milestones',
      label: 'Milestones',
      content: (
        <MilestoneTab 
          payments={payments}
        />
      )
    },
    {
      id: 'requests',
      label: 'Additional Requests',
      badge: requests.length,
      content: (
        <RequestTab 
          projectId={project.id} 
          requests={requests}
          onRequestsChange={setRequests}
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/projects')}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.project_name}</h1>
            <p className="text-gray-600">{project.code}</p>
          </div>
        </div>
        <Button icon={Edit} onClick={() => navigate(`/projects/${project.id}/edit`)}>
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{project.project_name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <StatusBadge 
                      status={project.status} 
                      variant={getStatusColor(project.status)}
                    />
                    <StatusBadge 
                      status={project.priority} 
                      variant={getPriorityColor(project.priority)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.client_name}</div>
                    <div className="text-xs text-gray-500">Client</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.poc_name}</div>
                    <div className="text-xs text-gray-500">Point of Contact</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-900">
                      {new Date(project.start_date).toLocaleDateString()}
                      {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                    </div>
                    <div className="text-xs text-gray-500">Project Duration</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-900">{project.type}</div>
                    <div className="text-xs text-gray-500">Project Type</div>
                  </div>
                </div>
              </div>

              {project.description && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {new Date(project.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};