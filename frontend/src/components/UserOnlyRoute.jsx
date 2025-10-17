import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserOnlyRoute = ({ children }) => {
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  // If admin is authenticated, redirect to admin dashboard
  if (adminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // If not authenticated as user, allow access (public pages)
  // If authenticated as user, allow access
  return children;
};

export default UserOnlyRoute;








