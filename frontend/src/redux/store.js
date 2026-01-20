import { configureStore } from '@reduxjs/toolkit';
import { blogsApi } from './features/blogs/blogsApi';
import { aboutApi } from './features/about/aboutApi';
import authApi from './features/auth/authApi';
import authReducer from './features/auth/authSlice';
import commentApi from './features/comments/commentsApi';
import { teachersApi } from './features/teachers/teachersApi';
import { clubsApi } from './features/clubs/clubsApi';
import { usersApi } from './features/users/usersApi';
import flagpoleAttendanceApi from './features/attendance/flagpoleAttendanceApi';
import flagpoleAttendanceReducer from './features/attendance/flagpoleAttendanceSlice';
import { behaviorScoreApi } from '../services/behaviorScoreApi';
import { studentsApi } from '../services/studentsApi';
import { academicApi } from '../services/academicApi';
import { studentPublicApi } from '../services/studentPublicApi';

export const store = configureStore({
  reducer: {
    [blogsApi.reducerPath]: blogsApi.reducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [teachersApi.reducerPath]: teachersApi.reducer,
    [clubsApi.reducerPath]: clubsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [flagpoleAttendanceApi.reducerPath]: flagpoleAttendanceApi.reducer,
    [behaviorScoreApi.reducerPath]: behaviorScoreApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [academicApi.reducerPath]: academicApi.reducer,
    [studentPublicApi.reducerPath]: studentPublicApi.reducer,
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
      usersApi.middleware,
      flagpoleAttendanceApi.middleware,
      behaviorScoreApi.middleware,
      studentsApi.middleware,
      academicApi.middleware,
      studentPublicApi.middleware
    ),
});
