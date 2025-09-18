import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Assuming you have an auth slice with a token
      if (token) { 
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include'}),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({

    fetchBlogs: builder.query({
      query: ({ search = '', category = '', location='' }) => `blogs?search=${search}&category=${category}&location=${location}`,
      providesTags: ['Blogs'],
    }),

    fetchBlogById: builder.query({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `blogs/related/${id}`, // ส่ง id ไปยังเซิร์ฟเวอร์
    }),

    postBlog: builder.mutation({
      query: (newBlog) => ({
        url: '/blogs/create-post',
        method: 'POST',
        body: newBlog,
        credentials: 'include',
      }),
      invalidatesTags: ['Blogs'],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `blogs/update-post/${id}`,
        method: 'PATCH',
        body: rest,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }],
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
  useFetchBlogsQuery, 
  useFetchBlogByIdQuery, 
  usePostBlogMutation, 
  useUpdateBlogMutation, 
  useDeleteBlogMutation ,
  useFetchRelatedBlogsQuery,
} = blogsApi;
