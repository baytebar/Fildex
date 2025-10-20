import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated: userAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated: adminAuthenticated } = useSelector((state) => state.admin);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigated.current) {
      hasNavigated.current = false;
      return;
    }

    const currentPath = location.pathname;
    
    // Check if trying to access admin routes without admin authentication
    if (currentPath.startsWith('/admin') && !adminAuthenticated) {
      hasNavigated.current = true;
      navigate('/admin-login', { 
        state: { from: location },
        replace: true 
      });
      return;
    }
    
    // Check if trying to access user routes without user authentication
    // Only check for protected user routes, not the home page
    if (currentPath === '/jobs' && !userAuthenticated) {
      hasNavigated.current = true;
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
      return;
    }
    
    // Check if trying to access login/signup when already authenticated
    if ((currentPath === '/login' || currentPath === '/signup') && userAuthenticated) {
      hasNavigated.current = true;
      navigate('/', { replace: true });
      return;
    }
    
    // Check if trying to access admin-login when already admin authenticated
    if (currentPath === '/admin-login' && adminAuthenticated) {
      hasNavigated.current = true;
      navigate('/admin', { replace: true });
      return;
    }
  }, [location.pathname, userAuthenticated, adminAuthenticated, navigate, location]);

  return children;
};

export default AuthChecker;
