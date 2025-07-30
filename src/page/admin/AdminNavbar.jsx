import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../redux/login/loginSlice";
import { safeNavigate, clearUserData, handleLogoutError } from '../../utils/navigationUtils';
import "bootstrap/dist/css/bootstrap.min.css";

const COLORS = {
  sidebarBg: "#F8FAFC",
  sidebarActive: "#E0F2FE",
  sidebarText: "#334155",
  sidebarActiveText: "#0284C7",
  sidebarBorder: "#E5E7EB",
  mainBg: "#FAFAF9",
  admin: "#1A4B52",
};

export default function AdminNavbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading } = useSelector((state) => state.account || {});

  // Extract thông tin từ user object
  const getUserEmail = () => {
    if (!user) return null;
    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      user.email ||
      user.emailAddress ||
      null;
  };

  const getUserFullName = () => {
    if (!user) return null;
    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      user.fullName ||
      user.name ||
      null;
  };

  const getUserRole = () => {
    if (!user) return null;
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null;
    return role ? role.toString().trim() : null;
  };

  // Logic authentication
  const userRole = getUserRole();
  const userEmail = getUserEmail();
  const userFullName = getUserFullName();
  const isAdmin = userRole === "Admin";
  const isAuthenticated = !!(token && user);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      clearUserData();
      dispatch(logoutAction());
      setTimeout(() => {
        safeNavigate(navigate, "/");
      }, 100);
    } catch (error) {
      handleLogoutError(error, navigate);
    }
  };

  // Authentication checks
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !isAdmin) {
    switch (userRole) {
      case "Coach":
        return <Navigate to="/coachpage" replace />;
      case "Member":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  const navItems = [
    { to: "/admin", label: "Trang chủ", icon: "🏠" },
    { to: "/admin/list", label: "Danh sách", icon: "📋" },
    { to: "/admin/community", label: "Cộng đồng", icon: "👥" },
    { to: "/admin/feedback", label: "Đánh giá", icon: "💬" },
    { to: "/admin/payment", label: "Giao dịch", icon: "💳" },
    { to: "/admin/report", label: "Báo cáo", icon: "📊" },
    { to: "/admin/ranking", label: "Xếp hạng", icon: "🏆" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.mainBg }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          background: COLORS.sidebarBg,
          borderRight: `1.5px solid ${COLORS.sidebarBorder}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "2rem 0 1rem 0",
          position: "fixed",
          top: 0,
          left: 0,
          minHeight: "100vh",
          height: "100vh",
          zIndex: 1050,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/A.png" alt="Admin Logo" style={{ width: 60, height: 60, borderRadius: 16, marginBottom: 8 }} />
          <div style={{
            fontWeight: 900,
            fontSize: 22,
            color: COLORS.admin,
            letterSpacing: 1,
            marginBottom: 8,
          }}>
            Cai Nghiện Thuốc Lá
          </div>
        </div>
        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 32px",
                  color: isActive ? COLORS.sidebarActiveText : COLORS.sidebarText,
                  background: isActive ? COLORS.sidebarActive : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 17,
                  textDecoration: "none",
                  borderLeft: isActive ? `4px solid ${COLORS.sidebarActiveText}` : "4px solid transparent",
                  transition: "all 0.2s",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 250, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header
          style={{
            width: "100%",
            background: "#F8FAFC",
            padding: "18px 32px 14px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #E5E7EB",
            position: "sticky",
            top: 0,
            zIndex: 200,
          }}
        >
          {/* Search box bên trái */}
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search..."
              style={{
                width: 260,
                padding: "8px 18px",
                borderRadius: 24,
                border: "1px solid #E5E7EB",
                background: "#fff",
                fontSize: 16,
                color: "#334155",
                outline: "none",
              }}
            />
          </div>
          {/* Thông tin admin bên phải */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* Các icon giả lập */}
            <span style={{ fontSize: 22, color: "#64748B", cursor: "pointer" }}>🌙</span>
            <span style={{ fontSize: 22, color: "#64748B", cursor: "pointer" }}>🛒<span style={{ color: "#F87171", fontWeight: 700, fontSize: 13, marginLeft: 2 }}>1</span></span>
            <span style={{ fontSize: 22, color: "#64748B", cursor: "pointer" }} onClick={() => navigate("/admin/settings")}>⚙️</span>

            {/* Avatar + info */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="avatar"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #E0F2FE",
              }}
              onClick={() => navigate("/admin/profile")}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{userFullName || userEmail}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{userEmail}</div>
                <div style={{ fontSize: 13, color: "#0284C7", fontWeight: 600 }}>Admin</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "#F87171",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 18px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  marginLeft: 8,
                  transition: "background 0.2s",
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung trang */}
        <main style={{ flex: 1, padding: "32px 40px", minHeight: "100vh" }}>
          <Outlet />
        </main>
      </div >
    </div >
  );
}