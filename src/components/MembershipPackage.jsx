import React, { useEffect, useState } from "react";

const COLORS = {
    card: "#1e3a3d",
    cardAlt: "#4a6e70",
    accent: "#b0c4d2",
    border: "#4a6e70",
    btn: "#2e5350",
    btnHover: "#4a6e70",
    highlight: "#bfa917",
    highlightBg: "#fffbe8",
    text: "#b0c4d2",
};

export default function MembershipPackage() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPackages(data);
                else setPackages([]);
                setLoading(false);
            })
            .catch(() => {
                setPackages([]);
                setLoading(false);
            });
    }, []);

    return (
        <section style={{ maxWidth: 1100, margin: "48px auto", padding: "0 16px" }}>
            <h2 style={{
                color: COLORS.accent,
                fontWeight: 800,
                fontSize: "2rem",
                textAlign: "center",
                marginBottom: 32,
                letterSpacing: 0.5,
            }}>
                Các gói thành viên
            </h2>
            {loading ? (
                <div style={{ color: COLORS.accent, textAlign: "center", padding: 40 }}>Đang tải...</div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        gap: 32,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {packages.length === 0 && (
                        <div style={{ color: COLORS.accent, textAlign: "center" }}>
                            Không có gói nào.
                        </div>
                    )}
                    {packages.map((pkg, idx) => (
                        <div
                            key={pkg.packageId}
                            style={{
                                background: idx === 1 ? COLORS.cardAlt : COLORS.card,
                                border: `2.5px solid ${idx === 1 ? COLORS.highlight : COLORS.border}`,
                                borderRadius: 18,
                                boxShadow: idx === 1
                                    ? "0 6px 32px #bfa91733"
                                    : "0 2px 12px #9ACBD022",
                                minWidth: 300,
                                maxWidth: 340,
                                flex: "1 1 300px",
                                padding: "2.2rem 1.6rem 2rem 1.6rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                position: "relative",
                                height: 420,
                                justifyContent: "flex-start",
                            }}
                        >
                            {idx === 1 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: -18,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: COLORS.highlight,
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        padding: "4px 22px",
                                        borderRadius: 16,
                                        boxShadow: "0 2px 8px #bfa91733",
                                        letterSpacing: 0.5,
                                        zIndex: 2,
                                    }}
                                >
                                    Phổ biến nhất
                                </div>
                            )}
                            <div style={{
                                color: COLORS.accent,
                                fontWeight: 800,
                                fontSize: 26,
                                marginBottom: 10,
                                marginTop: idx === 1 ? 18 : 0,
                                textAlign: "center",
                                letterSpacing: 0.5,
                                minHeight: 32,
                                lineHeight: 1.2,
                                width: "100%",
                            }}>
                                {pkg.packageName}
                            </div>
                            <div style={{
                                color: idx === 1 ? COLORS.highlight : COLORS.accent,
                                fontWeight: 700,
                                fontSize: 22,
                                marginBottom: 18,
                                textAlign: "center",
                                minHeight: 32,
                                width: "100%",
                                lineHeight: 1.2,
                            }}>
                                {pkg.price ? pkg.price.toLocaleString("vi-VN") + "đ/tháng" : "Miễn phí"}
                            </div>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 0,
                                marginBottom: 32,
                                width: "100%",
                                listStyle: "none",
                                minHeight: 108,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                            }}>
                                {pkg.features && pkg.features.length > 0 ? (
                                    pkg.features.map((f, i) => (
                                        <li key={i} style={{
                                            marginBottom: 12,
                                            display: "flex",
                                            alignItems: "center",
                                            color: COLORS.accent,
                                            fontSize: 17,
                                            fontWeight: 500,
                                        }}>
                                            <span style={{
                                                color: COLORS.text,
                                                fontSize: 18,
                                                marginRight: 10,
                                            }}>✔️</span>
                                            {f}
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ color: COLORS.text, fontStyle: "italic" }}>Không có thông tin tính năng</li>
                                )}
                            </ul>
                            <div style={{ flexGrow: 1 }} />
                            <button
                                style={{
                                    background: idx === 1 ? COLORS.highlight : COLORS.btn,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 12,
                                    padding: "16px 0",
                                    fontWeight: 700,
                                    fontSize: 20,
                                    width: "100%",
                                    cursor: "pointer",
                                    boxShadow: idx === 1
                                        ? "0 2px 8px #bfa91733"
                                        : "0 2px 8px #9ACBD022",
                                    transition: "background 0.18s",
                                    letterSpacing: 0.2,
                                    marginTop: "auto",
                                    minHeight: 56,
                                }}
                                onMouseOver={e => e.currentTarget.style.background = COLORS.btnHover}
                                onMouseOut={e => e.currentTarget.style.background = idx === 1 ? COLORS.highlight : COLORS.btn}
                            >
                                Đăng ký gói
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
