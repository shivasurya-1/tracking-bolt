import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ClientList } from '../../components/clients/ClientList';

export const ClientListPage: React.FC = () => {
  return (
    <Layout>
      <ClientList />
    </Layout>
  );
};