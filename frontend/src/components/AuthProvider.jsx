import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../redux/features/auth/authApi';
import { usersApi } from '../redux/features/users/usersApi';
import { setUser, logout } from '../redux/features/auth/authSlice';
import { store } from '../redux/store';
import Swal from 'sweetalert2';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // ป้องกัน navigate ซ้ำในกรณี mustChangePassword
  const didForcePasswordChange = useRef(false);
  // ติดตามว่า user เคย authenticated แล้วหรือยัง (เพื่อแยก "session หมด" จาก "ยังไม่ login")
  const wasAuthenticated = useRef(false);
  // หมายเหตุ: ไม่ใช้ useSelector สำหรับ voluntaryLogout
  // เพราะ useSelector คืนค่าจาก render cycle ก่อนหน้า (stale closure)
  // ให้อ่านจาก store.getState() โดยตรงใน effect แทน (synchronous เสมอ)

  const { data, error, isLoading } = useGetCurrentUserQuery(undefined, {
    // ตรวจสอบ session ทุก 10 นาที (token หมดอายุใน 2 ชั่วโมง / 7 วัน)
    // ป้องกันกรณีtoken หมดอายุระหว่างใช้งานแล้ว API อื่นๆ คืน 401 ก่อนที่ AuthProvider จะรู้
    pollingInterval: 10 * 60 * 1000, // 10 minutes
    // refetch เมื่อ tab กลับมา focus (user เปิดหลาย tab หรือกลับมาจาก tab อื่น)
    refetchOnFocus: true,
    // Never skip: let the backend decide via the httpOnly cookie
  });

  useEffect(() => {
    // ถ้ามี error อย่าประมวลผล data (อาจเป็น stale cache + 401 พร้อมกัน)
    if (error) {
      if (error.status !== 401 && error.status !== 'FETCH_ERROR') {
        console.error('Authentication error:', error);
      }
      // แสดง popup เฉพาะเมื่อ session หมดอายุระหว่างใช้งาน (ไม่ใช่ตอนยังไม่ login หรือออกจากระบบเอง)
      if (error.status === 401 && wasAuthenticated.current) {
        wasAuthenticated.current = false; // reset เสมอเมื่อ 401 มา
        // อ่านค่าจาก store โดยตรง (synchronous) ไม่ผ่าน React render cycle
        // เพื่อป้องกัน race condition กับ stale closure ของ useSelector
        const voluntaryLogout = store.getState().auth.voluntaryLogout;
        if (!voluntaryLogout) {
          Swal.fire({
            icon: 'warning',
            title: 'Session หมดอายุ',
            text: 'กรุณาเข้าสู่ระบบใหม่',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#f59e0b',
          });
        }
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
      wasAuthenticated.current = true; // บันทึกว่า user เคย authenticated แล้ว

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