import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { selectIsAuthenticated, selectUserRole } from '../redux/features/auth/authSlice';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  useEffect(() => {
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่มีสิทธิ์เข้าถึง',
        text: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3B82F6',
        allowOutsideClick: false,
      }).then(() => {
        setShouldRedirect(true);
      });
    }
  }, [allowedRoles, userRole]);

  // Redirect after alert is confirmed
  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  // If there are allowed roles and user's role isn't in them, don't render children yet
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null; // Wait for alert to show
  }

  return children;
};

export default ProtectedRoute;