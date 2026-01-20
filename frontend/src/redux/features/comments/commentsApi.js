// commentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/comments`,
        credentials: 'include',
    }),
    tagTypes: ['Comments'],
    endpoints: (builder) => ({
        postComment: builder.mutation({
            query: (commentData) => ({
                url: '/post-comment',
                method: 'POST',
                body: commentData,
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Comments', id: postId },
                { type: 'Comments', id: 'LIST' }
            ],
        }),
        updateComment: builder.mutation({
            query: ({ commentId, comment }) => ({
                url: `/update/${commentId}`,
                method: 'PATCH',
                body: { comment },
            }),
            // Invalidate ทันทีหลัง mutation สำเร็จ
            invalidatesTags: ['Comments'],
        }),
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `/delete/${commentId}`,
                method: 'DELETE',
            }),
            // Invalidate ทันทีหลัง mutation สำเร็จ
            invalidatesTags: ['Comments'],
        }),
        getComments: builder.query({
            query: () => ({
                url: '/total-comments',
            }),
            providesTags: [{ type: 'Comments', id: 'LIST' }],
        }),
        getPostComments: builder.query({
            query: (postId) => ({
                url: `/post/${postId}`,
            }),
            providesTags: (result, error, postId) => [
                { type: 'Comments', id: postId },
                { type: 'Comments', id: 'LIST' }
            ],
        }),
    }),
});

export const { 
    usePostCommentMutation, 
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useGetCommentsQuery,
    useGetPostCommentsQuery 
} = commentApi;

export default commentApi;
