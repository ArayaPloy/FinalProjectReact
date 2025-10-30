import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiURL } from '../utils/apiConfig';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiURL('/students'),
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
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
     * ดึงรายชื่อนักเรียน
     */
    getStudents: builder.query({
      query: ({ classRoom, search } = {}) => ({
        url: '/',
        params: { classRoom, search },
      }),
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
  useGetStudentsQuery,
  useGetStudentByIdQuery,
} = studentsApi;
