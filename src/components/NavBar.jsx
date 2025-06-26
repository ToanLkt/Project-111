"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../AuthContext/AuthContext"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/NavBar.css"

export default function NavBar() {
  const location = useLocation()
  const { role, email, logout } = useAuth()
  const [searchFocused, setSearchFocused] = useState(false)

  const navItems = [
    { to: "/", label: "Trang chủ", icon: "🏠" },
    { to: "/plan", label: "Lộ trình", icon: "🗺️" },
    { to: "/community", label: "Cộng đồng", icon: "👥" },
    { to: "/coach", label: "Chuyên gia", icon: "👨‍⚕️" },
    { to: "/ranking", label: "Bảng xếp hạng", icon: "🏆" },
    { to: "/feedback", label: "Phản hồi", icon: "💬" },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="top-navbar">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            {/* Logo Section */}
            <div className="col-lg-3 col-md-4 col-sm-12 mb-2 mb-md-0">
              <div className="logo-section d-flex align-items-center">
                <div className="logo-container">
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo" className="logo-img" />
                  <div className="logo-pulse"></div>
                </div>
                <Link to="/" className="brand-link">
                  <span className="brand-text">Cai Nghiện Thuốc Lá</span>
                </Link>
              </div>
            </div>

            {/* Search Section */}
            <div className="col-lg-6 col-md-4 col-sm-12 mb-2 mb-md-0">
              <div className="search-container">
                <div className={`search-wrapper ${searchFocused ? "focused" : ""}`}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm thông tin, bài viết..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <button className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="account-section d-flex align-items-center justify-content-end">
                {email ? (
                  <div className="user-menu d-flex align-items-center">
                    <div className="user-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <Link
                      to={role === "admin" ? "/admin/profile" : "/member/profile"}
                      className="user-email btn btn-outline-primary me-2"
                    >
                      {email}
                    </Link>
                    <button onClick={logout} className="btn btn-danger logout-btn">
                      <i className="fas fa-sign-out-alt me-1"></i>
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn btn-outline-primary me-2 auth-btn">
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="btn btn-primary auth-btn">
                      <i className="fas fa-user-plus me-1"></i>
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="main-navbar navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav nav-pills">
              {navItems.map((item) => (
                <li key={item.to} className="nav-item">
                  <Link to={item.to} className={`nav-link ${location.pathname === item.to ? "active" : ""}`}>
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                    {location.pathname === item.to && <div className="active-indicator"></div>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
