import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import NeuralLoader from "./NeuralLoader";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <NeuralLoader type="sync" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
