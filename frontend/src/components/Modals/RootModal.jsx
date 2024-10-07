import React from "react";
import ContentModal from "./ContentModal";
import PaymentModal from "./PaymentModal";
import EditRole from "./editRole/EditRole";
import PermissionModal from "./permissionModal/PermissionModal";
import ContntModal from "./contentModal/ContentModal";

function index() {
  return (
    <>
      <ContentModal />
      <PaymentModal />
      <EditRole />
      <PermissionModal />
      <ContntModal />
    </>
  );
}

export default index;
