import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";

export default function AdminNavbar() {
    const location = useLocation();
    const { email, logout } = useAuth();

    // Palette giống NavBar.jsx
    const colorBg = "#48A6A7";
    const color1 = "#9ACBD0";
    const color2 = "#48A6A7";
    const color3 = "#006A71";
    const colorWhite = "#fff";

    const navItems = [
        { to: "/admin", label: "Trang chủ" },
        { to: "/admin/list", label: "Danh sách" },
        { to: "/admin/community", label: "Cộng đồng" },
        { to: "/admin/feedback", label: "Phản hồi" },
        { to: "/admin/payment", label: "Thanh toán" },
    ];

    return (
        <>
            {/* Top Header Bar */}
            <div
                style={{
                    background: "linear-gradient(90deg,#ffffff 10% ,#CFE8EF 50%, #6AB7C5 100%)",
                    borderBottom: `2px solid ${color2}`,
                    padding: "1.2rem 0 0.8rem 0",
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 1.5rem",
                        gap: 32,
                    }}
                >
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
                                background: colorWhite,
                                borderRadius: 24,
                                display: "flex",
                                alignItems: "center",
                                padding: "0.3rem 1.2rem",
                                minWidth: 260,
                                width: "100%",
                                border: `2px solid ${color1}`,
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
                                    color: color3,
                                }}
                            />
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
                        <span style={{ fontSize: 26, color: color2, marginRight: 4 }}>👤</span>
                        {email && (
                            <>
                                <Link
                                    to="/admin/profile"
                                    style={{
                                        color: color3,
                                        fontWeight: 700,
                                        fontSize: "1.08rem",
                                        background: colorWhite,
                                        padding: "0.5rem 1.2rem",
                                        borderRadius: 20,
                                        minWidth: 120,
                                        textAlign: "center",
                                        border: `2px solid ${color2}`,
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
                                        color: colorWhite,
                                        fontWeight: 700,
                                        fontSize: "1.08rem",
                                        background: color2,
                                        padding: "0.5rem 1.2rem",
                                        borderRadius: 20,
                                        border: `2px solid ${color3}`,
                                        cursor: "pointer",
                                        marginLeft: 6,
                                        transition: "background 0.18s",
                                        whiteSpace: "nowrap",
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = color3}
                                    onMouseOut={e => e.currentTarget.style.background = color2}
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
                    background: colorWhite,
                    padding: "0.7rem 0",
                    display: "flex",
                    justifyContent: "center",
                    gap: "2.5rem",
                    borderBottom: `2px solid ${color2}`,
                }}
            >
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        style={{
                            color: location.pathname === item.to ? colorWhite : color3,
                            fontWeight: 700,
                            borderRadius: 24,
                            padding: "0.5rem 1.5rem",
                            textDecoration: "none",
                            fontSize: "1.08rem",
                            background:
                                location.pathname === item.to ? color2 : "transparent",
                            border:
                                location.pathname === item.to
                                    ? `2px solid ${color2}`
                                    : `2px solid ${color2}`,
                            boxShadow:
                                location.pathname === item.to
                                    ? "0 2px 8px #48A6A722"
                                    : "none",
                            margin: "0 4px",
                            transition: "all 0.18s",
                            position: "relative",
                        }}
                    >
                        {item.label}
                        {location.pathname === item.to && (
                            <span
                                style={{
                                    position: "absolute",
                                    bottom: 6,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "100%",
                                    height: 2,
                                    background: color2,
                                    borderRadius: 4,
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