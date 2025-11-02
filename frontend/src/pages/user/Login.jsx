import React, { useState } from "react";
import { useLoginUserMutation } from "../../redux/features/auth/authApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/auth/authSlice";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };

    try {
      const response = await loginUser(data).unwrap();
      const { token, user } = response;
      
      // Set the cookie first
      document.cookie = `token=${token}; path=/; ${
        rememberMe ? "max-age=2592000" : ""
      }`; // 30 days if remember me
      
      // Then update the Redux store
      dispatch(setUser({ user, token }));
      
      // Use location state for redirect if available
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl md:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-amber-900 leading-tight mb-2">
            เข้าสู่ระบบ
          </h2>
          <p className="text-sm sm:text-base text-amber-700 leading-relaxed px-2">
            ยินดีต้อนรับ! กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
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
                type={showPassword ? "text" : "password"}
                value={password}
                className="w-full pl-10 sm:pl-11 pr-12 py-3 sm:py-3 md:py-3 text-base md:text-base border-2 border-amber-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700 active:text-amber-800 transition-colors p-1 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 pt-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 sm:h-4 sm:w-4 text-amber-600 border-2 border-amber-300 rounded focus:ring-2 focus:ring-amber-500 touch-manipulation"
                id="remember-me"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-sm sm:text-sm text-amber-800 font-medium cursor-pointer">
                จำฉันไว้
              </label>
            </div>
            <Link
              to="/forgot-password" 
              className="text-sm sm:text-sm text-amber-600 hover:text-amber-800 active:text-amber-900 font-medium underline decoration-1 underline-offset-2 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
            >
              ลืมรหัสผ่าน?
            </Link>
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
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Register Link - Mobile Optimized */}
        <div className="mt-6 md:mt-6 pt-6 border-t-2 border-amber-100">
          <p className="text-center text-sm sm:text-sm text-amber-700 leading-relaxed">
            ยังไม่มีบัญชี?{" "}
            <Link 
              to="/register" 
              className="font-bold text-amber-600 hover:text-amber-800 active:text-amber-900 underline decoration-2 underline-offset-2 touch-manipulation"
            >
              สมัครสมาชิกที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;