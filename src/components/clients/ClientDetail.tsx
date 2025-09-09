import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Edit, Plus } from 'lucide-react';
import { Client, POC } from '../../types';
import { ClientService } from '../../services/clientService';
import { POCService } from '../../services/pocService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [pocs, setPocs] = useState<POC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadClientDetail();
      loadClientPOCs();
    }
  }, [id]);

  const loadClientDetail = async () => {
    if (!id) return;
    
    try {
      const data = await ClientService.getClient(id);
      setClient(data);
    } catch (error) {
      toast.error('Failed to load client details');
      console.error('Failed to load client:', error);
    }
  };

  const loadClientPOCs = async () => {
    if (!id) return;
    
    try {
      const data = await POCService.getPOCsByClient(id);
      setPocs(data);
    } catch (error) {
      toast.error('Failed to load POCs');
      console.error('Failed to load POCs:', error);
    } finally {
      setLoading(false);
    }
  };

  const pocColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (poc: POC) => (
        <div className="font-medium text-gray-900">{poc.name}</div>
      )
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (poc: POC) => (
        <div className="text-sm text-gray-600">{poc.designation}</div>
      )
    },
    {
      key: 'email',
      header: 'Contact',
      render: (poc: POC) => (
        <div>
          <div className="text-sm text-gray-900">{poc.email}</div>
          <div className="text-sm text-gray-500">{poc.phone}</div>
        </div>
      )
    },
    {
      key: 'active',
      header: 'Status',
      render: (poc: POC) => (
        <StatusBadge 
          status={poc.active ? 'Active' : 'Inactive'} 
          variant={poc.active ? 'success' : 'error'}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Client not found</p>
        <Button onClick={() => navigate('/clients')} className="mt-4">
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/clients')}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.company}</h1>
            <p className="text-gray-600">{client.client_name}</p>
          </div>
        </div>
        <Button icon={Edit} onClick={() => navigate(`/clients/${client.id}/edit`)}>
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{client.company}</h3>
                  <StatusBadge 
                    status={client.active ? 'Active' : 'Inactive'} 
                    variant={client.active ? 'success' : 'error'}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{client.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{client.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">{client.address || 'No address provided'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Created: {new Date(client.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {new Date(client.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Points of Contact</h3>
                <Button 
                  icon={Plus} 
                  size="sm"
                  onClick={() => navigate(`/pocs/new?client=${client.id}`)}
                >
                  Add POC
                </Button>
              </div>

              <Table
                data={pocs}
                columns={pocColumns}
                emptyMessage="No POCs found for this client"
                onRowClick={(poc) => navigate(`/pocs/${poc.id}`)}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};