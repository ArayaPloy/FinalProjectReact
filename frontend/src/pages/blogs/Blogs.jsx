import React, { useState, useMemo } from 'react';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
import SearchBlog from './SearchBlog';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion';

const Blogs = ({ limit }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState({ search: '', category: '' });
  
  // State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);

  const { data, error, isLoading } = useFetchBlogsQuery(query);
  const blogs = data || [];



  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => {
    setQuery({ search, category });
    setCurrentPage(1); // รีเซ็ตไปหน้า 1 เมื่อค้นหาใหม่
  };

  // ใช้ useMemo สำหรับการคำนวณ pagination
  const paginationData = useMemo(() => {
    // หากมี limit แสดงว่าเป็นการแสดงใน homepage ไม่ต้องใช้ pagination
    if (limit) {
      return {
        displayedBlogs: blogs.slice(0, limit),
        totalPages: 1,
        showPagination: false
      };
    }

    // คำนวณ pagination สำหรับหน้า blogs หลัก
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const displayedBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    return {
      displayedBlogs,
      totalPages,
      showPagination: true
    };
  }, [blogs, currentPage, blogsPerPage, limit]);

  // ฟังก์ชันเปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ฟังก์ชันเปลี่ยนจำนวนรายการต่อหน้า
  const handleBlogsPerPageChange = (e) => {
    setBlogsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // ฟังก์ชันตัดคำอธิบาย
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // ฟังก์ชันรีเซ็ตการค้นหา
  const handleReset = () => {
    setSearch("");
    setCategory("");
    setQuery({ search: "", category: "" });
    setCurrentPage(1);
  };

  const { displayedBlogs, totalPages, showPagination } = paginationData;

  return (
    <section className="py-20 bg-bgSecondary">
      <div className='container px-4 mx-auto'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-10 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">ข่าวสารและกิจกรรม</h2>
          <div className="w-24 h-1 mx-auto mb-1 rounded bg-secondary"></div>
          <p className="text-textSecondary">ติดตามข่าวสารและกิจกรรมล่าสุดจากโรงเรียนท่าบ่อพิทยาคม</p>
          {!limit && (
            <p className="text-sm text-textSecondary mt-2">มีทั้งหมด {blogs.length} รายการ</p>
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SearchBlog search={search} handleSearchChange={handleSearchChange} handleSearch={handleSearch} />
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-center p-10 bg-white rounded-lg shadow-md"
          >
            <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-4 text-lg text-textSecondary">กำลังโหลดข้อมูล...</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-6 bg-red-50 rounded-lg shadow-md"
          >
            <h3 className="mb-2 text-lg font-medium text-red-600">เกิดข้อผิดพลาด</h3>
            <p className="text-red-500">{error.toString()}</p>
            <button
              onClick={handleSearch}
              className="px-4 py-2 mt-4 text-white bg-primary rounded-md hover:bg-primary-dark"
            >
              ลองใหม่อีกครั้ง
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && displayedBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md"
          >
            <div className="p-4 mb-4 text-4xl bg-gray-100 rounded-full">📭</div>
            <h3 className="mb-2 text-xl font-medium text-primary">ไม่พบข้อมูล</h3>
            <p className="mb-6 text-center text-textSecondary">ไม่พบข้อมูลที่ตรงกับการค้นหาของคุณ โปรดลองค้นหาด้วยคำค้นอื่น</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark"
            >
              ดูทั้งหมด
            </button>
          </motion.div>
        )}

        {/* Blogs Grid */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='mt-8 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12'
        >
          {displayedBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Link to={`/blogs/${blog.id}`} className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={blog.coverImg}
                    alt={blog.title}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-6'>
                  <h2 className='text-xl font-bold mb-2 text-primary group-hover:bg-secondary hover:text-amber-600'>{blog.title}</h2>
                  <i className='text-sm text-textSecondary block mb-2 bg-clip-text bg-slate-900'>{blog.category}</i>
                  <p className='text-sm text-textSecondary mb-4'>{truncateDescription(blog.description, 100)}</p>
                  <span className="flex items-center text-sm font-semibold text-primary hover:text-amber-600">
                    ดูเพิ่มเติม <FaChevronRight className="ml-1 transition-transform hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {showPagination && displayedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-textSecondary">แสดง:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                value={blogsPerPage}
                onChange={handleBlogsPerPageChange}
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
              </select>
              <span className="text-sm text-textSecondary">รายการต่อหน้า</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-textSecondary">
                หน้า {currentPage} จาก {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ก่อนหน้า
                </button>
                
                {/* แสดงปุ่มเลขหน้า */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ดูข่าวสารทั้งหมด (แสดงเฉพาะเมื่อมี limit) */}
        {limit && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <Link
              to="/blogs"
              className="px-6 py-3 font-medium text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-900"
            >
              ดูข่าวสารทั้งหมด
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Blogs;