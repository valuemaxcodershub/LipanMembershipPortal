import { Logo } from "../UI/Logo";
import { DarkThemeToggle } from "flowbite-react";
import { BiMenu } from "react-icons/bi";
// import { useAuth } from "../../hooks/auth";
import ProfileToggle from "../UI/ProfileToggle";

function DashboardHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  // const { user, logout } = useAuth()
 
  return (
    <>
      <header className="fixed z-40 flex h-16 w-full items-center justify-between bg-blue-700 px-6 lg:px-14 shadow-md">
        <div className="flex gap-3 items-center">
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none lg:hidden"
          >
            <BiMenu size={35} />
          </button>
          <Logo className="h-9 lg:h-12" />
          <h2 className="sr-only">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
         <ProfileToggle/>
          <DarkThemeToggle />
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
