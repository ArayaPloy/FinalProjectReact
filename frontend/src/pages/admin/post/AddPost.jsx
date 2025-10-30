import React, { useEffect, useRef, useState } from "react";
import { usePostBlogMutation, useFetchBlogCategoriesQuery } from "../../../redux/features/blogs/blogsApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list'; 
import Header from '@editorjs/header';
import { getApiURL } from "../../../utils/apiConfig";

const AddPost = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // States สำหรับ upload รูปภาพ
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const [PostBlog, { isLoading }] = usePostBlogMutation();
  const { data: categories = [], isLoading: isCategoriesLoading } = useFetchBlogCategoriesQuery();

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ตั้งค่า editor js
  useEffect(() => {
    // ถ้า editor มีอยู่แล้ว ไม่ต้องสร้างใหม่
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        editorRef.current = editor;
        setIsEditorReady(true);
        console.log('EditorJS is ready');
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
      placeholder: 'เขียนเนื้อหาบทความที่นี่...',
    });

    // Cleanup function
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsEditorReady(false);
      }
    };
  }, []); // Empty dependency array - สร้างครั้งเดียว

  // จัดการเมื่อเลือกไฟล์
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setUploadError("");
    
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("กรุณาเลือกไฟล์รูปภาพ (JPEG, JPG, PNG, GIF, WEBP)");
      return;
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("ขนาดไฟล์ใหญ่เกินไป (สูงสุด 5MB)");
      return;
    }

    setSelectedFile(file);
    
    // แสดง preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // อัพโหลดรูปภาพ
  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadError("กรุณาเลือกไฟล์รูปภาพก่อน");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // ใช้ getApiURL แทนการ hardcode URL
      const uploadURL = getApiURL('/upload/image');
      
      const response = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCoverImg(data.imageUrl);
        setMessage("อัพโหลดรูปภาพสำเร็จ! ✅");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setUploadError(data.message || "เกิดข้อผิดพลาดในการอัพโหลด");
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  // ลบรูปภาพที่เลือก
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    setCoverImg("");
    setUploadError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบว่า editor พร้อมหรือยัง
    if (!editorRef.current || !isEditorReady) {
      setMessage("กรุณารอสักครู่ Editor กำลังโหลด...");
      return;
    }

    try {
      // บันทึกข้อมูลจาก EditorJS
      const content = await editorRef.current.save();
      
      // ตรวจสอบว่ามีเนื้อหาหรือไม่
      if (!content.blocks || content.blocks.length === 0) {
        setMessage("กรุณาเพิ่มเนื้อหาบทความ");
        return;
      }

      const newPost = {
        title, 
        content, // ส่ง object ไป backend จะ stringify เอง
        coverImg, 
        categoryId: categoryId ? parseInt(categoryId) : null, 
        description: metaDescription,
        author: user.id,
      };

      console.log('Sending post data:', newPost);
      
      const response = await PostBlog(newPost).unwrap();
      alert(response.message);
      navigate("/blogs");
    } catch (error) {
      console.error('Error creating post:', error);
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
            <p className="text-sm text-gray-600 mb-4">
              เขียนเนื้อหาบทความ 
              {isEditorReady && <span className="text-green-600 ml-2">● พร้อมใช้งาน</span>}
              {!isEditorReady && <span className="text-orange-600 ml-2">● กำลังโหลด...</span>}
            </p>
            <div id="editorjs" className="bg-gray-100 p-4 rounded-lg min-h-[300px]"></div>
          </div>

          {/* ด้านขวา */}
          <div className="md:w-1/3 w-full bg-gray-50 p-6 rounded-lg shadow-sm space-y-5">
            <p className="font-semibold text-xl">รูปแบบบทความ</p>

            {/* รูปภาพ - File Upload */}
            <div className="space-y-3">
              <label className="font-semibold">ภาพปกบทความ: </label>
              
              {/* แสดง preview หรือ URL ที่อัพโหลดแล้ว */}
              {(imagePreview || coverImg) && (
                <div className="relative">
                  <img 
                    src={imagePreview || coverImg} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="ลบรูปภาพ"
                  >
                    <i className="bi bi-trash text-lg"></i>
                  </button>
                </div>
              )}

              {/* File Input */}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                
                {/* ปุ่มอัพโหลด */}
                {selectedFile && !coverImg && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin"></i>
                        กำลังอัพโหลด...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-upload"></i>
                        อัพโหลดรูปภาพ
                      </>
                    )}
                  </button>
                )}
                
                {/* แสดง error */}
                {uploadError && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <i className="bi bi-exclamation-circle"></i>
                    {uploadError}
                  </p>
                )}
                
                {/* แสดง URL ที่อัพโหลดสำเร็จ */}
                {coverImg && (
                  <p className="text-green-600 text-sm flex items-center gap-1">
                    <i className="bi bi-check-circle-fill"></i>
                    อัพโหลดสำเร็จ
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500">
                รองรับ: JPEG, JPG, PNG, GIF, WEBP (สูงสุด 5MB)
              </p>
            </div>

            {/* หมวดหมู่ */}
            <div className="space-y-3">
              <label className="font-semibold">หมวดหมู่: </label>
              {isCategoriesLoading ? (
                <div className="w-full bg-gray-100 px-5 py-3 rounded-lg text-gray-500">
                  กำลังโหลดหมวดหมู่...
                </div>
              ) : (
                <select
                  value={categoryId}
                  className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg cursor-pointer"
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon && `${cat.icon} `}{cat.name}
                    </option>
                  ))}
                </select>
              )}
              {categories.length === 0 && !isCategoriesLoading && (
                <p className="text-sm text-orange-600">
                  <i className="bi bi-exclamation-triangle"></i> ไม่พบหมวดหมู่ในระบบ
                </p>
              )}
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

        {message && <p className="text-red-500 text-center font-medium">{message}</p>}
        <button
          type="submit"
          disabled={isLoading || !isEditorReady || !coverImg || !categoryId}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "กำลังบันทึก..." : !isEditorReady ? "กำลังโหลด Editor..." : !coverImg ? "กรุณาอัพโหลดรูปภาพปก" : !categoryId ? "กรุณาเลือกหมวดหมู่" : "เพิ่มบทความ"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;