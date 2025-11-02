import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';

const RelatedBlogs = ({ blogId }) => {
  const navigate = useNavigate();
  // ใช้ skip เพื่อไม่ให้ fetch ถ้า blogId ไม่มี
  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(blogId, {
    skip: !blogId, // ข้าม query ถ้า blogId เป็น undefined
    refetchOnMountOrArgChange: true // Refetch เมื่อ blogId เปลี่ยน
  });

  // ถ้าไม่มี blogId ไม่ต้องแสดงอะไร
  if (!blogId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">กำลังโหลด...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600 text-center py-4">
          <p>ไม่สามารถโหลดข่าวสารที่เกี่ยวข้องได้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">ข่าวสารที่เกี่ยวข้อง</h3>
      <hr className="mb-6 border-gray-200" />
      {blogs.length === 0 ? (
        <p className="text-gray-600 text-center py-8">ไม่มีข่าวสารที่เกี่ยวข้อง...</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div 
              key={blog.id}
              className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 cursor-pointer"
              onClick={() => {
                // ใช้ navigate แทน window.location.href เพื่อให้ React Router จัดการ
                navigate(`/blogs/${blog.id}`);
                // Scroll to top
                window.scrollTo(0, 0);
              }}
            >
              {/* รูปภาพ */}
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={blog.coverImg}
                  alt={blog.title}
                  className="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow-sm"
                />
              </div>

              {/* เนื้อหา */}
              <div className="flex-1">
                <h4 className="text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">
                  {blog.title.substring(0, 50)}
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  {blog?.description.substring(0, 80)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedBlogs;