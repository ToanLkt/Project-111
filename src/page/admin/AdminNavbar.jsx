import React from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout as logoutAction } from "../../redux/login/loginSlice"
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
  gradientAdmin: "linear-gradient(135deg, #336B73 0%, #1A4B52 100%)",
  gradientAdminLight: "linear-gradient(135deg, #6AB7C5 0%, #336B73 50%)",
  success: "#10B981",
  warning: "#F59E0B",
  admin: "#1A4B52",
}

export default function AdminNavbar() {
  const location = useLocation()
  const dispatch = useDispatch()
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

  // Logic authentication
  const userRole = getUserRole()
  const userEmail = getUserEmail()
  const isAdmin = userRole === "Admin"
  const isAuthenticated = !!(token && user)

  // Xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logoutAction())
    window.location.href = "/login"
  }

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
    { to: "/admin/feedback", label: "Phản hồi", icon: "💬" },
    { to: "/admin/payment", label: "Thanh toán", icon: "💳" },
    { to: "/admin/report", label: "Báo cáo", icon: "📊" },
  ]

  return (
    <>
      <style jsx>{`
        .admin-navbar-container {
          position: relative;
          z-index: 1050;
          font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          box-shadow: 0 8px 32px rgba(26, 75, 82, 0.15);
        }

        .admin-navbar-header {
          background: ${COLORS.white};
          border-bottom: 1px solid ${COLORS.color1};
          position: relative;
          z-index: 1051;
          padding: 1.5rem 0;
        }

        .admin-navbar-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: ${COLORS.gradientAdmin};
        }

        .admin-navbar-header::after {
          content: '';
          position: absolute;
          top: 5px;
          left: 0;
          right: 0;
          height: 2px;
          background: ${COLORS.gradientLight};
        }

        .admin-navbar-main {
          background: ${COLORS.background};
          position: sticky;
          top: 0;
          z-index: 1050;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${COLORS.color1};
          padding: 1.2rem 0;
          box-shadow: 0 4px 20px rgba(26, 75, 82, 0.08);
        }

        .admin-logo {
          width: 65px;
          height: 65px;
          background: ${COLORS.gradientAdmin};
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          box-shadow: 0 12px 32px rgba(26, 75, 82, 0.25);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 3px solid ${COLORS.color1};
        }

        .admin-logo::before {
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

        .admin-logo:hover::before {
          animation: adminShine 1s ease-in-out;
        }

        .admin-logo:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 48px rgba(26, 75, 82, 0.35);
        }

        @keyframes adminShine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); opacity: 0; }
        }

        .admin-logo img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 12px;
          filter: brightness(1.1) contrast(1.1);
        }

        .admin-brand {
          color: ${COLORS.admin};
          font-weight: 900;
          font-size: 1.6rem;
          text-decoration: none;
          background: ${COLORS.gradientAdmin};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
          position: relative;
        }

        .admin-brand:hover {
          text-decoration: none;
          transform: translateX(4px);
        }

        .admin-search {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .admin-search-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
        }

        .admin-search-input {
          border: 2px solid ${COLORS.color1};
          background: ${COLORS.white};
          color: ${COLORS.text};
          border-radius: 50px;
          padding: 1.2rem 1.8rem 1.2rem 4rem;
          width: 100%;
          font-size: 1.05rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(26, 75, 82, 0.08);
          backdrop-filter: blur(10px);
          font-weight: 500;
        }

        .admin-search-input:focus {
          border-color: ${COLORS.admin};
          box-shadow: 0 0 0 4px rgba(26, 75, 82, 0.15), 0 12px 40px rgba(26, 75, 82, 0.15);
          outline: none;
          background: ${COLORS.white};
          transform: translateY(-2px);
        }

        .admin-search-input::placeholder {
          color: ${COLORS.textLight};
          font-weight: 400;
        }

        .admin-search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: ${COLORS.admin};
          font-size: 1.2rem;
          pointer-events: none;
        }

        .admin-user-section {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .admin-user-info {
          background: ${COLORS.white};
          border: 2px solid ${COLORS.color1};
          border-radius: 50px;
          padding: 0.8rem 1.8rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(26, 75, 82, 0.08);
          font-weight: 600;
          text-decoration: none;
          color: ${COLORS.admin};
        }

        .admin-user-info:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.admin};
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(26, 75, 82, 0.15);
          text-decoration: none;
          color: ${COLORS.admin};
        }

        .admin-user-avatar {
          width: 45px;
          height: 45px;
          background: ${COLORS.gradientAdmin};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          box-shadow: 0 6px 16px rgba(26, 75, 82, 0.25);
          border: 2px solid ${COLORS.white};
        }

        .admin-logout-btn {
          background: ${COLORS.gradientAdmin};
          border: 2px solid transparent;
          color: ${COLORS.white};
          border-radius: 50px;
          padding: 1rem 2.5rem;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(26, 75, 82, 0.2);
          position: relative;
          overflow: hidden;
        }

        .admin-logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }

        .admin-logout-btn:hover::before {
          left: 100%;
        }

        .admin-logout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(26, 75, 82, 0.3);
          background: linear-gradient(135deg, #1A4B52 0%, #0F2E33 100%);
        }

        .admin-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .admin-nav-item {
          position: relative;
        }

        .admin-nav-link {
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
          box-shadow: 0 6px 20px rgba(26, 75, 82, 0.06);
        }

        .admin-nav-link-active {
          background: ${COLORS.gradientAdmin};
          color: ${COLORS.white};
          border-color: transparent;
          box-shadow: 0 12px 32px rgba(26, 75, 82, 0.25);
          transform: translateY(-2px);
        }

        .admin-nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 4px;
          background: ${COLORS.admin};
          border-radius: 2px;
        }

        .admin-nav-link-inactive {
          background: ${COLORS.white};
          color: ${COLORS.admin};
        }

        .admin-nav-link-inactive:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.admin};
          color: ${COLORS.admin};
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26, 75, 82, 0.15);
          text-decoration: none;
        }

        .admin-badge {
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
          .admin-search-input {
            font-size: 1rem;
            padding: 1rem 1.5rem 1rem 3.5rem;
          }

          .admin-brand {
            font-size: 1.4rem;
          }

          .admin-logo {
            width: 55px;
            height: 55px;
          }

          .admin-logo img {
            width: 32px;
            height: 32px;
          }

          .admin-navbar-header {
            padding: 1.2rem 0;
          }

          .admin-nav {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .admin-nav-link {
            padding: 1rem 1.8rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .admin-logout-btn {
            padding: 0.8rem 1.8rem;
            font-size: 1rem;
          }

          .admin-brand {
            font-size: 1.3rem;
          }

          .admin-logo {
            width: 50px;
            height: 50px;
          }

          .admin-user-section {
            flex-direction: column;
            gap: 0.8rem;
          }
        }
      `}</style>

      <div className="admin-navbar-container">
        {/* Top Header Bar */}
        <div className="admin-navbar-header" style={{ background: "linear-gradient(135deg,#FAFAF9 0%, #CFE8EF 70%, #6AB7C5 100%)" }}>
          <div className="container-fluid">
            <div className="row align-items-center">
              {/* Logo Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center">
                  <div className="admin-logo">
                    <img src="/A.png" alt="Admin Logo" />
                  </div>
                  <Link to="/admin" className="admin-brand">
                    <span className="d-none d-sm-inline">Cai Nghiện Thuốc Lá</span>
                    <span className="d-sm-none">CNTL</span>
                  </Link>
                </div>
              </div>

              {/* Search Section */}
              <div className="col-lg-6 col-md-4 d-none d-md-block">
                <div className="admin-search">
                  <div className="admin-search-wrapper">
                    <div className="admin-search-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <input type="text" className="admin-search-input" placeholder="Tìm kiếm quản trị..." />
                  </div>
                </div>
              </div>

              {/* Admin Account Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="admin-user-section">
                    {userEmail && (
                      <>
                        <Link to="/admin/profile" className="admin-user-info">
                          <div className="admin-user-avatar">
                            <i className="fas fa-user-shield"></i>
                          </div>
                          <span className="d-none d-sm-inline text-truncate" style={{ maxWidth: "120px" }}>
                            {userEmail.split("@")[0]}
                          </span>
                        </Link>
                        <button onClick={handleLogout} className="admin-logout-btn">
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
                <div className="admin-search">
                  <div className="admin-search-wrapper">
                    <div className="admin-search-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <input type="text" className="admin-search-input" placeholder="Tìm kiếm..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="admin-navbar-main">
          <div className="container-fluid">
            <ul className="admin-nav d-flex flex-wrap justify-content-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <li className="admin-nav-item" key={item.to}>
                    <Link
                      to={item.to}
                      className={`admin-nav-link ${isActive ? "admin-nav-link-active" : "admin-nav-link-inactive"}`}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                      {item.label}
                      {item.to === "/admin/feedback" && <span className="admin-badge">3</span>}
                      {item.to === "/admin/payment" && <span className="admin-badge">!</span>}
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
