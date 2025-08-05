import React, { useEffect, useRef, useState } from "react";
import { useFetchBlogByIdQuery, useUpdateBlogMutation } from "../../../redux/features/blogs/blogsApi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list'; 
import Header from '@editorjs/header';

const UpdatePosts = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [PostBlog] = useUpdateBlogMutation();
  const { id } = useParams();
  const { data: blog = {}, error, isLoading, refetch } = useFetchBlogByIdQuery(id);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Initialize editor js with default content
  useEffect(() => {
    if (blog.post) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onReady: () => {
          editorRef.current = editor;
          editor.isReady.then(() => {
            editor.render(blog.post.content);
          });
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
        data: blog.post.content, // Set the default content
      });

      return () => {
        editor.destroy();
        editorRef.current = null;
      };
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const content = await editorRef.current.save();
      const updatedPost = {
        title: title || blog.post.title,
        content,
        coverImg: coverImg || blog.post.coverImg,
        category: category || blog.post.category,
        description: description || blog.post.metaDescription,
        author: user.id,
      };
      console.log(updatedPost);
      const response = await PostBlog({ id, ...updatedPost }).unwrap();
      console.log(response);
      alert(response.message);
      refetch();
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update blog post. Please try again.");
    }
  };

  return (
    <div className="bg-white md:p-8 p-2">
      <h2 className="text-2xl font-semibold pt-5">Edit or Update Post</h2>
      <form onSubmit={handleSubmit} className="space-y-5 pt-8">
        <div className="space-y-4">
          <label className="font-semibold text-xl">Blog Title: </label>
          <input
            type="text"
            defaultValue={blog?.post?.title}
            className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Marina del Rey Marriott"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="md:w-2/3 w-full">
            <p className="font-semibold text-xl mb-5">Content Section</p>
            <div id="editorjs" className="bg-gray-100 p-4 rounded-lg"></div>
          </div>

          <div className="md:w-1/3 w-full bg-gray-50 p-6 rounded-lg shadow-sm space-y-5">
            <p className="font-semibold text-xl">Blog Format</p>

            <div className="space-y-3">
              <label className="font-semibold">Blog Cover: </label>
              <input
                type="text"
                defaultValue={blog?.post?.coverImg}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                onChange={(e) => setCoverImg(e.target.value)}
                placeholder="Ex: https://unsplash.com/photos/a-wooden-table.png"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="font-semibold">Category: </label>
              <input
                type="text"
                defaultValue={blog?.post?.category}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Rooftop/Gardening/something"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="font-semibold">Meta Data: </label>
              <textarea
                type="text"
                cols={4}
                rows={4}
                defaultValue={blog?.post?.description}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add Meta Data to increase SEO performance..."
                required
              />
            </div>

            <div className="space-y-3">
              <label className="font-semibold">Author: </label>
              <input
                type="text"
                value={user.username}
                className="w-full inline-block bg-gray-100 focus:outline-none px-5 py-3 rounded-lg"
                placeholder={`${user.username} (not editable)`}
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
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default UpdatePosts;