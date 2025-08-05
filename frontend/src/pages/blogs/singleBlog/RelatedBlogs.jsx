import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';

const RelatedBlogs = () => {
  const { id } = useParams(); 

  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id);
  console.log(blogs);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">ข่าวสารที่เกี่ยวข้อง</h3>
      <hr className="mb-6 border-gray-200" />
      {blogs.length === 0 ? (
        <p className="text-gray-600 text-center py-8">ไม่มีข่าวสารที่เกี่ยวข้อง...</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <Link
              to={`/blogs/${blog._id}`}
              key={blog._id}
              className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition-all duration-300"
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedBlogs;