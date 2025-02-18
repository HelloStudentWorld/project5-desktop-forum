import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;