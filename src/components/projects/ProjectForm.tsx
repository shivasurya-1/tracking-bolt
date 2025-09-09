import React, { useState, useEffect } from 'react';
import { Project, Client, POC } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FolderOpen, Building2, UserCheck, Calendar, FileText } from 'lucide-react';

interface ProjectFormProps {
  project?: Project | null;
  clients: Client[];
  pocs: POC[];
  onSubmit: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'client_name' | 'poc_name'>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  clients, 
  pocs, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    project_name: project?.project_name || '',
    code: project?.code || '',
    client: project?.client || '',
    poc: project?.poc || '',
    priority: project?.priority || 'Medium' as Project['priority'],
    type: project?.type || 'Fixed Price' as Project['type'],
    start_date: project?.start_date ? project.start_date.split('T')[0] : '',
    end_date: project?.end_date ? project.end_date.split('T')[0] : '',
    description: project?.description || '',
    status: project?.status || 'Planning' as Project['status']
  });
  const [filteredPOCs, setFilteredPOCs] = useState<POC[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.client) {
      setFilteredPOCs(pocs.filter(poc => poc.client === formData.client && poc.active));
      // Reset POC if it doesn't belong to the selected client
      if (formData.poc && !pocs.find(poc => poc.id === formData.poc && poc.client === formData.client)) {
        setFormData(prev => ({ ...prev, poc: '' }));
      }
    } else {
      setFilteredPOCs([]);
      setFormData(prev => ({ ...prev, poc: '' }));
    }
  }, [formData.client, pocs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.project_name) newErrors.project_name = 'Project name is required';
    if (!formData.code) newErrors.code = 'Project code is required';
    if (!formData.client) newErrors.client = 'Client is required';
    if (!formData.poc) newErrors.poc = 'POC is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined
      });
    } catch (error) {
      setErrors({ general: 'Failed to save project' });
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
          label="Project Name"
          icon={FolderOpen}
          value={formData.project_name}
          onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
          error={errors.project_name}
          placeholder="Enter project name"
          required
        />

        <Input
          label="Project Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          error={errors.code}
          placeholder="e.g. PROJ-001"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                  {client.company}
                </option>
              ))}
            </select>
          </div>
          {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Point of Contact</label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={formData.poc}
              onChange={(e) => setFormData({ ...formData, poc: e.target.value })}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.poc ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={!formData.client}
            >
              <option value="">Select POC</option>
              {filteredPOCs.map(poc => (
                <option key={poc.id} value={poc.id}>
                  {poc.name} - {poc.designation}
                </option>
              ))}
            </select>
          </div>
          {errors.poc && <p className="mt-1 text-sm text-red-600">{errors.poc}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Project['priority'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Project['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Fixed Price">Fixed Price</option>
            <option value="Time & Material">Time & Material</option>
            <option value="Retainer">Retainer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          icon={Calendar}
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          error={errors.start_date}
          required
        />

        <Input
          label="End Date (Optional)"
          type="date"
          icon={Calendar}
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Enter project description"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};