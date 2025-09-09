import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        
        <Card className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Page</h3>
          <p className="text-gray-600">
            This page will contain application settings, user preferences, and configuration options.
          </p>
        </Card>
      </div>
    </Layout>
  );
};