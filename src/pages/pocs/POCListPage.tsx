import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { POCList } from '../../components/pocs/POCList';

export const POCListPage: React.FC = () => {
  return (
    <Layout>
      <POCList />
    </Layout>
  );
};