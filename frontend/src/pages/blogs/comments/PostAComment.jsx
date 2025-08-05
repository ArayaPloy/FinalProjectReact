import React, { useState } from 'react';
import { usePostCommentMutation } from '../../../redux/features/comments/commentsApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchBlogByIdQuery } from '../../../redux/features/blogs/blogsApi';

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
      alert('คุณต้องเข้าสู่ระบบเพื่อแสดงความคิดเห็น');
      navigate('/login');
      return;
    }

    // Confirm before submitting
    const isConfirmed = window.confirm('คุณแน่ใจหรือไม่ที่จะส่งความคิดเห็นนี้?');
    if (!isConfirmed) return;

    // Prepare the comment data
    const newComment = {
      comment: comment,
      user: user._id, // Ensure user ID is correctly passed
      postId: id, // Ensure post ID is correctly passed
    };

    try {
      // Post the comment
      const response = await postComment(newComment).unwrap();
      console.log('Comment posted successfully:', response);

      // Clear the comment input and refetch comments
      setComment('');
      refetch();
      alert('แสดงความคิดเห็นสำเร็จ!');
    } catch (err) {
      // Handle errors
      console.error('Failed to post comment:', err);
      alert(err.data?.message || 'เกิดข้อผิดพลาดในการแสดงความคิดเห็น');
    }
  };

  return (
    <div className='mt-8'>
      <h3 className="text-lg font-medium mb-8">Leave a Comment</h3>
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