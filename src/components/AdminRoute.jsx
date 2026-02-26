import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import NeuralLoader from "./NeuralLoader";

const AdminRoute = ({ children }) => {
  const { user, isAuthLoading, role } = useStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <NeuralLoader type="sync" />
      </div>
    );
  }

  const isAdmin = role === "admin" || role === "singularity";

  if (!user || !isAdmin) {
    // Return 404 to obscure existence of the route
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default AdminRoute;
