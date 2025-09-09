import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthForm } from '../../components/auth/AuthForm';
import { useNavigate, Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    await login(email, password);
    navigate('/clients');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm mode="login" onSubmit={handleLogin} />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </Link>
        </p>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p><strong>Demo Login:</strong></p>
          <p>Email: admin@company.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};