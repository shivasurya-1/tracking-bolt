import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { UserList } from '../../components/tracking/UserList';

export const UsersPage: React.FC = () => {
  return (
    <Layout>
      <UserList />
    </Layout>
  );
};