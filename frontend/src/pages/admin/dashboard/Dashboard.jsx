/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaBlog, FaRegComment } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { useFetchBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { useGetUserQuery } from "../../../redux/features/auth/authApi";
import { useGetCommentsQuery } from "../../../redux/features/comments/commentsApi";
import BlogsChart from "./BlogsChart";

const Dashboard = () => {
  const [query, setQuery] = useState({ search: '', category: '' });
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);
  const { data: users = [] } = useGetUserQuery();
  const { data: comments = [] } = useGetCommentsQuery();
  const { user } = useSelector((state) => state.auth);

  // นับจำนวนผู้ใช้ที่มีบทบาท "admin"
  const adminCount = users.filter(user => user.role === "admin").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {isLoading && <div>กำลังโหลด...</div>}
      <div className="space-y-8">
        {/* ส่วนต้อนรับ */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800">สวัสดี, {user.username}!</h1>
          <p className="text-gray-600 mt-2">ยินดีต้อนรับสู่แดชบอร์ดผู้ดูแลระบบ</p>
          <p className="text-gray-600 mt-2">
            ที่นี่คุณสามารถจัดการเว็บไซต์โรงเรียน จัดการบทความ และงานบริหารอื่นๆ
          </p>
        </div>

        {/* การ์ดแสดงข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* การ์ดผู้ใช้ */}
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <FiUsers className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{users.length}</h2>
            <p className="text-gray-600">ผู้ใช้ทั้งหมด</p>
          </div>

          {/* การ์ดบทความ */}
          <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <FaBlog className="text-4xl text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{blogs.length}</h2>
            <p className="text-gray-600">บทความทั้งหมด</p>
          </div>

          {/* การ์ดผู้ดูแล */}
          <div className="bg-lime-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <RiAdminLine className="text-4xl text-lime-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{adminCount}</h2>
            <p className="text-gray-600">ผู้ดูแลระบบ</p>
          </div>

          {/* การ์ดความคิดเห็น */}
          <div className="bg-orange-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <FaRegComment className="text-4xl text-orange-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{comments.totalComments}</h2>
            <p className="text-gray-600">ความคิดเห็น</p>
          </div>
        </div>

        {/* ส่วนกราฟ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <BlogsChart blogs={blogs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;