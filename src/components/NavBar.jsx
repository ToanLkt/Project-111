

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"

export default function NavBar() {
  const location = useLocation()
  const pathname = location.pathname
  const { role, email, logout } = useAuth()

  // New palette
  const colorBg = "#FAFAF9"
  const color1 = "#CFE8EF"
  const color2 = "#6AB7C5"
  const color3 = "#336B73"
  const colorWhite = "#FFFFFF"

  const navItems = [
    { to: "/", label: "Trang chủ" },
    { to: "/plan", label: "Lộ trình" },
    { to: "/community", label: "Cộng đồng" },
    { to: "/coach", label: "Chuyên gia" },
    { to: "/ranking", label: "Bảng xếp hạng" },
    { to: "/feedback", label: "Phản hồi" },
  ]

  return (
    <>
      <style jsx>{`
        /* Navbar specific styles with high specificity to prevent override */
        .navbar-container {
          position: relative;
          z-index: 1050 !important;
          font-family: 'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif !important;
        }

        .navbar-header {
          background: linear-gradient(90deg, #ffffff 10%, #CFE8EF 50%, #6AB7C5 100%) !important;
          position: relative !important;
          z-index: 1051 !important;
          width: 100% !important;
          padding: 1rem 0 !important;
        }

        .navbar-main {
          background: ${colorBg} !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 1050 !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
           width: 100% !important;
          padding: 1rem 0 !important;
        }

        .navbar-logo {
          width: 45px !important;
          height: 45px !important;
          background: linear-gradient(135deg, ${color2} 0%, ${color3} 100%) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-right: 1rem !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .navbar-logo img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 50% !important;
          display: block !important;
        }

        .navbar-brand {
          color: ${color3} !important;
          font-weight: 700 !important;
          font-size: 1.25rem !important;
          text-decoration: none !important;
        }

        .navbar-brand:hover {
          color: ${color3} !important;
          text-decoration: none !important;
        }

        .navbar-search {
          position: relative !important;
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
        }

        .navbar-search-input {
          border: 2px solid ${color1} !important;
          background-color: ${colorWhite} !important;
          color: ${color3} !important;
          border-radius: 25px !important;
          padding: 0.5rem 1rem 0.5rem 2.5rem !important;
          width: 100% !important;
          max-width: 260px !important;
          min-width: 140px !important;
          margin: 0 auto !important;
          font-size: 0.9rem !important;
          transition: all 0.3s ease !important;
        }

        .navbar-search-input:focus {
          border-color: ${color2} !important;
          box-shadow: 0 0 0 0.2rem rgba(106, 183, 197, 0.25) !important;
          outline: none !important;
        }

        .navbar-search-input::placeholder {
          color: #999 !important;
        }

        .navbar-user-dropdown {
          border: 2px solid ${color2} !important;
          background: ${color1} !important;
          color: ${color3} !important;
          border-radius: 25px !important;
          padding: 0.5rem 1rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          transition: all 0.3s ease !important;
        }

        .navbar-user-dropdown:hover {
          background: ${color2} !important;
          color: ${colorWhite} !important;
        }

        .navbar-user-avatar {
          width: 32px !important;
          height: 32px !important;
          background: linear-gradient(135deg, ${color2} 0%, ${color3} 100%) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          font-size: 0.875rem !important;
        }

        .navbar-auth-btn {
          border-radius: 25px !important;
          padding: 0.5rem 1.5rem !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
          text-decoration: none !important;
          display: inline-block !important;
          text-align: center !important;
        }

        .navbar-auth-btn-login {
          border: 2px solid ${color2} !important;
          color: ${color3} !important;
          background: ${colorWhite} !important;
        }

        .navbar-auth-btn-login:hover {
          background: ${color2} !important;
          color: ${colorWhite} !important;
        }

        .navbar-auth-btn-register {
          background: ${color2} !important;
          border: 2px solid ${color2} !important;
          color: ${colorWhite} !important;
        }

        .navbar-auth-btn-register:hover {
          background: ${color3} !important;
          border-color: ${color3} !important;
        }

        .navbar-toggle {
          border: 2px solid ${color2} !important;
          color: ${color3} !important;
          background: ${colorBg} !important;
          border-radius: 8px !important;
          padding: 0.5rem !important;
        }

        .navbar-nav-item {
          margin: 0 0.25rem !important;
        }

        .navbar-nav-link {
          padding: 0.75rem 1.5rem !important;
          border-radius: 25px !important;
          font-weight: 600 !important;
          border: 2px solid ${color2} !important;
          transition: all 0.3s ease !important;
          text-decoration: none !important;
          position: relative !important;
          display: inline-block !important;
        }

        .navbar-nav-link-active {
          background: ${color2} !important;
          color: ${colorWhite} !important;
        }

        .navbar-nav-link-inactive {
          background: transparent !important;
          color: ${color3} !important;
        }

        .navbar-nav-link:hover {
          background: ${color2} !important;
          color: ${colorWhite} !important;
          text-decoration: none !important;
        }

        .navbar-nav-indicator {
          position: absolute !important;
          bottom: -2px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 24px !important;
          height: 3px !important;
          background: ${color3} !important;
          border-radius: 2px !important;
          display: block !important;
        }

        .navbar-dropdown-menu {
          z-index: 2000 !important;
          background: ${colorWhite} !important;
          border: 1px solid ${color1} !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .navbar-dropdown-item {
          color: ${color3} !important;
          padding: 0.75rem 1rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          text-decoration: none !important;
        }

        .navbar-dropdown-item:hover {
          background: ${color1} !important;
          color: ${color3} !important;
        }

        .navbar-mobile-search {
          padding: 0.5rem 1rem 1rem !important;
        }

        .navbar-mobile-search-input {
          border: 2px solid ${color1} !important;
          background-color: ${colorBg} !important;
          color: ${color3} !important;
          border-radius: 25px !important;
          padding: 0.5rem 1rem 0.5rem 2.5rem !important;
          width: 100% !important;
          max-width: 260px !important;
          margin: 0 auto !important;
          font-size: 0.9rem !important;
        }

        .offcanvas-custom {
          z-index: 1055 !important;
        }

        .offcanvas-header-custom {
          background: ${color1} !important;
          padding: 1rem !important;
        }

        .offcanvas-body-custom {
          background: ${colorWhite} !important;
          padding: 1rem !important;
        }

        .offcanvas-nav-link {
          border: 2px solid ${color2} !important;
          border-radius: 25px !important;
          padding: 0.75rem 1rem !important;
          margin-bottom: 0.5rem !important;
          text-decoration: none !important;
          display: block !important;
          transition: all 0.3s ease !important;
        }

        .offcanvas-nav-link-active {
          background: ${color2} !important;
          color: ${colorWhite} !important;
        }

        .offcanvas-nav-link-inactive {
          background: ${colorWhite} !important;
          color: ${color3} !important;
        }

        /* Ensure navbar stays on top of all content */
        .navbar-container * {
          box-sizing: border-box !important;
        }

        /* Mobile responsive fixes */
        @media (max-width: 768px) {
          .navbar-search-input {
            max-width: 200px !important;
            font-size: 0.85rem !important;
          }
          
          .navbar-mobile-search-input {
            max-width: 200px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>

      <div className="navbar-container">
        {/* Top Header Bar */}
        <div className="navbar-header">
          <div className="container-fluid">
            <div className="row align-items-center py-3">
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
                  <input type="text" className="navbar-search-input" placeholder="Tìm kiếm..." />
                </div>
              </div>

              {/* Account Section */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="d-flex align-items-center justify-content-end gap-2">
                  {email ? (
                    <div className="dropdown">
                      <button
                        className="btn navbar-user-dropdown"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="navbar-user-avatar">
                          <span>👤</span>
                        </div>
                        <span className="d-none d-sm-inline text-truncate" style={{ maxWidth: "120px" }}>
                          {email}
                        </span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end navbar-dropdown-menu">
                        <li>
                          <Link
                            to={role === "admin" ? "/admin/profile" : "/member/profile"}
                            className="dropdown-item navbar-dropdown-item"
                          >
                            <span>👤</span>
                            Hồ sơ cá nhân
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            onClick={logout}
                            className="dropdown-item navbar-dropdown-item"
                            style={{ color: "#d9534f !important" }}
                          >
                            <span>🚪</span>
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="navbar-auth-btn navbar-auth-btn-login d-none d-sm-inline-block">
                        Đăng nhập
                      </Link>
                      <Link to="/register" className="navbar-auth-btn navbar-auth-btn-register">
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
                    <span>☰</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="row d-md-none">
              <div className="col-12 navbar-mobile-search">
                <div className="navbar-search">
                  <input type="text" className="navbar-mobile-search-input" placeholder="Tìm kiếm..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="navbar navbar-expand-lg navbar-main">
          <div className="container-fluid">
            <ul className="navbar-nav mx-auto d-none d-lg-flex">
              {navItems.map((item) => {
                const isActive = pathname === item.to
                return (
                  <li className="navbar-nav-item" key={item.to}>
                    <Link
                      to={item.to}
                      className={`navbar-nav-link ${isActive ? "navbar-nav-link-active" : "navbar-nav-link-inactive"}`}
                    >
                      {item.label}
                      {isActive && <span className="navbar-nav-indicator" />}
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
                <span style={{ fontSize: "1.25rem" }}>🚭</span>
              </div>
              <h5 className="offcanvas-title fw-bold" id="mobileMenuLabel" style={{ color: color3 }}>
                Cai Nghiện Thuốc Lá
              </h5>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
          </div>

          <div className="offcanvas offcanvas-end offcanvas-custom" tabIndex="-1" id="mobileMenu">
            <div className="offcanvas-header offcanvas-header-custom">
              <h5 className="offcanvas-title">Menu</h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body offcanvas-body-custom">
              {navItems.map((item) => {
                const isActive = pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`offcanvas-nav-link ${isActive ? "offcanvas-nav-link-active" : "offcanvas-nav-link-inactive"}`}
                    data-bs-dismiss="offcanvas"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
