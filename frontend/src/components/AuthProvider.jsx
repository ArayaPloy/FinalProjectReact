import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../redux/features/auth/authApi';
import { usersApi } from '../redux/features/users/usersApi';
import { setUser, logout } from '../redux/features/auth/authSlice';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // ป้องกัน navigate ซ้ำในกรณี mustChangePassword
  const didForcePasswordChange = useRef(false);

  const { data, error, isLoading } = useGetCurrentUserQuery(undefined, {
    // Never skip: let the backend decide via the httpOnly cookie
  });

  useEffect(() => {
    // ถ้ามี error อย่าประมวลผล data (อาจเป็น stale cache + 401 พร้อมกัน)
    if (error) {
      if (error.status !== 401 && error.status !== 'FETCH_ERROR') {
        console.error('Authentication error:', error);
      }
      dispatch(logout());
      // Reset เฉพาะ usersApi cache (profile data) เท่านั้น
      // ห้าม reset authApi ที่นี่ เพราะจะทำให้ query ถูก clear แล้ว re-subscribe ใหม่ → 401 loop!
      dispatch(usersApi.util.resetApiState());
      didForcePasswordChange.current = false;
      return; // หยุดไม่ประมวลผล data ต่อ
    }

    // ประมวลผล data เฉพาะเมื่อไม่มี error
    if (data?.user) {
      dispatch(setUser({ user: data.user }));

      // บังคับเปลี่ยนรหัสผ่านถ้า mustChangePassword = true
      // ใช้ ref ป้องกัน navigate ซ้ำทุกครั้งที่ effect รัน
      if (data.user.mustChangePassword) {
        if (!didForcePasswordChange.current && location.pathname !== '/change-password') {
          didForcePasswordChange.current = true;
          navigate('/change-password', { replace: true });
        }
      } else {
        // reset ref เมื่อ mustChangePassword = false แล้ว
        didForcePasswordChange.current = false;
      }
    }
  // ไม่ใส่ location.pathname ใน dependencies เพื่อป้องกัน navigate loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, dispatch, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>;
  }

  return children;
};

export default AuthProvider;