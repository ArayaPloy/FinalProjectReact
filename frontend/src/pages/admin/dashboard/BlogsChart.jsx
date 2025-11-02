import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const BlogsChart = ({ blogs = [] }) => {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('th-TH', { 
        month: 'short',
        year: '2-digit'
      });
      const postsInMonth = blogs.filter(blog => {
        const blogDate = new Date(blog.createdAt);
        return (
          blogDate.getMonth() === date.getMonth() &&
          blogDate.getFullYear() === date.getFullYear()
        );
      }).length;
      monthsData.push({
        month: monthName,
        posts: postsInMonth
      });
    }
    return monthsData;
  }, [blogs]);

  const categoryData = useMemo(() => {
    const categories = {};
    blogs.forEach(blog => {
      const categoryName = blog.blog_categories?.name || 'อื่นๆ';
      categories[categoryName] = (categories[categoryName] || 0) + 1;
    });
    return Object.entries(categories)
      .map(([name, count]) => ({ 
        category: name, 
        count: count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [blogs]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="bi bi-calendar-event text-amber-600 mr-2"></i>
          บทความที่เผยแพร่ (6 เดือนล่าสุด)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="posts" 
              name="บทความ"
              fill="#D97706" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="bi bi-tags text-amber-600 mr-2"></i>
          การจัดกลุ่มตามหมวดหมู่
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis 
              type="category"
              dataKey="category" 
              width={150}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="จำนวน"
              fill="#3B82F6" 
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BlogsChart;
