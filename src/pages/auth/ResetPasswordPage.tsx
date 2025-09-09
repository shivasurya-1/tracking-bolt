import React from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { AuthService } from '../../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || 'reset-token-demo';

  const handleResetPassword = async ({ password }: { password: string }) => {
    await AuthService.resetPassword(token, password);
    alert('Password reset successfully! You can now log in.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm mode="reset" onSubmit={handleResetPassword} />
    </div>
  );
};