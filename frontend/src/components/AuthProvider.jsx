import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../redux/features/auth/authApi';
import { setUser, logout } from '../redux/features/auth/authSlice';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    // If we have user data, update the Redux store
    if (data?.user) {
      dispatch(setUser({ user: data.user }));
    }
    
    // If there's an authentication error, log the user out
    if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  // You might want to show a loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>;
  }

  return children;
};

export default AuthProvider;