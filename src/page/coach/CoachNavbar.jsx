import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";

export default function CoachNavbar() {
    const location = useLocation();
    const { email, logout } = useAuth();

    const navItems = [
        { to: "/coachpage", label: "Trang chủ" },
        { to: "/coachpage/community", label: "Cộng đồng" },
        { to: "/coachpage/members", label: "Quản lý học viên" },
        { to: "/coachpage/schedule", label: "Lịch trình" },
        { to: "/coachpage/statistics", label: "Thống kê" },
        // Thêm các mục khác nếu cần
    ];

    const COLORS = {
        navbarBg: "#E6F4F4",
        menuBg: "#9ACBD0",
        accent: "#006A71",
        primary: "#48A6A7",
        text: "#006A71",
        white: "#fff",
        active: "#F2EFE7",
        border: "#9ACBD0",
        shadow: "0 2px 8px rgba(72,166,167,0.08)",
        gold: "#bfa917",
        goldBg: "#fffbe8",
        goldBorder: "#f3d46e",
        danger: "#e74c3c",
        dangerHover: "#c0392b",
    };

    return (
        <>
            {/* Navbar top */}
            <div
                style={{
                    background: COLORS.navbarBg,
                    padding: "1.2rem 0 0.8rem 0",
                    borderBottom: `1.5px solid ${COLORS.border}`,
                    boxShadow: COLORS.shadow,
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
                    {/* Logo bên trái */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                            alt="Coach"
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                background: COLORS.goldBg,
                                border: `2px solid ${COLORS.primary}`,
                            }}
                        />
                        <Link to="/coachpage" style={{ textDecoration: "none" }}>
                            <span
                                style={{
                                    color: COLORS.accent,
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                    letterSpacing: 1,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Coach Dashboard
                            </span>
                        </Link>
                    </div>
                    {/* Thanh tìm kiếm ở giữa */}
                    <div style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        minWidth: 300,
                        maxWidth: 480,
                    }}>
                        <div
                            style={{
                                background: COLORS.white,
                                borderRadius: 24,
                                display: "flex",
                                alignItems: "center",
                                padding: "0.3rem 1.2rem",
                                minWidth: 260,
                                width: "100%",
                                boxShadow: COLORS.shadow,
                                border: `1.5px solid ${COLORS.primary}`,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 20,
                                    marginRight: 10,
                                    color: COLORS.primary,
                                }}
                            >
                                ☰
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                style={{
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    fontSize: "1rem",
                                    flex: 1,
                                    color: COLORS.text,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 18,
                                    marginLeft: 10,
                                    color: COLORS.primary,
                                    cursor: "pointer",
                                }}
                            >
                                🔍
                            </span>
                        </div>
                    </div>
                    {/* Tài khoản bên phải */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 220,
                        justifyContent: "flex-end",
                    }}>
                        <span style={{ fontSize: 26, color: COLORS.primary, marginRight: 4 }}>👤</span>
                        {email && (
                            <>
                                <Link
                                    to="/coachpage/profile"
                                    style={{
                                        color: COLORS.accent,
                                        fontWeight: 700,
                                        fontSize: "1.08rem",
                                        background: COLORS.white,
                                        padding: "0.5rem 1.2rem",
                                        borderRadius: 20,
                                        minWidth: 120,
                                        textAlign: "center",
                                        boxShadow: "0 2px 8px #9ACBD022",
                                        whiteSpace: "nowrap",
                                        border: `1.5px solid ${COLORS.primary}`,
                                        textDecoration: "none",
                                        display: "inline-block",
                                        cursor: "pointer"
                                    }}
                                >
                                    {email}
                                </Link>
                                <button
                                    onClick={logout}
                                    style={{
                                        color: COLORS.white,
                                        fontWeight: 700,
                                        fontSize: "1.08rem",
                                        background: COLORS.danger,
                                        padding: "0.5rem 1.2rem",
                                        borderRadius: 20,
                                        border: "none",
                                        cursor: "pointer",
                                        marginLeft: 6,
                                        boxShadow: "0 2px 8px #e74c3c22",
                                        transition: "background 0.18s",
                                        whiteSpace: "nowrap",
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = COLORS.dangerHover}
                                    onMouseOut={e => e.currentTarget.style.background = COLORS.danger}
                                >
                                    Đăng xuất
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Thanh menu */}
            <nav
                style={{
                    background: COLORS.menuBg,
                    padding: "0.7rem 0",
                    display: "flex",
                    justifyContent: "center",
                    gap: "2.5rem",
                    boxShadow: COLORS.shadow,
                    borderBottom: `1.5px solid ${COLORS.primary}`,
                }}
            >
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        style={{
                            color: location.pathname === item.to ? COLORS.accent : COLORS.white,
                            fontWeight: 700,
                            borderRadius: 8,
                            padding: "0.5rem 1.5rem",
                            textDecoration: "none",
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        {item.label}
                        {location.pathname === item.to && (
                            <span
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: 2,
                                    bottom: -2,
                                    left: 0,
                                    background: COLORS.accent,
                                    borderRadius: 2,
                                }}
                            />
                        )}
                    </Link>
                ))}
            </nav>
            <Outlet />
        </>
    );
}
