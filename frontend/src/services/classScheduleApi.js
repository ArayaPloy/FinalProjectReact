// services/classScheduleApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const classScheduleApi = createApi({
    reducerPath: 'classScheduleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/schedules`,
        credentials: 'include',
    }),
    tagTypes: ['Schedule', 'Classes', 'Subjects', 'Teachers'],
    endpoints: (builder) => ({

        // ดึงตารางเรียนตาม class และ semester
        getSchedule: builder.query({
            query: ({ className = '', semesterId = '' } = {}) => {
                const params = new URLSearchParams();
                if (className) params.append('className', className);
                if (semesterId) params.append('semesterId', semesterId);
                return `/?${params.toString()}`;
            },
            providesTags: (result, error, arg) => [
                { type: 'Schedule', id: `${arg?.className}-${arg?.semesterId}` },
            ],
        }),

        // ดึงรายชื่อห้องเรียน
        getClasses: builder.query({
            query: () => '/classes',
            providesTags: ['Classes'],
        }),

        // ดึงรายวิชาพร้อมครูผู้สอน
        getSubjects: builder.query({
            query: () => '/subjects',
            providesTags: ['Subjects'],
        }),

        // ดึงรายชื่อครู
        getTeachersForSchedule: builder.query({
            query: () => '/teachers',
            providesTags: ['Teachers'],
        }),

        // เพิ่มคาบเรียนใหม่ (admin only)
        createScheduleEntry: builder.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Schedule', id: `${arg?.className}-${arg?.semesterId}` },
                'Schedule',
            ],
        }),

        // แก้ไขคาบเรียน (admin only)
        updateScheduleEntry: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Schedule'],
        }),

        // ลบคาบเรียน (admin only)
        deleteScheduleEntry: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Schedule'],
        }),
    }),
});

export const {
    useGetScheduleQuery,
    useGetClassesQuery,
    useGetSubjectsQuery,
    useGetTeachersForScheduleQuery,
    useCreateScheduleEntryMutation,
    useUpdateScheduleEntryMutation,
    useDeleteScheduleEntryMutation,
} = classScheduleApi;
