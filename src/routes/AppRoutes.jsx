import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
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
import Admincommunity from "../page/admin/Admincommunity";
import AdminPayment from "../page/admin/AdminPayment";
import AdminProfile from "../page/admin/AdminProfile";


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
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

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
        <Route path="community" element={<Admincommunity />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="payment" element={<AdminPayment />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Các route khác */}
      <Route path="*" element={<NotFound />} />
      <Route path="dashboard" element={<DashBoard />}>
        <Route path="setting" element={<AdminPayment />} />
      </Route>
    </Routes>
  );
}
