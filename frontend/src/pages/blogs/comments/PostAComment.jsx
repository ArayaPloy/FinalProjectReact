import React, { useState } from 'react';
import { usePostCommentMutation } from '../../../redux/features/comments/commentsApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchBlogByIdQuery } from '../../../redux/features/blogs/blogsApi';
import Swal from 'sweetalert2';

const PostAComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [postComment] = usePostCommentMutation();

  // Refetch after posting a comment
  const { refetch } = useFetchBlogByIdQuery(id, {
    skip: !id, // Skip fetching if id is not available
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบเพื่อแสดงความคิดเห็น',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6'
      });
      navigate('/login');
      return;
    }

    // Confirm before submitting
    const result = await Swal.fire({
      title: 'ยืนยันการส่งความคิดเห็น',
      text: 'คุณแน่ใจหรือไม่ที่จะส่งความคิดเห็นนี้?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    });

    if (!result.isConfirmed) return;

    // Prepare the comment data
    const newComment = {
      comment: comment,
      user: user.id, // Prisma uses 'id' not '_id'
      postId: id, // Ensure post ID is correctly passed
    };

    try {
      // Post the comment
      const response = await postComment(newComment).unwrap();
      console.log('Comment posted successfully:', response);

      // Clear the comment input and refetch comments
      setComment('');
      refetch();
      
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'แสดงความคิดเห็นสำเร็จ',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      // Handle errors
      console.error('Failed to post comment:', err);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: err.data?.message || 'เกิดข้อผิดพลาดในการแสดงความคิดเห็น',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className='mt-8'>
      <h3 className="text-lg font-medium mb-8">ความคิดเห็น</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="text"
          id="text"
          cols="30"
          rows="10"
          className='w-full bg-bgPrimary focus:outline-none p-5'
          placeholder='แสดงความคิดเห็นของคุณเกี่ยวกับข่าวสารนี้...'
          required
        />
        <button
          type="submit"
          className='w-full mt-5 bg-primary hover:bg-amber-600 text-white font-medium py-3 rounded-md'
        >
          ส่งความคิดเห็น
        </button>
      </form>
    </div>
  );
};

export default PostAComment;