import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { role, email, logout } = useAuth();

  // New palette
  const colorBg = "#FAFAF9";       // nền sáng dịu
  const color1 = "#CFE8EF";        // nhạt hơn cho border/input
  const color2 = "#6AB7C5";        // màu chủ đạo dịu mắt
  const color3 = "#336B73";        // đậm hơn để tạo điểm nhấn
  const colorWhite = "#FFFFFF";    // trắng

  const navItems = [
    { to: "/", label: "Trang chủ" },
    { to: "/plan", label: "Lộ trình" },
    { to: "/community", label: "Cộng đồng" },
    { to: "/coach", label: "Chuyên gia" },
    { to: "/ranking", label: "Bảng xếp hạng" },
    { to: "/feedback", label: "Phản hồi" },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <div
        className="border-bottom"
        style={{
          background: "linear-gradient(90deg,#ffffff 10% ,#CFE8EF 50%, #6AB7C5 100%)",
          borderBottom: `2px solid ${color2}`,
        }}
      >
        <div className="container-fluid">
          <div className="row align-items-center py-3" style={{ position: "static", overflow: "visible" }}>
            {/* Logo Section */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                  style={{
                    width: "45px",
                    height: "45px",
                    background: `linear-gradient(135deg, ${color2} 0%, ${color3} 100%)`,
                    overflow: "hidden",
                  }}
                >
                  <span className="fs-4" style={{ color: colorWhite }}>
                    <img
                      src="/A.png"
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                        display: "block"
                      }}
                    />
                  </span>
                </div>
                <Link
                  to="/"
                  className="text-decoration-none fw-bold fs-5"
                  style={{ color: color3 }}
                >
                  <span className="d-none d-sm-inline">Cai Nghiện Thuốc Lá</span>
                  <span className="d-sm-none">CNTL</span>
                </Link>
              </div>
            </div>

            {/* Search Section */}
            <div className="col-lg-6 col-md-4 d-none d-md-block">
              <div className="position-relative d-flex justify-content-center">
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 pe-4 border-2"
                  placeholder="Tìm kiếm..."
                  style={{
                    borderColor: color1,
                    backgroundColor: colorWhite,
                    color: color3,
                    maxWidth: "260px",
                    minWidth: "140px",
                    margin: "0 auto",
                  }}
                />

              </div>
            </div>

            {/* Account Section */}
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="d-flex align-items-center justify-content-end gap-2">
                {email ? (
                  <div className="dropdown">
                    <button
                      className="btn dropdown-toggle d-flex align-items-center gap-2 rounded-pill"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        border: `2px solid ${color2}`,
                        background: color1,
                        color: color3,
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          background: `linear-gradient(135deg, ${color2} 0%, ${color3} 100%)`,
                        }}
                      >
                        <span className="text-white fs-6">👤</span>
                      </div>
                      <span className="d-none d-sm-inline text-truncate" style={{ maxWidth: "120px" }}>
                        {email}
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end shadow"
                      style={{ zIndex: 2000, background: colorWhite, borderColor: color1 }}
                    >
                      <li>
                        <Link
                          to={role === "admin" ? "/admin/profile" : "/member/profile"}
                          className="dropdown-item d-flex align-items-center gap-2"
                          style={{ color: color3 }}
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
                          className="dropdown-item d-flex align-items-center gap-2"
                          style={{ color: "#d9534f" }}
                        >
                          <span>🚪</span>
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn rounded-pill px-4 d-none d-sm-inline-block"
                      style={{
                        border: `2px solid ${color2}`,
                        color: color3,
                        background: colorWhite,
                      }}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="btn text-white rounded-pill px-4"
                      style={{
                        background: color2,
                        border: `2px solid ${color2}`,
                      }}
                    >
                      Đăng ký
                    </Link>
                  </>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  className="btn"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileMenu"
                  aria-controls="mobileMenu"
                  style={{
                    border: `2px solid ${color2}`,
                    color: color3,
                    background: colorBg,
                  }}
                >
                  <span className="navbar-toggler-icon">☰</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="row d-md-none pb-3">
            <div className="col-12">
              <div className="position-relative d-flex justify-content-center">
                <input
                  type="text"
                  className="form-control rounded-pill ps-5 pe-4 border-2"
                  placeholder="Tìm kiếm..."
                  style={{
                    borderColor: color1,
                    backgroundColor: colorBg,
                    color: color3,
                    maxWidth: "260px",
                    minWidth: "140px",
                    margin: "0 auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className="navbar navbar-expand-lg shadow-sm sticky-top border-bottom"
        style={{
          background: colorBg,
          borderBottom: `2px solid ${color2}`,
        }}
      >
        <div className="container-fluid">
          <ul className="navbar-nav gap-1 mx-auto d-none d-lg-flex">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <Link
                  to={item.to}
                  className={`nav-link px-4 py-2 rounded-pill fw-semibold position-relative ${pathname === item.to ? "text-white" : "text-dark"
                    }`}
                  style={{
                    background: pathname === item.to ? color2 : "transparent",
                    color: pathname === item.to ? colorWhite : color3,
                    border: `2px solid ${color2}`,
                    margin: "0 4px",
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.label}
                  {pathname === item.to && (
                    <span
                      className="position-absolute bottom-0 start-50 translate-middle-x"
                      style={{
                        width: "24px",
                        height: "3px",
                        bottom: "-2px",
                        background: color3,
                        borderRadius: "2px",
                        display: "block",
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Offcanvas Menu */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileMenu" aria-labelledby="mobileMenuLabel">
        <div className="offcanvas-header" style={{ background: color1 }}>
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "40px",
                height: "40px",
                background: `linear-gradient(135deg, ${color2} 0%, ${color3} 100%)`,
              }}
            >
              <span className="fs-5" style={{ color: colorWhite }}>🚭</span>
            </div>
            <h5 className="offcanvas-title fw-bold" id="mobileMenuLabel" style={{ color: color3 }}>
              Cai Nghiện Thuốc Lá
            </h5>
          </div>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body" style={{ background: colorWhite }}>
          <div className="d-flex flex-column gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`btn text-start rounded-pill py-3 ${pathname === item.to ? "text-white" : ""}`}
                style={{
                  background: pathname === item.to ? color2 : colorWhite,
                  color: pathname === item.to ? colorWhite : color3,
                  border: `2px solid ${color2}`,
                  marginBottom: "4px",
                }}
                data-bs-dismiss="offcanvas"
              >
                {item.label}
              </Link>
            ))}

            <hr className="my-4" />

            {email ? (
              <div className="d-flex flex-column gap-2">
                <Link
                  to={role === "admin" ? "/admin/profile" : "/member/profile"}
                  className="btn text-start rounded-pill py-3"
                  style={{
                    border: `2px solid ${color1}`,
                    color: color3,
                    background: colorWhite,
                  }}
                  data-bs-dismiss="offcanvas"
                >
                  <span className="me-2">👤</span>
                  {email}
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-outline-danger text-start rounded-pill py-3"
                  data-bs-dismiss="offcanvas"
                >
                  <span className="me-2">🚪</span>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/login"
                  className="btn rounded-pill py-3"
                  style={{
                    border: `2px solid ${color2}`,
                    color: color3,
                    background: colorWhite,
                  }}
                  data-bs-dismiss="offcanvas"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn text-white rounded-pill py-3"
                  style={{
                    background: color2,
                    border: `2px solid ${color2}`,
                  }}
                  data-bs-dismiss="offcanvas"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}