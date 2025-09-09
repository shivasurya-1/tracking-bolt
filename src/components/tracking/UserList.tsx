import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { User } from '../../types';
import { TrackingService } from '../../services/api';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { UserForm } from './UserForm';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await TrackingService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const newUser = await TrackingService.createUser(userData);
      setUsers([...users, newUser]);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Accountant': return 'bg-green-100 text-green-800';
      case 'Project Manager': return 'bg-blue-100 text-blue-800';
      case 'Team Leader': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleBadgeColor = (module: User['module']) => {
    switch (module) {
      case 'Frontend': return 'bg-purple-100 text-purple-800';
      case 'Backend': return 'bg-indigo-100 text-indigo-800';
      case 'Web': return 'bg-teal-100 text-teal-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} hoverable className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => setEditingUser(user)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModuleBadgeColor(user.module)}`}>
                  {user.module}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
        maxWidth="md"
      >
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? () => {} : handleCreateUser}
          onCancel={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </div>
  );
};