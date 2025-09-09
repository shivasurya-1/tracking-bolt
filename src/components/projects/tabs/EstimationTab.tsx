import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calculator } from 'lucide-react';
import { Estimation } from '../../../types';
import { EstimationService } from '../../../services/estimationService';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Table } from '../../common/Table';
import { StatusBadge } from '../../common/StatusBadge';
import { EstimationForm } from './EstimationForm';
import toast from 'react-hot-toast';

interface EstimationTabProps {
  projectId: string;
  estimations: Estimation[];
  onEstimationsChange: (estimations: Estimation[]) => void;
}

export const EstimationTab: React.FC<EstimationTabProps> = ({
  projectId,
  estimations,
  onEstimationsChange
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEstimation, setEditingEstimation] = useState<Estimation | null>(null);

  const handleCreateEstimation = async (estimationData: Omit<Estimation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newEstimation = await EstimationService.createEstimation(estimationData);
      onEstimationsChange([...estimations, newEstimation]);
      setShowModal(false);
      toast.success('Estimation created successfully');
    } catch (error) {
      toast.error('Failed to create estimation');
      console.error('Failed to create estimation:', error);
    }
  };

  const handleUpdateEstimation = async (estimationData: Omit<Estimation, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingEstimation) return;
    
    try {
      const updatedEstimation = await EstimationService.updateEstimation(editingEstimation.id, estimationData);
      onEstimationsChange(estimations.map(e => e.id === editingEstimation.id ? updatedEstimation : e));
      setShowModal(false);
      setEditingEstimation(null);
      toast.success('Estimation updated successfully');
    } catch (error) {
      toast.error('Failed to update estimation');
      console.error('Failed to update estimation:', error);
    }
  };

  const handleDeleteEstimation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this estimation?')) return;
    
    try {
      await EstimationService.deleteEstimation(id);
      onEstimationsChange(estimations.filter(e => e.id !== id));
      toast.success('Estimation deleted successfully');
    } catch (error) {
      toast.error('Failed to delete estimation');
      console.error('Failed to delete estimation:', error);
    }
  };

  const getApprovalColor = (status: Estimation['approval_status']) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const getPOColor = (status: Estimation['po_status']) => {
    switch (status) {
      case 'Received': return 'success';
      case 'Partial': return 'warning';
      case 'Not Received': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'version',
      header: 'Version',
      render: (estimation: Estimation) => (
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{estimation.version}</span>
        </div>
      )
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (estimation: Estimation) => estimation.provider
    },
    {
      key: 'amounts',
      header: 'Breakdown',
      render: (estimation: Estimation) => (
        <div className="text-sm">
          <div>Dev: ${estimation.development_amount.toLocaleString()}</div>
          <div>Test: ${estimation.testing_amount.toLocaleString()}</div>
          <div>PM: ${estimation.project_management_amount.toLocaleString()}</div>
        </div>
      )
    },
    {
      key: 'total_amount',
      header: 'Total',
      render: (estimation: Estimation) => (
        <span className="font-semibold text-lg">${estimation.total_amount.toLocaleString()}</span>
      )
    },
    {
      key: 'approval_status',
      header: 'Approval',
      render: (estimation: Estimation) => (
        <StatusBadge 
          status={estimation.approval_status} 
          variant={getApprovalColor(estimation.approval_status)}
        />
      )
    },
    {
      key: 'po_status',
      header: 'PO Status',
      render: (estimation: Estimation) => (
        <StatusBadge 
          status={estimation.po_status} 
          variant={getPOColor(estimation.po_status)}
        />
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (estimation: Estimation) => new Date(estimation.date).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (estimation: Estimation) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => {
              setEditingEstimation(estimation);
              setShowModal(true);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDeleteEstimation(estimation.id)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Project Estimations</h3>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Estimation
        </Button>
      </div>

      <Table
        data={estimations}
        columns={columns}
        emptyMessage="No estimations found"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEstimation(null);
        }}
        title={editingEstimation ? 'Edit Estimation' : 'Add New Estimation'}
        maxWidth="lg"
      >
        <EstimationForm
          projectId={projectId}
          estimation={editingEstimation}
          onSubmit={editingEstimation ? handleUpdateEstimation : handleCreateEstimation}
          onCancel={() => {
            setShowModal(false);
            setEditingEstimation(null);
          }}
        />
      </Modal>
    </div>
  );
};