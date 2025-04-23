import { DarkThemeToggle } from "flowbite-react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <Outlet />
      <div className="fixed bottom-10 right-10">
        <DarkThemeToggle />
      </div>
    </div>
  );
}

export default AuthLayout;
