import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const admissionsApi = createApi({
  reducerPath: 'admissionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/`,
    credentials: 'include',
  }),
  tagTypes: ['AdmissionsInfo'],
  endpoints: (builder) => ({
    getAdmissionsInfo: builder.query({
      query: () => 'admissions',
      providesTags: ['AdmissionsInfo'],
    }),
    updateAdmissionsInfo: builder.mutation({
      query: (data) => ({
        url: 'admissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdmissionsInfo'],
    }),
  }),
});

export const {
  useGetAdmissionsInfoQuery,
  useUpdateAdmissionsInfoMutation,
} = admissionsApi;
