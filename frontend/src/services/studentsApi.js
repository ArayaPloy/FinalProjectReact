import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiURL } from '../utils/apiConfig';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiURL('/students'),
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Students', 'Classrooms', 'BehaviorScores'],
  endpoints: (builder) => ({
    /**
     * ดึงรายชื่อห้องเรียนทั้งหมด
     */
    getClassrooms: builder.query({
      query: () => '/classrooms',
      providesTags: ['Classrooms'],
      transformResponse: (response) => response.data || [],
    }),

    /**
     * ดึงข้อมูลนักเรียนพร้อมคะแนนปัจจุบัน (สำหรับหน้าบันทึกคะแนน)
     */
    getStudentsWithScores: builder.query({
      query: ({ classRoom, search = '' }) => ({
        url: '/with-scores',
        params: { classRoom, search },
      }),
      providesTags: ['Students', 'BehaviorScores'],
    }),

    /**
     * เพิ่ม endpointดึงรายชื่อนักเรียนทั้งหมด (สำหรับหน้า AllStudents)
     */
    getAllStudents: builder.query({
      query: ({ classRoom, search } = {}) => {
        const params = {};
        if (classRoom) params.classRoom = classRoom;
        if (search) params.search = search;
        return {
          url: '/all',
          params,
        };
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
        return {
          url: '',
          params,
        };
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
  }),
});

export const {
  useGetClassroomsQuery,
  useGetStudentsWithScoresQuery,
  useGetAllStudentsQuery,
  useGetStudentsQuery,
  useGetStudentByIdQuery,
} = studentsApi;
