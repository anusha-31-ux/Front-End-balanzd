import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected Route Component
 * Checks if user is authenticated before allowing access
 * Redirects to login if no auth token is found
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login/admin-portal" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
