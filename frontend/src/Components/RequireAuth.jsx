import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAuth(props) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? props.children : <Navigate to="/login" />;
}
