import React, { useEffect, useRef, useState } from "react";
import { usePostBlogMutation } from "../../../redux/features/blogs/blogsApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list'; 
import Header from '@editorjs/header';

const AddPost = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [PostBlog, { isLoading }] = usePostBlogMutation();

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ตั้งค่า editor js
  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        editorRef.current = editor;
      },
      autofocus: true,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true 
        },
        list: { 
          class: List, 
          inlineToolbar: true 
        },
      },
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const content = await editorRef.current.save();
      const newPost = {
        title, 
        content,
        coverImg, 
        category, 
        description: metaDescription,
        author: user.id,
      };
      const response = await PostBlog(newPost).unwrap();
      alert(response.message);
      navigate("/blogs");
    } catch (error) {
      console.error(error);
      setMessage("เพิ่มบทความไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  }

  return (
    <div className="bg-white md:p-8 p-2">
      <h2 className="text-2xl font-semibold">สร้างบทความใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-5 pt-8">
        <div className="space-y-4">
          <label className="font-semibold text-xl">หัวข้อบทความ: </label>
          <input
            type="text"
            value={title}
            className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น: กิจกรรมปลูกต้นไม้"
            required
          />
        </div>

        {/* รายละเอียดบทความ */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* ด้านซ้าย */}
          <div className="md:w-2/3 w-full">
            <p className="font-semibold text-xl mb-5">ส่วนเนื้อหา</p>
            <p className="text-sm text-gray-600 mb-4">เขียนเนื้อหาบทความของคุณที่นี่...</p>
            <div id="editorjs" className="bg-gray-100 p-4 rounded-lg"></div>
          </div>

          {/* ด้านขวา */}
          <div className="md:w-1/3 w-full bg-gray-50 p-6 rounded-lg shadow-sm space-y-5">
            <p className="font-semibold text-xl">รูปแบบบทความ</p>

            {/* รูปภาพ */}
            <div className="space-y-3">
              <label className="font-semibold">ภาพปกบทความ: </label>
              <input
                type="text"
                value={coverImg}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                onChange={(e) => setCoverImg(e.target.value)}
                placeholder="เช่น: https://unsplash.com/photos/a-wooden-table.png"
                required
              />
            </div>

            {/* หมวดหมู่ */}
            <div className="space-y-3">
              <label className="font-semibold">หมวดหมู่: </label>
              <input
                type="text"
                value={category}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                onChange={(e) => setCategory(e.target.value)}
                placeholder="เช่น: กิจกรรม/สิ่งแวดล้อม"
                required
              />
            </div>

            {/* คำอธิบายเมตา */}
            <div className="space-y-3">
              <label className="font-semibold">คำอธิบายเมตา: </label>
              <textarea
                type="text"
                cols={4}
                rows={4}
                value={metaDescription}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="เพิ่มคำอธิบายเมตาเพื่อเพิ่มประสิทธิภาพ SEO..."
                required
              />
            </div>

            {/* ผู้เขียน */}
            <div className="space-y-3">
              <label className="font-semibold">ผู้เขียน: </label>
              <input
                type="text"
                value={user.username}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                placeholder={`${user.username} (ไม่สามารถแก้ไขได้)`}
                disabled
              />
            </div>
          </div>
        </div>

        {message && <p className="text-red-500">{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {isLoading ? "กำลังบันทึก..." : "เพิ่มบทความ"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;