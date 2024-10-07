import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: null,
  name: null,
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
        state._id = action.payload._id;
        state.name = action.payload.name;
    },
    removeRole: (state) => {
        state._id = null;
        state.name = null;
    },
  },
});

export const { setRole,removeRole } = roleSlice.actions;

export default roleSlice.reducer;
