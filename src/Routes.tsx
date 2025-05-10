import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/MemberLayout";

import WelcomePage from "./pages/main/Welcome";
import SignUpPage from "./pages/main/SignUp";
import SignInPage from "./pages/main/SignIn";
import TestPayment from "./pages/main/TestPayment";
import PricingPage from "./pages/main/PricingPage";
import EmailVerificationPage from "./pages/main/VerifyEmail";
import ForgotPasswordPage from "./pages/main/ForgotPassword";

import MemberDashboard from "./pages/members/Dashboard";
import ProfileAndSettings from "./pages/members/Profile";
import MyMembershipPage from "./pages/members/MyMembership";
import MyInvoicesPage from "./pages/members/MyInvoice";
import MyJournalPage from "./pages/members/Myjournal";
import UpcomingEventsPage from "./pages/members/UpcomingEvents";
import TransactionsPage from "./pages/members/Transactions";
import MyResourcesPage from "./pages/members/Resources";
import NotificationsPage from "./pages/members/Notifications";
import ContactAdminsPage from "./pages/members/ContactAdmin";
import AdminLayout from "./layouts/Adminlayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagementPage from "./pages/admin/ManageUsers";
import { useEffect, useState } from "react";
import SpinnerLogo from "./components/UI/LogoLoader";
import ProtectedRoute from "./ProtectRoute";
import { DarkThemeToggle } from "flowbite-react";
import RegistrationSuccessPage from "./pages/main/RegistrationSuccess";
import NotFoundPage from "./pages/main/404";
import AdminMembershipPlansPage from "./pages/admin/ManageMembership";
import AdminEventsPage from "./pages/admin/ManageEvents";
import ManageJournalsPage from "./pages/admin/ManageJournals";
import NotificationAnnouncementPage from "./pages/admin/Notifications&Announcements";
import AdminContactMessagesPage from "./pages/admin/UserContact&Reports";
import PortalSettingsPage from "./pages/admin/PortalSettings";
import AdminLoginPage from "./pages/admin/Login";
import ViewUserPage from "./pages/admin/ViewUser";

function AppRoutes() {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center dark:bg-gray-900">
        <SpinnerLogo />
        <div className="fixed bottom-10 right-10">
          <DarkThemeToggle />
        </div>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/test-pay" element={<TestPayment />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route
          path="forgot-password/:uid/:token"
          element={<ForgotPasswordPage />}
        />
        <Route path="verify-email/:token" element={<EmailVerificationPage />} />
      </Route>
      <Route
        path="/registration-success/:email"
        element={<RegistrationSuccessPage />}
      />
      <Route path="/getting-started" element={<PricingPage />} />

      <Route
        path="/member"
        element={
          <ProtectedRoute type="user">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/member/dashboard" />} />
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="my-journal" element={<MyJournalPage />} />
        <Route path="my-resources" element={<MyResourcesPage />} />
        <Route path="my-invoices" element={<MyInvoicesPage />} />
        <Route path="my-membership" element={<MyMembershipPage />} />
        <Route path="upcoming-events" element={<UpcomingEventsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="help&support" element={<ContactAdminsPage />} />
        <Route path="profile" element={<ProfileAndSettings />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute type="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="memberships" element={<AdminMembershipPlansPage />} />
        <Route path="manage-users" element={<UserManagementPage />} />
        <Route path="manage-users/:userId/view" element={<ViewUserPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="manage-journals" element={<ManageJournalsPage />} />
        <Route
          path="notifications"
          element={<NotificationAnnouncementPage />}
        />
        <Route path="user-reports" element={<AdminContactMessagesPage />} />
        <Route path="portal-settings" element={<PortalSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
