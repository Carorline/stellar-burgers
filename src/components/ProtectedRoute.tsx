import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';

interface ProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuthenticated = false;
  const location = useLocation();

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
