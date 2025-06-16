import React from "react";
import Footer from "../../components/Footer";

// Chủ đề màu
const COLORS = {
    bg: "#F2EFE7",
    border: "#9ACBD0",
    medal1: "#48A6A7",
    medal2: "#9ACBD0",
    medal3: "#006A71",
    text: "#006A71",
    white: "#fff",
    yellow: "#f3d46e",
    light: "#E6F4F4",
};

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

const currentUser = {
    name: "Lương Khánh Toàn",
    days: 90,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    rank: rankingData.findIndex(u => u.name === "Lương Khánh Toàn") + 1,
};

const medalColors = [COLORS.medal1, COLORS.medal2, COLORS.medal3];
const bgMedals = [
    "rgba(72,166,167,0.10)",
    "rgba(154,203,208,0.13)",
    "rgba(0,106,113,0.10)",
];

export default function Ranking() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: `linear-gradient(120deg, ${COLORS.bg} 60%, ${COLORS.medal2} 100%)`,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: COLORS.text,
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
                        background: COLORS.white,
                        borderRadius: 22,
                        boxShadow: "0 8px 32px rgba(72,166,167,0.13)",
                        padding: "2.5rem 2.2rem 1.7rem 2.2rem",
                        border: `2.5px solid ${COLORS.border}`,
                        position: "relative",
                    }}
                >
                    <h2
                        style={{
                            color: COLORS.text,
                            textAlign: "center",
                            marginBottom: 32,
                            fontWeight: 900,
                            fontSize: "2.2rem",
                            userSelect: "none",
                            letterSpacing: 1,
                            textShadow: "0 2px 8px #9ACBD033",
                        }}
                    >
                        🏆 Bảng xếp hạng thành viên
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {rankingData.map((user, idx) => (
                            <div
                                key={user.name}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: 16,
                                    padding: "1.1rem 1.2rem",
                                    background: idx < 3 ? bgMedals[idx] : COLORS.light,
                                    border: `2px solid ${medalColors[idx] || COLORS.border}`,
                                    boxShadow: idx < 3 ? `0 0 16px ${medalColors[idx]}33` : "none",
                                    transform: idx === 0 ? "scale(1.04)" : "none",
                                    marginBottom: 0,
                                    transition: "transform 0.2s",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 900,
                                        textAlign: "center",
                                        fontSize: idx === 0 ? "2.2rem" : "1.4rem",
                                        width: "2.5rem",
                                        color: medalColors[idx] || COLORS.text,
                                        marginRight: 10,
                                        userSelect: "none",
                                    }}
                                >
                                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                                </div>
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    style={{
                                        width: idx === 0 ? 62 : 48,
                                        height: idx === 0 ? 62 : 48,
                                        borderRadius: "50%",
                                        border: `2.5px solid ${medalColors[idx] || COLORS.border}`,
                                        background: COLORS.white,
                                        marginRight: 18,
                                        objectFit: "cover",
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: "1.13rem", color: COLORS.text }}>{user.name}</div>
                                    <div style={{ fontSize: 14, color: "#48A6A7" }}>
                                        Điểm cá nhân:{" "}
                                        <span style={{ color: COLORS.medal1, fontWeight: 700 }}>{user.days}</span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontWeight: 800,
                                        marginLeft: 20,
                                        color: medalColors[idx] || COLORS.text,
                                        fontSize: "1.18rem",
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
                            marginTop: 38,
                            padding: "1.4rem 1.1rem",
                            background: COLORS.light,
                            borderRadius: 18,
                            textAlign: "center",
                            border: `2px solid ${COLORS.border}`,
                            boxShadow: "0 2px 12px #9ACBD022",
                        }}
                    >
                        <h3
                            style={{
                                color: COLORS.text,
                                fontWeight: 900,
                                marginBottom: 18,
                                fontSize: "1.18rem",
                                letterSpacing: 0.3,
                            }}
                        >
                            🎖 Vị trí của bạn
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                style={{
                                    width: 62,
                                    height: 62,
                                    borderRadius: "50%",
                                    border: `2.5px solid ${COLORS.medal1}`,
                                    marginRight: 20,
                                    objectFit: "cover",
                                    background: COLORS.white,
                                }}
                            />
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 700, fontSize: "1.13rem", color: COLORS.text }}>{currentUser.name}</div>
                                <div style={{ color: "#48A6A7", fontSize: 14 }}>
                                    Điểm cá nhân:{" "}
                                    <span style={{ color: COLORS.medal1, fontWeight: 700 }}>{currentUser.days}</span>
                                </div>
                                <div style={{ color: COLORS.medal1, fontWeight: 800, fontSize: "1.15rem", marginTop: 2 }}>
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
