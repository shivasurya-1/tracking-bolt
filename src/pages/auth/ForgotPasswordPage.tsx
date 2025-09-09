import React from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { AuthService } from '../../services/api';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage: React.FC = () => {
  const handleForgotPassword = async ({ email }: { email: string }) => {
    await AuthService.forgotPassword(email);
    alert('Password reset email sent! Check your inbox.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm mode="forgot" onSubmit={handleForgotPassword} />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};