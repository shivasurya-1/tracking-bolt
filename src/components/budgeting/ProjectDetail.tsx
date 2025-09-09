import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Plus, DollarSign, Target, CheckSquare } from 'lucide-react';
import { Project, Estimation, Payment, User } from '../../types';
import { BudgetingService, TrackingService } from '../../services/api';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EstimationForm } from './EstimationForm';
import { PaymentForm } from './PaymentForm';
import { MilestoneForm } from './MilestoneForm';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'estimations' | 'payments' | 'milestones'>('estimations');
  const [showModal, setShowModal] = useState<'estimation' | 'payment' | 'milestone' | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  useEffect(() => {
    if (projectId) {
      loadProjectDetail();
      loadUsers();
    }
  }, [projectId]);

  const loadProjectDetail = async () => {
    if (!projectId) return;
    
    try {
      const data = await BudgetingService.getProjectDetail(projectId);
      setProject(data.project);
      setEstimations(data.estimations);
      setPayments(data.payments);
    } catch (error) {
      console.error('Failed to load project detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await TrackingService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateEstimation = async (estimationData: Omit<Estimation, 'id' | 'createdAt'>) => {
    try {
      const newEstimation = await BudgetingService.createEstimation(estimationData);
      setEstimations([...estimations, newEstimation]);
      setShowModal(null);
    } catch (error) {
      console.error('Failed to create estimation:', error);
    }
  };

  const handleCreatePayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'milestones'>) => {
    try {
      const newPayment = await BudgetingService.createPayment(paymentData);
      setPayments([...payments, newPayment]);
      setShowModal(null);
    } catch (error) {
      console.error('Failed to create payment:', error);
    }
  };

  const handleCreateMilestone = async (milestoneData: any) => {
    if (!selectedPayment) return;

    try {
      await BudgetingService.createMilestone(selectedPayment, milestoneData);
      await loadProjectDetail(); // Reload to get updated milestones
      setShowModal(null);
      setSelectedPayment('');
    } catch (error) {
      console.error('Failed to create milestone:', error);
    }
  };

  const getTotalEstimation = () => {
    return estimations.reduce((total, est) => total + est.totalAmount, 0);
  };

  const getTotalPayments = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'Not assigned';
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center text-gray-500">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => window.history.back()}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${project.budget.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Budget</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${getTotalEstimation().toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Estimations</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <CheckSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${getTotalPayments().toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Payments</p>
          </div>
        </Card>
      </div>

      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {['estimations', 'payments', 'milestones'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <Button
            icon={Plus}
            onClick={() => setShowModal(activeTab === 'estimations' ? 'estimation' : activeTab === 'payments' ? 'payment' : 'milestone')}
          >
            Add {activeTab.slice(0, -1)}
          </Button>
        </div>

        <div className="space-y-4">
          {activeTab === 'estimations' && (
            <div className="space-y-4">
              {estimations.map((estimation) => (
                <Card key={estimation.id} className="p-4" padding="none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{estimation.category}</h4>
                      <p className="text-sm text-gray-600">
                        {estimation.hours} hours × ${estimation.hourlyRate}/hr
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${estimation.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(estimation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
              {estimations.length === 0 && (
                <p className="text-center text-gray-500 py-8">No estimations yet</p>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="p-4" padding="none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{payment.description}</h4>
                      <p className="text-sm text-gray-600 capitalize">
                        Resource: {payment.resourceType}
                      </p>
                      {payment.resourceType === 'manpower' && (
                        <p className="text-sm text-gray-600">
                          Assigned to: {getUserName(payment.assignedUserId)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {payment.milestones.length} milestones
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment.id);
                          setShowModal('milestone');
                        }}
                        className="mt-1"
                      >
                        Add Milestone
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {payments.length === 0 && (
                <p className="text-center text-gray-500 py-8">No payments yet</p>
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id}>
                  <h4 className="font-medium text-gray-900 mb-2">{payment.description}</h4>
                  <div className="space-y-2 ml-4">
                    {payment.milestones.map((milestone) => (
                      <Card key={milestone.id} className="p-3" padding="none">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">{milestone.title}</p>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>Due: {new Date(milestone.targetDate).toLocaleDateString()}</p>
                            {milestone.completed && milestone.completedDate && (
                              <p>Completed: {new Date(milestone.completedDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                    {payment.milestones.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No milestones for this payment</p>
                    )}
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-center text-gray-500 py-8">No payments with milestones yet</p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={showModal === 'estimation'}
        onClose={() => setShowModal(null)}
        title="Add Estimation"
        maxWidth="md"
      >
        <EstimationForm
          projectId={project.id}
          onSubmit={handleCreateEstimation}
          onCancel={() => setShowModal(null)}
        />
      </Modal>

      <Modal
        isOpen={showModal === 'payment'}
        onClose={() => setShowModal(null)}
        title="Add Payment"
        maxWidth="md"
      >
        <PaymentForm
          projectId={project.id}
          users={users}
          onSubmit={handleCreatePayment}
          onCancel={() => setShowModal(null)}
        />
      </Modal>

      <Modal
        isOpen={showModal === 'milestone'}
        onClose={() => {
          setShowModal(null);
          setSelectedPayment('');
        }}
        title="Add Milestone"
        maxWidth="md"
      >
        <MilestoneForm
          onSubmit={handleCreateMilestone}
          onCancel={() => {
            setShowModal(null);
            setSelectedPayment('');
          }}
        />
      </Modal>
    </div>
  );
};