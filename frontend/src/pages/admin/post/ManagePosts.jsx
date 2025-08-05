import React, { useState } from "react";
import { useDeleteBlogMutation, useFetchBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utilis/dateFormater";
import { MdModeEdit } from "react-icons/md";

const ManagePosts = () => {
  const [query, setQuery] = useState({ search: "", category: "" });
  const { data: blogs = [], error, isLoading, refetch } = useFetchBlogsQuery(query); 
  const [deletePost] = useDeleteBlogMutation(); 

  const handleDelete = async (id) => {
    try {
      const response = await deletePost(id).unwrap();
      alert(response.message);
      refetch(); // ดึงข้อมูลบทความใหม่หลังจากลบ
    } catch (error) {
      console.error("ลบบทความไม่สำเร็จ:", error);
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
              ดูทั้งหมด
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">แก้ไข</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(blog.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <Link to={`/dashboard/update-items/${blog.id}`} className="text-indigo-600 hover:text-indigo-800">
                      <span className="flex items-center gap-1">
                        <MdModeEdit /> แก้ไข
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => handleDelete(blog.id)}
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
    </div>
  );
};

export default ManagePosts;