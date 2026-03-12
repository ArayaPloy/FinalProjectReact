import React, { useState } from "react";
import { useDeleteBlogMutation, useFetchBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { showApiError } from '../../../utils/sweetAlertHelper';
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok'
  });
};
import { MdModeEdit, MdDelete } from "react-icons/md";


const ManagePosts = () => {
  const [query, setQuery] = useState({ search: "", category: "" });
  const { data: blogs = [], error, isLoading, refetch } = useFetchBlogsQuery(query); 
  const [deletePost] = useDeleteBlogMutation(); 

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบบทความนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePost(id).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'ลบสำเร็จ',
          text: response.message || 'ลบบทความเรียบร้อยแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
        refetch();
      } catch (error) {
        console.error("ลบบทความไม่สำเร็จ:", error);
        showApiError(error, 'ไม่สามารถลบบทความได้', 'ลบบทความ');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {isLoading && <div>กำลังโหลด...</div>}
      {error && <div>โหลดบทความไม่สำเร็จ</div>}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">บทความทั้งหมด</h3>
          <Link to="/blogs">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              ดูบทความทั้งหมด
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ลำดับ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ชื่อบทความ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">วันที่เผยแพร่</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">จัดการบทความ</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(blog.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/update-items/${blog.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                        <MdModeEdit className="w-4 h-4" /> แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <MdDelete className="w-4 h-4" /> ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePosts;