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
import AdminLayout from "../layout/AdminLayout";
import List from "../page/admin/List";
import AdminFeedback from "../page/admin/AdminFeedback";
import AdminPage from "../page/admin/AdminPage";
import AdminCommunity from "../page/admin/AdminCommunity";
import AdminPayment from "../page/admin/AdminPayment";
import AdminProfile from "../page/admin/AdminProfile";
import Payment from "../components/Payment";
import CoachLayout from "../layout/CoachLayout";
import CoachPage from "../page/coach/CoachPage";
import CoachProfile from "../page/coach/CoachProfile";
import CoachNavbar from "../page/coach/CoachNavbar";
import CoachCommunity from "../page/coach/CoachCommunity";
import CoachMembers from "../page/coach/CoachMembers";
import CoachSchedule from "../page/coach/CoachSchedule";
import CoachStatistics from "../page/coach/CoachStatistics";
import ConfirmRegister from "../components/ConfirmRegister";
import ResetPassword from "../page/ResetPassword";
import LoginGoogle from "../components/LoginGoogle";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout chính cho user */}
      <Route path="" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route
          path="plan"
          element={
            <ProtectedRoute>
              <Plan />
            </ProtectedRoute>
          }
        />
        <Route path="start-information" element={<StartInformation />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="logingoogle" element={<LoginGoogle />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-register" element={<ConfirmRegister />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Các route cần đăng nhập */}
        <Route
          path="community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="coach"
          element={
            <ProtectedRoute>
              <Coach />
            </ProtectedRoute>
          }
        />
        <Route path="ranking" element={<Ranking />} />
        <Route path="feedback" element={<Feedback />} />

        <Route
          path="member"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="member/profile"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <MemberProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Route admin dùng AdminLayout riêng */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminPage />} />
        <Route path="list" element={<List />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="payment" element={<AdminPayment />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Route coach dùng CoachLayout riêng */}
      <Route
        path="coachpage"
        element={
          <ProtectedRoute allowedRoles={["coach"]}>
            <CoachNavbar />
          </ProtectedRoute>
        }
      >
        <Route index element={<CoachPage />} />
        <Route path="community" element={<CoachCommunity />} />
        <Route path="members" element={<CoachMembers />} />
        <Route path="schedule" element={<CoachSchedule />} />
        <Route path="statistics" element={<CoachStatistics />} />
        <Route path="profile" element={<CoachProfile />} />
      </Route>

      {/* Các route khác */}
      <Route path="*" element={<NotFound />} />
      <Route path="dashboard" element={<DashBoard />}>
        <Route path="setting" element={<AdminPayment />} />
      </Route>
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}
