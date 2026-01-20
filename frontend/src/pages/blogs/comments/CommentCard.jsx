import React, { useState } from "react";
import CommentorIcon from "../../../assets/commentor.png";
import { formatDate } from "../../../utils/dateFormater";
import PostAComment from "./PostAComment";
import { useSelector } from "react-redux";
import { 
  useUpdateCommentMutation, 
  useDeleteCommentMutation,
  useGetPostCommentsQuery 
} from "../../../redux/features/comments/commentsApi";
import Swal from "sweetalert2";
import { Edit2, Trash2, Save, X } from "lucide-react";

const CommentCard = ({ postId }) => {
  const user = useSelector((state) => state.auth.user);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  
  // ดึงข้อมูล comments จาก API
  const { data: comments = [], isLoading, error } = useGetPostCommentsQuery(postId, {
    skip: !postId
  });
  
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  
  const getApiURL = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const getBaseURL = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    return apiUrl.replace('/api', '');
  };
  
  // ตรวจสอบว่าเป็นเจ้าของคอมเมนต์หรือไม่
  const isCommentOwner = (comment) => {
    return user && comment?.users?.id === user.id;
  };

  // ตรวจสอบว่าเป็นแอดมินหรือไม่
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'super_admin');
  };

  // เริ่มแก้ไขคอมเมนต์
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment(comment.comment);
  };

  // ยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment("");
  };

  // บันทึกการแก้ไข
  const handleSaveEdit = async (commentId) => {
    if (!editedComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกความคิดเห็น',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      await updateComment({ 
        commentId, 
        comment: editedComment
      }).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'แก้ไขสำเร็จ!',
        text: 'แก้ไขความคิดเห็นเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });
      
      setEditingCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error('Error updating comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.data?.message || 'ไม่สามารถแก้ไขความคิดเห็นได้',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // ลบคอมเมนต์
  const handleDelete = async (commentId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: 'คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await deleteComment(commentId).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ!',
        text: 'ลบความคิดเห็นเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.data?.message || 'ไม่สามารถลบความคิดเห็นได้',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="my-6 bg-white p-8">
      <div>
        {isLoading && <div className="text-center py-4">กำลังโหลดความคิดเห็น...</div>}
        {error && <div className="text-red-600">เกิดข้อผิดพลาดในการโหลดความคิดเห็น</div>}
        {!isLoading && !error && (
          <>
            {
              comments?.length > 0 ? <div>
            <h3 className="text-lg font-medium">ความคิดเห็นทั้งหมด</h3>
            <div>
              {comments.map((comment, index) => (
                <div key={index} className="mt-4">
                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img 
                        src={
                          comment?.users?.profileImage 
                            ? `${getBaseURL()}${comment.users.profileImage}?t=${Date.now()}` 
                            : CommentorIcon
                        } 
                        alt="Profile" 
                        className="h-14 w-14 rounded-full object-cover border-2 border-gray-200" 
                      />
                      <div className="space-y-1">
                        <p className="text-lg font-medium underline capitalize underline-offset-4 text-blue-400">
                          {comment?.users?.username}
                        </p>
                        <p className="text-[12px] italic">
                          {formatDate(comment?.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* ปุ่ม Edit/Delete - แสดงเฉพาะเจ้าของหรือแอดมิน */}
                    {(isCommentOwner(comment) || isAdmin()) && (
                      <div className="flex gap-2">
                        {isCommentOwner(comment) && (
                          <>
                            {editingCommentId === comment.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(comment.id)}
                                  disabled={isUpdating}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                  <Save className="w-4 h-4" />
                                  <span className="text-sm">บันทึก</span>
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={isUpdating}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />
                                  <span className="text-sm">ยกเลิก</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(comment)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="text-sm">แก้ไข</span>
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={isDeleting}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">ลบ</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* comment details */}
                  <div className="text-gray-600 mt-5 border p-8">
                    {editingCommentId === comment.id ? (
                      <textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        className="w-full md:w-4/5 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                        placeholder="แก้ไขความคิดเห็น..."
                      />
                    ) : (
                      <p className="md:w-4/5">{comment.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div> : (<div className="text-lg font-medium">ไม่มีความคิดเห็น!</div>)
            }
          </>
        )}
      </div>

      {/* add comment section */}
      <PostAComment postId={postId} />
    </div>
  );
};

export default CommentCard;
