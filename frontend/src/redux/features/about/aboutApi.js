// redux/features/about/aboutApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aboutApi = createApi({
    reducerPath: 'aboutApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token; // Assuming you have an auth slice with a token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['SchoolInfo', 'Timeline', 'CompleteHistory'],
    endpoints: (builder) => ({

        // ====== School Information Endpoints ======

        // Get school information (public)
        fetchSchoolInfo: builder.query({
            query: () => 'about/school-info',
            providesTags: ['SchoolInfo'],
        }),

        // Create or update school information (admin only)
        saveSchoolInfo: builder.mutation({
            query: (schoolData) => ({
                url: 'about/school-info',
                method: 'POST',
                body: schoolData,
                credentials: 'include',
            }),
            invalidatesTags: ['SchoolInfo', 'CompleteHistory'],
        }),

        // ====== Timeline Endpoints ======

        // Get all timeline events (public)
        fetchTimeline: builder.query({
            query: () => 'about/timeline',
            providesTags: ['Timeline'],
        }),

        // Get single timeline event (public)
        fetchTimelineById: builder.query({
            query: (id) => `about/timeline/${id}`,
            providesTags: (result, error, id) => [{ type: 'Timeline', id }],
        }),

        // Create timeline event (admin only)
        createTimelineEvent: builder.mutation({
            query: (timelineData) => ({
                url: 'about/timeline',
                method: 'POST',
                body: timelineData,
                credentials: 'include',
            }),
            invalidatesTags: ['Timeline', 'CompleteHistory'],
        }),

        // Update timeline event (admin only)
        updateTimelineEvent: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `about/timeline/${id}`,
                method: 'PATCH',
                body: rest,
                credentials: 'include',
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Timeline', id },
                'Timeline',
                'CompleteHistory'
            ],
        }),

        // Delete timeline event (admin only)
        deleteTimelineEvent: builder.mutation({
            query: (id) => ({
                url: `about/timeline/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Timeline', 'CompleteHistory'],
        }),

        // Reorder timeline events (admin only)
        reorderTimelineEvents: builder.mutation({
            query: (timelineIds) => ({
                url: 'about/timeline/reorder',
                method: 'PATCH',
                body: { timelineIds },
                credentials: 'include',
            }),
            invalidatesTags: ['Timeline', 'CompleteHistory'],
        }),

        // ====== Combined Endpoints ======

        // Get complete school history (school info + timeline) - public
        fetchCompleteHistory: builder.query({
            query: () => 'about/complete-history',
            providesTags: ['SchoolHistory'],
            transformResponse: (response) => {
                // The response has success, data, message structure
                return {
                    schoolInfo: response.data?.schoolInfo || null,
                    timeline: response.data?.timeline || []
                };
            }
        }),

        updateSchoolInfo: builder.mutation({
            query: (schoolInfo) => ({
                url: 'about/school-info',
                method: 'POST',
                body: {
                    name: schoolInfo.name,
                    location: schoolInfo.location,
                    foundedDate: schoolInfo.foundedDate,
                    currentDirector: schoolInfo.currentDirector,
                    education_level: schoolInfo.education_level,
                    department: schoolInfo.department,
                    description: schoolInfo.description,
                    heroImage: schoolInfo.heroImage,
                    director_image: schoolInfo.director_image,
                    director_quote: schoolInfo.director_quote
                },
                credentials: 'include'
            }),
            invalidatesTags: ['SchoolHistory']
        }),

        updateTimelineEvent: builder.mutation({
            query: ({ id, ...eventData }) => ({
                url: `about/timeline/${id}`,
                method: 'PATCH',
                body: {
                    year: eventData.year,
                    date: eventData.date,
                    title: eventData.title,
                    description: eventData.description
                },
                credentials: 'include'
            }),
            invalidatesTags: ['SchoolHistory']
        }),

        addTimelineEvent: builder.mutation({
            query: (eventData) => ({
                url: 'about/timeline',
                method: 'POST',
                body: {
                    year: eventData.year,
                    date: eventData.date,
                    title: eventData.title,
                    description: eventData.description
                },
                credentials: 'include'
            }),
            invalidatesTags: ['SchoolHistory']
        }),

        deleteTimelineEvent: builder.mutation({
            query: (id) => ({
                url: `about/timeline/${id}`,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: ['SchoolHistory']
        })



    }),
});

export const {
    // School Info hooks
    useFetchSchoolInfoQuery,
    useSaveSchoolInfoMutation,

    // Timeline hooks
    useFetchTimelineQuery,
    useFetchTimelineByIdQuery,
    useCreateTimelineEventMutation,
    useUpdateTimelineEventMutation,
    useDeleteTimelineEventMutation,
    useReorderTimelineEventsMutation,

    useUpdateSchoolInfoMutation,
    useAddTimelineEventMutation,

    // Combined hooks
    useFetchCompleteHistoryQuery,
} = aboutApi;