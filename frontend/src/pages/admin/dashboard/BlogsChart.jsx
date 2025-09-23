import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Eye,
  MessageCircle,
  BarChart3,
  Activity,
  Users
} from 'lucide-react';

const BlogsChart = ({ blogs = [], comments = [], users = [] }) => {
  const [activeView, setActiveView] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');

  // ฟอร์แมตข้อมูลสำหรับกราฟต่างๆ
  const formatData = useMemo(() => {
    const now = new Date();
    const getTimeRange = () => {
      switch (timeRange) {
        case '1month': return 30;
        case '3months': return 90;
        case '6months': return 180;
        case '1year': return 365;
        default: return 180;
      }
    };

    const days = getTimeRange();
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    // กรองข้อมูลตามช่วงเวลา - รองรับทั้ง blogs และ blogs.posts
    const blogList = blogs.posts || blogs || [];
    const filteredBlogs = blogList.filter(blog => {
      const blogDate = new Date(blog.createdAt);
      return blogDate >= startDate && blogDate <= now;
    });

    // จัดกลุ่มข้อมูลตามวันที่
    const groupedData = {};

    // สร้างข้อมูลพื้นฐานสำหรับแต่ละวัน
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      groupedData[dateKey] = {
        date: dateKey,
        displayDate: d.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: 'short',
          year: timeRange === '1year' ? '2-digit' : undefined
        }),
        posts: 0,
        comments: 0
      };
    }

    // เพิ่มข้อมูลบทความ
    filteredBlogs.forEach(blog => {
      const dateKey = new Date(blog.createdAt).toISOString().split('T')[0];
      if (groupedData[dateKey]) {
        groupedData[dateKey].posts += 1;
        
        // เนื่องจาก comments เป็น object ที่มี totalComments ไม่ใช่ array
        // เราจึงไม่สามารถแยกความคิดเห็นตามวันที่ได้
        // ดังนั้นจะไม่เพิ่มข้อมูล comments ใน daily data
        groupedData[dateKey].comments += 0;
      }
    });

    return Object.values(groupedData).filter((_, index, array) => {
      // แสดงข้อมูลทุกวันสำหรับ 1 เดือน, ทุก 3 วันสำหรับ 3 เดือน, ทุกสัปดาห์สำหรับช่วงยาวกว่า
      if (timeRange === '1month') return true;
      if (timeRange === '3months') return index % 3 === 0;
      return index % 7 === 0;
    });
  }, [blogs, comments, timeRange]);

  // ข้อมูลสำหรับ Pie Chart - การแบ่งตาม Category
  const categoryData = useMemo(() => {
    const categories = {};
    const blogList = blogs.posts || blogs || [];

    blogList.forEach(blog => {
      const category = blog.category || 'ไม่มีหมวดหมู่';
      categories[category] = (categories[category] || 0) + 1;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [blogs]);

  // สถิติรวม - ใช้ข้อมูลจริงจาก props
  const stats = useMemo(() => {
    const blogList = blogs.posts || blogs || [];
    
    // ใช้ข้อมูลจาก props โดยตรง
    const totalPosts = blogList.length;
    const totalUsers = users.length;
    
    // ตรวจสอบ structure ของ comments
    const totalComments = typeof comments === 'object' && comments.totalComments 
      ? comments.totalComments 
      : (Array.isArray(comments) ? comments.length : 0);
    
    // คำนวณความคิดเห็นเฉลี่ยต่อบทความ
    const avgCommentsPerPost = totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : 0;

    return {
      totalPosts,
      totalUsers,
      totalComments,
      avgCommentsPerPost
    };
  }, [blogs, comments, users]);

  const chartViews = [
    { id: 'overview', name: 'ภาพรวม', icon: Activity },
    { id: 'trends', name: 'แนวโน้ม', icon: TrendingUp },
    { id: 'engagement', name: 'การมีส่วนร่วม', icon: MessageCircle },
    { id: 'categories', name: 'หมวดหมู่', icon: BarChart3 }
  ];

  const timeRanges = [
    { id: '1month', name: '1 เดือน' },
    { id: '3months', name: '3 เดือน' },
    { id: '6months', name: '6 เดือน' },
    { id: '1year', name: '1 ปี' }
  ];

  const renderChart = () => {
    switch (activeView) {
      case 'overview':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={formatData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#9ca3af' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="posts" fill="#6366f1" name="บทความใหม่" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="comments" stroke="#f59e0b" strokeWidth={3} name="ความคิดเห็น" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formatData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#6366f1' }}
                name="บทความใหม่"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#f59e0b' }}
                name="ความคิดเห็น"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'engagement':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={formatData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="comments"
                stroke="#f59e0b"
                fill="url(#commentsGradient)"
                name="ความคิดเห็น"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'categories':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">การแบ่งตามหมวดหมู่</h4>
              <div className="space-y-2">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.value} บทความ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">การวิเคราะห์บทความข่าว</h2>
          <p className="text-gray-600">ข้อมูลเชิงลึกและแนวโน้มของบทความในระบบ</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                timeRange === range.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards - ใช้ข้อมูลจริงจาก props */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">บทความทั้งหมด</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalPosts}</p>
            </div>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">ผู้ใช้ทั้งหมด</p>
              <p className="text-2xl font-bold text-green-800">{stats.totalUsers}</p>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">ความคิดเห็น</p>
              <p className="text-2xl font-bold text-orange-800">{stats.totalComments}</p>
            </div>
            <MessageCircle className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">ความคิดเห็นเฉลี่ย</p>
              <p className="text-2xl font-bold text-purple-800">{stats.avgCommentsPerPost}</p>
            </div>
            <Activity className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Chart View Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chartViews.map(view => {
          const IconComponent = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                activeView === view.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <IconComponent size={18} className="mr-2" />
              {view.name}
            </button>
          );
        })}
      </div>

      {/* Chart Area */}
      <div className="bg-gray-50 rounded-lg p-4">
        {renderChart()}
      </div>

      {/* Insights - ใช้ข้อมูลจริง */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-800 mb-2">ข้อมูลเชิงลึก</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <strong>สถิติเนื้อหา:</strong> ระบบมีบทความทั้งหมด {stats.totalPosts} บทความ
          </div>
          <div>
            <strong>ชุมชนผู้ใช้:</strong> มีสมาชิกทั้งหมด {stats.totalUsers} คน
          </div>
          <div>
            <strong>การมีส่วนร่วม:</strong> ความคิดเห็นทั้งหมด {stats.totalComments} รายการ
          </div>
          <div>
            <strong>ความคิดเห็นเฉลี่ย:</strong> {stats.avgCommentsPerPost} ต่อบทความ
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsChart;