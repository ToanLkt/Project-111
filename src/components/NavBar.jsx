"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"
import "bootstrap/dist/css/bootstrap.min.css"
import { useSelector, useDispatch } from "react-redux"
import { logout as logoutAction } from "../redux/login/loginSlice"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeNavigate, clearUserData, handleLogoutError } from '../utils/navigationUtils'

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
  const { user, token, loading } = useSelector((state) => state.account || {});
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
    if (!user) return "User";
    // Ưu tiên fullName, fallback về email nếu không có
    return user.fullName || getUserEmail() || "User";
  }

  const getUserInitial = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
  }

  // Kiểm tra xem user đã đăng nhập
  const isAuthenticated = !!(token && user)
  const isMember = getUserRole() === "Member"
  const isCoach = getUserRole() === "Coach"
  const isAdmin = getUserRole() === "Admin"

  // Cập nhật: Chỉ có plan, community, coach cần authentication hoàn toàn
  const protectedRoutes = ["/plan", "/community", "/coach"]

  const navItems = [
    { to: "/", label: "Trang chủ", icon: "🏠", protected: false },
    { to: "/plan", label: "Lộ trình", icon: "🗺️", protected: true },
    { to: "/community", label: "Cộng đồng", icon: "👥", protected: true },
    { to: "/coach", label: "Chuyên gia", icon: "🧠", protected: true },
    { to: "/ranking", label: "Bảng xếp hạng", icon: "🏆", protected: false },
    { to: "/feedback", label: "Đánh giá", icon: "💬", protected: false },
  ]

  // Xử lý click navigation item
  const handleNavClick = (e, item) => {
    // Chỉ chặn navigation cho các route thực sự cần authentication hoàn toàn
    if (item.protected && !isAuthenticated) {
      e.preventDefault()
      alert("Bạn cần đăng nhập để truy cập trang này!")
      navigate(`/login?returnUrl=${encodeURIComponent(item.to)}`)
      return
    }

  }

  // Xử lý click cho mobile menu
  const handleMobileNavClick = (e, item) => {
    if (item.protected && !isAuthenticated) {
      e.preventDefault()
      // Đóng mobile menu trước
      const offcanvasElement = document.getElementById('mobileMenu')
      if (offcanvasElement) {
        const offcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement)
        if (offcanvas) {
          offcanvas.hide()
        }
      }

      // Show alert và redirect
      setTimeout(() => {
        alert("Bạn cần đăng nhập để truy cập trang này!")
        navigate(`/login?returnUrl=${encodeURIComponent(item.to)}`)
      }, 300) // Delay để offcanvas đóng hoàn toàn
      return
    }
    // Đối với trang không cần authentication hoặc đã đăng nhập: Cho phép truy cập bình thường
    // Menu sẽ tự động đóng nhờ data-bs-dismiss="offcanvas"
  }

  // Xử lý click đăng nhập - đảm bảo clear session trước
  const handleLoginClick = async (e) => {
    e.preventDefault()

    // Nếu user đã đăng nhập, đăng xuất trước
    if (isAuthenticated) {
      console.log("🔄 User already authenticated, logging out first...")
      await handleLogout()
      // Delay một chút để đảm bảo logout hoàn tất
      setTimeout(() => {
        navigate("/login")
      }, 200)
    } else {
      navigate("/login")
    }
  }

  // Xử lý mobile login click
  const handleMobileLoginClick = async (e) => {
    e.preventDefault()

    // Đóng mobile menu trước
    const offcanvasElement = document.getElementById('mobileMenu')
    if (offcanvasElement) {
      const offcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement)
      if (offcanvas) {
        offcanvas.hide()
      }
    }

    // Delay một chút để menu đóng, rồi xử lý login
    setTimeout(async () => {
      if (isAuthenticated) {
        console.log("🔄 User already authenticated, logging out first...")
        await handleLogout()
        setTimeout(() => {
          navigate("/login")
        }, 200)
      } else {
        navigate("/login")
      }
    }, 300)
  }
  // Thêm state cho toast thông báo
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("#27ae60");

  // Sửa hàm handleLogout để hiện thông báo màu đỏ
  const handleLogout = async () => {
    try {
      // Đăng xuất ở Redux
      dispatch(logoutAction());
      // Đăng xuất ở AuthContext (xóa user trong localStorage)
      authLogout();

      // Hiện toast thông báo thành công với màu đỏ
      setToastMessage("Đã đăng xuất");
      setToastColor("#CC0000");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 1000);

    } catch (error) {
      console.error("❌ Logout error:", error);
      handleLogoutError(error, navigate);
    }
  }

  useEffect(() => {
    // Auto redirect theo role - chỉ khi ở trang chủ, không redirect từ login
    if (isAuthenticated && getUserRole()) {
      const role = getUserRole()
      const currentPath = location.pathname

      // Chỉ redirect khi đang ở trang chủ, không redirect từ login để user có thể đăng xuất/đăng nhập lại
      if (currentPath === "/") {
        switch (role) {
          case "Admin":
            safeNavigate(navigate, "/admin")
            break
          case "Coach":
            safeNavigate(navigate, "/coachpage")
            break
          // Member không cần redirect, có thể ở bất kỳ đâu
        }
      }
    }
  }, [isAuthenticated, getUserRole, navigate, location.pathname])

  return (
    <>
      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 32,
            right: 32,
            zIndex: 9999,
            background: toastColor,
            color: "#fff",
            padding: "16px 32px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 17,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transition: "all 0.3s",
            animation: "fadeIn 0.5s",
          }}
        >
          {toastMessage}
        </div>
      )}

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
          padding: 0.8rem 1.8rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .navbar-user-dropdown:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(51, 107, 115, 0.15);
        }

        .navbar-user-avatar {
          width: 45px;
          height: 45px;
          background: ${COLORS.gradient};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 6px 16px rgba(106, 183, 197, 0.25);
          border: 2px solid ${COLORS.white};
        }

        .navbar-auth-btn {
          border-radius: 50px;
          padding: 1rem 2.5rem;
          font-weight: 700;
          font-size: 1.05rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.08);
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
          gap: 1rem;
        }

        .navbar-nav-item {
          position: relative;
        }

        .navbar-nav-link {
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
          box-shadow: 0 6px 20px rgba(51, 107, 115, 0.06);
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
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .navbar-nav-link {
            padding: 1rem 1.8rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .navbar-auth-btn {
            padding: 0.8rem 1.8rem;
            font-size: 1rem;
          }

          .navbar-brand {
            font-size: 1.3rem;
          }

          .navbar-logo {
            width: 50px;
            height: 50px;
          }
        }

        .navbar-nav-link-protected {
          position: relative;
        }

        .navbar-nav-link-protected:not(.navbar-nav-link-active)::after {
          content: '🔒';
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .auth-required-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #F59E0B;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
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
                  {isAuthenticated && (isMember || isCoach || isAdmin) ? (
                    <div className="dropdown">
                      <button
                        className="btn navbar-user-dropdown"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        disabled={loading}
                      >
                        <div className="navbar-user-avatar">{getUserInitial()}</div>
                        <span className="d-none d-sm-inline">
                          {getUserName()}
                        </span>
                        <i className="fas fa-chevron-down" style={{ fontSize: "0.8rem" }}></i>
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
                          <Link
                            to="/member/historyPayment"
                            className="dropdown-item navbar-dropdown-item"
                          >
                            <i className="fas fa-history"></i>
                            Lịch sử giao dịch
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
                      <button onClick={handleLoginClick} className="navbar-auth-btn navbar-auth-btn-login d-none d-sm-inline-flex">
                        <i className="fas fa-sign-in-alt"></i>
                        Đăng nhập
                      </button>
                      <Link to="/register" className="navbar-auth-btn navbar-auth-btn-register">
                        <i className="fas fa-user-plus"></i>
                        Đăng ký
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

        {/* Main Navigation - Luôn hiển thị */}
        <nav className="navbar navbar-expand-lg navbar-main">
          <div className="container-fluid">
            <ul className="navbar-nav mx-auto d-none d-lg-flex">
              {navItems.map((item) => {
                const isActive = pathname === item.to
                return (
                  <li className="navbar-nav-item" key={item.to}>
                    <Link
                      to={item.to}
                      className={`navbar-nav-link ${isActive ? "navbar-nav-link-active" : "navbar-nav-link-inactive"} ${item.protected && !isAuthenticated ? "navbar-nav-link-protected" : ""}`}
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                      {item.label}
                      {item.protected && !isAuthenticated && (
                        <div className="auth-required-badge">
                          <i className="fas fa-lock" style={{ fontSize: "0.6rem" }}></i>
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

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
            {/* User Info trong Mobile Menu - Hiển thị khi đã đăng nhập */}
            {isAuthenticated && (isMember || isCoach || isAdmin) && (
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

            {/* Navigation Items - Luôn hiển thị */}
            {navItems.map((item) => {
              const isActive = pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`offcanvas-nav-link ${isActive ? "offcanvas-nav-link-active" : "offcanvas-nav-link-inactive"} position-relative`}
                  onClick={(e) => handleMobileNavClick(e, item)}
                  data-bs-dismiss={!item.protected || isAuthenticated ? "offcanvas" : ""}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  {item.label}
                  {item.protected && !isAuthenticated && (
                    <i className="fas fa-lock ms-auto" style={{ fontSize: "0.8rem", opacity: 0.7 }}></i>
                  )}
                </Link>
              )
            })}

            {/* Mobile User Menu khi đã đăng nhập */}
            {isAuthenticated && (isMember || isCoach || isAdmin) && (
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
            )}

            {/* Mobile Auth Buttons khi chưa đăng nhập */}
            {!isAuthenticated && (
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${COLORS.color1}` }}>
                <button
                  onClick={handleMobileLoginClick}
                  className="offcanvas-nav-link offcanvas-nav-link-inactive mb-2 w-100 border-0"
                  style={{ background: "none", textAlign: "left" }}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Đăng nhập
                </button>
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


          </div>
        </div>
      </div>
    </>
  )
}
