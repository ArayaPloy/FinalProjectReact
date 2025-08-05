import React, { useState } from "react";
import {
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import UpdateUserModal from "./UpdateUserModal";

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: users = [], error, isLoading, refetch } = useGetUserQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await deleteUser(id).unwrap();
      console.log(response);
      alert("User deleted successfully");
      refetch();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete user", error);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {isLoading && <div>กำลังโหลด...</div>}
      {error && <div>เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้</div>}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">ผู้ใช้ทั้งหมด</h3>
          
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">หมายเลข</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">อีเมลผู้ใช้</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">บทบาทผู้ใช้</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">แก้ไข</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user?.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`rounded-full py-1 px-3 text-sm font-medium ${
                        user?.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {user?.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <MdModeEdit /> แก้ไข
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => handleDelete(user?._id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative pt-8 pb-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-6/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-600 font-semibold py-1">
                Made with{" "}
                <a
                  href="https://www.creative-tim.com/product/notus-js"
                  className="text-gray-600 hover:text-gray-800"
                  target="_blank"
                >
                  Node JS
                </a>{" "}
                by{" "}
                <a
                  href="https://www.creative-tim.com"
                  className="text-gray-600 hover:text-gray-800"
                  target="_blank"
                >
                  Araya Hongsawong
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <UpdateUserModal user={selectedUser} onClose={handleCloseModal} onRoleUpdate={refetch} />
      )}
    </div>
  );
};

export default ManageUser;