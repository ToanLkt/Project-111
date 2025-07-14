"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"
import "bootstrap/dist/css/bootstrap.min.css"
import { useSelector, useDispatch } from "react-redux"
import { logout as logoutAction } from "../redux/login/loginSlice"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  success: "#10B981",
  warning: "#F59E0B",
}

export default function NavBar() {
  const location = useLocation()
  const pathname = location.pathname
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // Lấy thông tin từ Redux thay vì AuthContext
  const { user, token, loading } = useSelector((state) => state.account || {})
  const { logout: authLogout } = useAuth()

  // Extract thông tin từ user object
  const getUserEmail = () => {
    if (!user) return null

    // Extract email từ các trường có thể có
    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      user.email ||
      user.emailAddress ||
      null
  }

  const getUserRole = () => {
    if (!user) return null

    // Extract role từ các trường có thể có
    return user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null
  }

  const getUserName = () => {
    const email = getUserEmail()
    if (email) {
      return email.split("@")[0] // Lấy phần trước @ của email
    }
    return "User"
  }

  const getUserInitial = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
  }

  // Kiểm tra xem user đã đăng nhập và có role member không
  const isAuthenticated = !!(token && user && getUserRole() === "Member")
  const isMember = getUserRole() === "Member"

  const navItems = [
    { to: "/", label: "Trang chủ", icon: "🏠" },
    { to: "/plan", label: "Lộ trình", icon: "🗺️" },
    { to: "/community", label: "Cộng đồng", icon: "👥" },
    { to: "/coach", label: "Chuyên gia", icon: "🧠" },
    { to: "/ranking", label: "Bảng xếp hạng", icon: "🏆" },
    { to: "/feedback", label: "Phản hồi", icon: "💬" },
  ]

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Logout từ Redux
      dispatch(logoutAction())

      // Logout từ AuthContext nếu có
      if (authLogout) {
        authLogout()
      }

      console.log("Logout successful")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    // Auto redirect Admin đến admin panel
    if (isAuthenticated && getUserRole() === "Admin") {
      console.log("Admin detected, redirecting to admin panel");
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, getUserRole, navigate]);

  return (
    <>
      <style jsx>{`
        .navbar-container {
          position: relative;
          z-index: 1050;
          font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          box-shadow: 0 8px 32px rgba(51, 107, 115, 0.15);
        }

        .navbar-header {
          background: ${COLORS.white};
          border-bottom: 1px solid ${COLORS.color1};
          position: relative;
          z-index: 1051;
          padding: 1.5rem 0;
        }

        .navbar-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: ${COLORS.gradient};
        }

        .navbar-header::after {
          content: '';
          position: absolute;
          top: 5px;
          left: 0;
          right: 0;
          height: 2px;
          background: ${COLORS.gradientLight};
        }

        .navbar-main {
          background: ${COLORS.background};
          position: sticky;
          top: 0;
          z-index: 1050;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${COLORS.color1};
          padding: 1.2rem 0;
          box-shadow: 0 4px 20px rgba(51, 107, 115, 0.08);
        }

        .navbar-logo {
          width: 65px;
          height: 65px;
          background: ${COLORS.gradient};
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          box-shadow: 0 12px 32px rgba(106, 183, 197, 0.25);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 3px solid ${COLORS.color1};
        }

        .navbar-logo::before {
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

        .navbar-logo:hover::before {
          animation: shine 1s ease-in-out;
        }

        .navbar-logo:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 48px rgba(106, 183, 197, 0.35);
        }

        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); opacity: 0; }
        }

        .navbar-logo img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 12px;
          filter: brightness(1.1) contrast(1.1);
        }

        .navbar-brand {
          color: ${COLORS.color3};
          font-weight: 900;
          font-size: 1.6rem;
          text-decoration: none;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
        }

        .navbar-brand:hover {
          text-decoration: none;
          transform: translateX(4px);
        }

        .navbar-search {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .navbar-search-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
        }

        .navbar-search-input {
          border: 2px solid ${COLORS.color1};
          background: ${COLORS.white};
          color: ${COLORS.text};
          border-radius: 50px;
          padding: 1.2rem 1.8rem 1.2rem 4rem;
          width: 100%;
          font-size: 1.05rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
          backdrop-filter: blur(10px);
          font-weight: 500;
        }

        .navbar-search-input:focus {
          border-color: ${COLORS.color2};
          box-shadow: 0 0 0 4px rgba(106, 183, 197, 0.15), 0 12px 40px rgba(51, 107, 115, 0.15);
          outline: none;
          background: ${COLORS.white};
          transform: translateY(-2px);
        }

        .navbar-search-input::placeholder {
          color: ${COLORS.textLight};
          font-weight: 400;
        }

        .navbar-search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: ${COLORS.color2};
          font-size: 1.2rem;
          pointer-events: none;
        }

        .navbar-user-dropdown {
          border: 2px solid ${COLORS.color1};
          background: ${COLORS.white};
          color: ${COLORS.color3};
          border-radius: 50px;
          padding: 0.8rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
          font-weight: 600;
          backdrop-filter: blur(10px);
          white-space: nowrap;
          min-width: fit-content;
        }

        .navbar-user-dropdown:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(51, 107, 115, 0.15);
        }

        .navbar-user-avatar {
          width: 40px;
          height: 40px;
          background: ${COLORS.gradient};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          box-shadow: 0 6px 16px rgba(106, 183, 197, 0.25);
          border: 2px solid ${COLORS.white};
          flex-shrink: 0;
        }

        .navbar-user-name {
          flex-shrink: 0;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .navbar-auth-btn {
          border-radius: 50px;
          padding: 0.9rem 2rem;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
          white-space: nowrap;
          min-width: fit-content;
          flex-shrink: 0;
        }

        .navbar-auth-btn-icon {
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .navbar-auth-btn-text {
          flex-shrink: 0;
        }

        .navbar-auth-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }

        .navbar-auth-btn:hover::before {
          left: 100%;
        }

        .navbar-auth-btn-login {
          border: 2px solid ${COLORS.color2};
          color: ${COLORS.color3};
          background: ${COLORS.white};
        }

        .navbar-auth-btn-login:hover {
          background: ${COLORS.color2};
          color: ${COLORS.white};
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(106, 183, 197, 0.25);
        }

        .navbar-auth-btn-register {
          background: ${COLORS.gradient};
          border: 2px solid transparent;
          color: ${COLORS.white};
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.2);
        }

        .navbar-auth-btn-register:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(106, 183, 197, 0.3);
        }

        .navbar-toggle {
          border: 2px solid ${COLORS.color1};
          color: ${COLORS.color3};
          background: ${COLORS.white};
          border-radius: 16px;
          padding: 0.8rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
        }

        .navbar-toggle:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
          transform: translateY(-3px);
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          flex-wrap: nowrap;
          width: 100%;
        }

        .navbar-nav-item {
          position: relative;
          flex-shrink: 0;
        }

        .navbar-nav-link {
          padding: 1rem 1.8rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border: 2px solid ${COLORS.color1};
          backdrop-filter: blur(10px);
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.06);
          white-space: nowrap;
          min-width: fit-content;
        }

        .navbar-nav-link-icon {
          font-size: 1rem;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }

        .navbar-nav-link-text {
          flex-shrink: 0;
        }

        .navbar-nav-link-active {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border-color: transparent;
          box-shadow: 0 12px 32px rgba(106, 183, 197, 0.25);
          transform: translateY(-2px);
        }

        .navbar-nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 4px;
          background: ${COLORS.color2};
          border-radius: 2px;
        }

        .navbar-nav-link-inactive {
          background: ${COLORS.white};
          color: ${COLORS.color3};
        }

        .navbar-nav-link-inactive:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
          color: ${COLORS.color3};
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(51, 107, 115, 0.15);
          text-decoration: none;
        }

        .navbar-dropdown-menu {
          z-index: 2000;
          background: ${COLORS.white};
          border: 2px solid ${COLORS.color1};
          border-radius: 20px;
          box-shadow: 0 16px 48px rgba(51, 107, 115, 0.12);
          padding: 0.8rem;
          margin-top: 0.8rem;
          backdrop-filter: blur(20px);
        }

        .navbar-dropdown-item {
          color: ${COLORS.color3};
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          border-radius: 16px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .navbar-dropdown-item:hover {
          background: ${COLORS.color1};
          color: ${COLORS.color3};
          transform: translateX(6px);
        }

        .navbar-dropdown-divider {
          margin: 0.8rem 0;
          border-color: ${COLORS.color1};
        }

        .navbar-mobile-search {
          padding: 1.2rem;
          background: ${COLORS.background};
          border-top: 1px solid ${COLORS.color1};
        }

        .offcanvas-custom {
          z-index: 1055;
          border: none;
          box-shadow: -8px 0 32px rgba(51, 107, 115, 0.12);
        }

        .offcanvas-header-custom {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          padding: 2rem;
          border-bottom: 1px solid ${COLORS.color1};
        }

        .offcanvas-body-custom {
          background: ${COLORS.white};
          padding: 2rem;
        }

        .offcanvas-nav-link {
          border: 2px solid ${COLORS.color1};
          border-radius: 20px;
          padding: 1.2rem 1.5rem;
          margin-bottom: 1rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
        }

        .offcanvas-nav-link-active {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.2);
        }

        .offcanvas-nav-link-inactive {
          background: ${COLORS.background};
          color: ${COLORS.color3};
        }

        .offcanvas-nav-link-inactive:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
          transform: translateX(6px);
        }

        .offcanvas-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: ${COLORS.white};
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .offcanvas-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        /* Responsive Media Queries - Cải thiện */
        @media (max-width: 1400px) {
          .navbar-nav-link {
            padding: 0.9rem 1.5rem;
            font-size: 0.9rem;
            gap: 0.5rem;
          }
          
          .navbar-nav {
            gap: 0.6rem;
          }
          
          .navbar-auth-btn {
            padding: 0.8rem 1.8rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 1200px) {
          .navbar-nav-link {
            padding: 0.8rem 1.3rem;
            font-size: 0.85rem;
          }
          
          .navbar-nav {
            gap: 0.5rem;
          }
          
          .navbar-auth-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.85rem;
          }
          
          .navbar-user-dropdown {
            padding: 0.7rem 1.3rem;
          }
          
          .navbar-user-avatar {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }

        @media (max-width: 992px) {
          .navbar-nav-link {
            padding: 0.7rem 1.2rem;
            font-size: 0.8rem;
            gap: 0.4rem;
          }
          
          .navbar-nav-link-icon {
            font-size: 0.9rem;
          }
          
          .navbar-nav {
            gap: 0.4rem;
          }
          
          .navbar-auth-btn {
            padding: 0.7rem 1.3rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 768px) {
          .navbar-search-input {
            font-size: 1rem;
            padding: 1rem 1.5rem 1rem 3.5rem;
          }

          .navbar-brand {
            font-size: 1.4rem;
          }

          .navbar-logo {
            width: 55px;
            height: 55px;
          }

          .navbar-logo img {
            width: 32px;
            height: 32px;
          }

          .navbar-header {
            padding: 1.2rem 0;
          }

          .navbar-nav {
            display: none !important;
          }

          .navbar-auth-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
          }
          
          .navbar-user-dropdown {
            padding: 0.7rem 1.2rem;
          }
        }

        @media (max-width: 576px) {
          .navbar-auth-btn {
            padding: 0.7rem 1.3rem;
            font-size: 0.85rem;
          }

          .navbar-brand {
            font-size: 1.3rem;
          }

          .navbar-logo {
            width: 50px;
            height: 50px;
          }
          
          .navbar-user-dropdown {
            padding: 0.6rem 1rem;
          }
          
          .navbar-user-avatar {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }
        }

        /* Prevent text wrapping và overflow */
        .container-fluid {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        .navbar-main .container-fluid {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        
        /* Đảm bảo navbar không bị overflow */
        .navbar-main {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .navbar-main::-webkit-scrollbar {
          display: none;
        }
        }
      `}</style>

      <div className="navbar-container">
        {/* Top Header Bar */}
        <div className="navbar-header" style={{ background: "linear-gradient(135deg,#FAFAF9 0%, #CFE8EF 70%, #6AB7C5 100%)" }}>
          <div className="container-fluid">
            <div className="row align-items-center">
              {/* Logo Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center">
                  <div className="navbar-logo">
                    <img src="/A.png" alt="Logo" />
                  </div>
                  <Link to="/" className="navbar-brand">
                    <span className="d-none d-sm-inline">Cai Nghiện Thuốc Lá</span>
                    <span className="d-sm-none">CNTL</span>
                  </Link>
                </div>
              </div>

              {/* Search Section */}
              <div className="col-lg-6 col-md-4 d-none d-md-block">
                <div className="navbar-search">
                  <div className="navbar-search-wrapper">
                    <div className="navbar-search-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <input type="text" className="navbar-search-input" placeholder="Tìm kiếm thông tin, bài viết..." />
                  </div>
                </div>
              </div>

              {/* Account Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  {isAuthenticated && isMember ? (
                    <div className="dropdown">
                      <button
                        className="btn navbar-user-dropdown"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        disabled={loading}
                      >
                        <div className="navbar-user-avatar">{getUserInitial()}</div>
                        <span className="navbar-user-name d-none d-sm-inline text-truncate">
                          {getUserName()}
                        </span>
                        <i className="fas fa-chevron-down" style={{ fontSize: "0.7rem", flexShrink: 0 }}></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end navbar-dropdown-menu">
                        <li>
                          <div className="dropdown-item-text">
                            <small className="text-muted">{getUserEmail()}</small>
                            <br />
                            <small className="badge bg-success">{getUserRole()}</small>
                          </div>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link
                            to="/member/profile"
                            className="dropdown-item navbar-dropdown-item"
                          >
                            <i className="fas fa-user"></i>
                            Thông tin cá nhân
                          </Link>
                        </li>

                        <li>
                          <hr className="dropdown-divider navbar-dropdown-divider" />
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="dropdown-item navbar-dropdown-item"
                            style={{ color: "#EF4444" }}
                            disabled={loading}
                          >
                            <i className="fas fa-sign-out-alt"></i>
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="navbar-auth-btn navbar-auth-btn-login d-none d-sm-inline-flex">
                        <i className="fas fa-sign-in-alt navbar-auth-btn-icon"></i>
                        <span className="navbar-auth-btn-text">Đăng nhập</span>
                      </Link>
                      <Link to="/register" className="navbar-auth-btn navbar-auth-btn-register">
                        <i className="fas fa-user-plus navbar-auth-btn-icon"></i>
                        <span className="navbar-auth-btn-text">Đăng ký</span>
                      </Link>
                    </>
                  )}

                  {/* Mobile Menu Toggle */}
                  <button
                    className="btn navbar-toggle d-lg-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="row d-md-none">
              <div className="col-12 navbar-mobile-search">
                <div className="navbar-search">
                  <div className="navbar-search-wrapper">
                    <div className="navbar-search-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <input type="text" className="navbar-search-input" placeholder="Tìm kiếm..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation - Chỉ hiển thị khi user đã đăng nhập và là Member */}
        {isAuthenticated && isMember && (
          <nav className="navbar navbar-expand-lg navbar-main">
            <div className="container-fluid">
              <div className="w-100 d-flex justify-content-center">
                <ul className="navbar-nav d-none d-lg-flex">
                  {navItems.map((item) => {
                    const isActive = pathname === item.to
                    return (
                      <li className="navbar-nav-item" key={item.to}>
                        <Link
                          to={item.to}
                          className={`navbar-nav-link ${isActive ? "navbar-nav-link-active" : "navbar-nav-link-inactive"}`}
                        >
                          <span className="navbar-nav-link-icon">{item.icon}</span>
                          <span className="navbar-nav-link-text">{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </nav>
        )}

        {/* Mobile Offcanvas Menu */}
        <div
          className="offcanvas offcanvas-start offcanvas-custom"
          tabIndex={-1}
          id="mobileMenu"
          aria-labelledby="mobileMenuLabel"
        >
          <div className="offcanvas-header offcanvas-header-custom">
            <div className="d-flex align-items-center">
              <div className="navbar-logo" style={{ marginRight: "0.75rem", width: "40px", height: "40px" }}>
                <img src="/A.png" alt="Logo" style={{ width: "24px", height: "24px" }} />
              </div>
              <h5 className="offcanvas-title fw-bold mb-0" id="mobileMenuLabel">
                Cai Nghiện Thuốc Lá
              </h5>
            </div>
            <button type="button" className="offcanvas-close-btn" data-bs-dismiss="offcanvas" aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="offcanvas-body offcanvas-body-custom">
            {/* User Info trong Mobile Menu */}
            {isAuthenticated && isMember && (
              <div className="mb-4 pb-3" style={{ borderBottom: `1px solid ${COLORS.color1}` }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="navbar-user-avatar" style={{ width: "50px", height: "50px" }}>
                    {getUserInitial()}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{getUserName()}</h6>
                    <small className="text-muted">{getUserEmail()}</small>
                    <br />
                    <small className="badge bg-success">{getUserRole()}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items - Chỉ hiển thị cho Member */}
            {isAuthenticated && isMember && (
              <>
                {navItems.map((item) => {
                  const isActive = pathname === item.to
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`offcanvas-nav-link ${isActive ? "offcanvas-nav-link-active" : "offcanvas-nav-link-inactive"}`}
                      data-bs-dismiss="offcanvas"
                    >
                      <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}

                {/* Mobile User Menu khi đã đăng nhập */}
                <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${COLORS.color1}` }}>
                  <Link
                    to="/member/profile"
                    className="offcanvas-nav-link offcanvas-nav-link-inactive mb-2"
                    data-bs-dismiss="offcanvas"
                  >
                    <i className="fas fa-user"></i>
                    Thông tin cá nhân
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="offcanvas-nav-link offcanvas-nav-link-inactive w-100 border-0"
                    style={{ background: "none", color: "#EF4444" }}
                    data-bs-dismiss="offcanvas"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Đăng xuất
                  </button>
                </div>
              </>
            )}

            {/* Mobile Auth Buttons khi chưa đăng nhập */}
            {!isAuthenticated && (
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${COLORS.color1}` }}>
                <Link
                  to="/login"
                  className="offcanvas-nav-link offcanvas-nav-link-inactive mb-2"
                  data-bs-dismiss="offcanvas"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="offcanvas-nav-link offcanvas-nav-link-active"
                  data-bs-dismiss="offcanvas"
                >
                  <i className="fas fa-user-plus"></i>
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Message khi không phải Member */}
            {isAuthenticated && !isMember && (
              <div className="text-center p-4">
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  <br />
                  Bạn cần có quyền Member để truy cập các chức năng này.
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
