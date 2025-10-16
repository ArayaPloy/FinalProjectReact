import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/features/auth/authSlice';

export const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // ถ้า authenticated แล้ว ให้ redirect ไปที่หน้าแรก
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ถ้ายังไม่ได้ login ให้แสดงหน้าปกติ
  return children;
};

export default PublicRoute;