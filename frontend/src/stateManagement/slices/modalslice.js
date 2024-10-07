import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contentModal: false,
  PaymentModal: false,
  editRoleModal: false,
  permissionModal: false,
  contentDetailModal: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.contentModal = true;
    },
    closeModal: (state) => {
      state.contentModal = false;
    },
    openPaymentModal: (state) => {
      state.PaymentModal = true;
    },
    closePaymentModal: (state) => {
      state.PaymentModal = false;
    },
    openEditRoleModal: (state) => {
      state.editRoleModal = true;
    },
    closeEditRoleModal: (state) => {
      state.editRoleModal = false;
    },
    openPermissionModal: (state) => {
      state.permissionModal = true;
    },
    closePermissionModal: (state) => {
      state.permissionModal = false;
    },
    openContentModal: (state) => {
      state.contentDetailModal = true;
    },
    closeContentModal: (state) => {
      state.contentDetailModal = false;
    },
  },
});

export const {
  openModal,
  closeModal,
  openPaymentModal,
  closePaymentModal,
  openEditRoleModal,
  closeEditRoleModal,
  openPermissionModal,
  closePermissionModal,
  openContentModal,
  closeContentModal,
} = modalSlice.actions;

export default modalSlice.reducer;
