import React, { useState } from 'react';
import { Plus, Edit, Trash2, DollarSign, AlertTriangle } from 'lucide-react';
import { Payment } from '../../../types';
import { PaymentService } from '../../../services/paymentService';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Table } from '../../common/Table';
import { StatusBadge } from '../../common/StatusBadge';
import { PaymentForm } from './PaymentForm';
import toast from 'react-hot-toast';

interface PaymentTabProps {
  projectId: string;
  payments: Payment[];
  onPaymentsChange: (payments: Payment[]) => void;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({
  projectId,
  payments,
  onPaymentsChange
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const handleCreatePayment = async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPayment = await PaymentService.createPayment(paymentData);
      onPaymentsChange([...payments, newPayment]);
      setShowModal(false);
      toast.success('Payment created successfully');
    } catch (error) {
      toast.error('Failed to create payment');
      console.error('Failed to create payment:', error);
    }
  };

  const handleUpdatePayment = async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingPayment) return;
    
    try {
      const updatedPayment = await PaymentService.updatePayment(editingPayment.id, paymentData);
      onPaymentsChange(payments.map(p => p.id === editingPayment.id ? updatedPayment : p));
      setShowModal(false);
      setEditingPayment(null);
      toast.success('Payment updated successfully');
    } catch (error) {
      toast.error('Failed to update payment');
      console.error('Failed to update payment:', error);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      await PaymentService.deletePayment(id);
      onPaymentsChange(payments.filter(p => p.id !== id));
      toast.success('Payment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete payment');
      console.error('Failed to delete payment:', error);
    }
  };

  const columns = [
    {
      key: 'payment_type',
      header: 'Type',
      render: (payment: Payment) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium">{payment.payment_type}</span>
        </div>
      )
    },
    {
      key: 'resource',
      header: 'Resource',
      render: (payment: Payment) => payment.resource
    },
    {
      key: 'currency',
      header: 'Currency',
      render: (payment: Payment) => (
        <span className="text-sm font-mono">{payment.currency}</span>
      )
    },
    {
      key: 'approved_budget',
      header: 'Budget',
      render: (payment: Payment) => (
        <span className="font-semibold">${payment.approved_budget.toLocaleString()}</span>
      )
    },
    {
      key: 'payout',
      header: 'Payout',
      render: (payment: Payment) => (
        <span className="font-semibold text-green-600">${payment.payout.toLocaleString()}</span>
      )
    },
    {
      key: 'utilization_percentage',
      header: 'Utilization',
      render: (payment: Payment) => (
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${payment.utilization_percentage >= 90 ? 'text-green-600' : payment.utilization_percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {payment.utilization_percentage}%
          </span>
          {payment.is_exceeded && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
      )
    },
    {
      key: 'is_exceeded',
      header: 'Status',
      render: (payment: Payment) => (
        <StatusBadge 
          status={payment.is_exceeded ? 'Exceeded' : 'Within Budget'} 
          variant={payment.is_exceeded ? 'error' : 'success'}
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (payment: Payment) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => {
              setEditingPayment(payment);
              setShowModal(true);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDeletePayment(payment.id)}
          />
        </div>
      )
    }
  ];

  const totalBudget = payments.reduce((sum, p) => sum + p.approved_budget, 0);
  const totalPayout = payments.reduce((sum, p) => sum + p.payout, 0);
  const totalRetention = payments.reduce((sum, p) => sum + p.retention, 0);
  const totalPenalty = payments.reduce((sum, p) => sum + p.penalty, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Project Payments</h3>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Payment
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Budget</div>
          <div className="text-2xl font-bold text-blue-900">${totalBudget.toLocaleString()}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Total Payout</div>
          <div className="text-2xl font-bold text-green-900">${totalPayout.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600 font-medium">Total Retention</div>
          <div className="text-2xl font-bold text-yellow-900">${totalRetention.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-red-600 font-medium">Total Penalty</div>
          <div className="text-2xl font-bold text-red-900">${totalPenalty.toLocaleString()}</div>
        </div>
      </div>

      <Table
        data={payments}
        columns={columns}
        emptyMessage="No payments found"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPayment(null);
        }}
        title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
        maxWidth="lg"
      >
        <PaymentForm
          projectId={projectId}
          payment={editingPayment}
          onSubmit={editingPayment ? handleUpdatePayment : handleCreatePayment}
          onCancel={() => {
            setShowModal(false);
            setEditingPayment(null);
          }}
        />
      </Modal>
    </div>
  );
};