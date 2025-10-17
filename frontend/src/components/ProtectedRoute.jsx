import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  // Check if user is authenticated as any role
  const isAuthenticated = userAuthenticated || adminAuthenticated;
  
  // Determine user role
  const userRole = userAuthenticated ? 'user' : adminAuthenticated ? 'admin' : null;

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and user doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's actual role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'user') {
      return <Navigate to="/" replace />;
    }
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;








