import React, { useState, useEffect, useCallback } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { MdCheckCircle, MdCancel, MdLockReset } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import Swal from "sweetalert2";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const PasswordResetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/password-reset-requests`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (err) {
            console.error("fetch reset requests error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = async (req) => {
        const result = await Swal.fire({
            title: "อนุมัติคำขอรีเซ็ต?",
            html: `<p>อนุมัติให้ <strong>${req.user.email}</strong> รีเซ็ตรหัสผ่าน?</p>
             <p class="text-sm text-gray-500 mt-2">ระบบจะสร้างรหัสผ่านชั่วคราวและแสดงให้คุณเห็น</p>`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d97706",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "อนุมัติ",
            cancelButtonText: "ยกเลิก",
        });
        if (!result.isConfirmed) return;

        try {
            const res = await fetch(
                `${API_BASE_URL}/auth/password-reset-requests/${req.id}/approve`,
                { method: "POST", credentials: "include" }
            );
            const data = await res.json();

            if (res.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "✅ อนุมัติสำเร็จ",
                    html: `
            <div style="text-align:left; line-height:1.8">
              <p><strong>อีเมล:</strong> ${data.email}</p>
              <p style="margin-top:8px"><strong>รหัสผ่านชั่วคราว:</strong></p>
              <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:10px 16px;margin-top:6px;font-size:1.4rem;font-weight:bold;letter-spacing:0.15em;text-align:center;font-family:monospace">
                ${data.tempPassword}
              </div>
              <p style="margin-top:10px;font-size:0.85rem;color:#6b7280">⚠️ กรุณาบันทึกและแจ้งรหัสนี้ให้ผู้ใช้ทันที รหัสนี้จะแสดงเพียงครั้งเดียว</p>
            </div>`,
                    confirmButtonText: "ตกลง รับทราบแล้ว",
                    confirmButtonColor: "#d97706",
                    allowOutsideClick: false,
                });
                fetchRequests();
            } else {
                Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: data.message || "", confirmButtonText: "ตกลง", confirmButtonColor: "#ef4444" });
            }
        } catch {
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", confirmButtonText: "ตกลง", confirmButtonColor: "#ef4444" });
        }
    };

    const handleReject = async (req) => {
        const result = await Swal.fire({
            title: "ปฏิเสธคำขอ?",
            html: `<p>ปฏิเสธคำขอรีเซ็ตรหัสผ่านของ <strong>${req.user.email}</strong>?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ปฏิเสธ",
            cancelButtonText: "ยกเลิก",
        });
        if (!result.isConfirmed) return;

        try {
            const res = await fetch(
                `${API_BASE_URL}/auth/password-reset-requests/${req.id}/reject`,
                { method: "POST", credentials: "include" }
            );
            if (res.ok) {
                Swal.fire({ icon: "success", title: "ปฏิเสธคำขอแล้ว", timer: 1500, showConfirmButton: false });
                fetchRequests();
            }
        } catch {
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", confirmButtonText: "ตกลง", confirmButtonColor: "#ef4444" });
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("th-TH", {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MdLockReset className="text-amber-700 text-2xl" />
                    <h3 className="text-lg font-bold text-gray-800">
                        คำขอรีเซ็ตรหัสผ่าน
                    </h3>
                    {requests.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {requests.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 font-medium border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors disabled:opacity-50"
                >
                    <FiRefreshCw className={`text-base ${isLoading ? "animate-spin" : ""}`} />
                    รีเฟรช
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <FaKey className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">ไม่มีคำขอรีเซ็ตรหัสผ่านที่รอดำเนินการ</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white border-2 border-amber-100 rounded-xl p-4 shadow-sm hover:border-amber-300 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="font-semibold text-gray-800">
                                        {req.user.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ชื่อผู้ใช้: {req.user.username}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        ส่งคำขอเมื่อ: {formatDate(req.requestedAt)}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => handleApprove(req)}
                                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <MdCheckCircle className="text-base" />
                                        อนุมัติ
                                    </button>
                                    <button
                                        onClick={() => handleReject(req)}
                                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <MdCancel className="text-base" />
                                        ปฏิเสธ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PasswordResetRequests;
