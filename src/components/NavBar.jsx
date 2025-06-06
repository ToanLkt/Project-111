import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const { role, email, logout } = useAuth();

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
      {/* Top bar - Đã thay đổi màu sắc phù hợp với trang home */}
      <div
        style={{
          background: "linear-gradient(90deg, #111 60%, #000 100%)",
          padding: "1.2rem 0 0.8rem 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          borderBottom: "1px solid #333"
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            gap: 32,
          }}
        >
          {/* Logo - Cập nhật style */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Logo"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid #d4af37" // Thêm viền vàng
              }}
            />
            <Link to="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  color: "#d4af37", // Màu vàng sang trọng
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}
              >
                Cai Nghiện Thuốc Lá
              </span>
            </Link>
          </div>

          {/* Search bar - Tối giản hóa */}
          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            minWidth: 300,
            maxWidth: 480,
          }}>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                padding: "0.3rem 1.2rem",
                minWidth: 260,
                width: "100%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                border: "1px solid #333",
                transition: "all 0.3s",
              }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1rem",
                  flex: 1,
                  color: "#fff",
                  padding: "0.3rem 0",
                }}
              />
              <span style={{
                fontSize: 18,
                marginLeft: 10,
                color: "#d4af37",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                🔍
              </span>
            </div>
          </div>

          {/* Tài khoản - Cập nhật màu sắc */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 220,
            justifyContent: "flex-end",
          }}>
            <span style={{
              fontSize: 26,
              color: "#d4af37",
              marginRight: 4,
              transition: "transform 0.2s",
              cursor: "pointer"
            }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
              👤
            </span>
            {email ? (
              <>
                <Link
                  to={role === "admin" ? "/admin/profile" : "/member/profile"}
                  style={{
                    color: "#d4af37",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    background: "rgba(212, 175, 55, 0.1)",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    minWidth: 120,
                    textAlign: "center",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.2)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(212, 175, 55, 0.3)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
                  }}
                >
                  {email}
                </Link>
                <button
                  onClick={logout}
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    background: "rgba(239, 83, 80, 0.7)",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    border: "1px solid rgba(239, 83, 80, 0.5)",
                    cursor: "pointer",
                    marginLeft: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "rgba(239, 83, 80, 0.9)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(239, 83, 80, 0.4)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "rgba(239, 83, 80, 0.7)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: "#d4af37",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    textDecoration: "none",
                    background: "rgba(212, 175, 55, 0.1)",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    marginRight: 6,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.2)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(212, 175, 55, 0.3)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    textDecoration: "none",
                    background: "rgba(212, 175, 55, 0.7)",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(212, 175, 55, 0.5)",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.9)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(212, 175, 55, 0.4)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "rgba(212, 175, 55, 0.7)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nav menu - Cập nhật phong cách tối giản */}
      <nav
        style={{
          background: "rgba(0,0,0,0.8)",
          padding: "0.7rem 0",
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)"
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: location.pathname === item.to ? "#d4af37" : "#fff",
              fontWeight: 600,
              borderRadius: 8,
              padding: "0.5rem 1.5rem",
              textDecoration: "none",
              fontSize: "1.05rem",
              background:
                location.pathname === item.to ? "rgba(212, 175, 55, 0.1)" : "transparent",
              boxShadow:
                location.pathname === item.to
                  ? "0 2px 12px rgba(212, 175, 55, 0.2)"
                  : "none",
              border:
                location.pathname === item.to
                  ? "1px solid rgba(212, 175, 55, 0.3)"
                  : "1px solid transparent",
              transition: "all 0.2s",
              position: "relative",
            }}
            onMouseOver={e => {
              if (location.pathname !== item.to) {
                e.currentTarget.style.color = "#d4af37";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }
            }}
            onMouseOut={e => {
              if (location.pathname !== item.to) {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {item.label}
            {location.pathname === item.to && (
              <div style={{
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: 2,
                background: "#d4af37",
                borderRadius: 2
              }} />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}