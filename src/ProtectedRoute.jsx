import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the /authentication route, not /authentication/otp
    return <Navigate to="/auth" replace />;
  }

  return children;
};
export default ProtectedRoute;