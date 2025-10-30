import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const flagpoleAttendanceApi = createApi({
  reducerPath: 'flagpoleAttendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include'
  }),
  tagTypes: ['FlagpoleAttendance', 'Students', 'AttendanceStatuses'],
  endpoints: (builder) => ({
    // ดึงรายการสถานะการเช็คชื่อ (จากตาราง attendancestatuses)
    getAttendanceStatuses: builder.query({
      query: () => '/attendance-statuses',
      transformResponse: (response) => response.data,
      providesTags: ['AttendanceStatuses']
    }),

    // ดึงรายชื่อห้องเรียนที่มีอยู่ (distinct จากตาราง students.classRoom)
    getClassRooms: builder.query({
      query: () => '/students/classrooms',
      transformResponse: (response) => response.data
    }),

    // ดึงรายชื่อนักเรียนตามห้องเรียน (จากตาราง students)
    getStudentsByClassRoom: builder.query({
      query: (classRoom) => ({
        url: '/students',
        params: { classRoom }
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Students']
    }),

    // ดึงข้อมูลการเช็คชื่อตามวันที่และห้องเรียน (จากตาราง flagpoleattendance)
    getFlagpoleAttendance: builder.query({
      query: ({ date, classRoom }) => ({
        url: '/flagpole-attendance',
        params: { date, classRoom }
      }),
      transformResponse: (response) => response.data,
      providesTags: ['FlagpoleAttendance']
    }),

    // บันทึกการเช็คชื่อแบบหลายรายการ (bulk create ลงตาราง flagpoleattendance)
    createFlagpoleAttendance: builder.mutation({
      query: (data) => ({
        url: '/flagpole-attendance',
        method: 'POST',
        body: data // { date, classRoom, records, semesterId }
      }),
      invalidatesTags: ['FlagpoleAttendance']
    }),

    // ดึงสถิติการเช็คชื่อ (Summary)
    getFlagpoleStatistics: builder.query({
      query: ({ startDate, endDate, classRoom }) => ({
        url: '/flagpole-attendance/statistics',
        params: { startDate, endDate, classRoom }
      }),
      transformResponse: (response) => response.data
    }),

    // ดึงรายงานการเช็คชื่อแบบละเอียด (สำหรับ Dashboard + Export CSV)
    getFlagpoleReport: builder.query({
      query: ({ startDate, endDate, classRoom }) => ({
        url: '/flagpole-attendance/report',
        params: { startDate, endDate, classRoom }
      }),
      transformResponse: (response) => response.data
    })
  })
});

export const {
  useGetAttendanceStatusesQuery,
  useGetClassRoomsQuery,
  useGetStudentsByClassRoomQuery,
  useGetFlagpoleAttendanceQuery,
  useCreateFlagpoleAttendanceMutation,
  useGetFlagpoleStatisticsQuery,
  useGetFlagpoleReportQuery
} = flagpoleAttendanceApi;

export default flagpoleAttendanceApi;