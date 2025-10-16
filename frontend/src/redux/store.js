import { configureStore } from '@reduxjs/toolkit';
import { blogsApi } from './features/blogs/blogsApi';
import { aboutApi } from './features/about/aboutApi';
import authApi from './features/auth/authApi';
import authReducer from './features/auth/authSlice';
import commentApi from './features/comments/commentsApi';
import { teachersApi } from './features/teachers/teachersApi';
import { clubsApi } from './features/clubs/clubsApi';
import flagpoleAttendanceApi from './features/attendance/flagpoleAttendanceApi';
import flagpoleAttendanceReducer from './features/attendance/flagpoleAttendanceSlice';

export const store = configureStore({
  reducer: {
    [blogsApi.reducerPath]: blogsApi.reducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [teachersApi.reducerPath]: teachersApi.reducer,
    [clubsApi.reducerPath]: clubsApi.reducer,
    [flagpoleAttendanceApi.reducerPath]: flagpoleAttendanceApi.reducer,
    auth: authReducer,
    flagpoleAttendance: flagpoleAttendanceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      blogsApi.middleware,
      aboutApi.middleware,
      commentApi.middleware,
      authApi.middleware,
      teachersApi.middleware,
      clubsApi.middleware,
      flagpoleAttendanceApi.middleware
    ),
});
