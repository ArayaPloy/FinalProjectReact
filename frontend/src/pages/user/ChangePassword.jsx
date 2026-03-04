import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { updateUser } from "../../redux/features/auth/authSlice";
import { authApi } from "../../redux/features/auth/authApi";
import Swal from "sweetalert2";

// ต้องนิยาม PasswordInput ข้างนอก ChangePassword component
// ถ้านิยามข้างใน React จะสร้าง component type ใหม่ทุก render
// → input ถูก unmount/remount ทุกครั้งที่พิมพ์ → พิมพ์ไม่ได้
const PasswordInput = ({ value, onChange, show, onToggle, placeholder }) => (
    <div className="relative">
        <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 text-base" />
        <input
            type={show ? "text" : "password"}
            value={value}
            onChange={onChange}
            className="w-full pl-11 pr-12 py-3 text-base border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            placeholder={placeholder}
            required
        />
        <button
            type="button"
            onClick={onToggle}
            className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
            {show ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
        </button>
    </div>
);

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const mustChangePassword = user?.mustChangePassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }
        if (newPassword.length < 6) {
            setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }
        if (currentPassword === newPassword) {
            setError("รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม");
            return;
        }

        setIsLoading(true);
        try {
            const API_BASE_URL =
                import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "เกิดข้อผิดพลาด");
                return;
            }

            // อัปเดต Redux state ให้ mustChangePassword = false
            dispatch(updateUser({ mustChangePassword: false }));
            // Invalidate cache ของ /me เพื่อให้ AuthProvider refetch ข้อมูลใหม่จาก DB
            // ป้องกัน cache เก่า (mustChangePassword: true) redirect กลับมาที่หน้านี้
            dispatch(authApi.util.invalidateTags(['User']));

            await Swal.fire({
                icon: "success",
                title: "เปลี่ยนรหัสผ่านสำเร็จ!",
                text: "คุณสามารถเข้าใช้งานระบบได้แล้ว",
                timer: 2000,
                showConfirmButton: false,
            });

            navigate("/");
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md bg-white rounded-xl md:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <div className="bg-amber-100 rounded-full p-4">
                            <MdSecurity className="text-amber-700 text-4xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
                        เปลี่ยนรหัสผ่าน
                    </h2>
                    {mustChangePassword && (
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3 mt-3">
                            <p className="text-orange-700 text-sm font-semibold">
                                🔑 คุณกำลังใช้รหัสผ่านชั่วคราว
                            </p>
                            <p className="text-orange-600 text-sm mt-1">
                                กรุณาตั้งรหัสผ่านใหม่ก่อนเข้าใช้งานระบบ
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-amber-800">
                            {mustChangePassword ? "รหัสผ่านชั่วคราว" : "รหัสผ่านปัจจุบัน"}
                        </label>
                        <PasswordInput
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            show={showCurrent}
                            onToggle={() => setShowCurrent(!showCurrent)}
                            placeholder={mustChangePassword ? "กรอกรหัสผ่านชั่วคราวที่ได้รับ" : "กรอกรหัสผ่านปัจจุบัน"}
                        />
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-amber-800">
                            รหัสผ่านใหม่
                        </label>
                        <PasswordInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            show={showNew}
                            onToggle={() => setShowNew(!showNew)}
                            placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-amber-800">
                            ยืนยันรหัสผ่านใหม่
                        </label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            show={showConfirm}
                            onToggle={() => setShowConfirm(!showConfirm)}
                            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600 text-center font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-base py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] mt-2"
                    >
                        {isLoading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
