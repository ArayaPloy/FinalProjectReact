import { createSlice } from '@reduxjs/toolkit';

// Utility function to check if the token exists in cookies
const isTokenPresentInCookies = () => {
  const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  return !!token;
};

// Utility function to get the initial state from localStorage
const loadUserFromLocalStorage = () => {
  try {
    // if (!isTokenPresentInCookies()) {
    //   localStorage.removeItem('user');
    //   return { user: null };
    // }

    const serializedState = localStorage.getItem('user');
    const serialzedToken = localStorage.getItem('token');
    if (serializedState === null) return { user: null };
    if (serialzedToken === null) return { user: null };
    return {
      user: serializedUser ? JSON.parse(serializedUser) : null,
      token: serializedToken ? serializedToken : null,
    };
  } catch (err) {
    return { user: null, token: null };
  }
};

const initialState = loadUserFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Save user state to localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', state.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Remove user from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
