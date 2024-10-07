import { createSlice } from '@reduxjs/toolkit';

const loadFromSessionStorage = (key) => {
  try {
    const serializedData = sessionStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error("Error loading from session storage", error);
    return null;
  }
};

const saveToSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to session storage", error);
  }
};

const initialState = loadFromSessionStorage('user') || {
  userDetails: null,
  token: null,
  role: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { userDetails, token, role } = action.payload;
      state.userDetails = userDetails;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;

      saveToSessionStorage('user', { userDetails, token, role, isAuthenticated: true });
    },
    logout: (state) => {
      state.userDetails = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    },
    updateUserDetails: (state, action) => {
      state.userDetails = action.payload;
      saveToSessionStorage('user', { ...state, userDetails: action.payload });
    }
  },
});

export const { login, logout,updateUserDetails } = userSlice.actions;

export default userSlice.reducer;