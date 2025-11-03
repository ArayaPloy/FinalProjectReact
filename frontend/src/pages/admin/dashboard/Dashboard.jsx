/* eslint-disable react/no-unescaped-entities */
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchBlogsQuery } from "../../../redux/features/blogs/blogsApi";
import { useGetUserQuery } from "../../../redux/features/auth/authApi";
import { useGetCommentsQuery } from "../../../redux/features/comments/commentsApi";
import BlogsChart from "./BlogsChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [query] = useState({ search: '', category: '' });
  const [hideAlert, setHideAlert] = useState(false); // State สำหรับซ่อนการแจ้งเตือน
  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);
  const { data: users = [] } = useGetUserQuery();
  const { data: comments = [] } = useGetCommentsQuery();
  const { user } = useSelector((state) => state.auth);

  // นับจำนวนผู้ใช้ตามบทบาท
  const roleStats = useMemo(() => {
    const superAdminCount = users.filter(u => u.role === "super_admin").length;
    const adminCount = users.filter(u => u.role === "admin").length;
    const teacherCount = users.filter(u => u.role === "teacher").length;
    const userCount = users.filter(u => u.role === "user").length; // ผู้ใช้ทั่วไป (default role)
    
    return {
      superAdminCount,
      adminCount,
      teacherCount,
      userCount, 
      totalAdmins: superAdminCount + adminCount, // รวม superadmin + admin
      totalUsers: users.length,
      pendingUsers: userCount // ผู้ใช้ที่รอการอนุมัติ/เปลี่ยนบทบาท
    };
  }, [users]);

  // คำนวณสถิติบทความ
  const blogStats = useMemo(() => {
    if (!blogs.length) return {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0,
      percentage: 0,
      byCategory: {}
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthBlogs = blogs.filter(blog => {
      const date = new Date(blog.createdAt || blog.publishedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const lastMonthBlogs = blogs.filter(blog => {
      const date = new Date(blog.createdAt || blog.publishedAt);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    }).length;

    const growth = thisMonthBlogs - lastMonthBlogs;
    const percentage = lastMonthBlogs === 0 
      ? (thisMonthBlogs > 0 ? 100 : 0)
      : Math.round((growth / lastMonthBlogs) * 100);

    // นับตามหมวดหมู่
    const byCategory = blogs.reduce((acc, blog) => {
      const category = blog.blog_categories?.name || 'อื่นๆ';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      total: blogs.length,
      thisMonth: thisMonthBlogs,
      lastMonth: lastMonthBlogs,
      growth,
      percentage,
      byCategory
    };
  }, [blogs]);

  // คำนวณกิจกรรมล่าสุด
  const recentActivity = useMemo(() => {
    const activities = [];
    
    // บทความล่าสุด (3 รายการ)
    const recentBlogs = [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(blog => ({
        type: 'blog',
        title: blog.title,
        time: new Date(blog.createdAt),
        author: blog.users_blogs_authorTousers?.username
      }));
    
    activities.push(...recentBlogs);
    
    // เรียงตามเวลา
    return activities.sort((a, b) => b.time - a.time).slice(0, 5);
  }, [blogs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-semibold">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  <i className="bi bi-speedometer2 mr-2"></i>
                  แดชบอร์ดผู้ดูแลระบบ
                </h1>
                <p className="text-amber-100 mt-2">
                  สวัสดี, <span className="font-semibold text-white">{user.username}</span> 
                  <span className="mx-2">•</span>
                  <span className="text-sm">{new Date().toLocaleDateString('th-TH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-amber-100 text-sm">บทบาท</p>
                  <p className="text-white font-bold text-lg capitalize">
                    <i className="bi bi-shield-check mr-1"></i>
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert/Notification - ผู้ใช้ใหม่รอตรวจสอบ */}
          {roleStats.pendingUsers > 0 && !hideAlert && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500 p-3 rounded-lg flex-shrink-0">
                  <i className="bi bi-exclamation-triangle-fill text-white text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-orange-900 mb-1">
                    <i className="bi bi-bell-fill mr-2"></i>
                    มีผู้ใช้ใหม่รอการตรวจสอบ!
                  </h3>
                  <p className="text-orange-800 text-sm mb-3">
                    มีผู้ใช้ทั่วไป <span className="font-bold text-lg">{roleStats.pendingUsers}</span> คน ที่ลงทะเบียนใหม่และรอให้คุณตรวจสอบและกำหนดบทบาทใหม่
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate('/dashboard/users')}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center text-sm"
                    >
                      <i className="bi bi-person-check-fill mr-2"></i>
                      ตรวจสอบผู้ใช้ใหม่
                    </button>
                    <button
                      onClick={() => setHideAlert(true)}
                      className="bg-white hover:bg-red-50 text-orange-700 hover:text-red-700 border-2 border-orange-300 hover:border-red-300 font-semibold px-4 py-2 rounded-lg transition-all duration-300 flex items-center text-sm"
                    >
                      <i className="bi bi-x-circle mr-2"></i>
                      ปิดการแจ้งเตือน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats - Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card: บทความทั้งหมด */}
            <div 
              onClick={() => navigate('/dashboard/manage-items')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-transparent hover:border-amber-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">บทความทั้งหมด</p>
                  <h3 className="text-3xl font-bold text-gray-800">{blogStats.total}</h3>
                  {blogStats.growth !== 0 && (
                    <p className={`text-sm mt-2 flex items-center ${blogStats.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <i className={`bi bi-arrow-${blogStats.growth > 0 ? 'up' : 'down'} mr-1`}></i>
                      {Math.abs(blogStats.percentage)}% จากเดือนที่แล้ว
                    </p>
                  )}
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-xl">
                  <i className="bi bi-newspaper text-2xl text-amber-600"></i>
                </div>
              </div>
            </div>

            {/* Card: ผู้ใช้ทั้งหมด */}
            <div 
              onClick={() => navigate('/dashboard/users')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">ผู้ใช้ทั้งหมด</p>
                  <h3 className="text-3xl font-bold text-gray-800">{roleStats.totalUsers}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <i className="bi bi-people mr-1"></i>
                    สมาชิกในระบบ
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                  <i className="bi bi-people-fill text-2xl text-blue-600"></i>
                </div>
              </div>
            </div>

            {/* Card: ผู้ดูแลระบบ */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">ผู้ดูแลระบบ</p>
                  <h3 className="text-3xl font-bold text-gray-800">{roleStats.totalAdmins}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600">
                      <i className="bi bi-star-fill text-yellow-500 mr-1"></i>
                      Super Admin: {roleStats.superAdminCount}
                    </p>
                    <p className="text-xs text-gray-600">
                      <i className="bi bi-shield-fill-check text-purple-500 mr-1"></i>
                      Admin: {roleStats.adminCount}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                  <i className="bi bi-shield-fill-check text-2xl text-purple-600"></i>
                </div>
              </div>
            </div>

            {/* Card: ความคิดเห็น */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">ความคิดเห็น</p>
                  <h3 className="text-3xl font-bold text-gray-800">{comments.totalComments || 0}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <i className="bi bi-chat-dots mr-1"></i>
                    การมีส่วนร่วม
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                  <i className="bi bi-chat-square-text-fill text-2xl text-green-600"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Blog Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    <i className="bi bi-bar-chart-fill text-amber-600 mr-2"></i>
                    สถิติบทความ
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                      เดือนนี้: {blogStats.thisMonth} บทความ
                    </span>
                  </div>
                </div>
                <BlogsChart blogs={blogs} />
              </div>

              {/* User Role Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  <i className="bi bi-pie-chart-fill text-amber-600 mr-2"></i>
                  การกระจายตัวของผู้ใช้
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bi bi-star-fill text-2xl text-yellow-600"></i>
                      <span className="text-2xl font-bold text-gray-800">{roleStats.superAdminCount}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Super Admin</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bi bi-shield-fill-check text-2xl text-purple-600"></i>
                      <span className="text-2xl font-bold text-gray-800">{roleStats.adminCount}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Admin</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bi bi-person-badge-fill text-2xl text-blue-600"></i>
                      <span className="text-2xl font-bold text-gray-800">{roleStats.teacherCount}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">ครู</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bi bi-person-circle text-2xl text-orange-600"></i>
                      <span className="text-2xl font-bold text-gray-800">{roleStats.userCount}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">ผู้ใช้ทั่วไป</p>
                    {roleStats.userCount > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        <i className="bi bi-hourglass-split"></i> รอตรวจสอบ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  <i className="bi bi-lightning-fill text-amber-600 mr-2"></i>
                  การดำเนินการด่วน
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard/add-new-post')}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                  >
                    <i className="bi bi-plus-circle-fill mr-2"></i>
                    เพิ่มบทความใหม่
                  </button>
                  
                  <button
                    onClick={() => navigate('/dashboard/users')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 border-2 border-gray-200 hover:border-amber-300 flex items-center justify-center"
                  >
                    <i className="bi bi-people-fill mr-2"></i>
                    จัดการผู้ใช้
                  </button>
                  
                  <button
                    onClick={() => navigate('/dashboard/manage-items')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 border-2 border-gray-200 hover:border-amber-300 flex items-center justify-center"
                  >
                    <i className="bi bi-folder-fill mr-2"></i>
                    จัดการบทความ
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  <i className="bi bi-clock-history text-amber-600 mr-2"></i>
                  กิจกรรมล่าสุด
                </h2>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                          <i className="bi bi-newspaper text-amber-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            โดย {activity.author || 'ไม่ระบุ'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.time.toLocaleDateString('th-TH', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">ไม่มีกิจกรรม</p>
                  )}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  <i className="bi bi-check-circle-fill text-green-600 mr-2"></i>
                  สถานะระบบ
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">API Server</span>
                    <span className="flex items-center text-green-600 font-semibold">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                      ออนไลน์
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="flex items-center text-green-600 font-semibold">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                      เชื่อมต่อ
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="flex items-center text-green-600 font-semibold">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                      ปกติ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Categories Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              <i className="bi bi-grid-fill text-amber-600 mr-2"></i>
              บทความแยกตามหมวดหมู่
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(blogStats.byCategory).map(([category, count], index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 border-2 border-amber-200 hover:scale-105 cursor-pointer"
                >
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-600 mt-1 truncate" title={category}>{category}</p>
                </div>
              ))}
              {Object.keys(blogStats.byCategory).length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  ยังไม่มีบทความในระบบ
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;