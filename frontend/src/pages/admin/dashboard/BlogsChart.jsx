import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../../utilis/dateFormater';

// จัดรูปแบบข้อมูลสำหรับกราฟ
const formatData = (blogs) => {
  return blogs.map(blog => ({
    name: formatDate(blog.createdAt), // ใช้วันที่เป็นป้ายกำกับแกน X
    post: blog.title.length || 0, // ใช้ความยาวหัวข้อหรือเมตริกอื่น
    pv: blog.pageViews || 0, // ตัวอย่างสำหรับจำนวนการดูหน้า
    amt: blog.amt || 0, // ตัวอย่างสำหรับข้อมูลเพิ่มเติม
  }));
};

const BlogsChart = ({ blogs }) => {
  const data = formatData(blogs?.posts || []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ประสิทธิภาพบทความข่าว</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }} 
              axisLine={{ stroke: '#9ca3af' }} 
            />
            <YAxis 
              tick={{ fill: '#6b7280' }} 
              axisLine={{ stroke: '#9ca3af' }} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="post" 
              stroke="#6366f1" 
              fill="#6366f1" 
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BlogsChart;