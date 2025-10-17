import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  // If user is authenticated, redirect to appropriate dashboard
  if (userAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // If not authenticated, render the component (login/signup pages)
  return children;
};

export default PublicRoute;





