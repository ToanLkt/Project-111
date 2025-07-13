import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../AuthContext/AuthContext";

const COACH_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Coach";
const MEMBER_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member";
const PAYMENT_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Payment";
const PACKAGE_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership";

function AdminReport() {
    const [memberCount, setMemberCount] = useState(0);
    const [coachCount, setCoachCount] = useState(0);
    const [paymentCount, setPaymentCount] = useState(0);
    const [packageCount, setPackageCount] = useState(0);
    const [activePackageCount, setActivePackageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [successfulPayments, setSuccessfulPayments] = useState(0);
    const [recentPayments, setRecentPayments] = useState([]);

    const auth = useContext(AuthContext);
    const adminToken = auth?.token;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const headers = {
                    "Authorization": `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                };

                // Lấy dữ liệu member
                const memberRes = await fetch(MEMBER_API, { headers });
                const memberData = await memberRes.json();
                setMemberCount(Array.isArray(memberData) ? memberData.length : 0);

                // Lấy dữ liệu coach
                const coachRes = await fetch(COACH_API, { headers });
                const coachData = await coachRes.json();
                setCoachCount(Array.isArray(coachData) ? coachData.length : 0);

                // Lấy dữ liệu payment
                const paymentRes = await fetch(PAYMENT_API, { headers });
                const paymentData = await paymentRes.json();
                if (Array.isArray(paymentData)) {
                    setPaymentCount(paymentData.length);
                    const successful = paymentData.filter(p => p.paymentStatus === "Success");
                    setSuccessfulPayments(successful.length);
                    // Tổng doanh thu = tổng tất cả số tiền trong lịch sử thanh toán (chỉ tính giao dịch thành công)
                    setTotalRevenue(successful.reduce((sum, p) => sum + (p.totalPrice || 0), 0));
                    setRecentPayments(paymentData.slice(-5).reverse());
                }

                // Lấy dữ liệu package
                const packageRes = await fetch(PACKAGE_API, { headers });
                const packageData = await packageRes.json();
                if (Array.isArray(packageData)) {
                    setPackageCount(packageData.length);
                    setActivePackageCount(packageData.filter(pkg => pkg.status === "Active").length);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        if (adminToken) {
            fetchData();
        }
    }, [adminToken]);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                fontSize: "1.2rem",
                color: "#006A71"
            }}>
                🔄 Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 1200,
            margin: "40px auto",
            padding: "0 20px"
        }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #006A71 0%, #48A6A7 100%)",
                color: "white",
                padding: "2rem",
                borderRadius: "20px 20px 0 0",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,106,113,0.2)"
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    margin: 0,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}>
                    📊 Báo cáo tổng hợp hệ thống
                </h1>
                <p style={{
                    fontSize: "1.1rem",
                    margin: "10px 0 0 0",
                    opacity: 0.9
                }}>
                    Thống kê chi tiết các hoạt động trong hệ thống
                </p>
            </div>

            {/* Main Stats Cards */}
            <div style={{
                background: "#fff",
                padding: "2rem",
                boxShadow: "0 8px 32px rgba(0,106,113,0.1)",
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 25,
                    marginBottom: "2rem"
                }}>
                    <StatCard
                        icon="👥"
                        title="Tổng số thành viên"
                        value={memberCount}
                        color="#4CAF50"
                        subtitle="Người dùng đã đăng ký"
                    />
                    <StatCard
                        icon="🎯"
                        title="Huấn luyện viên"
                        value={coachCount}
                        color="#2196F3"
                        subtitle="Chuyên gia hỗ trợ"
                    />
                    <StatCard
                        icon="💰"
                        title="Tổng doanh thu"
                        value={`${totalRevenue.toLocaleString("vi-VN")}đ`}
                        color="#FF9800"
                        subtitle="Từ các giao dịch thành công"
                    />
                    <StatCard
                        icon="✅"
                        title="Giao dịch thành công"
                        value={successfulPayments}
                        color="#8BC34A"
                        subtitle={`Trên tổng ${paymentCount} giao dịch`}
                    />
                </div>

                {/* Package Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 20,
                    marginBottom: "2rem"
                }}>
                    <SmallStatCard
                        icon="📦"
                        title="Tổng gói dịch vụ"
                        value={packageCount}
                        color="#9C27B0"
                    />
                    <SmallStatCard
                        icon="🟢"
                        title="Gói đang hoạt động"
                        value={activePackageCount}
                        color="#4CAF50"
                    />
                    <SmallStatCard
                        icon="📊"
                        title="Tỷ lệ thanh toán"
                        value={paymentCount > 0 ? `${Math.round((successfulPayments / paymentCount) * 100)}%` : "0%"}
                        color="#FF5722"
                    />
                </div>

                {/* Recent Payments */}
                {recentPayments.length > 0 && (
                    <div style={{
                        background: "#F8F9FA",
                        padding: "1.5rem",
                        borderRadius: 12,
                        border: "1px solid #E3F2FD"
                    }}>
                        <h3 style={{
                            color: "#006A71",
                            marginBottom: "1rem",
                            fontSize: "1.3rem",
                            fontWeight: 700
                        }}>
                            🕒 Giao dịch gần đây
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {recentPayments.map((payment, index) => (
                                <div key={index} style={{
                                    background: "#fff",
                                    padding: "12px 16px",
                                    borderRadius: 8,
                                    border: "1px solid #E0E0E0",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <span style={{ fontWeight: 600, color: "#333" }}>
                                        Gói #{payment.packageMembershipId}
                                    </span>
                                    <span style={{
                                        color: payment.paymentStatus === "Success" ? "#4CAF50" : "#FF5722",
                                        fontWeight: 600
                                    }}>
                                        {payment.totalPrice?.toLocaleString("vi-VN")}đ
                                    </span>
                                    <span style={{
                                        padding: "4px 8px",
                                        borderRadius: 4,
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        background: payment.paymentStatus === "Success" ? "#E8F5E8" : "#FFEBEE",
                                        color: payment.paymentStatus === "Success" ? "#2E7D32" : "#C62828"
                                    }}>
                                        {payment.paymentStatus === "Success" ? "Thành công" : "Thất bại"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                background: "#F5F5F5",
                padding: "1.5rem",
                borderRadius: "0 0 20px 20px",
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem"
            }}>
                📅 Cập nhật lúc: {new Date().toLocaleString("vi-VN")}
            </div>
        </div>
    );
}

// Component StatCard
function StatCard({ icon, title, value, color, subtitle }) {
    return (
        <div style={{
            background: "#fff",
            padding: "1.8rem",
            borderRadius: 16,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            border: "1px solid #F0F0F0",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer"
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
            }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
            <h3 style={{
                fontSize: "1.1rem",
                color: "#666",
                marginBottom: "0.5rem",
                fontWeight: 600
            }}>{title}</h3>
            <div style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: color,
                marginBottom: "0.5rem"
            }}>{value}</div>
            <p style={{
                fontSize: "0.9rem",
                color: "#999",
                margin: 0
            }}>{subtitle}</p>
        </div>
    );
}

// Component SmallStatCard
function SmallStatCard({ icon, title, value, color }) {
    return (
        <div style={{
            background: "#fff",
            padding: "1.2rem",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid #F0F0F0",
            textAlign: "center"
        }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{icon}</div>
            <h4 style={{
                fontSize: "0.95rem",
                color: "#666",
                marginBottom: "0.5rem",
                fontWeight: 600
            }}>{title}</h4>
            <div style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: color
            }}>{value}</div>
        </div>
    );
}

export default AdminReport;