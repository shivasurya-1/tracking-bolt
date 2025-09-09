import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ProjectList } from '../../components/projects/ProjectList';

export const ProjectListPage: React.FC = () => {
  return (
    <Layout>
      <ProjectList />
    </Layout>
  );
};