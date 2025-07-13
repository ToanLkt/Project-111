import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    const [error, setError] = useState(null);

    // Redux state thay vì AuthContext
    const { user, token } = useSelector((state) => {
        console.log('🔍 AdminReport Redux state:', state.account);
        return state.account || {};
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Extract user info từ Redux user object
    const getUserRole = () => {
        if (!user) return null;
        const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            user.role ||
            null;
        return role ? role.toString().trim() : null;
    };

    const userRole = getUserRole();
    const adminToken = token;

    // Check admin authorization
    useEffect(() => {
        if (!token) {
            console.log('❌ No token found, redirecting to login...');
            navigate("/login");
            return;
        }

        if (userRole && userRole !== "Admin") {
            console.log('❌ User is not admin, role:', userRole);
            setError("Bạn không có quyền truy cập trang này!");
            return;
        }
    }, [token, userRole, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!adminToken) {
                    throw new Error("Token không tồn tại");
                }

                const headers = {
                    "Authorization": `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                };

                console.log('🚀 Fetching admin data with token...');

                // Fetch all data in parallel
                const [memberRes, coachRes, paymentRes, packageRes] = await Promise.all([
                    fetch(MEMBER_API, { headers }).catch(err => {
                        console.error('❌ Member API error:', err);
                        return { ok: false, status: 500 };
                    }),
                    fetch(COACH_API, { headers }).catch(err => {
                        console.error('❌ Coach API error:', err);
                        return { ok: false, status: 500 };
                    }),
                    fetch(PAYMENT_API, { headers }).catch(err => {
                        console.error('❌ Payment API error:', err);
                        return { ok: false, status: 500 };
                    }),
                    fetch(PACKAGE_API, { headers }).catch(err => {
                        console.error('❌ Package API error:', err);
                        return { ok: false, status: 500 };
                    })
                ]);

                // Process member data
                if (memberRes.ok) {
                    const memberData = await memberRes.json();
                    setMemberCount(Array.isArray(memberData) ? memberData.length : 0);
                    console.log('✅ Members loaded:', Array.isArray(memberData) ? memberData.length : 0);
                } else {
                    console.error('❌ Failed to fetch members:', memberRes.status);
                }

                // Process coach data
                if (coachRes.ok) {
                    const coachData = await coachRes.json();
                    setCoachCount(Array.isArray(coachData) ? coachData.length : 0);
                    console.log('✅ Coaches loaded:', Array.isArray(coachData) ? coachData.length : 0);
                } else {
                    console.error('❌ Failed to fetch coaches:', coachRes.status);
                }

                // Process payment data
                if (paymentRes.ok) {
                    const paymentData = await paymentRes.json();
                    if (Array.isArray(paymentData)) {
                        setPaymentCount(paymentData.length);
                        const successful = paymentData.filter(p => p.paymentStatus === "Success");
                        setSuccessfulPayments(successful.length);

                        // Calculate total revenue from successful payments
                        const revenue = successful.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
                        setTotalRevenue(revenue);

                        // Get recent payments (last 5)
                        setRecentPayments(paymentData.slice(-5).reverse());

                        console.log('✅ Payments loaded:', {
                            total: paymentData.length,
                            successful: successful.length,
                            revenue
                        });
                    }
                } else {
                    console.error('❌ Failed to fetch payments:', paymentRes.status);
                }

                // Process package data
                if (packageRes.ok) {
                    const packageData = await packageRes.json();
                    if (Array.isArray(packageData)) {
                        setPackageCount(packageData.length);
                        setActivePackageCount(packageData.filter(pkg => pkg.status === "Active").length);
                        console.log('✅ Packages loaded:', {
                            total: packageData.length,
                            active: packageData.filter(pkg => pkg.status === "Active").length
                        });
                    }
                } else {
                    console.error('❌ Failed to fetch packages:', packageRes.status);
                }

            } catch (error) {
                console.error("❌ Error fetching admin data:", error);
                setError(`Lỗi khi tải dữ liệu: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (adminToken && userRole === "Admin") {
            fetchData();
        }
    }, [adminToken, userRole]);

    // Debug user info
    useEffect(() => {
        console.log('🔍 Admin user info debug:', {
            hasToken: !!token,
            hasUser: !!user,
            userRole,
            userKeys: user ? Object.keys(user) : []
        });
    }, [token, user, userRole]);

    // Error state
    if (error) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                fontSize: "1.2rem",
                color: "#FF5722",
                textAlign: "center",
                padding: "2rem"
            }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❌</div>
                <div style={{ fontWeight: 600, marginBottom: "1rem" }}>{error}</div>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "12px 24px",
                        background: "#006A71",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600
                    }}
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    // Loading state
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
            {/* Debug panel - Development only */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    position: "fixed",
                    top: 10,
                    right: 10,
                    background: "rgba(0,0,0,0.8)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    zIndex: 999
                }}>
                    <div>Token: {token ? "✅" : "❌"}</div>
                    <div>User: {user ? "✅" : "❌"}</div>
                    <div>Role: {userRole || "null"}</div>
                    <div>Members: {memberCount}</div>
                    <div>Coaches: {coachCount}</div>
                    <div>Payments: {paymentCount}</div>
                    <div>Revenue: {totalRevenue.toLocaleString()}</div>
                </div>
            )}

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
                {user && (
                    <p style={{
                        fontSize: "0.9rem",
                        margin: "5px 0 0 0",
                        opacity: 0.8
                    }}>
                        👋 Xin chào, {user.fullName || user.email || "Admin"}
                    </p>
                )}
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