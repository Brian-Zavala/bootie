import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const PrivateRoute = ({ requiredRoles = ['student', 'instructor', 'admin'] }) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking authentication
  if (loading || !initialized) {
    return <LoadingSpinner />;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;