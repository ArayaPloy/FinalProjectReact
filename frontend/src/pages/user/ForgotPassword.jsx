import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            const API_BASE_URL =
                import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setStatus("success");
            setMessage(data.message || "ส่งคำขอสำเร็จ");
        } catch {
            setStatus("error");
            setMessage("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
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
                            <MdLockReset className="text-amber-700 text-4xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
                        ลืมรหัสผ่าน
                    </h2>
                    <p className="text-sm sm:text-base text-amber-700 leading-relaxed px-2">
                        กรอกอีเมลของคุณ ระบบจะส่งคำขอให้แอดมินดำเนินการ
                        และแจ้งรหัสชั่วคราวให้คุณ
                    </p>
                </div>

                {status === "success" ? (
                    // Success state
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                            <p className="text-green-700 font-semibold text-base mb-1">
                                ✅ ส่งคำขอสำเร็จ
                            </p>
                            <p className="text-green-600 text-sm leading-relaxed">{message}</p>
                            <p className="text-green-600 text-sm mt-2 leading-relaxed">
                                กรุณารอแอดมินติดต่อกลับผ่านช่องทางที่โรงเรียนกำหนด
                                เพื่อรับรหัสผ่านชั่วคราว
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-xl transition-all"
                        >
                            <FaArrowLeft className="text-sm" />
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                ) : (
                    // Form state
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-amber-800 mb-2">
                                อีเมล
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-amber-500 text-base" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 text-base border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    placeholder="กรอกอีเมลที่ลงทะเบียนไว้"
                                    required
                                />
                            </div>
                        </div>

                        {status === "error" && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600 text-center font-medium">
                                    {message}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-base py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                        >
                            {isLoading ? "กำลังส่งคำขอ..." : "ส่งคำขอรีเซ็ตรหัสผ่าน"}
                        </button>

                        <div className="text-center pt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-800 font-medium underline underline-offset-2"
                            >
                                <FaArrowLeft className="text-xs" />
                                กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
