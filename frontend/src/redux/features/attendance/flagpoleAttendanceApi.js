import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const flagpoleAttendanceApi = createApi({
  reducerPath: 'flagpoleAttendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
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
        body: data
      }),
      invalidatesTags: ['FlagpoleAttendance']
    }),

    // ดึงสถิติการเช็คชื่อ
    getFlagpoleStatistics: builder.query({
      query: ({ startDate, endDate, classRoom }) => ({
        url: '/flagpole-attendance/statistics',
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
  useGetFlagpoleStatisticsQuery
} = flagpoleAttendanceApi;

export default flagpoleAttendanceApi;