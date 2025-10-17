import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserRoute = ({ children }) => {
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  // If admin is authenticated, redirect to admin dashboard
  if (adminAuthenticated && !userAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // If not authenticated as user, redirect to login
  if (!userAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated as user, render the component
  return children;
};

export default UserRoute;








