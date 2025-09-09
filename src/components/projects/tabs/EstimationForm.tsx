import React, { useState } from 'react';
import { Estimation } from '../../../types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { Calculator, User, Calendar, DollarSign, FileText } from 'lucide-react';

interface EstimationFormProps {
  projectId: string;
  estimation?: Estimation | null;
  onSubmit: (estimationData: Omit<Estimation, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export const EstimationForm: React.FC<EstimationFormProps> = ({
  projectId,
  estimation,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    version: estimation?.version || '',
    date: estimation?.date ? estimation.date.split('T')[0] : '',
    provider: estimation?.provider || '',
    review_date: estimation?.review_date ? estimation.review_date.split('T')[0] : '',
    client_review_date: estimation?.client_review_date ? estimation.client_review_date.split('T')[0] : '',
    development_amount: estimation?.development_amount?.toString() || '',
    testing_amount: estimation?.testing_amount?.toString() || '',
    project_management_amount: estimation?.project_management_amount?.toString() || '',
    approval_status: estimation?.approval_status || 'Pending' as Estimation['approval_status'],
    po_status: estimation?.po_status || 'Not Received' as Estimation['po_status'],
    notes: estimation?.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = 
    parseFloat(formData.development_amount || '0') +
    parseFloat(formData.testing_amount || '0') +
    parseFloat(formData.project_management_amount || '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.version) newErrors.version = 'Version is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.provider) newErrors.provider = 'Provider is required';
    if (!formData.development_amount) newErrors.development_amount = 'Development amount is required';
    if (!formData.testing_amount) newErrors.testing_amount = 'Testing amount is required';
    if (!formData.project_management_amount) newErrors.project_management_amount = 'PM amount is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        project: projectId,
        version: formData.version,
        date: new Date(formData.date).toISOString(),
        provider: formData.provider,
        review_date: formData.review_date ? new Date(formData.review_date).toISOString() : undefined,
        client_review_date: formData.client_review_date ? new Date(formData.client_review_date).toISOString() : undefined,
        development_amount: parseFloat(formData.development_amount),
        testing_amount: parseFloat(formData.testing_amount),
        project_management_amount: parseFloat(formData.project_management_amount),
        total_amount: totalAmount,
        approval_status: formData.approval_status,
        po_status: formData.po_status,
        notes: formData.notes
      });
    } catch (error) {
      setErrors({ general: 'Failed to save estimation' });
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
        <Input
          label="Version"
          icon={Calculator}
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          error={errors.version}
          placeholder="e.g. v1.0"
          required
        />

        <Input
          label="Date"
          type="date"
          icon={Calendar}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        <Input
          label="Provider"
          icon={User}
          value={formData.provider}
          onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
          error={errors.provider}
          placeholder="Provider name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Review Date"
          type="date"
          icon={Calendar}
          value={formData.review_date}
          onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
        />

        <Input
          label="Client Review Date"
          type="date"
          icon={Calendar}
          value={formData.client_review_date}
          onChange={(e) => setFormData({ ...formData, client_review_date: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Development Amount"
          type="number"
          icon={DollarSign}
          value={formData.development_amount}
          onChange={(e) => setFormData({ ...formData, development_amount: e.target.value })}
          error={errors.development_amount}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="Testing Amount"
          type="number"
          icon={DollarSign}
          value={formData.testing_amount}
          onChange={(e) => setFormData({ ...formData, testing_amount: e.target.value })}
          error={errors.testing_amount}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="PM Amount"
          type="number"
          icon={DollarSign}
          value={formData.project_management_amount}
          onChange={(e) => setFormData({ ...formData, project_management_amount: e.target.value })}
          error={errors.project_management_amount}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Amount:</span>
          <span className="text-xl font-bold text-blue-600">
            ${isNaN(totalAmount) ? '0.00' : totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
          <select
            value={formData.approval_status}
            onChange={(e) => setFormData({ ...formData, approval_status: e.target.value as Estimation['approval_status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PO Status</label>
          <select
            value={formData.po_status}
            onChange={(e) => setFormData({ ...formData, po_status: e.target.value as Estimation['po_status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Not Received">Not Received</option>
            <option value="Received">Received</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
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
          {estimation ? 'Update Estimation' : 'Create Estimation'}
        </Button>
      </div>
    </form>
  );
};