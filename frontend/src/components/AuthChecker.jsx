import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if trying to access admin routes
    if (currentPath.startsWith('/admin')) {
      if (!adminAuthenticated) {
        // If not admin, redirect to admin login
        navigate('/admin-login', { 
          state: { from: location },
          replace: true 
        });
        return;
      }
    }
    
    // Check if admin is trying to access user-facing pages
    // Allow admin to access home page but redirect from other user pages
    if (adminAuthenticated && !userAuthenticated) {
      if (currentPath === '/jobs' || currentPath === '/careers') {
        navigate('/admin', { replace: true });
        return;
      }
    }
    
    // Check if trying to access login/signup when already authenticated
    if (currentPath === '/login' || currentPath === '/signup') {
      if (userAuthenticated) {
        navigate('/', { replace: true });
        return;
      }
      if (adminAuthenticated) {
        navigate('/admin', { replace: true });
        return;
      }
    }
  }, [location, userAuthenticated, adminAuthenticated, navigate]);

  return children;
};

export default AuthChecker;
