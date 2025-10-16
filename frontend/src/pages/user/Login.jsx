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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900">เข้าสู่ระบบ</h2>
          <p className="text-amber-700">ยินดีต้อนรับ! กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-800">อีเมล</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <input
                type="email"
                value={email}
                className="w-full pl-10 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลของคุณ"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-800">รหัสผ่าน</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="w-full pl-10 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
              />
              <label className="ml-2 text-sm text-amber-800">จำฉันไว้</label>
            </div>
            <Link
              to="/forgot-password" 
              className="text-sm text-amber-600 hover:text-amber-800"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>

          {/* Error Message */}
          {message && (
            <p className="text-sm text-red-500 text-center">{message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-amber-700">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="font-medium text-amber-600 hover:text-amber-800">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;