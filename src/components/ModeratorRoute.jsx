import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import NeuralLoader from "./NeuralLoader";

const ModeratorRoute = ({ children }) => {
  const { user, isAuthLoading, role } = useStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <NeuralLoader type="sync" />
      </div>
    );
  }

  // Moderators, Admins, and Singularity can all access moderator tools
  const canAccess =
    role === "moderator" || role === "admin" || role === "singularity";

  if (!user || !canAccess) {
    // Return 404 to obscure existence of the route
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ModeratorRoute;
