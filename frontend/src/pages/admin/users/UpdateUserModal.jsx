import React, { useState } from "react";
import { useUpdateUserRoleMutation } from "../../../redux/features/auth/authApi";
import { MdClose, MdSave, MdPerson, MdEmail, MdVerifiedUser } from "react-icons/md";

const UpdateUserModal = ({ user, onClose, onSuccess }) => {
  const [role, setRole] = useState(user?.role || 'user');
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  const handleUpdateRole = async () => {
    if (!user) return;
    
    try {
      // Use both possible ID formats for compatibility
      const userId = user.id || user._id;
      await updateUserRole({ userId, role }).unwrap();
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successDiv.textContent = 'อัปเดตบทบาทผู้ใช้สำเร็จ';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
      onSuccess();
    } catch (error) {
      console.error("Failed to update user role:", error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'เกิดข้อผิดพลาดในการอัปเดตบทบาทผู้ใช้';
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-indigo-500 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white flex items-center">
              <MdVerifiedUser className="mr-2" />
              แก้ไขข้อมูลผู้ใช้
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Username/Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MdPerson className="mr-1 text-gray-400" />
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              value={user.username || user.name || 'ไม่ระบุชื่อ'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MdEmail className="mr-1 text-gray-400" />
              อีเมล
            </label>
            <input
              type="email"
              value={user.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MdVerifiedUser className="mr-1 text-gray-400" />
              บทบาท (Role)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            >
              <option value="user">ผู้ใช้ทั่วไป (User)</option>
              <option value="student">นักเรียน (Student)</option>
              <option value="teacher">ครู (Teacher)</option>
              <option value="admin">ผู้ดูแลระบบ (Admin)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              เลือกบทบาทที่เหมาะสมสำหรับผู้ใช้คนนี้
            </p>
          </div>

          {/* Warning for Admin Role */}
          {role === 'admin' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    คำเตือน
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    การกำหนดให้ผู้ใช้เป็นผู้ดูแลระบบจะให้สิทธิ์เต็มในการจัดการระบบ
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            disabled={isLoading}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleUpdateRole}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <MdSave className="mr-1" />
                บันทึกการเปลี่ยนแปลง
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;