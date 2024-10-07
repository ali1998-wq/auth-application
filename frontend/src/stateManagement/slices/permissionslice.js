import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  content:"",
  usersWithAccess:[],
  groupsWithAccess:[],
  id: "",
};

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermission: (state, action) => {
        console.log(action.payload);
        if (action?.payload?.name !== undefined) {
            state.name = action.payload.name;
        }
        if (action?.payload?.content !== undefined) {
            state.content = action.payload.content;
        }
        if (action?.payload?.usersWithAccess !== undefined) {
            state.usersWithAccess = action.payload.usersWithAccess;
        }
        if (action?.payload?.groupsWithAccess !== undefined) {
            state.groupsWithAccess = action.payload.groupsWithAccess;
        }
        if (action?.payload?.id !== undefined) {
            state.id = action.payload.id;
        }
    },
    removePermission: (state) => {
        state.name = "";
        state.content = "";
        state.usersWithAccess = [];
        state.groupsWithAccess = [];
        state.id = "";
    },
  },
});

export const { setPermission,removePermission } = permissionSlice.actions;

export default permissionSlice.reducer;
