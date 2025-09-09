import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, FolderOpen, DollarSign, Settings, BarChart3, CheckSquare, Building2, UserCheck } from 'lucide-react';

const navigation = [
  {
    name: 'Clients',
    children: [
      { name: 'Clients', href: '/clients', icon: Building2 },
      { name: 'POCs', href: '/pocs', icon: UserCheck },
    ]
  },
  {
    name: 'Projects',
    children: [
      { name: 'Projects', href: '/projects', icon: FolderOpen },
    ]
  },
  {
    name: 'Other',
    children: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      
      <nav className="px-3">
        {navigation.map((section) => (
          <div key={section.name} className="mb-8">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.name}
            </h3>
            <div className="space-y-1">
              {section.children.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};