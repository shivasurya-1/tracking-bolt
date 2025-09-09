import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ProjectList } from '../../components/budgeting/ProjectList';

export const BudgetingProjectsPage: React.FC = () => {
  return (
    <Layout>
      <ProjectList />
    </Layout>
  );
};