import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'completed', 'approved', 'received'].includes(lowerStatus)) {
      return 'success';
    }
    if (['pending', 'planning', 'in progress'].includes(lowerStatus)) {
      return 'warning';
    }
    if (['rejected', 'cancelled', 'overdue', 'exceeded'].includes(lowerStatus)) {
      return 'error';
    }
    if (['on hold', 'not received'].includes(lowerStatus)) {
      return 'info';
    }
    return 'default';
  };

  const finalVariant = variant === 'default' ? getStatusVariant(status) : variant;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantClasses()} ${className}`}>
      {status}
    </span>
  );
};