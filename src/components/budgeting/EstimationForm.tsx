import React, { useState } from 'react';
import { Estimation } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Calculator, Clock, DollarSign } from 'lucide-react';

interface EstimationFormProps {
  projectId: string;
  onSubmit: (estimationData: Omit<Estimation, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const EstimationForm: React.FC<EstimationFormProps> = ({ projectId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    hours: '',
    hourlyRate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = parseFloat(formData.hours || '0') * parseFloat(formData.hourlyRate || '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.hours) newErrors.hours = 'Hours is required';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        projectId,
        category: formData.category,
        hours: parseFloat(formData.hours),
        hourlyRate: parseFloat(formData.hourlyRate),
        totalAmount
      });
    } catch (error) {
      setErrors({ general: 'Failed to create estimation' });
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
        label="Category"
        icon={Calculator}
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
        placeholder="e.g. Frontend Development, Backend Development"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hours"
          type="number"
          icon={Clock}
          value={formData.hours}
          onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
          error={errors.hours}
          placeholder="0"
          min="0"
          step="0.5"
        />

        <Input
          label="Hourly Rate ($)"
          type="number"
          icon={DollarSign}
          value={formData.hourlyRate}
          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
          error={errors.hourlyRate}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Amount:</span>
          <span className="text-xl font-bold text-blue-600">
            ${isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Estimation
        </Button>
      </div>
    </form>
  );
};