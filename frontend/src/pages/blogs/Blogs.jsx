import React, { useState } from 'react';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
import SearchBlog from './SearchBlog';
import { Link } from 'react-router-dom';
import { FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion'; // นำเข้า motion จาก framer-motion

const Blogs = ({ limit }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState({ search: '', category: '' });

  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search, category });

  // จำกัดจำนวนบล็อกที่แสดงผล
  const displayedBlogs = limit ? blogs.slice(0, limit) : blogs;

  // ฟังก์ชันตัดคำอธิบาย
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

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
              onClick={() => {
                setSearch("")
                setCategory("")
                setQuery({ search: "", category: "" })
              }}
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
                {/* ปรับความสูงของรูปภาพให้เท่ากัน */}
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

        {/* ดูข่าวสารทั้งหมด */}
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