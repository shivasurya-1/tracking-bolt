import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { POC, Client } from '../../types';
import { POCService } from '../../services/pocService';
import { ClientService } from '../../services/clientService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Table } from '../common/Table';
import { StatusBadge } from '../common/StatusBadge';
import { POCForm } from './POCForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const POCList: React.FC = () => {
  const [pocs, setPocs] = useState<POC[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPOC, setEditingPOC] = useState<POC | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pocsData, clientsData] = await Promise.all([
        POCService.getPOCs(),
        ClientService.getClients()
      ]);
      setPocs(pocsData);
      setClients(clientsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePOC = async (pocData: Omit<POC, 'id' | 'created_at' | 'updated_at' | 'client_name'>) => {
    try {
      const newPOC = await POCService.createPOC(pocData);
      setPocs([...pocs, newPOC]);
      setShowModal(false);
      toast.success('POC created successfully');
    } catch (error) {
      toast.error('Failed to create POC');
      console.error('Failed to create POC:', error);
    }
  };

  const handleUpdatePOC = async (pocData: Omit<POC, 'id' | 'created_at' | 'updated_at' | 'client_name'>) => {
    if (!editingPOC) return;
    
    try {
      const updatedPOC = await POCService.updatePOC(editingPOC.id, pocData);
      setPocs(pocs.map(p => p.id === editingPOC.id ? updatedPOC : p));
      setShowModal(false);
      setEditingPOC(null);
      toast.success('POC updated successfully');
    } catch (error) {
      toast.error('Failed to update POC');
      console.error('Failed to update POC:', error);
    }
  };

  const handleDeletePOC = async (id: string) => {
    if (!confirm('Are you sure you want to delete this POC?')) return;
    
    try {
      await POCService.deletePOC(id);
      setPocs(pocs.filter(p => p.id !== id));
      toast.success('POC deleted successfully');
    } catch (error) {
      toast.error('Failed to delete POC');
      console.error('Failed to delete POC:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (poc: POC) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{poc.name}</div>
            <div className="text-sm text-gray-500">{poc.designation}</div>
          </div>
        </div>
      )
    },
    {
      key: 'client_name',
      header: 'Client',
      render: (poc: POC) => (
        <div className="text-sm text-gray-900">{poc.client_name}</div>
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
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (poc: POC) => new Date(poc.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (poc: POC) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pocs/${poc.id}`);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              setEditingPOC(poc);
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
              handleDeletePOC(poc.id);
            }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Points of Contact</h1>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add POC
        </Button>
      </div>

      <Card>
        <Table
          data={pocs}
          columns={columns}
          loading={loading}
          emptyMessage="No POCs found"
          onRowClick={(poc) => navigate(`/pocs/${poc.id}`)}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPOC(null);
        }}
        title={editingPOC ? 'Edit POC' : 'Add New POC'}
        maxWidth="md"
      >
        <POCForm
          poc={editingPOC}
          clients={clients}
          onSubmit={editingPOC ? handleUpdatePOC : handleCreatePOC}
          onCancel={() => {
            setShowModal(false);
            setEditingPOC(null);
          }}
        />
      </Modal>
    </div>
  );
};