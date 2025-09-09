import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthForm } from '../../components/auth/AuthForm';
import { useNavigate, Link } from 'react-router-dom';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (data: any) => {
    await signup(data.email, data.password, data.name);
    navigate('/clients');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm mode="signup" onSubmit={handleSignup} />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};