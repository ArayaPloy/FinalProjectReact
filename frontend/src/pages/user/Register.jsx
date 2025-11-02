import React, { useState } from "react";
import { useRegisterUserMutation } from "../../redux/features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };

    try {
      await registerUser(data).unwrap();
      
      // แสดง SweetAlert2 เมื่อสมัครสำเร็จ
      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ!",
        text: "บัญชีของคุณถูกสร้างเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ",
        confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
        confirmButtonColor: "#B45309",
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      // แสดง SweetAlert2 เมื่อสมัครไม่สำเร็จ
      Swal.fire({
        icon: "error",
        title: "สมัครสมาชิกไม่สำเร็จ",
        text: err?.data?.message || "กรุณาตรวจสอบข้อมูลและลองอีกครั้ง",
        confirmButtonText: "ลองอีกครั้ง",
        confirmButtonColor: "#B45309"
      });
      setMessage("สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl md:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-amber-900 leading-tight mb-2">
            สมัครสมาชิก
          </h2>
          <p className="text-sm sm:text-base text-amber-700 leading-relaxed px-2">
            สร้างบัญชีของคุณเพื่อเริ่มต้นใช้งาน
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 md:space-y-6">
          {/* Username Field - Mobile First */}
          <div className="space-y-2">
            <label className="block text-sm md:text-sm font-bold text-amber-800 mb-2">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 text-base sm:text-base flex-shrink-0" />
              <input
                type="text"
                value={username}
                className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3 md:py-3 text-base md:text-base border-2 border-amber-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                required
              />
            </div>
          </div>

          {/* Email Field - Mobile First */}
          <div className="space-y-2">
            <label className="block text-sm md:text-sm font-bold text-amber-800 mb-2">
              อีเมล
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 text-base sm:text-base flex-shrink-0" />
              <input
                type="email"
                value={email}
                className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3 md:py-3 text-base md:text-base border-2 border-amber-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลของคุณ"
                required
              />
            </div>
          </div>

          {/* Password Field - Mobile First */}
          <div className="space-y-2">
            <label className="block text-sm md:text-sm font-bold text-amber-800 mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 text-base sm:text-base flex-shrink-0" />
              <input
                type="password"
                value={password}
                className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3 md:py-3 text-base md:text-base border-2 border-amber-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {message && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-3">
              <p className="text-sm md:text-sm text-red-600 text-center font-medium leading-relaxed">
                {message}
              </p>
            </div>
          )}

          {/* Submit Button - Touch Optimized */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-base md:text-base py-3.5 sm:py-3 md:py-3 rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px]"
          >
            {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>
        </form>

        {/* Login Link - Mobile Optimized */}
        <div className="mt-6 md:mt-6 pt-6 border-t-2 border-amber-100">
          <p className="text-center text-sm sm:text-sm text-amber-700 leading-relaxed">
            มีบัญชีอยู่แล้ว?{" "}
            <Link 
              to="/login" 
              className="font-bold text-amber-600 hover:text-amber-800 active:text-amber-900 underline decoration-2 underline-offset-2 touch-manipulation"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;