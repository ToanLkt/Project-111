import React from "react";
import Footer from "../../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const rankingData = [
    {
        name: "Bạch Tấn Phú",
        days: 120,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Hà Việt Thành",
        days: 98,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Lương Khánh Toàn",
        days: 90,
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
        name: "Phan Diệu Linh",
        days: 80,
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Hoàng Văn E",
        days: 75,
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
];

// Mô phỏng current user (bạn nên truyền từ props/context thực tế)
const currentUser = {
    name: "Lương Khánh Toàn",
    days: 90,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    rank: rankingData.findIndex(u => u.name === "Lương Khánh Toàn") + 1,
};

const medalColors = ["#d4af37", "#c0c0c0", "#cd7f32"];
const bgMedals = [
    "rgba(212, 175, 55, 0.08)",
    "rgba(192, 192, 192, 0.08)",
    "rgba(205, 127, 50, 0.08)",
];

export default function Ranking() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f7fa",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#222",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "48px 0 32px 0",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 540,
                        background: "#fff",
                        borderRadius: 16,
                        boxShadow: "0 4px 24px rgba(44,130,201,0.07)",
                        padding: "2.2rem 2rem 1.5rem 2rem",
                        border: "1.5px solid #f3d46e",
                    }}
                >
                    <h2
                        style={{
                            color: "#bfa917",
                            textAlign: "center",
                            marginBottom: 28,
                            fontWeight: 800,
                            fontSize: "2rem",
                            userSelect: "none",
                            letterSpacing: 0.5,
                        }}
                    >
                        🏆 Bảng xếp hạng thành viên
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {rankingData.map((user, idx) => (
                            <div
                                key={user.name}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: 12,
                                    padding: "0.9rem 1rem",
                                    background: idx < 3 ? bgMedals[idx] : "#fffbe8",
                                    border: `1.5px solid ${medalColors[idx] || "#f3d46e"}`,
                                    boxShadow: idx < 3 ? `0 0 10px ${medalColors[idx]}33` : "none",
                                    transform: idx === 0 ? "scale(1.03)" : "none",
                                    marginBottom: 0,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 800,
                                        textAlign: "center",
                                        fontSize: idx === 0 ? "2rem" : "1.3rem",
                                        width: "2.2rem",
                                        color: medalColors[idx] || "#bfa917",
                                        marginRight: 8,
                                        userSelect: "none",
                                    }}
                                >
                                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                                </div>
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    style={{
                                        width: idx === 0 ? 56 : 44,
                                        height: idx === 0 ? 56 : 44,
                                        borderRadius: "50%",
                                        border: `2px solid ${medalColors[idx] || "#f3d46e"}`,
                                        background: "#fff",
                                        marginRight: 16,
                                        objectFit: "cover",
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: "1.08rem", color: "#222" }}>{user.name}</div>
                                    <div style={{ fontSize: 14, color: "#888" }}>
                                        Điểm cá nhân :{" "}
                                        <span style={{ color: "#bfa917", fontWeight: 600 }}>{user.days}</span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        marginLeft: 18,
                                        color: medalColors[idx] || "#bfa917",
                                        fontSize: "1.15rem",
                                    }}
                                >
                                    #{idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vị trí của bạn */}
                    <div
                        style={{
                            marginTop: 32,
                            padding: "1.3rem 1rem",
                            background: "#fffbe8",
                            borderRadius: 14,
                            textAlign: "center",
                            border: "1.5px solid #f3d46e",
                            boxShadow: "0 2px 8px rgba(243,212,110,0.07)",
                        }}
                    >
                        <h3
                            style={{
                                color: "#bfa917",
                                fontWeight: 800,
                                marginBottom: 16,
                                fontSize: "1.15rem",
                                letterSpacing: 0.2,
                            }}
                        >
                            🎖 Vị trí của bạn
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    border: "2.5px solid #d4af37",
                                    marginRight: 18,
                                    objectFit: "cover",
                                }}
                            />
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 700, fontSize: "1.08rem", color: "#222" }}>{currentUser.name}</div>
                                <div style={{ color: "#888", fontSize: 14 }}>
                                    Điểm cá nhân :{" "}
                                    <span style={{ color: "#bfa917", fontWeight: 600 }}>{currentUser.days}</span>
                                </div>
                                <div style={{ color: "#bfa917", fontWeight: 700, fontSize: "1.1rem", marginTop: 2 }}>
                                    #{currentUser.rank}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
