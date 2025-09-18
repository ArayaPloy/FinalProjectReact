// redux/features/clubs/clubsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clubsApi = createApi({
    reducerPath: 'clubsApi',
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
    tagTypes: ['Clubs', 'Club', 'Categories', 'ClubStats'],
    endpoints: (builder) => ({

        // Get all clubs (public)
        fetchClubs: builder.query({
            query: ({ category, search, isActive } = {}) => {
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (search) params.append('search', search);
                if (isActive !== undefined) params.append('isActive', isActive);
                return `clubs?${params.toString()}`;
            },
            providesTags: ['Clubs'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return [];
            }
        }),

        // Get single club (public)
        fetchClubById: builder.query({
            query: (id) => `clubs/${id}`,
            providesTags: (result, error, id) => [{ type: 'Club', id }],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return null;
            }
        }),

        // Create club (admin only)
        createClub: builder.mutation({
            query: (clubData) => ({
                url: 'clubs',
                method: 'POST',
                body: clubData,
                credentials: 'include',
            }),
            invalidatesTags: ['Clubs', 'ClubStats'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to create club');
            }
        }),

        // Update club (admin only)
        updateClub: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `clubs/${id}`,
                method: 'PATCH',
                body: rest,
                credentials: 'include',
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Club', id },
                'Clubs',
                'ClubStats'
            ],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to update club');
            }
        }),

        // Delete club (admin only)
        deleteClub: builder.mutation({
            query: (id) => ({
                url: `clubs/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Clubs', 'ClubStats'],
            transformResponse: (response) => {
                if (response.success) {
                    return { success: true, message: response.message };
                }
                throw new Error(response.message || 'Failed to delete club');
            }
        }),

        // Get categories (public)
        fetchCategories: builder.query({
            query: () => 'clubs/categories/list',
            providesTags: ['Categories'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return [];
            }
        }),

        // Get club statistics (admin only)
        fetchClubStats: builder.query({
            query: () => 'clubs/stats/overview',
            providesTags: ['ClubStats'],
            transformResponse: (response) => {
                if (response.success) {
                    return response.data;
                }
                return null;
            }
        }),

        // Bulk operations
        updateMultipleClubs: builder.mutation({
            queryFn: async (clubUpdates, api, extraOptions, baseQuery) => {
                const results = [];
                const errors = [];

                for (const update of clubUpdates) {
                    try {
                        const result = await baseQuery({
                            url: `clubs/${update.id}`,
                            method: 'PATCH',
                            body: update.data,
                            credentials: 'include'
                        });

                        if (result.data?.success) {
                            results.push(result.data.data);
                        } else {
                            errors.push({
                                id: update.id,
                                error: result.data?.message || 'Update failed'
                            });
                        }
                    } catch (error) {
                        errors.push({
                            id: update.id,
                            error: error.message
                        });
                    }
                }

                if (errors.length > 0) {
                    return {
                        error: {
                            status: 'PARTIAL_FAILURE',
                            data: { results, errors }
                        }
                    };
                }

                return { data: results };
            },
            invalidatesTags: ['Clubs', 'ClubStats']
        })

    }),
});

export const {
    useFetchClubsQuery,
    useFetchClubByIdQuery,
    useCreateClubMutation,
    useUpdateClubMutation,
    useDeleteClubMutation,
    useFetchCategoriesQuery,
    useFetchClubStatsQuery,
    useUpdateMultipleClubsMutation,
    useLazyFetchClubsQuery,
    useLazyFetchClubByIdQuery
} = clubsApi;

// Helper hooks for common operations
export const useClubManagement = () => {
    const [createClub, { isLoading: isCreating }] = useCreateClubMutation();
    const [updateClub, { isLoading: isUpdating }] = useUpdateClubMutation();
    const [deleteClub, { isLoading: isDeleting }] = useDeleteClubMutation();

    const handleCreateClub = async (clubData) => {
        try {
            const result = await createClub(clubData).unwrap();
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleUpdateClub = async (id, clubData) => {
        try {
            const result = await updateClub({ id, ...clubData }).unwrap();
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleDeleteClub = async (id) => {
        try {
            const result = await deleteClub(id).unwrap();
            return { success: true, message: result.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return {
        createClub: handleCreateClub,
        updateClub: handleUpdateClub,
        deleteClub: handleDeleteClub,
        isCreating,
        isUpdating,
        isDeleting
    };
};

// Selectors for common data transformations
export const selectActiveClubs = (clubs) => 
    clubs?.filter(club => club.isActive) || [];

export const selectClubsByCategory = (clubs, category) => 
    clubs?.filter(club => club.category === category) || [];

export const selectOpenForRegistration = (clubs) => {
    const today = new Date();
    return clubs?.filter(club => 
        club.isActive && 
        club.registrationDeadline && 
        new Date(club.registrationDeadline) >= today
    ) || [];
};

export const selectClubsWithTeachers = (clubs) =>
    clubs?.filter(club => club.teacher) || [];

// Cache management utilities
export const invalidateClubsCache = (dispatch) => {
    dispatch(clubsApi.util.invalidateTags(['Clubs']));
};

export const invalidateClubStatsCache = (dispatch) => {
    dispatch(clubsApi.util.invalidateTags(['ClubStats']));
};

export const prefetchClubById = (id, dispatch) => {
    dispatch(clubsApi.util.prefetch('fetchClubById', id, { force: false }));
};