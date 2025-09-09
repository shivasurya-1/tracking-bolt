import React, { useState } from 'react';
import { AdditionalRequest } from '../../../types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { DollarSign, FileText } from 'lucide-react';

interface RequestFormProps {
  projectId: string;
  onSubmit: (requestData: Omit<AdditionalRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'approved_by' | 'approved_at' | 'rejection_reason'>) => void;
  onCancel: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  projectId,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    requested_amount: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.requested_amount) newErrors.requested_amount = 'Amount is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        project: projectId,
        requested_amount: parseFloat(formData.requested_amount),
        reason: formData.reason
      });
    } catch (error) {
      setErrors({ general: 'Failed to create request' });
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

      <Input
        label="Requested Amount"
        type="number"
        icon={DollarSign}
        value={formData.requested_amount}
        onChange={(e) => setFormData({ ...formData, requested_amount: e.target.value })}
        error={errors.requested_amount}
        placeholder="0.00"
        min="0"
        step="0.01"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            placeholder="Explain why additional budget is needed..."
            required
          />
        </div>
        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Request Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Provide detailed justification for the additional budget</li>
          <li>• Include any supporting documentation or estimates</li>
          <li>• Requests will be reviewed by project managers</li>
          <li>• Approval may take 2-3 business days</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Submit Request
        </Button>
      </div>
    </form>
  );
};