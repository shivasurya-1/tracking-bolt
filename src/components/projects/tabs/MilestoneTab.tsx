import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, CheckCircle, Clock } from 'lucide-react';
import { Milestone, Payment } from '../../../types';
import { MilestoneService } from '../../../services/milestoneService';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Table } from '../../common/Table';
import { StatusBadge } from '../../common/StatusBadge';
import { MilestoneForm } from './MilestoneForm';
import toast from 'react-hot-toast';

interface MilestoneTabProps {
  payments: Payment[];
}

export const MilestoneTab: React.FC<MilestoneTabProps> = ({ payments }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const data = await MilestoneService.getMilestones();
      setMilestones(data);
    } catch (error) {
      toast.error('Failed to load milestones');
      console.error('Failed to load milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (milestoneData: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMilestone = await MilestoneService.createMilestone(milestoneData);
      setMilestones([...milestones, newMilestone]);
      setShowModal(false);
      setSelectedPayment('');
      toast.success('Milestone created successfully');
    } catch (error) {
      toast.error('Failed to create milestone');
      console.error('Failed to create milestone:', error);
    }
  };

  const handleUpdateMilestone = async (milestoneData: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingMilestone) return;
    
    try {
      const updatedMilestone = await MilestoneService.updateMilestone(editingMilestone.id, milestoneData);
      setMilestones(milestones.map(m => m.id === editingMilestone.id ? updatedMilestone : m));
      setShowModal(false);
      setEditingMilestone(null);
      toast.success('Milestone updated successfully');
    } catch (error) {
      toast.error('Failed to update milestone');
      console.error('Failed to update milestone:', error);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      await MilestoneService.deleteMilestone(id);
      setMilestones(milestones.filter(m => m.id !== id));
      toast.success('Milestone deleted successfully');
    } catch (error) {
      toast.error('Failed to delete milestone');
      console.error('Failed to delete milestone:', error);
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Overdue': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'In Progress': return Clock;
      case 'Overdue': return Target;
      case 'Pending': return Target;
      default: return Target;
    }
  };

  const getPaymentName = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    return payment ? `${payment.payment_type} - ${payment.resource}` : 'Unknown Payment';
  };

  const columns = [
    {
      key: 'name',
      header: 'Milestone',
      render: (milestone: Milestone) => {
        const StatusIcon = getStatusIcon(milestone.status);
        return (
          <div className="flex items-center space-x-3">
            <StatusIcon className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">{milestone.name}</div>
              <div className="text-sm text-gray-500">{getPaymentName(milestone.payment)}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (milestone: Milestone) => (
        <span className="font-semibold">${milestone.amount.toLocaleString()}</span>
      )
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (milestone: Milestone) => {
        const dueDate = new Date(milestone.due_date);
        const isOverdue = dueDate < new Date() && milestone.status !== 'Completed';
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (milestone: Milestone) => (
        <StatusBadge 
          status={milestone.status} 
          variant={getStatusColor(milestone.status)}
        />
      )
    },
    {
      key: 'completion_date',
      header: 'Completed',
      render: (milestone: Milestone) => (
        milestone.completion_date ? new Date(milestone.completion_date).toLocaleDateString() : '-'
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (milestone: Milestone) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => {
              setEditingMilestone(milestone);
              setShowModal(true);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDeleteMilestone(milestone.id)}
          />
        </div>
      )
    }
  ];

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const completedAmount = milestones
    .filter(m => m.status === 'Completed')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
        <div className="flex items-center space-x-3">
          {payments.length > 0 && (
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Payment</option>
              {payments.map(payment => (
                <option key={payment.id} value={payment.id}>
                  {payment.payment_type} - {payment.resource}
                </option>
              ))}
            </select>
          )}
          <Button 
            icon={Plus} 
            onClick={() => setShowModal(true)}
            disabled={payments.length === 0}
          >
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Milestone Value</div>
          <div className="text-2xl font-bold text-blue-900">${totalAmount.toLocaleString()}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Completed Value</div>
          <div className="text-2xl font-bold text-green-900">${completedAmount.toLocaleString()}</div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No payments available. Create payments first to add milestones.</p>
        </div>
      ) : (
        <Table
          data={milestones}
          columns={columns}
          loading={loading}
          emptyMessage="No milestones found"
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMilestone(null);
          setSelectedPayment('');
        }}
        title={editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
        maxWidth="md"
      >
        <MilestoneForm
          payments={payments}
          milestone={editingMilestone}
          selectedPayment={selectedPayment}
          onSubmit={editingMilestone ? handleUpdateMilestone : handleCreateMilestone}
          onCancel={() => {
            setShowModal(false);
            setEditingMilestone(null);
            setSelectedPayment('');
          }}
        />
      </Modal>
    </div>
  );
};