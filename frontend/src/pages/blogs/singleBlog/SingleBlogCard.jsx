import React from 'react';
import { formatDate } from '../../../utilis/dateFormater';
import { motion } from 'framer-motion';
import EditorJSHTML from 'editorjs-html';

const editorJSHTML = EditorJSHTML();

const SingleBlogCard = ({ blog }) => {
  const { title, description, createdAt, users_blogs_authorTousers, content, coverImg } = blog || {};

  let htmlContent = '';
  if (content) {
    try {
      // Parse content ถ้าเป็น string
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      
      // ตรวจสอบว่ามี blocks หรือไม่
      if (parsedContent && parsedContent.blocks) {
        const html = editorJSHTML.parse(parsedContent);
        htmlContent = html.join('');
      } else {
        // Fallback ถ้าไม่มี blocks
        htmlContent = `<p>${description || 'ไม่มีเนื้อหา'}</p>`;
      }
    } catch (err) {
      console.error('Error parsing blog content:', err);
      console.error('Content received:', content);
      // Fallback: แสดง description แทน
      htmlContent = `<p>${description || 'ไม่สามารถแสดงเนื้อหาได้'}</p>`;
    }
  } else {
    // ถ้าไม่มี content ให้แสดง description
    htmlContent = `<p>${description || 'ไม่มีเนื้อหา'}</p>`;
  }

  // แสดงชื่อผู้เขียนที่ถูกต้องตาม schema
  const authorName = users_blogs_authorTousers?.username || 'ไม่ระบุ';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white p-4 md:p-8 rounded-lg shadow-lg"
    >
      {/* header */}
      <div>
        <h1 className="md:text-4xl text-3xl font-bold mb-4 text-gray-800">{title}</h1>
        <p className="mb-6 text-gray-600">
          {createdAt ? formatDate(createdAt) : 'ไม่ระบุวันที่'} โดย
          <span className="text-blue-600 cursor-pointer font-semibold"> {authorName}</span>
        </p>
      </div>

      {coverImg && (
        <div className="mb-8">
          <img 
            src={coverImg} 
            alt={title || 'Blog cover'} 
            className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]" 
          />
        </div>
      )}

      {/* details */}
      <div className="mt-8">
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="prose prose-lg max-w-none editorjsdiv"
        />
      </div>
    </motion.div>
  );
};

export default SingleBlogCard;
