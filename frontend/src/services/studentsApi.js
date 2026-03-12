import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiURL } from '../utils/apiConfig';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiURL('/students'),
    credentials: 'include',
  }),
  tagTypes: ['Students', 'Classrooms', 'BehaviorScores'],
  endpoints: (builder) => ({
    /**
     * ดึงรายชื่อห้องเรียนทั้งหมด (string array)
     */
    getClassrooms: builder.query({
      query: () => '/classrooms',
      providesTags: ['Classrooms'],
      transformResponse: (response) => response.data || [],
    }),

    /**
     * ดึงรายชื่อห้องเรียนพร้อมข้อมูลครูประจำชั้น
     */
    getClassroomsFull: builder.query({
      query: () => '/classrooms-full',
      providesTags: ['Classrooms'],
      transformResponse: (response) => response.data || [],
    }),

    /**
     * ดึงรายการเพศทั้งหมด
     */
    getGenders: builder.query({
      query: () => '/genders',
      transformResponse: (response) => response.data || [],
    }),

    /**
     * ดึงข้อมูลนักเรียนในห้องพร้อมคะแนนปัจจุบัน (สำหรับหน้าบันทึกคะแนน)
     */
    getStudentsWithScores: builder.query({
      query: ({ classRoom, search = '' }) => ({
        url: '/with-scores',
        params: { classRoom, search },
      }),
      providesTags: ['Students', 'BehaviorScores'],
    }),

    /**
     * ดึงรายชื่อนักเรียนทั้งหมด (สำหรับหน้า AllStudents / ManageStudent)
     */
    getAllStudents: builder.query({
      query: ({ classRoom, search, includeDeleted } = {}) => {
        const params = {};
        if (classRoom) params.classRoom = classRoom;
        if (search) params.search = search;
        if (includeDeleted) params.includeDeleted = 'true';
        return { url: '/all', params };
      },
      providesTags: ['Students'],
    }),

    /**
     * ดึงรายชื่อนักเรียน
     */
    getStudents: builder.query({
      query: ({ classRoom, search } = {}) => {
        const params = {};
        if (classRoom) params.classRoom = classRoom;
        if (search) params.search = search;
        return { url: '', params };
      },
      providesTags: ['Students'],
    }),

    /**
     * ดึงข้อมูลนักเรียนตาม ID
     */
    getStudentById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),

    /**
     * สร้างนักเรียนใหม่
     */
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: '',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Students'],
    }),

    /**
     * แก้ไขข้อมูลนักเรียนทั้งหมด
     */
    updateStudent: builder.mutation({
      query: ({ id, ...studentData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: studentData,
      }),
      invalidatesTags: (result, error, { id }) => ['Students', { type: 'Students', id }],
    }),

    /**
     * เปิด/ปิดการใช้งานนักเรียน
     */
    toggleStudent: builder.mutation({
      query: (id) => ({
        url: `/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Students'],
    }),

    /**
     * ลบนักเรียน (soft delete)
     */
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Students'],
    }),

    /**
     * นำเข้าข้อมูลนักเรียนจากไฟล์ CSV
     */
    importStudents: builder.mutation({
      query: (body) => ({
        url: '/import',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Students'],
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useGetClassroomsFullQuery,
  useGetGendersQuery,
  useGetStudentsWithScoresQuery,
  useGetAllStudentsQuery,
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useToggleStudentMutation,
  useDeleteStudentMutation,
  useImportStudentsMutation,
} = studentsApi;
