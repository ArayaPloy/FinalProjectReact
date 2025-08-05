import React, { useState } from "react";
import { useUpdateUserRoleMutation } from "../../../redux/features/auth/authApi";

const UpdateUserModal = ({ user, onClose, onRoleUpdate }) => {
  const [role, setRole] = useState(user.role);
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleUpdateRole = async () => {
    try {
      await updateUserRole({ userId: user._id, role }).unwrap();
      alert("User role updated successfully");
      onRoleUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4">แก้ไขผู้ใช้งาน (User)</h2>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            อีเมล:
          </label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="mt-1 bg-bgPrimary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none"
          />
        </div>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            บทบาท (Role):
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-1.5 px-5 focus:outline-none"
          >
            <option value="user">ผู้ใช้</option>
            <option value="admin">แอดมิน</option>
          </select>
        </div>
        <div className="flex justify-end pt-5">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleUpdateRole}
            className="bg-indigo-500 text-white px-4 py-2 rounded"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
