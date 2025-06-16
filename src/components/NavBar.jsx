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
      {/* Top bar - Chủ đề màu mới */}
      <div
        style={{
          background: "linear-gradient(90deg, #F2EFE7 60%, #9ACBD0 100%)",
          padding: "1.2rem 0 0.8rem 0",
          boxShadow: "0 2px 8px rgba(0,106,113,0.07)",
          borderBottom: "1px solid #9ACBD0"
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
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Logo"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#fff",
                border: "2px solid #48A6A7"
              }}
            />
            <Link to="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  color: "#006A71",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 4px rgba(0,106,113,0.07)"
                }}
              >
                Cai Nghiện Thuốc Lá
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            minWidth: 300,
            maxWidth: 480,
          }}>
            <div
              style={{
                background: "#E6F4F4",
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                padding: "0.3rem 1.2rem",
                minWidth: 260,
                width: "100%",
                boxShadow: "0 2px 8px rgba(0,106,113,0.06)",
                border: "1px solid #9ACBD0",
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
                  color: "#006A71",
                  padding: "0.3rem 0",
                }}
              />
              <span style={{
                fontSize: 18,
                marginLeft: 10,
                color: "#48A6A7",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                🔍
              </span>
            </div>
          </div>

          {/* Tài khoản */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 220,
            justifyContent: "flex-end",
          }}>
            <span style={{
              fontSize: 26,
              color: "#48A6A7",
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
                    color: "#006A71",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    background: "#9ACBD0",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    minWidth: 120,
                    textAlign: "center",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(0,106,113,0.06)",
                    whiteSpace: "nowrap",
                    border: "1px solid #48A6A7",
                    transition: "all 0.2s",
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
                    background: "#48A6A7",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    border: "1px solid #006A71",
                    cursor: "pointer",
                    marginLeft: 6,
                    boxShadow: "0 2px 8px rgba(0,106,113,0.06)",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
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
                    color: "#006A71",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    textDecoration: "none",
                    background: "#9ACBD0",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    marginRight: 6,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    border: "1px solid #48A6A7",
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
                    background: "#48A6A7",
                    padding: "0.5rem 1.2rem",
                    borderRadius: 20,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    border: "1px solid #006A71",
                  }}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nav menu - Chủ đề màu mới */}
      <nav
        style={{
          background: "#F2EFE7",
          padding: "0.7rem 0",
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,106,113,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid #9ACBD0"
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: location.pathname === item.to ? "#006A71" : "#48A6A7",
              fontWeight: 600,
              borderRadius: 8,
              padding: "0.5rem 1.5rem",
              textDecoration: "none",
              fontSize: "1.05rem",
              background:
                location.pathname === item.to ? "#9ACBD0" : "transparent",
              boxShadow:
                location.pathname === item.to
                  ? "0 2px 12px rgba(72,166,167,0.15)"
                  : "none",
              border:
                location.pathname === item.to
                  ? "1px solid #48A6A7"
                  : "1px solid transparent",
              transition: "all 0.2s",
              position: "relative",
            }}
            onMouseOver={e => {
              if (location.pathname !== item.to) {
                e.currentTarget.style.color = "#006A71";
                e.currentTarget.style.background = "#E6F4F4";
              }
            }}
            onMouseOut={e => {
              if (location.pathname !== item.to) {
                e.currentTarget.style.color = "#48A6A7";
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
                background: "#006A71",
                borderRadius: 2
              }} />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}