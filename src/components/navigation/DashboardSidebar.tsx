import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "flowbite-react";
export interface LinkType {
  name: string;
  icon: IconType;
  path?: string;
  dropdown?: LinkType[];
}

interface SidebarPropType {
  isOpen: boolean;
  links: LinkType[];
}

function DashboardSidebar({ isOpen, links }: SidebarPropType) {
  const { pathname } = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  useEffect(() => {
    const current = pathname.split("/")[2];
    // console.log(current, pathname, pathname.split("/"));
    setCurrentPath(current);
  }, [pathname]);

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
  return (
    <>
      <div
        className={`fixed left-0 top-12 z-30 h-screen w-64 bg-white dark:bg-gray-800 lg:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="relative h-[90%]">
          <nav className="mt-4 ml-3 flex flex-col max-h-[88%] app_sidebar overflow-y-auto">
            {links.map((link, index) => {
              if ("dropdown" in link) {
                return (
                  <div className="relative" key={index}>
                    <button
                      onClick={() => toggleDropdown(link.name.toLowerCase())}
                      className={`flex font-semibold rounded-tl-xl rounded-bl-xl w-full items-center justify-between px-4 py-4 ${currentPath === link.name.trim().toLowerCase() ? btnActive : btnHover}  focus:outline-none`}
                    >
                      <span className="flex items-center">
                        <link.icon className="mr-3" size={20} />
                        {link.name}
                      </span>
                      <FiChevronDown
                        size={20}
                        className={`transition-transform ${
                          openDropdowns.includes("courses") ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdowns.includes(link.name.toLowerCase()) && (
                      <div className="ml-2 mt-1 space-y-2 rounded-lg bg-gray-50 p-2 shadow-sm">
                        {link.dropdown?.map((dropLink, index) => (
                          <Link
                            key={index}
                            to={dropLink.path || "#"}
                            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:text-blue-600"
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
                      to={link.path || "#"}
                      className={`flex font-semibold !w-full rounded-tl-xl rounded-bl-xl items-center px-4 py-4 ${currentPath === (link.path?.trim().toLowerCase() ?? "") ? btnActive : btnHover} focus:outline-none`}
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
          <div className="w-full absolute bottom-0 left-0 border-t border-black/20 p-4">
            <button
              // onClick={openLogoutModal}
              className="w-full flex items-center px-4 py-2 text-white bg-[#ff0000] rounded-md"
            >
              <FiLogOut className="mr-3" size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
