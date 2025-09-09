import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { TaskBoard } from '../../components/tracking/TaskBoard';

export const TasksPage: React.FC = () => {
  return (
    <Layout>
      <TaskBoard />
    </Layout>
  );
};