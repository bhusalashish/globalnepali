import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import type { RootState } from '../store/store';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'editor' | 'user')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User's role is not authorized
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 