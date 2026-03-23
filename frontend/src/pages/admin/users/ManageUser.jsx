import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../redux/features/auth/authApi";
import { useFetchPendingBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { MdModeEdit, MdDelete, MdWarning, MdAdminPanelSettings, MdLockReset } from "react-icons/md";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi";
import UpdateUserModal from "./UpdateUserModal";
import PasswordResetRequests from "./PasswordResetRequests";
import BlogApprovalRequests from "../post/BlogApprovalRequests";
import Swal from 'sweetalert2';
import { showApiError } from '../../../utils/sweetAlertHelper';

const USERS_PER_PAGE = 10;

const ManageUser = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // unused, kept for safety
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ดึงข้อมูลผู้ใช้ปัจจุบันจาก Redux store
  const currentUser = useSelector((state) => state.auth.user);
  
  // Extract role string - handle both object and string formats
  const currentUserRole = typeof currentUser?.role === 'object' 
    ? currentUser?.role?.roleName || currentUser?.role?.name || 'user'
    : currentUser?.role || 'user';

  // ตรวจสอบว่าผู้ใช้เป็น admin หรือ super_admin หรือไม่
  const isAuthorized = currentUserRole === 'admin' || currentUserRole === 'super_admin';
  
  // Skip API call ถ้าไม่มีสิทธิ์
  const { data: users = [], error, isLoading, refetch } = useGetUserQuery(undefined, {
    skip: !isAuthorized
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // ดึงจำนวน pending blog posts (สำหรับ badge บนแท็บ)
  const { data: pendingBlogs = [] } = useFetchPendingBlogsQuery(undefined, {
    skip: !isAuthorized
  });

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบผู้ใช้?',
      html: `<p class="text-gray-600">คุณแน่ใจหรือไม่ที่จะลบ <strong>${user.username || user.email}</strong>?</p><p class="text-red-500 text-sm mt-1">การกระทำนี้ไม่สามารถย้อนกลับได้</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ลบผู้ใช้',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(user.id).unwrap();
      refetch();
      Swal.fire({
        icon: 'success',
        title: 'ลบผู้ใช้สำเร็จ!',
        text: `ลบผู้ใช้ "${user.username || user.email}" เรียบร้อยแล้ว`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      showApiError(error, 'เกิดข้อผิดพลาดในการลบผู้ใช้', 'ลบผู้ใช้');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const username = (u.username || u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const role = (typeof u.role === 'object' ? u.role?.roleName || u.role?.name : u.role || '').toLowerCase();
    return username.includes(term) || email.includes(term) || role.includes(term);
  });

  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

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
      case 'super_admin':
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case 'admin':
        return "bg-red-100 text-red-800 border border-red-200";
      case 'teacher':
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case 'student':
        return "bg-green-100 text-green-800 border border-green-200";
      case 'user':
        return "bg-gray-100 text-gray-800 border border-gray-200";
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
      case 'super_admin':
        return <MdAdminPanelSettings className="w-4 h-4" />;
      case 'admin':
        return <FiUserCheck className="w-4 h-4" />;
      case 'teacher':
        return <FiUsers className="w-4 h-4" />;
      case 'student':
        return <FiUserCheck className="w-4 h-4" />;
      case 'user':
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-gray-500 text-sm">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
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
        {/* Header + Tabs */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FiUsers className="mr-3 text-indigo-600" />
                จัดการผู้ใช้งาน
              </h3>
              <p className="text-gray-600 mt-1">ทั้งหมด {users.length} คน{search && ` · พบ ${filteredUsers.length} รายการ`}</p>
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="ค้นหาชื่อผู้ใช้ / อีเมล / บทบาท..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
            />
          </div>
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FiUsers className="text-base" />
              รายชื่อผู้ใช้
            </button>
            <button
              onClick={() => setActiveTab("reset")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "reset"
                  ? "bg-amber-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <MdLockReset className="text-base" />
              คำขอรีเซ็ตรหัสผ่าน
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "blogs"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <HiOutlineNewspaper className="text-base" />
              คำขอโพสต์บทความ
              {pendingBlogs.length > 0 && (
                <span className={`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === "blogs" ? "bg-white text-indigo-600" : "bg-red-500 text-white"
                }`}>
                  {pendingBlogs.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "reset" ? (
          <div className="p-6">
            <PasswordResetRequests />
          </div>
        ) : activeTab === "blogs" ? (
          <div className="p-6">
            <BlogApprovalRequests />
          </div>
        ) : (
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
              {paginatedUsers.map((user, index) => (
                <tr key={user.id || `user-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {(currentPage - 1) * USERS_PER_PAGE + index + 1}
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
                        onClick={() => handleDelete(user)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
          
          {paginatedUsers.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{search ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ไม่มีผู้ใช้'}</h3>
              <p className="mt-1 text-sm text-gray-500">{search ? `ไม่มีผลลัพธ์สำหรับ "${search}"` : 'ยังไม่มีข้อมูลผู้ใช้ในระบบ'}</p>
            </div>
          )}

          {/* Pagination */}
          {totalUserPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                แสดง {(currentPage - 1) * USERS_PER_PAGE + 1}–{Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} จาก {filteredUsers.length} รายการ
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                  className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
                <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}
                  className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
                {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                  .filter((page) => page === 1 || page === totalUserPages || Math.abs(page - currentPage) <= 1)
                  .reduce((acc, page, idx, arr) => {
                    if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...');
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">…</span>
                    ) : (
                      <button key={item} onClick={() => setCurrentPage(item)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentPage === item ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>{item}</button>
                    )
                  )}
                <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalUserPages}
                  className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
                <button onClick={() => setCurrentPage(totalUserPages)} disabled={currentPage === totalUserPages}
                  className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>



      {/* Update User Modal */}
      {isModalOpen && selectedUser && (
        <UpdateUserModal 
          user={selectedUser} 
          onClose={handleCloseModal} 
          onSuccess={handleModalSuccess}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
};

export default ManageUser;