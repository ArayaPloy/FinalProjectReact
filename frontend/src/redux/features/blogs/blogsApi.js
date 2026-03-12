import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/`,
    credentials: 'include' // ส่ง cookie อัตโนมัติ
  }),
  tagTypes: ['Blogs', 'PendingBlogs'],
  endpoints: (builder) => ({

    fetchBlogCategories: builder.query({
      query: () => 'blogs/categories',
    }),

    fetchBlogs: builder.query({
      query: ({ search = '', category = '', location = '', limit = 10, page = 1 }) => 
        `blogs?search=${search}&category=${category}&location=${location}&limit=${limit}&page=${page}`,
      providesTags: ['Blogs'],
    }),

    fetchBlogById: builder.query({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `blogs/related/${id}`,
    }),

    fetchPendingBlogs: builder.query({
      query: () => 'blogs/pending',
      providesTags: ['PendingBlogs'],
    }),

    postBlog: builder.mutation({
      query: (newBlog) => ({
        url: '/blogs/create-post',
        method: 'POST',
        body: newBlog,
        credentials: 'include',
      }),
      invalidatesTags: ['Blogs', 'PendingBlogs'],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `blogs/update-post/${id}`,
        method: 'PATCH',
        body: rest,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }, 'PendingBlogs'],
    }),

    approveBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/approve/${id}`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['Blogs', 'PendingBlogs'],
    }),

    rejectBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/reject/${id}`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['PendingBlogs'],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),
  }),
});

export const { 
  useFetchBlogCategoriesQuery,
  useFetchBlogsQuery, 
  useFetchBlogByIdQuery, 
  usePostBlogMutation, 
  useUpdateBlogMutation, 
  useDeleteBlogMutation,
  useFetchRelatedBlogsQuery,
  useFetchPendingBlogsQuery,
  useApproveBlogMutation,
  useRejectBlogMutation,
} = blogsApi;
