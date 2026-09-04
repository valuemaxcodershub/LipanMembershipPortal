import { useEffect, useState } from "react";
import {
  FiBook,
  FiBookmark,
  FiBookOpen,
  FiGift,
  FiHome,
  FiInfo,
  FiMail,
  FiSettings,
  FiSpeaker,
  FiUser,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { useBreakpoint } from "../hooks/breakpoint";
import DashboardHeader from "../components/navigation/DashboardHeader";
import DashboardSidebar, {
  LinkType,
} from "../components/navigation/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { BiBuilding, BiCertification, BiSolidCertification, BiUserPlus } from "react-icons/bi";

function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { viewportWidth, breakpoint } = useBreakpoint();

  const SidebarLinks: LinkType[] = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "dashboard",
    },
    {
      name: "Memberships",
      icon: FiGift,
      path: "memberships",
    },
    {
      name: "Membership Benefits",
      icon: FiBookmark,
      path: "membership-benefits",
    },
    {
      name: "Manage Users",
      icon: FiUsers,
      path: "manage-users",
    },
    {
      name: "Journals",
      icon: FiBookOpen,
      path: "manage-journals",
    },
    {
      name: "Events",
      icon: FiSpeaker,
      path: "events",
    },
    {
      name: "Conference",
      icon: FiCalendar,
      dropdown: [
        {
          name: "2025 Participants",
          icon: FiUsers,
          path: "/admin/conference/participants/2025",
        },
        {
          name: "2026 Participants",
          icon: FiUsers,
          path: "/admin/conference/participants/2026",
        },
      ],
    },
    {
      name: "Notifications & Announcements",
      icon: FiInfo,
      path: "notifications",
    },    {
      name: "Messages",
      icon: FiMail,
      path: "user-reports",
    },
    {
      name: "Portal Settings",
      icon: FiSettings,
      path: "portal-settings",
    },
    {
      name: "Profile",
      icon: FiUser,
      path: "profile",
    },

    // {
    //   name: "Settings",
    //   icon: FiSettings,
    //   dropdown: [
    //     {
    //       name: "Account Settings",
    //       icon: FiMail,
    //       path: "",
    //     },
    //     {
    //       name: "Profile",
    //       icon: FiMail,
    //       path: "profile",
    //     },
    //   ],
    // },
  ];

  useEffect(() => {
    if (breakpoint("lg")) {
      setSidebarOpen(true); // Open sidebar on large screens
    } else {
      setSidebarOpen(false); // Close sidebar on smaller screens
    }
  }, [viewportWidth]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Sidebar Overlay */}
      {!breakpoint("lg") && isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Header */}
      <DashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar isOpen={isSidebarOpen} links={SidebarLinks} />

        {/* Content Area */}
        <main className="bg-gray-100 dark:bg-gray-900  h-screen flex-auto overflow-y-auto px-3 lg:px-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
