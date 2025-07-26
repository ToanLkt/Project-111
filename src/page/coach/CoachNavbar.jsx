"use client"

import React from "react";
import { Link, useLocation, Outlet, Navigate, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout as logoutAction } from "../../redux/login/loginSlice"
import { safeNavigate, clearUserData, handleLogoutError } from '../../utils/navigationUtils'
import "bootstrap/dist/css/bootstrap.min.css"

const COLORS = {
  background: "#FAFAF9",
  color1: "#CFE8EF",
  color2: "#6AB7C5",
  color3: "#336B73",
  white: "#FFFFFF",
  text: "#2D3748",
  textLight: "#718096",
  gradient: "linear-gradient(135deg, #6AB7C5 0%, #336B73 100%)",
  gradientLight: "linear-gradient(135deg, #CFE8EF 0%, #6AB7C5 50%)",
  gradientCoach: "linear-gradient(135deg, #48A6A7 0%, #006A71 100%)",
  gradientCoachLight: "linear-gradient(135deg, #9ACBD0 0%, #48A6A7 50%)",
  success: "#10B981",
  warning: "#F59E0B",
  coach: "#006A71",
  coachPrimary: "#48A6A7",
  coachLight: "#9ACBD0",
  gold: "#bfa917",
  goldBg: "#fffbe8",
  danger: "#e74c3c",
}

export default function CoachNavbar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, loading } = useSelector((state) => state.account || {});

  // Extract thông tin từ user object
  const getUserEmail = () => {
    if (!user) return null
    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      user.email ||
      user.emailAddress ||
      null
  }

  const getUserRole = () => {
    if (!user) return null
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null
    return role ? role.toString().trim() : null
  }

  const getUserFullName = () => {
    if (!user) return "";
    return user.fullName || userEmail?.split("@")[0] || "";
  }

  // Logic authentication
  const userRole = getUserRole()
  const userEmail = getUserEmail()
  const isCoach = userRole === "Coach"
  const isAuthenticated = !!(token && user)

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      console.log("🚪 Coach logout process starting...")

      // Clear data first
      clearUserData()

      // Logout từ Redux
      dispatch(logoutAction())

      console.log("✅ Coach logout completed, redirecting...")

      // Safe navigation
      setTimeout(() => {
        safeNavigate(navigate, "/")
      }, 100)

    } catch (error) {
      console.error("❌ Coach logout error:", error)
      handleLogoutError(error, navigate)
    }
  }

  // Authentication checks
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !isCoach) {
    switch (userRole) {
      case "Admin":
        return <Navigate to="/admin" replace />;
      case "Member":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  const navItems = [
    { to: "/coachpage", label: "Trang chủ", icon: "🏠" },
    { to: "/coachpage/community", label: "Cộng đồng", icon: "👥" },
    { to: "/coachpage/members", label: "Quản lý học viên", icon: "👨‍🎓" },
    { to: "/coachpage/chat", label: "Tin nhắn", icon: "�" },
    { to: "/coachpage/statistics", label: "Thống kê", icon: "📊" },
  ]

  return (
    <>
      <style jsx>{`
        .coach-navbar-container {
          position: relative;
          z-index: 1050;
          font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          box-shadow: 0 8px 32px rgba(0, 106, 113, 0.15);
        }

        .coach-navbar-header {
          background: ${COLORS.white};
          border-bottom: 1px solid ${COLORS.color1};
          position: relative;
          z-index: 1051;
          padding: 1.5rem 0;
        }

        .coach-navbar-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: ${COLORS.gradientCoach};
        }

        .coach-navbar-header::after {
          content: '';
          position: absolute;
          top: 5px;
          left: 0;
          right: 0;
          height: 2px;
          background: ${COLORS.gradientCoachLight};
        }

        .coach-navbar-main {
          background: ${COLORS.background};
          position: sticky;
          top: 0;
          z-index: 1050;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${COLORS.color1};
          padding: 1.2rem 0;
          box-shadow: 0 4px 20px rgba(0, 106, 113, 0.08);
        }

        .coach-logo {
          width: 65px;
          height: 65px;
          background: ${COLORS.gradientCoach};
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          box-shadow: 0 12px 32px rgba(0, 106, 113, 0.25);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 3px solid ${COLORS.color1};
        }

        .coach-logo::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: rotate(45deg);
          transition: all 0.8s;
          opacity: 0;
        }

        .coach-logo:hover::before {
          animation: coachShine 1s ease-in-out;
        }

        .coach-logo:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 48px rgba(0, 106, 113, 0.35);
        }

        @keyframes coachShine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); opacity: 0; }
        }

        .coach-logo img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 12px;
          filter: brightness(1.1) contrast(1.1);
        }

        .coach-brand {
          color: ${COLORS.coach};
          font-weight: 900;
          font-size: 1.6rem;
          text-decoration: none;
          background: ${COLORS.gradientCoach};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
          position: relative;
        }

        .coach-brand:hover {
          text-decoration: none;
          transform: translateX(4px);
        }

        .coach-search {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .coach-search-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
        }

        .coach-search-input {
          border: 2px solid ${COLORS.color1};
          background: ${COLORS.white};
          color: ${COLORS.text};
          border-radius: 50px;
          padding: 1.2rem 1.8rem 1.2rem 4rem;
          width: 100%;
          font-size: 1.05rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(0, 106, 113, 0.08);
          backdrop-filter: blur(10px);
          font-weight: 500;
        }

        .coach-search-input:focus {
          border-color: ${COLORS.coachPrimary};
          box-shadow: 0 0 0 4px rgba(72, 166, 167, 0.15), 0 12px 40px rgba(0, 106, 113, 0.15);
          outline: none;
          background: ${COLORS.white};
          transform: translateY(-2px);
        }

        .coach-search-input::placeholder {
          color: ${COLORS.textLight};
          font-weight: 400;
        }

        .coach-search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: ${COLORS.coachPrimary};
          font-size: 1.2rem;
          pointer-events: none;
        }

        .coach-user-section {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .coach-user-info {
          background: ${COLORS.white};
          border: 2px solid ${COLORS.color1};
          border-radius: 50px;
          padding: 0.8rem 1.8rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(0, 106, 113, 0.08);
          font-weight: 600;
          text-decoration: none;
          color: ${COLORS.coach};
        }

        .coach-user-info:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.coachPrimary};
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 106, 113, 0.15);
          text-decoration: none;
          color: ${COLORS.coach};
        }

        .coach-user-avatar {
          width: 45px;
          height: 45px;
          background: ${COLORS.gradientCoach};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 6px 16px rgba(0, 106, 113, 0.25);
          border: 2px solid ${COLORS.white};
        }

        .coach-logout-btn {
          background: ${COLORS.gradientCoach};
          border: 2px solid transparent;
          color: ${COLORS.white};
          border-radius: 50px;
          padding: 1rem 2.5rem;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(0, 106, 113, 0.2);
          position: relative;
          overflow: hidden;
        }

        .coach-logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }

        .coach-logout-btn:hover::before {
          left: 100%;
        }

        .coach-logout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0, 106, 113, 0.3);
          background: linear-gradient(135deg, #006A71 0%, #004B50 100%);
        }

        .coach-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .coach-nav-item {
          position: relative;
        }

        .coach-nav-link {
          padding: 1.2rem 2.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 2px solid ${COLORS.color1};
          backdrop-filter: blur(10px);
          box-shadow: 0 6px 20px rgba(0, 106, 113, 0.06);
        }

        .coach-nav-link-active {
          background: ${COLORS.gradientCoach};
          color: ${COLORS.white};
          border-color: transparent;
          box-shadow: 0 12px 32px rgba(0, 106, 113, 0.25);
          transform: translateY(-2px);
        }

        .coach-nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 4px;
          background: ${COLORS.coach};
          border-radius: 2px;
        }

        .coach-nav-link-inactive {
          background: ${COLORS.white};
          color: ${COLORS.coach};
        }

        .coach-nav-link-inactive:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.coachPrimary};
          color: ${COLORS.coach};
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 106, 113, 0.15);
          text-decoration: none;
        }

        .coach-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: ${COLORS.warning};
          color: ${COLORS.white};
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .coach-search-input {
            font-size: 1rem;
            padding: 1rem 1.5rem 1rem 3.5rem;
          }

          .coach-brand {
            font-size: 1.4rem;
          }

          .coach-logo {
            width: 55px;
            height: 55px;
          }

          .coach-logo img {
            width: 32px;
            height: 32px;
          }

          .coach-navbar-header {
            padding: 1.2rem 0;
          }

          .coach-nav {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .coach-nav-link {
            padding: 1rem 1.8rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .coach-logout-btn {
            padding: 0.8rem 1.8rem;
            font-size: 1rem;
          }

          .coach-brand {
            font-size: 1.3rem;
          }

          .coach-logo {
            width: 50px;
            height: 50px;
          }

          .coach-user-section {
            flex-direction: column;
            gap: 0.8rem;
          }
        }
      `}</style>

      <div className="coach-navbar-container">
        {/* Top Header Bar */}
        <div className="coach-navbar-header" style={{ background: "linear-gradient(135deg,#FAFAF9 0%, #CFE8EF 70%, #6AB7C5 100%)" }}>
          <div className="container-fluid">
            <div className="row align-items-center">
              {/* Logo Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center">
                  <div className="coach-logo">
                    <img src="/A.png" alt="Coach Logo" />
                  </div>
                  <Link to="/coachpage" className="coach-brand">
                    <span className="d-none d-sm-inline">Coach Dashboard</span>
                    <span className="d-sm-none">Coach</span>
                  </Link>
                </div>
              </div>

              {/* Search Section */}
              <div className="col-lg-6 col-md-4 d-none d-md-block">
                <div className="coach-search">
                  <div className="coach-search-wrapper">
                    <div className="coach-search-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <input type="text" className="coach-search-input" placeholder="Tìm kiếm học viên, lịch trình..." />
                  </div>
                </div>
              </div>

              {/* Coach Account Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="coach-user-section">
                    {userEmail && (
                      <>
                        <Link to="/coachpage/profile" className="coach-user-info">
                          <div className="coach-user-avatar">
                            <i className="fas fa-chalkboard-teacher"></i>
                          </div>
                          <span className="d-none d-sm-inline text-truncate" style={{ maxWidth: "120px" }}>
                            {getUserFullName()}
                          </span>
                        </Link>
                        <button onClick={handleLogout} className="coach-logout-btn">
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Đăng xuất
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="row d-md-none mt-3">
              <div className="col-12">
                <div className="coach-search">
                  <div className="coach-search-wrapper">
                    <div className="coach-search-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <input type="text" className="coach-search-input" placeholder="Tìm kiếm..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="coach-navbar-main">
          <div className="container-fluid">
            <ul className="coach-nav d-flex flex-wrap justify-content-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <li className="coach-nav-item" key={item.to}>
                    <Link
                      to={item.to}
                      className={`coach-nav-link ${isActive ? "coach-nav-link-active" : "coach-nav-link-inactive"}`}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                      {item.label}
                      {item.to === "/coachpage/members" && <span className="coach-badge">12</span>}
                      {item.to === "/coachpage/chat" && <span className="coach-badge">!</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>

      <Outlet />
    </>
  )
}
