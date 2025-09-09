import React, { useState } from 'react';
import { POC, Client } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User, Mail, Phone, Briefcase, Building2 } from 'lucide-react';

interface POCFormProps {
  poc?: POC | null;
  clients: Client[];
  onSubmit: (pocData: Omit<POC, 'id' | 'created_at' | 'updated_at' | 'client_name'>) => void;
  onCancel: () => void;
}

export const POCForm: React.FC<POCFormProps> = ({ poc, clients, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: poc?.name || '',
    email: poc?.email || '',
    phone: poc?.phone || '',
    designation: poc?.designation || '',
    client: poc?.client || '',
    active: poc?.active ?? true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.client) newErrors.client = 'Client is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ general: 'Failed to save POC' });
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
        label="Full Name"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="Enter full name"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="Enter email address"
          required
        />

        <Input
          label="Phone"
          icon={Phone}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          placeholder="Enter phone number"
          required
        />
      </div>

      <Input
        label="Designation"
        icon={Briefcase}
        value={formData.designation}
        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
        error={errors.designation}
        placeholder="Enter designation"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.client ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select client</option>
            {clients.filter(c => c.active).map(client => (
              <option key={client.id} value={client.id}>
                {client.company} - {client.client_name}
              </option>
            ))}
          </select>
        </div>
        {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
          Active POC
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {poc ? 'Update POC' : 'Create POC'}
        </Button>
      </div>
    </form>
  );
};