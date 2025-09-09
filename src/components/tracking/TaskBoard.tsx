import React, { useState, useEffect } from 'react';
import { Plus, User, Calendar, AlertCircle } from 'lucide-react';
import { Task, User as UserType, Project } from '../../types';
import { TrackingService } from '../../services/api';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { TaskForm } from './TaskForm';

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const statuses: Task['status'][] = ['Open', 'Working', 'Waiting for Client', 'Closed'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, usersData, projectsData] = await Promise.all([
        TrackingService.getTasks(),
        TrackingService.getUsers(),
        TrackingService.getProjects()
      ]);
      setTasks(tasksData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await TrackingService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await TrackingService.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 border-blue-200';
      case 'Working': return 'bg-yellow-100 border-yellow-200';
      case 'Waiting for Client': return 'bg-orange-100 border-orange-200';
      case 'Closed': return 'bg-green-100 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
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
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div key={status} className={`rounded-lg border-2 border-dashed p-4 ${getStatusColor(status)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status}</h3>
              <span className="bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-600">
                {getTasksByStatus(status).length}
              </span>
            </div>

            <div className="space-y-3">
              {getTasksByStatus(status).map((task) => (
                <Card
                  key={task.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  padding="none"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                      <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>

                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {getUserName(task.assignedUserId)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getProjectName(task.projectId)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Task"
        maxWidth="lg"
      >
        <TaskForm
          users={users}
          projects={projects}
          onSubmit={handleCreateTask}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};