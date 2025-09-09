import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ProjectDetail } from '../../components/projects/ProjectDetail';

export const ProjectDetailPage: React.FC = () => {
  return (
    <Layout>
      <ProjectDetail />
    </Layout>
  );
};