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


const POSTS_PER_PAGE = 10;

const ManagePosts = () => {
  const [query, setQuery] = useState({ search: "", category: "", limit: 1000 });
  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogsData = {}, error, isLoading, refetch } = useFetchBlogsQuery(query);
  const blogs = blogsData?.posts || [];
  const [deletePost] = useDeleteBlogMutation(); 

  const handleSearchChange = (e) => {
    setQuery((prev) => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = blogs.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">บทความทั้งหมด</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={query.search}
              onChange={handleSearchChange}
              placeholder="ค้นหาชื่อบทความ..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-64"
            />
            <Link to="/blogs">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap w-full">
                ดูบทความทั้งหมด
              </button>
            </Link>
          </div>
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
              {paginatedBlogs.map((blog, index) => (
                <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{(currentPage - 1) * POSTS_PER_PAGE + index + 1}</td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <span className="text-sm text-gray-500">
              แสดง {(currentPage - 1) * POSTS_PER_PAGE + 1}–{Math.min(currentPage * POSTS_PER_PAGE, blogs.length)} จาก {blogs.length} รายการ
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                .reduce((acc, page, idx, arr) => {
                  if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...');
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-gray-400">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === item
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePosts;