import React, { useState } from "react";
import { useRegisterUserMutation } from "../../redux/features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

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
      alert("สมัครสมาชิกสำเร็จ");
      navigate('/login');
    } catch (err) {
      setMessage("สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900">สมัครสมาชิก</h2>
          <p className="text-amber-700">สร้างบัญชีของคุณเพื่อเริ่มต้นใช้งาน</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-800">ชื่อผู้ใช้</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                value={username}
                className="w-full pl-10 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                required
              />
            </div>
          </div>

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
                type="password"
                value={password}
                className="w-full pl-10 px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                required
              />
            </div>
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
            {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-amber-700">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/login" className="font-medium text-amber-600 hover:text-amber-800">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;