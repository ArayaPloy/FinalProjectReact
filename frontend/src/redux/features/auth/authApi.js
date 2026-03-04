import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/auth`,
    credentials: "include",
  }),
  tagTypes: ['User', 'PasswordReset'],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",   
        body: credentials,
      }),
      // ล้าง cache ของ /me ที่อาจเก็บ 401 ค้างไว้ก่อน login
      // เพื่อบังคับ AuthProvider refetch /me ใหม่หลัง login สำเร็จ
      invalidatesTags: ['User'],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ['User'],
      // Don't retry on 401 errors
      extraOptions: { maxRetries: 0 },
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ['User'],
    }),
    getUserStats: builder.query({
      query: () => ({
        url: "/users/stats",
        method: "GET",
      }),
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, roleId, username }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { roleId, username },
      }),
      refetchOnMount: true,
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch({ type: 'usersApi/invalidateTags', payload: ['Profile'] });
        } catch {}
      },
    }),
    getPasswordResetRequests: builder.query({
      query: () => ({ url: "/password-reset-requests", method: "GET" }),
      providesTags: ['PasswordReset'],
    }),
    approvePasswordReset: builder.mutation({
      query: (id) => ({ url: `/password-reset-requests/${id}/approve`, method: "POST" }),
      invalidatesTags: ['PasswordReset'],
    }),
    rejectPasswordReset: builder.mutation({
      query: (id) => ({ url: `/password-reset-requests/${id}/reject`, method: "POST" }),
      invalidatesTags: ['PasswordReset'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useGetUserQuery,
  useGetUserStatsQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useGetPasswordResetRequestsQuery,
  useApprovePasswordResetMutation,
  useRejectPasswordResetMutation,
} = authApi;

export default authApi;
