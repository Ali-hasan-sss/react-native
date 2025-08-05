import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    accountType: 'user' | 'restaurant';
  } | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ id: string; email: string; name: string }>) => {
      const accountType = action.payload.email === 'restaurant@example.com' ? 'restaurant' : 'user';
      state.isAuthenticated = true;
      state.user = { ...action.payload, accountType };
      state.loading = false;
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
    updateProfile: (state, action: PayloadAction<{ name: string; email: string }>) => {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        const accountType = action.payload.email === 'restaurant@example.com' ? 'restaurant' : 'user';
        state.user.accountType = accountType;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;