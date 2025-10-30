import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const academicApi = createApi({
  reducerPath: 'academicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include'
  }),
  tagTypes: ['AcademicYears', 'Semesters'],
  endpoints: (builder) => ({
    // Academic Years
    getAcademicYears: builder.query({
      query: () => 'academic-years',
      providesTags: ['AcademicYears'],
    }),

    getCurrentAcademicYear: builder.query({
      query: () => 'academic-years/current',
      providesTags: ['AcademicYears'],
    }),

    getAcademicYearById: builder.query({
      query: (id) => `academic-years/${id}`,
      providesTags: (result, error, id) => [{ type: 'AcademicYears', id }],
    }),

    createAcademicYear: builder.mutation({
      query: (data) => ({
        url: 'academic-years',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AcademicYears'],
    }),

    updateAcademicYear: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `academic-years/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AcademicYears', id },
        'AcademicYears'
      ],
    }),

    setCurrentAcademicYear: builder.mutation({
      query: (id) => ({
        url: `academic-years/${id}/set-current`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AcademicYears', 'Semesters'],
    }),

    deleteAcademicYear: builder.mutation({
      query: (id) => ({
        url: `academic-years/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AcademicYears'],
    }),

    // Semesters
    getCurrentSemester: builder.query({
      query: () => 'semesters/current',
      providesTags: ['Semesters'],
    }),

    updateSemester: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `semesters/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Semesters', 'AcademicYears'],
    }),

    setCurrentSemester: builder.mutation({
      query: (id) => ({
        url: `semesters/${id}/set-current`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Semesters', 'AcademicYears'],
    }),

    detectSemester: builder.mutation({
      query: (data) => ({
        url: 'semesters/detect',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useGetCurrentAcademicYearQuery,
  useGetAcademicYearByIdQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useSetCurrentAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useGetCurrentSemesterQuery,
  useUpdateSemesterMutation,
  useSetCurrentSemesterMutation,
  useDetectSemesterMutation,
} = academicApi;
