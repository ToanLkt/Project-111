import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer";

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

const medalColors = [COLORS.medal1, COLORS.medal2, COLORS.medal3];
const bgMedals = [
    "rgba(72,166,167,0.10)",
    "rgba(154,203,208,0.13)",
    "rgba(0,106,113,0.10)",
];

export default function Ranking() {
    // Redux state thay vì useContext(AuthContext)
    const { user, token } = useSelector((state) => state.account || {});

    const [rankingData, setRankingData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(false);

    // Extract user info từ Redux user object
    const getUserInfo = () => {
        if (!user) return { fullName: "Ẩn danh" };

        const fullName = user.fullName ||
            user.name ||
            user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            user.email ||
            "Ẩn danh";

        return { fullName };
    };

    const userInfo = getUserInfo();

    // Lấy bảng xếp hạng
    useEffect(() => {
        const fetchRankingData = async () => {
            setLoading(true);
            try {
                console.log("🚀 Fetching ranking data...");

                const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Ranking");

                console.log("📡 Ranking API response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ Ranking data received:", data);
                    setRankingData(Array.isArray(data) ? data : []);
                } else {
                    console.warn("⚠️ Ranking API failed");
                    setRankingData([]);
                }
            } catch (error) {
                console.error("❌ Error fetching ranking data:", error);
                setRankingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankingData();
    }, []);

    // Lấy thông tin rank của user hiện tại
    useEffect(() => {
        const fetchCurrentUserRank = async () => {
            if (!token) {
                console.log("❌ No token, skipping user rank fetch");
                setCurrentUser(null);
                return;
            }

            setUserLoading(true);
            try {
                console.log("🚀 Fetching current user rank...");

                const response = await fetch(
                    "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Ranking/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log("📡 User rank API response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ User rank data received:", data);
                    setCurrentUser(data);
                } else {
                    console.warn("⚠️ User rank API failed");
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("❌ Error fetching user rank:", error);
                setCurrentUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        fetchCurrentUserRank();
    }, [token]);

    return (
        <>
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                
                .loading-animation {
                    animation: pulse 1.5s ease-in-out infinite;
                }
                
                .ranking-item:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(72,166,167,0.2) !important;
                }
                
                @media (max-width: 768px) {
                    .ranking-container {
                        margin: 0 1rem;
                        padding: 1.5rem 1rem !important;
                    }
                    
                    .ranking-title {
                        font-size: 1.8rem !important;
                    }
                    
                    .ranking-item {
                        padding: 0.8rem 1rem !important;
                    }
                    
                    .user-avatar {
                        width: 40px !important;
                        height: 40px !important;
                        margin-right: 12px !important;
                    }
                }
            `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    background: `#FAFAF9`,
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
                        className="ranking-container"
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
                            className="ranking-title"
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

                        {loading ? (
                            <div style={{
                                textAlign: "center",
                                color: COLORS.medal1,
                                fontWeight: 700,
                                fontSize: 18,
                                margin: "2rem 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}>
                                <div style={{
                                    width: "20px",
                                    height: "20px",
                                    border: `3px solid ${COLORS.border}`,
                                    borderRadius: "50%",
                                    borderTopColor: COLORS.medal1,
                                    animation: "spin 1s ease-in-out infinite"
                                }}></div>
                                Đang tải bảng xếp hạng...
                            </div>
                        ) : rankingData.length === 0 ? (
                            <div style={{
                                textAlign: "center",
                                color: COLORS.medal1,
                                fontWeight: 700,
                                fontSize: 18,
                                margin: "2rem 0",
                                padding: "2rem",
                                background: COLORS.light,
                                borderRadius: "12px",
                                border: `2px solid ${COLORS.border}`
                            }}>
                                📭 Không có dữ liệu xếp hạng.
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {rankingData.map((user, idx) => (
                                    <div
                                        key={user.rank || idx}
                                        className="ranking-item"
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
                                            transition: "all 0.3s ease",
                                            cursor: "pointer"
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
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${user.rank}`}
                                        </div>
                                        <div
                                            className="user-avatar"
                                            style={{
                                                width: idx === 0 ? 62 : 48,
                                                height: idx === 0 ? 62 : 48,
                                                borderRadius: "50%",
                                                border: `2.5px solid ${medalColors[idx] || COLORS.border}`,
                                                background: COLORS.white,
                                                marginRight: 18,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 900,
                                                fontSize: idx === 0 ? 28 : 20,
                                                color: medalColors[idx] || COLORS.text,
                                                flexShrink: 0
                                            }}
                                        >
                                            {user.fullName ? user.fullName[0].toUpperCase() : "?"}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: 700,
                                                fontSize: "1.13rem",
                                                color: COLORS.text,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {user.fullName || "Ẩn danh"}
                                            </div>
                                            <div style={{ fontSize: 14, color: "#48A6A7" }}>
                                                Huy hiệu: <span style={{ color: COLORS.medal1, fontWeight: 700 }}>{user.badge || "Chưa có"}</span>
                                            </div>
                                            <div style={{ fontSize: 14, color: "#48A6A7" }}>
                                                Điểm cá nhân: <span style={{ color: COLORS.medal1, fontWeight: 700 }}>{user.totalScore ?? 0}</span>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 800,
                                                marginLeft: 20,
                                                color: medalColors[idx] || COLORS.text,
                                                fontSize: "1.18rem",
                                                flexShrink: 0
                                            }}
                                        >
                                            #{user.rank}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

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

                            {!token ? (
                                <div style={{
                                    color: "#888",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    padding: "1rem",
                                    background: "rgba(136, 136, 136, 0.1)",
                                    borderRadius: "8px"
                                }}>
                                    🔒 Vui lòng đăng nhập để xem vị trí của bạn.
                                </div>
                            ) : userLoading ? (
                                <div style={{
                                    color: COLORS.medal1,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px"
                                }}>
                                    <div style={{
                                        width: "16px",
                                        height: "16px",
                                        border: `2px solid ${COLORS.border}`,
                                        borderRadius: "50%",
                                        borderTopColor: COLORS.medal1,
                                        animation: "spin 1s ease-in-out infinite"
                                    }}></div>
                                    Đang tải thông tin của bạn...
                                </div>
                            ) : currentUser ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{
                                        width: 62,
                                        height: 62,
                                        borderRadius: "50%",
                                        border: `2.5px solid ${COLORS.medal1}`,
                                        background: COLORS.white,
                                        marginRight: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 900,
                                        fontSize: 24,
                                        color: COLORS.medal1,
                                        flexShrink: 0
                                    }}>
                                        {(currentUser.fullName || userInfo.fullName)[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div style={{ textAlign: "left" }}>
                                        <div style={{
                                            fontWeight: 700,
                                            fontSize: "1.13rem",
                                            color: COLORS.text,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth: "200px"
                                        }}>
                                            {currentUser.fullName || userInfo.fullName}
                                        </div>
                                        <div style={{ color: "#48A6A7", fontSize: 14 }}>
                                            Điểm cá nhân:{" "}
                                            <span style={{ color: COLORS.medal1, fontWeight: 700 }}>
                                                {currentUser.totalScore ?? 0}
                                            </span>
                                        </div>
                                        <div style={{ color: COLORS.medal1, fontWeight: 800, fontSize: "1.15rem", marginTop: 2 }}>
                                            #{currentUser.rank ?? "?"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    color: "#e74c3c",
                                    fontWeight: 600,
                                    fontSize: 15,
                                    padding: "1rem",
                                    background: "rgba(231, 76, 60, 0.1)",
                                    borderRadius: "8px"
                                }}>
                                    ❌ Không thể tải thông tin xếp hạng của bạn.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />

                {/* Debug Panel - Development Only */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: 15,
                        borderRadius: 8,
                        fontSize: 12,
                        fontFamily: "monospace",
                        zIndex: 9998,
                        maxWidth: 300
                    }}>
                        <div><strong>🔍 Ranking Debug:</strong></div>
                        <div>Token: {token ? "✅" : "❌"}</div>
                        <div>User: {user ? "✅" : "❌"}</div>
                        <div>FullName: {userInfo.fullName}</div>
                        <div>Ranking Data: {rankingData.length}</div>
                        <div>Current User: {currentUser ? "✅" : "❌"}</div>
                        <div>Loading: {loading ? "⏳" : "✅"}</div>
                        <div>User Loading: {userLoading ? "⏳" : "✅"}</div>
                    </div>
                )}

                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}
