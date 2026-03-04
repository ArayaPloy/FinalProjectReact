// services/subjectsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const subjectsApi = createApi({
    reducerPath: 'subjectsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/subjects`,
        credentials: 'include',
    }),
    tagTypes: ['Subjects', 'Departments', 'Teachers'],
    endpoints: (builder) => ({

        // ดึงรายวิชาทั้งหมด (พร้อม filter)
        getSubjects: builder.query({
            query: ({ search = '', departmentId = '' } = {}) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (departmentId) params.append('departmentId', departmentId);
                return `/?${params.toString()}`;
            },
            providesTags: ['Subjects'],
        }),

        // ดึงวิชาเดี่ยวตาม id
        getSubjectById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Subjects', id }],
        }),

        // ดึงรายชื่อแผนก
        getDepartments: builder.query({
            query: () => '/departments',
            providesTags: ['Departments'],
        }),

        // ดึงรายชื่อครูทั้งหมด (สำหรับ assign)
        getAllTeachers: builder.query({
            query: () => '/teachers',
            providesTags: ['Teachers'],
        }),

        // เพิ่มวิชาใหม่ (admin)
        createSubject: builder.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Subjects'],
        }),

        // แก้ไขวิชา (admin)
        updateSubject: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Subjects'],
        }),

        // ลบวิชา (soft delete, admin)
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subjects'],
        }),

        // เพิ่มครูผู้สอนให้วิชา (admin)
        assignTeacher: builder.mutation({
            query: ({ subjectId, teacherId }) => ({
                url: `/${subjectId}/teachers`,
                method: 'POST',
                body: { teacherId },
            }),
            invalidatesTags: ['Subjects'],
        }),

        // ลบครูผู้สอนออกจากวิชา (admin)
        removeTeacher: builder.mutation({
            query: ({ subjectId, teacherId }) => ({
                url: `/${subjectId}/teachers/${teacherId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subjects'],
        }),
    }),
});

export const {
    useGetSubjectsQuery,
    useGetSubjectByIdQuery,
    useGetDepartmentsQuery,
    useGetAllTeachersQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useAssignTeacherMutation,
    useRemoveTeacherMutation,
} = subjectsApi;
