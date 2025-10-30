import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const studentPublicApi = createApi({
  reducerPath: 'studentPublicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/students/public/`,
    credentials: 'include'
  }),
  tagTypes: ['StudentAttendance', 'StudentBehaviorScore'],
  endpoints: (builder) => ({
    // Get student flagpole attendance history
    getStudentAttendanceHistory: builder.query({
      query: ({ studentNumber, academicYearId, semesterId }) => {
        const params = new URLSearchParams();
        if (academicYearId) params.append('academicYearId', academicYearId);
        if (semesterId) params.append('semesterId', semesterId);
        return `flagpole-attendance/${studentNumber}?${params.toString()}`;
      },
      providesTags: ['StudentAttendance'],
    }),

    // Get student behavior score history
    getStudentBehaviorScore: builder.query({
      query: (studentNumber) => `behavior-score/${studentNumber}`,
      providesTags: ['StudentBehaviorScore'],
    }),
  }),
});

export const {
  useGetStudentAttendanceHistoryQuery,
  useGetStudentBehaviorScoreQuery,
  useLazyGetStudentAttendanceHistoryQuery,
  useLazyGetStudentBehaviorScoreQuery,
} = studentPublicApi;
