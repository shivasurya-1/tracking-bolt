import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ClientDetail } from '../../components/clients/ClientDetail';

export const ClientDetailPage: React.FC = () => {
  return (
    <Layout>
      <ClientDetail />
    </Layout>
  );
};