import { DarkThemeToggle } from "flowbite-react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";

function AuthLayout() {
  const { user, isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to={user?.is_admin ? "/admin" : "/member"} />
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
          <Outlet />
          <div className="fixed bottom-10 right-10 z-40">
            <DarkThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}

export default AuthLayout;
