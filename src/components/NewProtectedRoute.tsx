import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/NewAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  moderatorOnly?: boolean;
}

const NewProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false, 
  moderatorOnly = false 
}) => {
  const { isAuthenticated, isAdmin, isModerator, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (moderatorOnly && !isModerator) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default NewProtectedRoute;
