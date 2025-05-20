import { useEffect, useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiSettings,
  FiStar,
  FiBookmark,
  FiSpeaker,
  FiList,
  FiBriefcase,
  FiHelpCircle,
} from "react-icons/fi";
import { useBreakpoint } from "../hooks/breakpoint";
import DashboardHeader from "../components/navigation/DashboardHeader";
import DashboardSidebar, {
  LinkType,
} from "../components/navigation/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { usePayment } from "../hooks/payment";
import { Button } from "flowbite-react";

function DashboardLayout() {
  const { user } = useAuth();
  const { openMembershipModal } = usePayment();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { viewportWidth, breakpoint } = useBreakpoint();

  const setButtonsState = () => {
    if (user) {
      setIsDisabled(() =>
        ["unpaid", "pending"].includes(user.payment_status) ? true : false
      );
    }
  };

  useEffect(() => {
    setButtonsState();
  }, []);

  const SidebarLinks: LinkType[] = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "dashboard",
      isDisabled,
    },
    {
      name: "My Journal",
      icon: FiBookOpen,
      path: "my-journal",
      isDisabled,
    },
    {
      name: "My Resources",
      icon: FiBriefcase,
      path: "my-resources",
      isDisabled,
    },
    {
      name: "My Invoices",
      icon: FiBookmark,
      path: "my-invoices",
      isDisabled,
    },
    {
      name: "My Membership",
      icon: FiStar,
      path: "my-membership",
      isDisabled,
    },
    {
      name: "Upcoming Events",
      icon: FiSpeaker,
      path: "upcoming-events",
      isDisabled,
    },
    {
      name: "Notifications",
      icon: FiSpeaker,
      path: "notifications",
      isDisabled,
    },
    {
      name: "Transactions",
      icon: FiList,
      path: "transactions",
      isDisabled,
    },
    {
      name: "Help & Support",
      icon: FiHelpCircle,
      path: "help&support",
      isDisabled,
    },
    {
      name: " Account & Profile Settings",
      icon: FiUser,
      path: "profile",
      isDisabled,
    },

    // {
    //   name: "Settings",
    //   icon: FiSettings,
    //   dropdown: [
    //     {
    //       name: "Account Settings",
    //       icon: FiStar,
    //       path: "",
    //     },
    //     {
    //       name: "Profile",
    //       icon: FiUser,
    //       path: "profile",
    //     }
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
        <main className="bg-gray-100 dark:bg-gray-900  h-screen flex-auto overflow-y-auto p-6 pt-24">
          {isDisabled ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-lg w-full">
                <div className="flex justify-center mb-4">
                  <FiStar className="text-blue-600 text-5xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Membership Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please select a membership plan to unlock all features and
                  continue using your dashboard.
                </p>
                <Button
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold"
                  onClick={openMembershipModal}
                >
                  Choose Membership
                </Button>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
