/* eslint-disable react/no-unescaped-entities */
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { 
  FaBlog, 
  FaRegComment, 
  FaUserTie, 
  FaUserFriends,
  FaChartLine,
  FaBook,
  FaClipboardList,
  FaHome,
  FaChalkboardTeacher,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaUsers
} from "react-icons/fa";
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

  // นับจำนวนผู้ใช้ที่มีบทบาทต่างๆ
  const adminCount = users.filter(user => user.role === "admin").length;
  const teacherCount = users.filter(user => user.role === "teacher").length;
  const studentCount = users.filter(user => user.role === "student").length;

  // คำนวณ Monthly Growth สำหรับบทความ
  const monthlyGrowth = useMemo(() => {
    if (!blogs.length) return { current: 0, previous: 0, growth: 0, percentage: 0 };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // เดือนที่แล้ว
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // นับบทความเดือนปัจจุบัน
    const currentMonthBlogs = blogs.filter(blog => {
      const blogDate = new Date(blog.createdAt || blog.publishedAt);
      return blogDate.getMonth() === currentMonth && blogDate.getFullYear() === currentYear;
    }).length;

    // นับบทความเดือนที่แล้ว
    const previousMonthBlogs = blogs.filter(blog => {
      const blogDate = new Date(blog.createdAt || blog.publishedAt);
      return blogDate.getMonth() === previousMonth && blogDate.getFullYear() === previousYear;
    }).length;

    // คำนวณ growth
    const growth = currentMonthBlogs - previousMonthBlogs;
    const percentage = previousMonthBlogs === 0 
      ? (currentMonthBlogs > 0 ? 100 : 0) 
      : Math.round((growth / previousMonthBlogs) * 100);

    return {
      current: currentMonthBlogs,
      previous: previousMonthBlogs,
      growth,
      percentage,
      currentMonthName: now.toLocaleDateString('th-TH', { month: 'long' }),
      previousMonthName: new Date(previousYear, previousMonth).toLocaleDateString('th-TH', { month: 'long' })
    };
  }, [blogs]);

  // ฟังก์ชันแสดง Growth Icon และสี
  const getGrowthDisplay = (growth, percentage) => {
    if (growth > 0) {
      return {
        icon: <FaArrowUp className="text-green-500" />,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (growth < 0) {
      return {
        icon: <FaArrowDown className="text-red-500" />,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    } else {
      return {
        icon: <FaMinus className="text-gray-500" />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {isLoading && <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>}
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
          {/* การ์ดผู้ใช้ทั้งหมด */}
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <FiUsers className="text-4xl text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{users.length}</h2>
            <p className="text-gray-600">ผู้ใช้ทั้งหมด</p>
          </div>

          {/* การ์ดบทความทั้งหมด */}
          <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <FaBook className="text-4xl text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{blogs.length}</h2>
            <p className="text-gray-600">บทความทั้งหมด</p>
          </div>

          {/* การ์ดผู้ดูแลระบบ */}
          <div className="bg-lime-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <RiAdminLine className="text-4xl text-lime-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{adminCount}</h2>
            <p className="text-gray-600">ผู้ดูแลระบบ</p>
          </div>

          {/* การ์ดความคิดเห็น */}
          <div className="bg-orange-100 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <FaRegComment className="text-4xl text-orange-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">{comments.totalComments || 0}</h2>
            <p className="text-gray-600">ความคิดเห็น</p>
          </div>
        </div>

        {/* ส่วนกราฟ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">สถิติบทความและกิจกรรม</h2>
          <BlogsChart blogs={blogs} comments={comments} users={users} />
        </div>

        {/* ข้อมูลสรุป */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* สรุปข้อมูลระบบ - เพิ่มผู้ดูแลระบบ */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">สรุปข้อมูลระบบ</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">ผู้ใช้ทั้งหมด:</span>
                <span className="font-semibold">{users.length} คน</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">บทความทั้งหมด:</span>
                <span className="font-semibold">{blogs.length} บทความ</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">ความคิดเห็นทั้งหมด:</span>
                <span className="font-semibold">{comments.totalComments || 0} ความคิดเห็น</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">ผู้ดูแลระบบ:</span>
                <span className="font-semibold">{adminCount} คน</span>
              </li>
            </ul>
          </div>
          
          {/* Monthly Growth Card - การเติบโตรายเดือน */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">การเติบโตรายเดือน</h3>
            <div className="space-y-4">
              {/* เปรียบเทียบเดือนปัจจุบันกับเดือนที่แล้ว */}
              <div className={`p-4 rounded-lg border ${getGrowthDisplay(monthlyGrowth.growth, monthlyGrowth.percentage).bgColor} ${getGrowthDisplay(monthlyGrowth.growth, monthlyGrowth.percentage).borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">บทความใหม่</span>
                  <div className="flex items-center">
                    {getGrowthDisplay(monthlyGrowth.growth, monthlyGrowth.percentage).icon}
                    <span className={`ml-1 text-sm font-semibold ${getGrowthDisplay(monthlyGrowth.growth, monthlyGrowth.percentage).color}`}>
                      {monthlyGrowth.percentage > 0 ? '+' : ''}{monthlyGrowth.percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{monthlyGrowth.current}</div>
                    <div className="text-gray-500">{monthlyGrowth.currentMonthName}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">{monthlyGrowth.previous}</div>
                    <div className="text-gray-500">{monthlyGrowth.previousMonthName}</div>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">
                    {monthlyGrowth.growth > 0 ? 'เพิ่มขึ้น' : monthlyGrowth.growth < 0 ? 'ลดลง' : 'ไม่เปลี่ยนแปลง'} {Math.abs(monthlyGrowth.growth)} บทความ
                  </span>
                </div>
              </div>
              
              {/* ข้อมูลเพิ่มเติม */}
              <div className="text-xs text-gray-500 text-center">
                <p>เปรียบเทียบจำนวนบทความที่เผยแพร่</p>
                <p>ระหว่างเดือนปัจจุบันและเดือนที่ผ่านมา</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NavLink 
              to="/dashboard/add-new-post"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-left flex items-center no-underline"
            >
              <FaBlog className="mr-3" />
              <span>เขียนบทความใหม่</span>
            </NavLink>
            <NavLink 
              to="/dashboard/users"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-left flex items-center no-underline"
            >
              <FaUsers className="mr-3" />
              <span>จัดการผู้ใช้</span>
            </NavLink>
            <NavLink 
              to="/dashboard/manage-clubs"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-left flex items-center no-underline"
            >
              <FaUserFriends className="mr-3" />
              <span>จัดการชุมนุมวิชาการ</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;