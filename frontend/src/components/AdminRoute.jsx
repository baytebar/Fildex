import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  // If user is authenticated as regular user, redirect to home
  if (userAuthenticated && !adminAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated as admin, redirect to login
  if (!adminAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated as admin, render the component
  return children;
};

export default AdminRoute;

