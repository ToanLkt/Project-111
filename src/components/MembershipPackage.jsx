import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext/AuthContext";

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

function getCurrentPackage(accountId) {
    if (!accountId) return null;
    try {
        const data = localStorage.getItem(`current_package_${accountId}`);
        if (!data) return null;
        const pkg = JSON.parse(data);
        if (pkg.accountId !== accountId) return null;
        if (new Date(pkg.endDate) > new Date()) return pkg;
        return null;
    } catch {
        return null;
    }
}

function showToast(message) {
    let old = document.getElementById("toast-msg");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.id = "toast-msg";
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "32px";
    toast.style.right = "32px";
    toast.style.background = "#e67e22";
    toast.style.color = "#fff";
    toast.style.padding = "16px 32px";
    toast.style.borderRadius = "10px";
    toast.style.fontWeight = "600";
    toast.style.fontSize = "17px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export default function MembershipPackage() {
    const [packages, setPackages] = useState([]);
    const auth = useContext(AuthContext);

    // Luôn lấy lại currentPkg khi accountId thay đổi hoặc có giao dịch mới
    const [currentPkg, setCurrentPkg] = useState(() => getCurrentPackage(auth?.accountId));
    const navigate = useNavigate();

    // Cập nhật lại currentPkg khi accountId thay đổi
    useEffect(() => {
        setCurrentPkg(getCurrentPackage(auth?.accountId));
    }, [auth?.accountId]);

    // Cập nhật lại currentPkg mỗi 3s để bắt kịp giao dịch mới
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPkg(getCurrentPackage(auth?.accountId));
        }, 3000);
        return () => clearInterval(interval);
    }, [auth?.accountId]);

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
    }, []);

    const handleRegister = (pkg) => {
        if (!auth?.token) {
            showToast("Đăng nhập để mua gói");
            return;
        }
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
                    Gói thành viên
                </h2>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                    {packages.length === 0 && (
                        <div style={{ color: COLORS.secondary, textAlign: "center", fontWeight: 600 }}>
                            Chưa có gói thành viên nào.
                        </div>
                    )}
                    {packages.map((pkg) => {
                        // Kiểm tra gói hiện tại theo accountId
                        const isCurrent = auth?.token && currentPkg && currentPkg.package_membership_ID === pkg.package_membership_ID;
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
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    cursor: pkg.status === "Active" && !isCurrent ? "pointer" : "not-allowed",
                                }}
                                onMouseOver={e => {
                                    if (pkg.status === "Active" && !isCurrent) {
                                        e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                                        e.currentTarget.style.boxShadow = "0 6px 24px #48A6A733";
                                    }
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.boxShadow = "0 2px 8px #9ACBD022";
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
                                    {pkg.status === "Active" ? (isCurrent ? "Đang dùng" : "Đang mở") : "Đóng"}
                                </div>
                                {pkg.status === "Active" && !isCurrent && (
                                    <button
                                        style={{
                                            marginTop: 16,
                                            padding: "0.7rem 1.5rem",
                                            background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            cursor: "pointer",
                                            opacity: 1,
                                            transition: "background 0.2s, box-shadow 0.2s",
                                            boxShadow: "0 2px 8px #48A6A733"
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = "#006A71"}
                                        onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)"}
                                        onClick={() => handleRegister(pkg)}
                                    >
                                        Đăng ký
                                    </button>
                                )}
                                {isCurrent && (
                                    <div
                                        style={{
                                            marginTop: 16,
                                            padding: "0.7rem 1.5rem",
                                            background: "#27ae60",
                                            color: "#fff",
                                            borderRadius: 8,
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                            textAlign: "center",
                                            boxShadow: "0 2px 8px #48A6A733"
                                        }}
                                    >
                                        Bạn đang sử dụng gói này
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
