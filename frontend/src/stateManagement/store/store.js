import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import modalReducer from '../slices/modalslice';
import contentReducer from '../slices/contentslice';
import roleReducer from '../slices/roleslice';
import permissionReducer from '../slices/permissionslice';
import contentDetail  from '../slices/contentDetailSlice';

const store = configureStore({
  reducer: {
    user: userReducer, // Add user slice
    modal: modalReducer, // Add modal slice
    content: contentReducer, // Add content slice
    role: roleReducer, // Add role slice
    permission: permissionReducer, // Add permission slice
    contentDetail:contentDetail, // Add contentDetail slice
  },
});

export default store;