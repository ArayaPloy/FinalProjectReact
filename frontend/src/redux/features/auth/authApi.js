import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/auth`,
    credentials: "include",
  }),
  tagTypes: ['User'],
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
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
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
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} = authApi;

export default authApi;
