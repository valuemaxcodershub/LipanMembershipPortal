import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Tooltip } from "flowbite-react";
import { useAuth } from "../../hooks/auth";
import { getInitails } from "../../utils/app/text";
export interface LinkType {
  name: string;
  icon: IconType;
  path?: string;
  isDisabled?: boolean;
  permission_keys?: string[];
  dropdown?: LinkType[];
}

interface SidebarPropType {
  isOpen: boolean;
  links: LinkType[];
}

function DashboardSidebar({ isOpen, links }: SidebarPropType) {
  const { logout, user } = useAuth();
  const { pathname } = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  useEffect(() => {
    const current = pathname.split("/")[2];
    setCurrentPath(current);
    if (pathname.includes("/conference")) {
      setOpenDropdowns((prev) =>
        prev.includes("conference") ? prev : [...prev, "conference"]
      );
    }
  }, [pathname]);

  const resolveTo = (path?: string) => {
    if (!path) return "#";
    if (path.startsWith("/")) return path;
    const base = "/" + pathname.split("/").filter(Boolean)[0];
    return `${base}/${path}`;
  };

  const isActivePath = (path?: string) => {
    if (!path) return false;
    const full = resolveTo(path);
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdowns(
      (prev) =>
        prev.includes(menu)
          ? prev.filter((item) => item !== menu) // Close if already open
          : [...prev, menu] // Open if closed
    );
  };

  const btnActive = "bg-gray-100 dark:bg-gray-900 text-blue-600";
  const btnHover =
    "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-600 dark:hover:text-blue-600";
  const btnDisabled = `${btnHover} opacity-30`;
  return (
    <>
      <div
        className={`fixed left-0 top-12 z-30 h-[100dvh] w-64 bg-white dark:bg-gray-800 lg:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        {user?.is_admin && (
          <div className="flex items-center justify-between p-4 border-b-2 border-black/20 sticky top-0">
            <Link
              to="/admin"
              className="flex flex-col items-center gap-2 w-full mt-7"
            >
              <Avatar
                img={user?.profile_pic || undefined}
                placeholderInitials={getInitails(`${user?.first_name || ""} ${user?.last_name || ""}`)}
                color={"purple"}
                size="lg"
                rounded
                bordered
              />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {/* {user?.full_name} */}Administrator
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </Link>
          </div>
        )}
        <div className={`relative ${user?.is_admin ? "h-[70%]" : "h-[90%]"}`}>
          <nav className="mt-4 ml-3 flex flex-col max-h-[88%] app_sidebar overflow-hidden overflow-y-auto pb-48">
            {links.map((link, index) => {
              let isNotAllowed = false
               if (link.permission_keys && link.permission_keys.length > 0) {
                 const userPermissions: string[] = Array.isArray(
                   user?.membership_detail?.permissions
                 )
                   ? user.membership_detail.permissions.map(
                       (per: any) => per.key
                     )
                   : [];

                 const isAllowed = link.permission_keys.some((key) =>
                   userPermissions.includes(key)
                 );
                 console.log(isAllowed)

                 isNotAllowed = !isAllowed;
               }
              if ("dropdown" in link) {
                return (
                  <div className="relative" key={index}>
                    <Tooltip
                      content={<p className="w-max">{link.name}</p>}
                      key={index}
                      placement="right"
                    >
                      <button
                        disabled={link.isDisabled}
                        onClick={() => toggleDropdown(link.name.toLowerCase())}
                        className={`flex font-semibold rounded-tl-xl rounded-bl-xl w-full items-center justify-start px-4 py-4 ${
                          link.dropdown?.some((item) => isActivePath(item.path)) ||
                          currentPath === link.name.trim().toLowerCase()
                            ? btnActive
                            : btnHover
                        }  focus:outline-none`}
                      >
                        <span className="flex items-center">
                          <link.icon size={20} />
                          <div className="w-full pl-3">
                            <p className="w-[160px] flex justify-start max-w-[160px] truncate">
                              {link.name}
                            </p>
                          </div>
                        </span>
                        <FiChevronDown
                          size={20}
                          className={`transition-transform ${
                            openDropdowns.includes(link.name.toLowerCase())
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                    </Tooltip>
                    {openDropdowns.includes(link.name.toLowerCase()) && (
                      <div className="ml-2 mt-1 space-y-2 rounded-lg bg-gray-100 dark:bg-gray-900 p-2 shadow-sm">
                        {link.dropdown?.map((dropLink, index) => (
                          <Link
                            key={index}
                            to={resolveTo(dropLink.path)}
                            className={`flex items-center rounded-md px-4 py-2 ${
                              isActivePath(dropLink.path)
                                ? "bg-white font-semibold text-blue-600 dark:bg-gray-800"
                                : "text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-600"
                            }`}
                          >
                            <dropLink.icon className="mr-2" size={18} />
                            {dropLink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Tooltip
                    content={<p className="w-max">{link.name}</p>}
                    key={index}
                    placement="right"
                  >
                    <Link
                      to={
                        link.isDisabled || isNotAllowed
                          ? "no-access"
                          : resolveTo(link.path)
                      }
                      className={`flex font-semibold !w-full rounded-tl-xl rounded-bl-xl items-center px-4 py-4 ${
                        link.isDisabled || isNotAllowed
                          ? btnDisabled
                          : isActivePath(link.path)
                            ? btnActive
                            : btnHover
                      } focus:outline-none`}
                    >
                      <link.icon className="mr-3" size={20} />
                      <div className="w-full">
                        <p className="w-[180px] max-w-[180px] truncate">
                          {link.name}
                        </p>
                      </div>
                    </Link>
                  </Tooltip>
                );
              }
            })}
          </nav>
        </div>
        <div className="w-full absolute bg-white dark:bg-gray-800 bottom-10 left-0 border-t border-black/20 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-white bg-[#ff0000] rounded-md"
          >
            <FiLogOut className="mr-3" size={20} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
