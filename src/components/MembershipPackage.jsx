import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Bảng màu chủ đề
const COLORS = {
    background: "#F2EFE7",
    primary: "#9ACBD0",
    secondary: "#48A6A7",
    accent: "#006A71",
    text: "#006A71",
    white: "#fff",
    light: "#E6F4F4",
};

function getCurrentPackage() {
    try {
        const data = localStorage.getItem("current_package");
        if (!data) return null;
        const pkg = JSON.parse(data);
        if (new Date(pkg.endDate) > new Date()) return pkg;
        return null;
    } catch {
        return null;
    }
}

export default function MembershipPackage() {
    const [packages, setPackages] = useState([]);
    const [currentPkg, setCurrentPkg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(
                    "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership"
                );
                const data = await res.json();
                setPackages(Array.isArray(data) ? data : []);
            } catch {
                setPackages([]);
            }
        };
        fetchPackages();
        setCurrentPkg(getCurrentPackage());
    }, []);

    // Khi user thanh toán thành công ở nơi khác, cập nhật lại gói đang dùng
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPkg(getCurrentPackage());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleRegister = (pkg) => {
        if (currentPkg) return; // Không cho đăng ký nếu còn hạn
        navigate("/payment", { state: { package: pkg } });
    };

    return (
        <section
            id="membership"
            style={{
                width: "100%",
                minHeight: "40vh",
                background: COLORS.background,
                padding: "2.5rem 0",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: 900,
                    width: "100%",
                    background: COLORS.white,
                    borderRadius: 20,
                    boxShadow: "0 6px 32px rgba(72,166,167,0.13)",
                    border: `2px solid ${COLORS.primary}`,
                    padding: "2.2rem 2rem",
                }}
            >
                <h2
                    style={{
                        color: COLORS.accent,
                        fontWeight: 900,
                        fontSize: "2rem",
                        marginBottom: 24,
                        letterSpacing: 1,
                        textAlign: "center",
                        textShadow: "0 2px 8px #9ACBD033",
                        userSelect: "none",
                    }}
                >
                    🎁 Gói thành viên
                </h2>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                    {packages.length === 0 && (
                        <div style={{ color: COLORS.secondary, textAlign: "center", fontWeight: 600 }}>
                            Chưa có gói thành viên nào.
                        </div>
                    )}
                    {packages.map((pkg) => {
                        const isCurrent = currentPkg && currentPkg.package_membership_ID === pkg.package_membership_ID;
                        const isExpired = !currentPkg || new Date(currentPkg.endDate) <= new Date();
                        return (
                            <div
                                key={pkg.package_membership_ID}
                                style={{
                                    background: COLORS.light,
                                    borderRadius: 14,
                                    border: `2px solid ${pkg.status === "Active" ? COLORS.secondary : "#ccc"}`,
                                    boxShadow: "0 2px 8px #9ACBD022",
                                    padding: "1.5rem 1.2rem",
                                    minWidth: 220,
                                    maxWidth: 270,
                                    flex: "1 1 220px",
                                    opacity: pkg.status === "Active" ? 1 : 0.6,
                                    position: "relative",
                                }}
                            >
                                <div style={{
                                    fontWeight: 700,
                                    color: COLORS.accent,
                                    fontSize: "1.18rem",
                                    marginBottom: 8,
                                    textTransform: "uppercase"
                                }}>
                                    {pkg.category}
                                </div>
                                <div style={{
                                    color: COLORS.text,
                                    fontSize: "1.07rem",
                                    marginBottom: 10,
                                    fontWeight: 500
                                }}>
                                    {pkg.description}
                                </div>
                                <div style={{
                                    color: COLORS.secondary,
                                    fontWeight: 700,
                                    fontSize: "1.15rem",
                                    marginBottom: 8
                                }}>
                                    {pkg.price === 0 ? "Miễn phí" : pkg.price.toLocaleString("vi-VN") + "đ"}
                                </div>
                                <div style={{ color: "#888", fontSize: "0.98rem", marginBottom: 8 }}>
                                    Thời hạn: {pkg.duration} ngày
                                </div>
                                <div style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 16,
                                    color: pkg.status === "Active" ? COLORS.secondary : "#aaa",
                                    fontWeight: 600,
                                    fontSize: "0.95rem"
                                }}>
                                    {pkg.status === "Active" ? "Đang mở" : "Đóng"}
                                </div>
                                {pkg.status === "Active" && (
                                    <button
                                        style={{
                                            marginTop: 16,
                                            padding: "0.7rem 1.5rem",
                                            background: isCurrent ? COLORS.secondary : COLORS.primary,
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            cursor: isCurrent ? "default" : (isExpired ? "pointer" : "not-allowed"),
                                            opacity: isCurrent || isExpired ? 1 : 0.6,
                                            transition: "background 0.2s",
                                        }}
                                        disabled={!isExpired && !isCurrent}
                                        onClick={() => handleRegister(pkg)}
                                    >
                                        {isCurrent ? "Đang dùng" : "Đăng ký"}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
