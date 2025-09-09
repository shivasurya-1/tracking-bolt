import React, { useState } from 'react';
import { Milestone, Payment } from '../../../types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { Target, DollarSign, Calendar, FileText } from 'lucide-react';

interface MilestoneFormProps {
  payments: Payment[];
  milestone?: Milestone | null;
  selectedPayment?: string;
  onSubmit: (milestoneData: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export const MilestoneForm: React.FC<MilestoneFormProps> = ({
  payments,
  milestone,
  selectedPayment = '',
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    payment: milestone?.payment || selectedPayment,
    name: milestone?.name || '',
    amount: milestone?.amount?.toString() || '',
    due_date: milestone?.due_date ? milestone.due_date.split('T')[0] : '',
    status: milestone?.status || 'Pending' as Milestone['status'],
    completion_date: milestone?.completion_date ? milestone.completion_date.split('T')[0] : '',
    notes: milestone?.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.payment) newErrors.payment = 'Payment is required';
    if (!formData.name) newErrors.name = 'Milestone name is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        payment: formData.payment,
        name: formData.name,
        amount: parseFloat(formData.amount),
        due_date: new Date(formData.due_date).toISOString(),
        status: formData.status,
        completion_date: formData.completion_date ? new Date(formData.completion_date).toISOString() : undefined,
        notes: formData.notes
      });
    } catch (error) {
      setErrors({ general: 'Failed to save milestone' });
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
        <select
          value={formData.payment}
          onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.payment ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select payment</option>
          {payments.map(payment => (
            <option key={payment.id} value={payment.id}>
              {payment.payment_type} - {payment.resource} (${payment.approved_budget.toLocaleString()})
            </option>
          ))}
        </select>
        {errors.payment && <p className="mt-1 text-sm text-red-600">{errors.payment}</p>}
      </div>

      <Input
        label="Milestone Name"
        icon={Target}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="e.g. Frontend Setup Complete"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          icon={DollarSign}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="Due Date"
          type="date"
          icon={Calendar}
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          error={errors.due_date}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Milestone['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {formData.status === 'Completed' && (
          <Input
            label="Completion Date"
            type="date"
            icon={Calendar}
            value={formData.completion_date}
            onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {milestone ? 'Update Milestone' : 'Create Milestone'}
        </Button>
      </div>
    </form>
  );
};