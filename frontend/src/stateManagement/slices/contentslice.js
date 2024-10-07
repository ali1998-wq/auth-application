import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contentDetails: null,
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.contentDetails = action.payload;
    },
    removeContent: (state) => {
      state.contentDetails = null;
    },
  },
});

export const { setContent, removeContent } = contentSlice.actions;

export default contentSlice.reducer;
