import React, { useState } from 'react';
import { Payment } from '../../../types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { DollarSign, User, Percent } from 'lucide-react';

interface PaymentFormProps {
  projectId: string;
  payment?: Payment | null;
  onSubmit: (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  projectId,
  payment,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    payment_type: payment?.payment_type || 'Development' as Payment['payment_type'],
    resource: payment?.resource || '',
    currency: payment?.currency || 'USD' as Payment['currency'],
    approved_budget: payment?.approved_budget?.toString() || '',
    additional_amount: payment?.additional_amount?.toString() || '0',
    payout: payment?.payout?.toString() || '',
    retention: payment?.retention?.toString() || '0',
    penalty: payment?.penalty?.toString() || '0',
    utilization_percentage: payment?.utilization_percentage?.toString() || '0'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isExceeded = parseFloat(formData.payout || '0') > parseFloat(formData.approved_budget || '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.resource) newErrors.resource = 'Resource is required';
    if (!formData.approved_budget) newErrors.approved_budget = 'Approved budget is required';
    if (!formData.payout) newErrors.payout = 'Payout is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        project: projectId,
        payment_type: formData.payment_type,
        resource: formData.resource,
        currency: formData.currency,
        approved_budget: parseFloat(formData.approved_budget),
        additional_amount: parseFloat(formData.additional_amount),
        payout: parseFloat(formData.payout),
        retention: parseFloat(formData.retention),
        penalty: parseFloat(formData.penalty),
        utilization_percentage: parseFloat(formData.utilization_percentage),
        is_exceeded: isExceeded
      });
    } catch (error) {
      setErrors({ general: 'Failed to save payment' });
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
          <select
            value={formData.payment_type}
            onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as Payment['payment_type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Project Management">Project Management</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Resource"
          icon={User}
          value={formData.resource}
          onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
          error={errors.resource}
          placeholder="e.g. Frontend Team"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value as Payment['currency'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Approved Budget"
          type="number"
          icon={DollarSign}
          value={formData.approved_budget}
          onChange={(e) => setFormData({ ...formData, approved_budget: e.target.value })}
          error={errors.approved_budget}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="Additional Amount"
          type="number"
          icon={DollarSign}
          value={formData.additional_amount}
          onChange={(e) => setFormData({ ...formData, additional_amount: e.target.value })}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Payout"
          type="number"
          icon={DollarSign}
          value={formData.payout}
          onChange={(e) => setFormData({ ...formData, payout: e.target.value })}
          error={errors.payout}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="Retention"
          type="number"
          icon={DollarSign}
          value={formData.retention}
          onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <Input
          label="Penalty"
          type="number"
          icon={DollarSign}
          value={formData.penalty}
          onChange={(e) => setFormData({ ...formData, penalty: e.target.value })}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <Input
        label="Utilization Percentage"
        type="number"
        icon={Percent}
        value={formData.utilization_percentage}
        onChange={(e) => setFormData({ ...formData, utilization_percentage: e.target.value })}
        placeholder="0"
        min="0"
        max="100"
      />

      {isExceeded && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="font-medium">⚠️ Budget Exceeded</span>
          </div>
          <div className="text-sm mt-1">
            Payout (${parseFloat(formData.payout || '0').toLocaleString()}) exceeds approved budget (${parseFloat(formData.approved_budget || '0').toLocaleString()})
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {payment ? 'Update Payment' : 'Create Payment'}
        </Button>
      </div>
    </form>
  );
};