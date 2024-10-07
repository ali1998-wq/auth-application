import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   title: null,
   description: null,
   body: null,
   type: null,
   amount: null,
   id: null,
};

export const contentDetailSlice = createSlice({
  name: "contentDetail",
  initialState,
  reducers: {
    setContentDetail: (state, action) => {
        state.title = action.payload.title;
        state.description = action.payload.description;
        state.body = action.payload.body;
        state.type = action.payload.type;
        state.amount = action.payload.amount;
        state.id = action.payload.id;
    },
    removeContentDetail: (state) => {
        state.title = null;
        state.description = null;
        state.body = null;
        state.type = null;
        state.amount = null;
        state.id = null;
    },
  },
});

export const { setContentDetail,removeContentDetail } = contentDetailSlice.actions;

export default contentDetailSlice.reducer;
