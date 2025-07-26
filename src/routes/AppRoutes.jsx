import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../page/Home/Home";
import MemberProfile from "../page/member/MemberProfile";
import Contact from "../page/Contact";
import NotFound from "../page/NotFound";
import DashBoard from "../page/member/DashBoard";
import AppLayout from "../layout/AppLayout";
import Plan from "../page/member/Plan";
import Login from "../page/Login";
import Register from "../page/Register";
import ForgotPassword from "../page/ForgotPassword";
import Community from "../page/member/Community";
import Coach from "../page/member/Coach";
import Ranking from "../page/member/Ranking";
import Feedback from "../page/member/Feedback";
import StartInformation from "../page/member/StartInformation";
import ProtectedRoute from "../components/ProtectedRoute";

// Admin imports
import AdminNavbar from "../page/admin/AdminNavbar";
import List from "../page/admin/List";
import AdminFeedback from "../page/admin/AdminFeedback";
import AdminPage from "../page/admin/AdminPage";
import AdminCommunity from "../page/admin/AdminCommunity";
import AdminPayment from "../page/admin/AdminPayment";
import AdminProfile from "../page/admin/AdminProfile";
import AdminReport from "../page/admin/AdminReport";

// Coach imports
import CoachNavbar from "../page/coach/CoachNavbar";
import CoachPage from "../page/coach/CoachPage";
import CoachProfile from "../page/coach/CoachProfile";
import CoachCommunity from "../page/coach/CoachCommunity";
import CoachMembers from "../page/coach/CoachMembers";
import CoachChat from "../page/coach/CoachChat";
import CoachStatistics from "../page/coach/CoachStatistics";

// Other imports
import Payment from "../components/Payment";
import ConfirmRegister from "../components/ConfirmRegister";
import ResetPassword from "../page/ResetPassword";
import LoginGoogle from "../components/LoginGoogle";
import AdminSettings from "../page/admin/AdminSettings";
import AdminRanking from "../page/admin/AdminRanking";
import HistoryPayment from "../page/member/HistoryPayment";

export default function AppRoutes() {
  console.log("🔥 AppRoutes rendering...");
  console.log("🔥 Current location:", window.location.pathname);

  return (
    <Routes>
      {/* Admin Routes - PHẢI ĐỂ TRƯỚC */}
      <Route path="admin" element={<AdminNavbar />}>
        <Route index element={<AdminPage />} />
        <Route path="list" element={<List />} />
        <Route path="payment" element={<AdminPayment />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="report" element={<AdminReport />} />
        <Route path="settings" element={<AdminSettings />} />

        {/* Admin có thể truy cập các trang chung - KHÔNG dùng AppLayout */}
        <Route path="community" element={<AdminCommunity />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="ranking" element={<AdminRanking />} />
      </Route>

      {/* Coach Routes */}
      <Route path="coachpage" element={<CoachNavbar />}>
        <Route index element={<CoachPage />} />
        <Route path="members" element={<CoachMembers />} />
        <Route path="chat" element={<CoachChat />} />
        <Route path="statistics" element={<CoachStatistics />} />
        <Route path="profile" element={<CoachProfile />} />
        <Route path="community" element={<CoachCommunity />} />
      </Route>



      {/* Layout chính cho Member/Public */}
      <Route path="" element={<AppLayout />}>
        <Route index element={<Home />} />

        {/* Public routes */}
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="logingoogle" element={<LoginGoogle />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="confirm-register" element={<ConfirmRegister />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="start-information" element={<StartInformation />} />
        <Route path="payment" element={<Payment />} />

        {/* Member-only routes */}
        <Route
          path="plan"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <Plan />
            </ProtectedRoute>
          }
        />
        <Route
          path="coach"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <Coach />
            </ProtectedRoute>
          }
        />

        {/* Public routes - không cần đăng nhập */}
        <Route path="ranking" element={<Ranking />} />
        <Route path="feedback" element={<Feedback />} />

        {/* Member shared routes - CHỈ cho Member */}
        <Route
          path="community"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <Community />
            </ProtectedRoute>
          }
        />

        {/* Member specific routes */}
        <Route
          path="member"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="member/profile"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <MemberProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="member/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="member/historyPayment"
          element={
            <ProtectedRoute allowedRoles={["Member"]}>
              <HistoryPayment />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
