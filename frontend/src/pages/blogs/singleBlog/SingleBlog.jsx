import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchBlogByIdQuery } from "../../../redux/features/blogs/blogsApi";
import SingleBlogCard from "./SingleBlogCard";
import CommentCard from "../comments/CommentCard";
import RelatedBlogs from "./RelatedBlogs";

const SingleBlog = () => {
  const { id } = useParams();

  // Scroll to top เมื่อ id เปลี่ยน
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  const { data: blog = {}, error, isLoading } = useFetchBlogByIdQuery(id, {
    skip: !id, // ป้องกันการ fetch ถ้า id เป็น undefined
    refetchOnMountOrArgChange: true // Refetch เมื่อ id เปลี่ยน
  });

  // ถ้า id เป็น undefined ให้แสดง loading
  if (!id) {
    return (
      <div className="text-primary container mx-auto mt-8">
        <div className="text-center py-8">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="text-primary container mx-auto mt-8">
      <div>
        {isLoading && <div className="text-center py-8">กำลังโหลด...</div>}
        {error && <div className="text-red-600 text-center py-8">เกิดข้อผิดพลาด: {error.message}</div>}
        {blog?.post && (
          <div className="flex flex-col lg:flex-row justify-between items-start md:gap-4 gap-2">
            <div className="lg:w-2/3">
              <SingleBlogCard blog={blog.post} />
              <CommentCard comments={blog?.comments || []} />
            </div>
            <div className="bg-white lg:w-1/3 w-full">
              <RelatedBlogs key={id} blogId={id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleBlog;
