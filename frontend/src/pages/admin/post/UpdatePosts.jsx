import React, { useEffect, useRef, useState } from "react";
import { useFetchBlogByIdQuery, useUpdateBlogMutation, useFetchBlogCategoriesQuery } from "../../../redux/features/blogs/blogsApi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list'; 
import Header from '@editorjs/header';
import { getApiURL } from "../../../utils/apiConfig";

const UpdatePosts = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // States สำหรับ upload รูปภาพ
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [hasNewImage, setHasNewImage] = useState(false); // ติดตามว่ามีการเปลี่ยนรูปหรือไม่
  
  const [PostBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const { id } = useParams();
  const { data: blog = {}, error, isLoading, refetch } = useFetchBlogByIdQuery(id);
  const { data: categories = [], isLoading: isCategoriesLoading } = useFetchBlogCategoriesQuery();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ตั้งค่าข้อมูลเริ่มต้นจาก blog ที่โหลดมา
  useEffect(() => {
    if (blog?.post) {
      setTitle(blog.post.title || "");
      setDescription(blog.post.description || "");
      setCoverImg(blog.post.coverImg || "");
      setCategoryId(blog.post.categoryId ? String(blog.post.categoryId) : "");
    }
  }, [blog]);

  // ตั้งค่า EditorJS พร้อมโหลดข้อมูลเดิม
  useEffect(() => {
    // รอให้โหลดข้อมูล blog เสร็จก่อน
    if (!blog?.post || isLoading) return;
    
    // ถ้า editor มีอยู่แล้ว ไม่ต้องสร้างใหม่
    if (editorRef.current) return;

    // Parse content จาก string เป็น object
    let initialData = { blocks: [] };
    try {
      if (blog.post.content) {
        const parsedContent = typeof blog.post.content === 'string' 
          ? JSON.parse(blog.post.content) 
          : blog.post.content;
        initialData = parsedContent;
      }
    } catch (error) {
      console.error('Error parsing content:', error);
      // ถ้า parse ไม่ได้ ใช้ description แทน
      if (blog.post.description) {
        initialData = {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: blog.post.description
              }
            }
          ]
        };
      }
    }

    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        editorRef.current = editor;
        setIsEditorReady(true);
        console.log('EditorJS is ready with existing content');
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
      data: initialData, // โหลดข้อมูลเดิม
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
  }, [blog, isLoading]); // Depend on blog and isLoading

  // จัดการเมื่อเลือกไฟล์ใหม่
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
    setHasNewImage(true);
    
    // แสดง preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // อัปโหลดรูปภาพใหม่
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
        setSelectedFile(null); // ล้าง selectedFile หลังอัปโหลดสำเร็จ
        setImagePreview(""); // ล้าง preview
        setMessage("อัปโหลดรูปภาพใหม่สำเร็จ! ✅");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setUploadError(data.message || "เกิดข้อผิดพลาดในการอัปโหลด");
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  // ยกเลิกการเปลี่ยนรูปภาพ (ใช้รูปเดิม)
  const handleCancelImageChange = () => {
    setSelectedFile(null);
    setImagePreview("");
    setHasNewImage(false);
    setUploadError("");
    // กลับไปใช้รูปเดิมจาก blog
    if (blog?.post?.coverImg) {
      setCoverImg(blog.post.coverImg);
    }
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

      const updatedPost = {
        title: title || blog.post.title,
        content, // ส่ง object ไป backend จะ stringify เอง
        coverImg: coverImg || blog.post.coverImg,
        categoryId: categoryId ? parseInt(categoryId) : blog.post.categoryId,
        description: description || blog.post.description,
        author: user.id,
      };

      console.log('Updating post data:', updatedPost);
      
      const response = await PostBlog({ id, ...updatedPost }).unwrap();
      console.log('Update response:', response);
      
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: response.message || 'แก้ไขบทความเรียบร้อยแล้ว',
        timer: 2000,
        showConfirmButton: false
      });
      
      refetch();
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'แก้ไขบทความไม่สำเร็จ กรุณาลองอีกครั้ง',
        confirmButtonColor: '#d97706'
      });
    }
  };

  return (
    <div className="bg-white md:p-8 p-2">
      <h2 className="text-2xl font-semibold">แก้ไขบทความ</h2>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
          ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง
        </div>
      )}

      {!isLoading && blog?.post && (
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
                แก้ไขเนื้อหาบทความ 
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
                
                {/* แสดงรูปปัจจุบัน */}
                <div className="relative">
                  <img 
                    src={imagePreview || coverImg} 
                    alt="Cover" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {hasNewImage && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <i className="bi bi-check-circle-fill mr-1"></i>
                      รูปใหม่
                    </div>
                  )}
                </div>

                {/* File Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    {hasNewImage ? "เลือกรูปใหม่อีกครั้ง (ถ้าต้องการ):" : "เปลี่ยนรูปภาพปก:"}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  
                  {/* ปุ่มสำหรับจัดการรูปภาพ */}
                  {hasNewImage && (
                    <div className="flex gap-2">
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={isUploading}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <i className="bi bi-arrow-repeat animate-spin"></i>
                              กำลังอัปโหลด...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-cloud-upload"></i>
                              อัปโหลดรูปใหม่
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleCancelImageChange}
                        className={`${selectedFile ? 'flex-1' : 'w-full'} bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
                      >
                        <i className="bi bi-x-circle"></i>
                        ใช้รูปเดิม
                      </button>
                    </div>
                  )}
                  
                  {/* แสดง error */}
                  {uploadError && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <i className="bi bi-exclamation-circle"></i>
                      {uploadError}
                    </p>
                  )}
                  
                  {/* แสดงสถานะ */}
                  {hasNewImage && !selectedFile && coverImg && (
                    <p className="text-green-600 text-sm flex items-center gap-1">
                      <i className="bi bi-check-circle-fill"></i>
                      อัปโหลดรูปใหม่สำเร็จ (กด Submit เพื่อบันทึก)
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
                  value={description}
                  className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เพิ่มคำอธิบายเมตาเพื่อเพิ่มประสิทธิภาพ SEO..."
                  required
                />
              </div>

              {/* ผู้เขียน */}
              <div className="space-y-3">
                <label className="font-semibold">ผู้แก้ไข: </label>
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
            disabled={isUpdating || !isEditorReady || !categoryId}
            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isUpdating ? "กำลังบันทึก..." : !isEditorReady ? "กำลังโหลด Editor..." : !categoryId ? "กรุณาเลือกหมวดหมู่" : "อัปเดตบทความ"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdatePosts;