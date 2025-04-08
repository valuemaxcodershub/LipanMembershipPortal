import { Routes, Route, Navigate } from "react-router-dom";
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

function AppRoutes() {
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
      <Route path="/getting-started" element={<PricingPage />} />

      <Route path="/member" element={<DashboardLayout />}>
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
    </Routes>
  );
}

export default AppRoutes;
