import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/profile`,
    credentials: "include", // ส่ง cookie ไปด้วยทุกครั้ง
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
      // อัปเดตข้อมูลผู้ใช้ใน authApi ด้วย (สำหรับหน้าจัดการผู้ใช้)
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate cache ของ authApi และ teachersApi
          dispatch({ type: 'authApi/invalidateTags', payload: ['User'] });
          dispatch({ type: 'teachersApi/invalidateTags', payload: ['Teachers'] });
        } catch {}
      },
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

    // ครูแก้ไขข้อมูลตัวเองใน teachers table (phoneNumber, email, biography, specializations)
    updateTeacherProfile: builder.mutation({
      query: (data) => ({
        url: "/teacher",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['Profile'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate teachers cache เพื่อให้หน้าบุคลากร (FacultyStaff) โหลดใหม่
          dispatch({ type: 'teachersApi/invalidateTags', payload: ['Teachers', 'Teacher'] });
        } catch {}
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadProfileImageMutation,
  useAdminResetPasswordMutation,
  useUpdateTeacherProfileMutation,
} = usersApi;
