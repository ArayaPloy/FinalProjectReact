import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  voluntaryLogout: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.voluntaryLogout = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.voluntaryLogout = false;
      // Clear cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setVoluntaryLogout: (state) => {
      state.voluntaryLogout = true;
    },
  },
});

export const { setUser, logout, updateUser, setVoluntaryLogout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectVoluntaryLogout = (state) => state.auth.voluntaryLogout;

export default authSlice.reducer;
