import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getStatus();
      if (response.data.isAuthenticated && allowedRoles.includes(response.data.user.role)) {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthorized) return <Navigate to="/login" />;
  
  return <>{children}</>;
}