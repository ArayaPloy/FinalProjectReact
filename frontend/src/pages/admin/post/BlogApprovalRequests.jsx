import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    useFetchPendingBlogsQuery,
    useApproveBlogMutation,
    useRejectBlogMutation,
} from "../../../redux/features/blogs/blogsApi";
import { FiRefreshCw, FiExternalLink } from "react-icons/fi";
import { MdCheckCircle, MdCancel, MdArticle, MdModeEdit } from "react-icons/md";
import { HiOutlineNewspaper } from "react-icons/hi";
import Swal from "sweetalert2";

const BlogApprovalRequests = () => {
    const {
        data: pendingPosts = [],
        isLoading,
        refetch,
    } = useFetchPendingBlogsQuery();

    const [approveBlog] = useApproveBlogMutation();
    const [rejectBlog] = useRejectBlogMutation();
    const [previewPost, setPreviewPost] = useState(null);

    const handleApprove = async (post) => {
        const isUpdate = !!post.pendingUpdateForId;
        const result = await Swal.fire({
            title: "อนุมัติคำขอ?",
            html: `<p>อนุมัติ${isUpdate ? "การแก้ไข" : "การสร้าง"}บทความ</p>
             <p class="font-semibold mt-1">"${post.title}"</p>
             <p class="text-sm text-gray-500 mt-2">โดย ${post.users_blogs_authorTousers?.username || "ไม่ระบุ"}</p>`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "อนุมัติ",
            cancelButtonText: "ยกเลิก",
        });
        if (!result.isConfirmed) return;

        try {
            await approveBlog(post.id).unwrap();
            Swal.fire({
                icon: "success",
                title: "✅ อนุมัติสำเร็จ",
                text: isUpdate
                    ? "บทความถูกอัปเดตเรียบร้อยแล้ว"
                    : "บทความถูกเผยแพร่เรียบร้อยแล้ว",
                timer: 2000,
                showConfirmButton: false,
            });
            refetch();
        } catch {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถอนุมัติบทความได้",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    const handleReject = async (post) => {
        const result = await Swal.fire({
            title: "ปฏิเสธคำขอ?",
            html: `<p>ปฏิเสธคำขอ "${post.title}"?</p>
             <p class="text-sm text-gray-500 mt-1">บทความนี้จะถูกลบออกจากระบบ</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ปฏิเสธ",
            cancelButtonText: "ยกเลิก",
        });
        if (!result.isConfirmed) return;

        try {
            await rejectBlog(post.id).unwrap();
            Swal.fire({
                icon: "success",
                title: "ปฏิเสธคำขอแล้ว",
                timer: 1500,
                showConfirmButton: false,
            });
            refetch();
        } catch {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderContentPreview = (content) => {
        try {
            const parsed =
                typeof content === "string" ? JSON.parse(content) : content;
            const blocks = parsed?.blocks || [];
            return blocks
                .slice(0, 3)
                .map((b) => b.data?.text || b.data?.items?.join(", ") || "")
                .filter(Boolean)
                .join(" • ")
                .slice(0, 200);
        } catch {
            return content?.slice?.(0, 200) || "";
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HiOutlineNewspaper className="text-indigo-600 text-2xl" />
                    <h3 className="text-lg font-bold text-gray-800">
                        คำขอโพสต์บทความ
                    </h3>
                    {pendingPosts.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingPosts.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={refetch}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-sm text-indigo-700 hover:text-indigo-900 font-medium border border-indigo-300 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                    <FiRefreshCw className={`text-base ${isLoading ? "animate-spin" : ""}`} />
                    รีเฟรช
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                </div>
            ) : pendingPosts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <MdArticle className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">ไม่มีคำขอบทความที่รอดำเนินการ</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pendingPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white border-2 border-indigo-100 rounded-xl p-4 shadow-sm hover:border-indigo-300 transition-colors"
                        >
                            <div className="flex flex-col gap-3">
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Badge: new post vs update */}
                                            {post.pendingUpdateForId ? (
                                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    <MdModeEdit className="text-sm" />
                                                    คำขอแก้ไข
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    <MdArticle className="text-sm" />
                                                    บทความใหม่
                                                </span>
                                            )}
                                            {post.blog_categories && (
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {post.blog_categories.icon} {post.blog_categories.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-semibold text-gray-800 text-base leading-snug truncate">
                                            {post.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            <span>ผู้เขียน: <strong>{post.users_blogs_authorTousers?.username || "ไม่ระบุ"}</strong></span>
                                            <span>·</span>
                                            <span>ส่งเมื่อ: {formatDate(post.createdAt)}</span>
                                        </div>
                                        {post.description && (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.description}</p>
                                        )}
                                    </div>

                                    {/* Cover image thumbnail */}
                                    {post.coverImg && (
                                        <img
                                            src={post.coverImg}
                                            alt="cover"
                                            className="w-20 h-14 object-cover rounded-lg border border-gray-200 shrink-0"
                                            onError={(e) => { e.target.style.display = "none"; }}
                                        />
                                    )}
                                </div>

                                {/* Content preview */}
                                {post.content && (
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">
                                        {renderContentPreview(post.content) || "ไม่มีเนื้อหาตัวอย่าง"}
                                    </p>
                                )}

                                {/* Action buttons */}
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <button
                                        onClick={() => handleApprove(post)}
                                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <MdCheckCircle className="text-base" />
                                        อนุมัติ
                                    </button>
                                    <button
                                        onClick={() => handleReject(post)}
                                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <MdCancel className="text-base" />
                                        ปฏิเสธ
                                    </button>
                                    <Link
                                        to={`/dashboard/update-items/${post.id}`}
                                        className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <MdModeEdit className="text-base" />
                                        แก้ไขเพิ่มเติม
                                    </Link>
                                    {post.pendingUpdateForId && (
                                        <Link
                                            to={`/blogs/${post.pendingUpdateForId}`}
                                            target="_blank"
                                            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FiExternalLink className="text-base" />
                                            ดูบทความเดิม
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{previewPost.title}</h2>
                            <button onClick={() => setPreviewPost(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">×</button>
                        </div>
                        {previewPost.coverImg && (
                            <img src={previewPost.coverImg} alt="cover" className="w-full h-52 object-cover rounded-lg mb-4" />
                        )}
                        <p className="text-gray-600 whitespace-pre-line">
                            {renderContentPreview(previewPost.content)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogApprovalRequests;
