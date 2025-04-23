import { FiLogOut, FiMenu } from "react-icons/fi";
import { Logo } from "../UI/Logo";
import { Avatar, DarkThemeToggle, Dropdown } from "flowbite-react";
import { BiMenu } from "react-icons/bi";
import { useAuth } from "../../hooks/auth";
import { getInitails } from "../../utils/app/text";

function DashboardHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logout } = useAuth()
 
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
          <Dropdown
            label={
              <Avatar
                img={user?.profile_pic ||undefined}
                placeholderInitials={getInitails(user?.full_name || "")}
                color={"purple"}
                rounded
              />
            }
            arrowIcon={false}
            inline
            className="!min-w-[200px]"
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.full_name}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 text-white bg-[#ff0000] rounded-md"
              >
                <FiLogOut className="mr-3" size={20} /> Logout
              </button>
            </Dropdown.Item>
          </Dropdown>
          <DarkThemeToggle/>
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
