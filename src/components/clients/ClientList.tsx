import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import { Client } from '../../types';
import { ClientService } from '../../services/clientService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Table } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { ClientForm } from './ClientForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await ClientService.getClients();
      setClients(data);
    } catch (error) {
      toast.error('Failed to load clients');
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newClient = await ClientService.createClient(clientData);
      setClients([...clients, newClient]);
      setShowModal(false);
      toast.success('Client created successfully');
    } catch (error) {
      toast.error('Failed to create client');
      console.error('Failed to create client:', error);
    }
  };

  const handleUpdateClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingClient) return;
    
    try {
      const updatedClient = await ClientService.updateClient(editingClient.id, clientData);
      setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
      setShowModal(false);
      setEditingClient(null);
      toast.success('Client updated successfully');
    } catch (error) {
      toast.error('Failed to update client');
      console.error('Failed to update client:', error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
      await ClientService.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client');
      console.error('Failed to delete client:', error);
    }
  };

  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (client: Client) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{client.company}</div>
            <div className="text-sm text-gray-500">{client.client_name}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Contact',
      render: (client: Client) => (
        <div>
          <div className="text-sm text-gray-900">{client.email}</div>
          <div className="text-sm text-gray-500">{client.phone}</div>
        </div>
      )
    },
    {
      key: 'active',
      header: 'Status',
      render: (client: Client) => (
        <StatusBadge 
          status={client.active ? 'Active' : 'Inactive'} 
          variant={client.active ? 'success' : 'error'}
        />
      )
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (client: Client) => new Date(client.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (client: Client) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${client.id}`);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              setEditingClient(client);
              setShowModal(true);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClient(client.id);
            }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Client
        </Button>
      </div>

      <Card>
        <Table
          data={clients}
          columns={columns}
          loading={loading}
          emptyMessage="No clients found"
          onRowClick={(client) => navigate(`/clients/${client.id}`)}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        maxWidth="md"
      >
        <ClientForm
          client={editingClient}
          onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
          onCancel={() => {
            setShowModal(false);
            setEditingClient(null);
          }}
        />
      </Modal>
    </div>
  );
};