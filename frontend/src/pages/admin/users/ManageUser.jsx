import React, { useState } from "react";
import {
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../redux/features/auth/authApi";
import { MdModeEdit, MdDelete, MdWarning } from "react-icons/md";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import UpdateUserModal from "./UpdateUserModal";

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const { data: users = [], error, isLoading, refetch } = useGetUserQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      setShowDeleteConfirm(null);
      refetch();
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successDiv.textContent = 'ลบผู้ใช้สำเร็จ';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'เกิดข้อผิดพลาดในการลบผู้ใช้';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    refetch();
    handleCloseModal();
  };

  const getRoleBadgeStyle = (role) => {
    // Extract role string from object or use as-is
    const roleString = typeof role === 'object' ? role?.roleName || role?.name : role;
    
    if (!roleString || typeof roleString !== 'string') {
      return "bg-gray-100 text-gray-800 border border-gray-200";
    }
    
    switch (roleString.toLowerCase()) {
      case 'admin':
        return "bg-red-100 text-red-800 border border-red-200";
      case 'teacher':
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case 'student':
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    // Extract role string from object or use as-is
    const roleString = typeof role === 'object' ? role?.roleName || role?.name : role;
    
    if (!roleString || typeof roleString !== 'string') {
      return <FiUserX className="w-4 h-4" />;
    }
    
    switch (roleString.toLowerCase()) {
      case 'admin':
        return <FiUserCheck className="w-4 h-4" />;
      case 'teacher':
        return <FiUsers className="w-4 h-4" />;
      default:
        return <FiUserX className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-lg text-gray-600">กำลังโหลดข้อมูลผู้ใช้...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <MdWarning className="text-red-500 w-6 h-6 mr-2" />
            <span className="text-red-800">เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FiUsers className="mr-3 text-indigo-600" />
                จัดการผู้ใช้งาน
              </h3>
              <p className="text-gray-600 mt-1">ทั้งหมด {users.length} คน</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ลำดับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อผู้ใช้
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อีเมล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  บทบาท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id || user._id || `user-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {user.username || user.name || 'ไม่ระบุชื่อ'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {typeof user.role === 'object' ? user.role?.roleName || user.role?.name || 'ไม่ระบุ' : user.role || 'ไม่ระบุ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                        title="แก้ไขผู้ใช้"
                      >
                        <MdModeEdit className="w-4 h-4" />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id || user._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        title="ลบผู้ใช้"
                        disabled={isDeleting}
                      >
                        <MdDelete className="w-4 h-4" />
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีผู้ใช้</h3>
              <p className="mt-1 text-sm text-gray-500">ยังไม่มีข้อมูลผู้ใช้ในระบบ</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <MdWarning className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">ยืนยันการลบผู้ใช้</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 transition-colors"
                  disabled={isDeleting}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'กำลังลบ...' : 'ลบ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {isModalOpen && selectedUser && (
        <UpdateUserModal 
          user={selectedUser} 
          onClose={handleCloseModal} 
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default ManageUser;