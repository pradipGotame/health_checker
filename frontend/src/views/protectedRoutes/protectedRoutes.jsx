import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  console.log("user id ==>>> ", userId);

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
