import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/auth";
// import { requestNotificationPermission } from "./utils/notifications";
interface ProtectedRouteProps {
  children: React.ReactNode;
  type?: "user" | "admin" | null;
}

const ProtectedRoute = ({ children, type = null }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

//   useEffect(() => {
//     requestNotificationPermission();
//   }, []);

  if (!isAuthenticated) {
    return <Navigate to={type === "admin" ? "/admin-panel/auth" : "/auth/sign-in"} />;
  }

  // Redirect if wrong type tries to access the page
  if (type === "user" && user?.is_admin) {
    return <Navigate to="/admin-panel/dashboard" />;
  }
  if (type === "admin" && !user?.is_admin) {
    return <Navigate to="/member/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;