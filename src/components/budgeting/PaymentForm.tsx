import React, { useState } from 'react';
import { Payment, User } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { DollarSign, FileText } from 'lucide-react';

interface PaymentFormProps {
  projectId: string;
  users: User[];
  onSubmit: (paymentData: Omit<Payment, 'id' | 'createdAt' | 'milestones'>) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ projectId, users, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    resourceType: 'manpower' as Payment['resourceType'],
    description: '',
    assignedUserId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.resourceType === 'manpower' && !formData.assignedUserId) {
      newErrors.assignedUserId = 'User assignment is required for manpower';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        projectId,
        amount: parseFloat(formData.amount),
        resourceType: formData.resourceType,
        description: formData.description,
        assignedUserId: formData.resourceType === 'manpower' ? formData.assignedUserId : undefined
      });
    } catch (error) {
      setErrors({ general: 'Failed to create payment' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount ($)"
          type="number"
          icon={DollarSign}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
          <select
            value={formData.resourceType}
            onChange={(e) => setFormData({ ...formData, resourceType: e.target.value as Payment['resourceType'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="manpower">Manpower</option>
            <option value="tools">Tools</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <Input
        label="Description"
        icon={FileText}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        placeholder="e.g. Frontend development team allocation"
      />

      {formData.resourceType === 'manpower' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign to User</label>
          <select
            value={formData.assignedUserId}
            onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.assignedUserId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role}) - {user.module}
              </option>
            ))}
          </select>
          {errors.assignedUserId && <p className="mt-1 text-sm text-red-600">{errors.assignedUserId}</p>}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Payment
        </Button>
      </div>
    </form>
  );
};