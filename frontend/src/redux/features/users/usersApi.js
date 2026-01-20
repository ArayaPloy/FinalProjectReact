import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/profile`,
    credentials: "include", // ✅ ส่ง cookie ไปด้วยทุกครั้ง
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // ดึงข้อมูลโปรไฟล์
    getProfile: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ['Profile'],
    }),
    
    // อัปเดตข้อมูลโปรไฟล์ (username, email, phone)
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['Profile'], // Refetch หลังอัปเดต
    }),
    
    // เปลี่ยนรหัสผ่าน
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/password",
        method: "PATCH",
        body: data,
      }),
    }),
    
    // อัปโหลดรูปโปรไฟล์
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "/upload-image",
        method: "POST",
        body: formData, // ส่งเป็น FormData
      }),
      invalidatesTags: ['Profile'],
    }),
    
    // Admin รีเซ็ตรหัสผ่าน user อื่น
    adminResetPassword: builder.mutation({
      query: ({ userId, newPassword }) => ({
        url: `/admin/reset-password/${userId}`,
        method: "PATCH",
        body: { newPassword },
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadProfileImageMutation,
  useAdminResetPasswordMutation,
} = usersApi;
