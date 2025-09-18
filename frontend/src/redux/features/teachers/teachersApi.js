// redux/features/teachers/teachersApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teachersApi = createApi({
    reducerPath: 'teachersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['Teachers', 'Teacher', 'Departments'],
    endpoints: (builder) => ({

        // Get all teachers grouped by department (public)
        fetchTeachersByDepartment: builder.query({
            query: () => 'teachers/by-department',
            providesTags: ['Teachers'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return {};
            }
        }),

        // Get all teachers with optional filters (public)
        fetchTeachers: builder.query({
            query: ({ department, search } = {}) => {
                const params = new URLSearchParams();
                if (department) params.append('department', department);
                if (search) params.append('search', search);
                return `teachers?${params.toString()}`;
            },
            providesTags: ['Teachers'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return [];
            }
        }),

        // Get single teacher (public)
        fetchTeacherById: builder.query({
            query: (id) => `teachers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Teacher', id }],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return null;
            }
        }),

        // Create teacher (admin only)
        createTeacher: builder.mutation({
            query: (teacherData) => ({
                url: 'teachers',
                method: 'POST',
                body: teacherData,
                credentials: 'include',
            }),
            invalidatesTags: ['Teachers'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to create teacher');
            }
        }),

        // Update teacher (admin only)
        updateTeacher: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `teachers/${id}`,
                method: 'PATCH',
                body: rest,
                credentials: 'include',
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Teacher', id },
                'Teachers'
            ],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to update teacher');
            }
        }),

        // Delete teacher (admin only)
        deleteTeacher: builder.mutation({
            query: (id) => ({
                url: `teachers/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Teachers'],
            transformResponse: (response) => {
                if (response.success) {
                    return { success: true, message: response.message };
                }
                throw new Error(response.message || 'Failed to delete teacher');
            }
        }),

        // Get departments (public)
        fetchDepartments: builder.query({
            query: () => 'teachers/departments/list',
            providesTags: ['Departments'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return [];
            }
        }),

    }),
});

export const {
    useFetchTeachersByDepartmentQuery,
    useFetchTeachersQuery,
    useFetchTeacherByIdQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
    useFetchDepartmentsQuery,
} = teachersApi;