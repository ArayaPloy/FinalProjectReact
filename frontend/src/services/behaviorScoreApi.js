import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiURL } from '../utils/apiConfig';

export const behaviorScoreApi = createApi({
  reducerPath: 'behaviorScoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiURL('/behavior-scores'),
    credentials: 'include', // ส่ง cookie อัตโนมัติ
  }),
  tagTypes: ['BehaviorScores', 'BehaviorHistory', 'BehaviorReports'],
  endpoints: (builder) => ({
    // ========================================
    // TEACHER ENDPOINTS
    // ========================================
    
    /**
     * บันทึกคะแนน (single/multiple students)
     */
    saveBehaviorScores: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BehaviorScores', 'BehaviorHistory'],
    }),

    /**
     * ดูประวัติการบันทึกของนักเรียน
     */
    getStudentHistory: builder.query({
      query: (studentId) => `/history/${studentId}`,
      providesTags: (result, error, studentId) => [
        { type: 'BehaviorHistory', id: studentId },
      ],
    }),

    // ========================================
    // ADMIN ENDPOINTS
    // ========================================

    /**
     * รายงานประวัติการบันทึก
     */
    getBehaviorReportsHistory: builder.query({
      query: ({ classRoom, search, startDate, endDate }) => ({
        url: '/reports/history',
        params: { classRoom, search, startDate, endDate },
      }),
      providesTags: ['BehaviorReports'],
    }),

    /**
     * รายงานสรุป
     */
    getBehaviorReportsSummary: builder.query({
      query: ({ classRoom, search, period }) => ({
        url: '/reports/summary',
        params: { classRoom, search, period },
      }),
      providesTags: ['BehaviorReports'],
    }),

    /**
     * แก้ไขคะแนน
     */
    updateBehaviorScore: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['BehaviorScores', 'BehaviorHistory', 'BehaviorReports'],
    }),

    /**
     * ลบคะแนน
     */
    deleteBehaviorScore: builder.mutation({
      query: ({ id, deletedBy }) => ({
        url: `/${id}`,
        method: 'DELETE',
        body: { deletedBy },
      }),
      invalidatesTags: ['BehaviorScores', 'BehaviorHistory', 'BehaviorReports'],
    }),
  }),
});

export const {
  useSaveBehaviorScoresMutation,
  useGetStudentHistoryQuery,
  useGetBehaviorReportsHistoryQuery,
  useGetBehaviorReportsSummaryQuery,
  useUpdateBehaviorScoreMutation,
  useDeleteBehaviorScoreMutation,
} = behaviorScoreApi;
