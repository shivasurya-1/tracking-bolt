import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ProjectDetail } from '../../components/budgeting/ProjectDetail';

export const ProjectDetailPage: React.FC = () => {
  return (
    <Layout>
      <ProjectDetail />
    </Layout>
  );
};