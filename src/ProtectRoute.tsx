import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/auth";
import { toast } from "react-toastify";
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
    return <Navigate to={type === "admin" ? "/admin/login" : "/auth/sign-in"} />;
  }

  // Redirect if wrong type tries to access the page
  if (type === "user" && user?.is_admin) {
    toast.warning("You are currently logged in as an admin, please logout to access the page.");
    return <Navigate to="/admin/dashboard" />;
  }
  if (type === "admin" && !user?.is_admin) {
    toast.warning("You are not authorized to access this page.");
    return <Navigate to="/member/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;