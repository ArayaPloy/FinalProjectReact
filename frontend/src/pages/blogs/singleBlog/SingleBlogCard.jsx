import React from 'react';
import { formatDate } from '../../../utilis/dateFormater';
import { motion } from 'framer-motion';
import EditorJSHTML from 'editorjs-html';

const editorJSHTML = EditorJSHTML();

const SingleBlogCard = ({ blog }) => {
  const { title, createdAt, authorUser, content, coverImg } = blog || {};

  let htmlContent = '';
  if (content) {
    try {
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      htmlContent = editorJSHTML.parse(parsedContent).join('');
    } catch (err) {
      console.error('Error parsing blog content:', err);
      htmlContent = '<p>Invalid content format</p>';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white p-4 md:p-6 rounded-lg shadow-lg"
    >
      {/* header */}
      <div>
        <h1 className="md:text-4xl text-3xl font-medium mb-4">{title}</h1>
        <p className="mb-6">
          {createdAt ? formatDate(createdAt) : ''} by
          <span className="text-blue-400 cursor-pointer"> {authorUser?.username}</span>
        </p>
      </div>

      {coverImg && (
        <div>
          <img src={coverImg} alt="cover" className="w-full bg-cover" />
        </div>
      )}

      {/* details */}
      <div className="mt-8 space-y-4">
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="space-y-3 editorjsdiv"
        />
      </div>
      <br /><br />
    </motion.div>
  );
};

export default SingleBlogCard;
