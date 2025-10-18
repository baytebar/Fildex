import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserOnlyRoute = ({ children }) => {
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  // Allow both users and admins to access the home page
  // Admins can access the home page when clicking the logo
  return children;
};

export default UserOnlyRoute;








