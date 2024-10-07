import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole }) => {
  const role = useSelector((state) => state.user.role);

  if (requiredRole === "all" && role !== null) {
    return <Outlet />;
  } else if (!role || role === null) {
    return <Navigate to="/login" replace />;
  } else if (role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
