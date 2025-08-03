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
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    purple: "#8B5CF6",
};

const medalColors = [COLORS.medal1, COLORS.medal2, COLORS.medal3];
const bgMedals = [
    "rgba(72,166,167,0.10)",
    "rgba(154,203,208,0.13)",
    "rgba(0,106,113,0.10)",
];

// THÊM DỮ LIỆU BẢNG ĐIỂM THƯỞNG
const pointsTable = [
    {
        icon: "📝",
        activity: "Đăng bài trong cộng đồng",
        shortActivity: "Bài đăng",
        points: "+10 điểm",
        color: COLORS.info,
        bgColor: "rgba(59, 130, 246, 0.1)"
    },
    {
        icon: "💬",
        activity: "Bình luận",
        shortActivity: "Bình luận",
        points: "+5 điểm",
        color: COLORS.purple,
        bgColor: "rgba(139, 92, 246, 0.1)"
    },
    {
        icon: "🚭",
        activity: "Cập nhật tiến trình",
        shortActivity: "Cập nhật tiến trình",
        points: "+10 điểm",
        color: COLORS.warning,
        bgColor: "rgba(245, 158, 11, 0.1)"
    },
    {
        icon: "⭐",
        activity: "Gửi phản hồi",
        shortActivity: "Phản hồi",
        points: "+50 điểm",
        color: COLORS.yellow,
        bgColor: "rgba(243, 212, 110, 0.2)"
    },
    {
        icon: "🎉",
        activity: "Hoàn thành giai đoạn",
        shortActivity: "Hoàn thành giai đoạn",
        points: "+50 điểm",
        color: COLORS.success,
        bgColor: "rgba(16, 185, 129, 0.1)"
    },
    {
        icon: "🏆",
        activity: "Hoàn thành kế hoạch",
        shortActivity: "Hoàn thành kế hoạch",
        points: "+150 điểm",
        color: COLORS.medal1,
        bgColor: "rgba(72, 166, 167, 0.15)"
    }
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
                const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Ranking");
                if (response.ok) {
                    const data = await response.json();
                    setRankingData(Array.isArray(data) ? data : []);
                } else {
                    setRankingData([]);
                }
            } catch (error) {
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
                setCurrentUser(null);
                return;
            }

            setUserLoading(true);
            try {
                const response = await fetch(
                    "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Ranking/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                setCurrentUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        fetchCurrentUserRank();
    }, [token]);

    // COMPONENT BẢNG ĐIỂM THƯỞNG - COMPACT VERSION
    const PointsTableSidebar = () => (
        <div
            style={{
                background: COLORS.white,
                borderRadius: 18,
                border: `2px solid ${COLORS.border}`,
                boxShadow: "0 4px 20px rgba(72,166,167,0.1)",
                overflow: "hidden",
                height: "fit-content",
                position: "sticky",
                top: "20px"
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: `linear-gradient(135deg, ${COLORS.medal1} 0%, ${COLORS.medal3} 100%)`,
                    color: COLORS.white,
                    padding: "1.2rem 1.5rem",
                    textAlign: "center"
                }}
            >
                <h3 style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    marginBottom: "0.3rem"
                }}>
                    🎯 Bảng điểm thưởng
                </h3>
                <p style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    opacity: 0.9
                }}>
                    Cách thức tích điểm
                </p>
            </div>

            {/* Content - Always visible */}
            <div style={{ padding: "1.2rem 1.5rem" }}>
                <div style={{
                    display: "grid",
                    gap: "10px"
                }}>
                    {pointsTable.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0.8rem 1rem",
                                background: item.bgColor,
                                borderRadius: "10px",
                                border: `1px solid ${item.color}40`,
                                transition: "all 0.3s ease"
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                fontSize: "1.4rem",
                                marginRight: "0.8rem",
                                flexShrink: 0
                            }}>
                                {item.icon}
                            </div>

                            {/* Activity & Points */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: COLORS.text,
                                    lineHeight: 1.3,
                                    marginBottom: "0.2rem"
                                }}>
                                    {item.shortActivity}
                                </div>
                                <div style={{
                                    background: item.color,
                                    color: COLORS.white,
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "15px",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    display: "inline-block",
                                    boxShadow: `0 2px 6px ${item.color}40`
                                }}>
                                    {item.points}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compact Tips */}
                <div style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.6rem"
                    }}>
                        <span style={{ fontSize: "1.1rem" }}>💡</span>
                        <h4 style={{
                            margin: 0,
                            color: COLORS.text,
                            fontSize: "0.9rem",
                            fontWeight: 700
                        }}>
                            Mẹo tích điểm:
                        </h4>
                    </div>
                    <ul style={{
                        margin: 0,
                        paddingLeft: "1rem",
                        color: COLORS.text,
                        fontSize: "0.8rem",
                        lineHeight: 1.4
                    }}>
                        <li>Tham gia cộng đồng</li>
                        <li>Cập nhật tiến trình</li>
                        <li>Hoàn thành kế hoạch</li>
                        <li>Chia sẻ kinh nghiệm</li>
                    </ul>
                </div>
            </div>
        </div>
    );

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
                
                @media (max-width: 1200px) {
                    .main-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    
                    .points-sidebar {
                        order: -1;
                    }
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
                    
                    .main-container {
                        padding: 24px 0 !important;
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
                    className="main-container"
                    style={{
                        flex: 1,
                        padding: "48px 0 32px 0",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1400, // Tăng maxWidth để chứa 2 cột
                            margin: "0 auto",
                            padding: "0 1rem"
                        }}
                    >
                        {/* MAIN GRID LAYOUT - 2 COLUMNS */}
                        <div
                            className="main-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 320px", // Left: ranking, Right: points table
                                gap: "2rem",
                                alignItems: "start"
                            }}
                        >
                            {/* LEFT COLUMN - RANKING */}
                            <div
                                className="ranking-container"
                                style={{
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

                            {/* RIGHT COLUMN - POINTS TABLE */}
                            <div className="points-sidebar">
                                <PointsTableSidebar />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />


                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}
