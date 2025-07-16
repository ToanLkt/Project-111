import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Đăng ký các components của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

// API endpoints mới
const ACCOUNT_STATS_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/AdminDashboard/account-stats";
const REVENUE_STATS_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/AdminDashboard/revenue-stats";
const PACKAGE_STATS_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/AdminDashboard/package-stats";
const CESSATION_STATS_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/AdminDashboard/cessation-stats";

// Colors theme
const COLORS = {
    primary: "#006A71",
    secondary: "#48A6A7",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#f44336",
    info: "#2196F3",
    purple: "#9C27B0",
    teal: "#009688",
    indigo: "#3F51B5",
    pink: "#E91E63"
};

function AdminReport() {
    // State cho từng loại data
    const [accountStats, setAccountStats] = useState(null);
    const [revenueStats, setRevenueStats] = useState(null);
    const [packageStats, setPackageStats] = useState(null);
    const [cessationStats, setCessationStats] = useState(null);

    // State cho biểu đồ doanh thu
    const [revenueChartData, setRevenueChartData] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redux state
    const { user, token } = useSelector((state) => {
        console.log('🔍 AdminReport Redux state:', state.account);
        return state.account || {};
    });

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

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
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

                console.log('🚀 Fetching dashboard data with token...');

                // Fetch tất cả APIs song song
                const [accountRes, revenueRes, packageRes, cessationRes] = await Promise.all([
                    fetch(ACCOUNT_STATS_API, { headers }).catch(err => {
                        console.error('❌ Account Stats API error:', err);
                        return { ok: false, status: 500, error: err.message };
                    }),
                    fetch(REVENUE_STATS_API, { headers }).catch(err => {
                        console.error('❌ Revenue Stats API error:', err);
                        return { ok: false, status: 500, error: err.message };
                    }),
                    fetch(PACKAGE_STATS_API, { headers }).catch(err => {
                        console.error('❌ Package Stats API error:', err);
                        return { ok: false, status: 500, error: err.message };
                    }),
                    fetch(CESSATION_STATS_API, { headers }).catch(err => {
                        console.error('❌ Cessation Stats API error:', err);
                        return { ok: false, status: 500, error: err.message };
                    })
                ]);

                // Process Account Stats
                if (accountRes.ok) {
                    const accountData = await accountRes.json();
                    console.log('✅ Account Stats loaded:', accountData);
                    setAccountStats(accountData);
                } else {
                    console.error('❌ Failed to fetch account stats:', accountRes.status);
                }

                // Process Revenue Stats
                if (revenueRes.ok) {
                    const revenueData = await revenueRes.json();
                    console.log('✅ Revenue Stats loaded:', revenueData);
                    setRevenueStats(revenueData);
                } else {
                    console.error('❌ Failed to fetch revenue stats:', revenueRes.status);
                }

                // Process Package Stats
                if (packageRes.ok) {
                    const packageData = await packageRes.json();
                    console.log('✅ Package Stats loaded:', packageData);
                    setPackageStats(packageData);
                } else {
                    console.error('❌ Failed to fetch package stats:', packageRes.status);
                }

                // Process Cessation Stats
                if (cessationRes.ok) {
                    const cessationData = await cessationRes.json();
                    console.log('✅ Cessation Stats loaded:', cessationData);
                    setCessationStats(cessationData);
                } else {
                    console.error('❌ Failed to fetch cessation stats:', cessationRes.status);
                }

            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
                setError(`Lỗi khi tải dữ liệu: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (adminToken && userRole === "Admin") {
            fetchDashboardData();
        }
    }, [adminToken, userRole]);

    // Tạo data cho biểu đồ cột doanh thu từ revenueStats thực tế
    const generateRevenueBarChart = (revenueData) => {
        if (!revenueData) return null;

        return {
            labels: ['Gói Basic', 'Gói Plus', 'Tổng Doanh Thu'],
            datasets: [
                {
                    label: 'Doanh Thu (VNĐ)',
                    data: [
                        revenueData.Package1Revenue || 0,
                        revenueData.Package2Revenue || 0,
                        revenueData.TotalRevenue || 0
                    ],
                    backgroundColor: [
                        `${COLORS.success}80`, // Basic - Green với opacity
                        `${COLORS.indigo}80`,  // Plus - Indigo với opacity
                        `${COLORS.warning}80`  // Total - Orange với opacity
                    ],
                    borderColor: [
                        COLORS.success,
                        COLORS.indigo,
                        COLORS.warning
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: [
                        `${COLORS.success}B3`,
                        `${COLORS.indigo}B3`,
                        `${COLORS.warning}B3`
                    ],
                    hoverBorderColor: [
                        COLORS.success,
                        COLORS.indigo,
                        COLORS.warning
                    ],
                    hoverBorderWidth: 3
                }
            ]
        };
    };

    // Cấu hình biểu đồ cột
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Ẩn legend vì chỉ có 1 dataset
            },
            title: {
                display: true,
                text: 'Biểu Đồ Doanh Thu Theo Gói',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                color: COLORS.primary,
                padding: {
                    bottom: 30
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: COLORS.primary,
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        return `Doanh thu: ${formatCurrency(context.parsed.y)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#666',
                    font: {
                        size: 13,
                        weight: '600'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0',
                    borderDash: [5, 5],
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#666',
                    font: {
                        size: 12
                    },
                    callback: function (value) {
                        if (value >= 1000000) {
                            return `${(value / 1000000).toFixed(1)}M`;
                        } else if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}K`;
                        }
                        return value;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        elements: {
            bar: {
                borderRadius: 8
            }
        }
    };

    // Cập nhật useEffect để tạo biểu đồ cột
    useEffect(() => {
        if (revenueStats) {
            console.log('📊 Generating bar chart data from revenue stats:', revenueStats);
            const chartData = generateRevenueBarChart(revenueStats);
            setRevenueChartData(chartData);
        }
    }, [revenueStats]);

    // Format number với dấu phẩy
    const formatNumber = (num) => {
        if (num === null || num === undefined) return "0";
        return num.toLocaleString("vi-VN");
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "0đ";
        return `${amount.toLocaleString("vi-VN")}đ`;
    };

    // Format percentage
    const formatPercentage = (value) => {
        if (value === null || value === undefined) return "0%";
        return `${Math.round(value)}%`;
    };

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
                color: COLORS.error,
                textAlign: "center",
                padding: "2rem"
            }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❌</div>
                <div style={{ fontWeight: 600, marginBottom: "1rem" }}>{error}</div>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "12px 24px",
                        background: COLORS.primary,
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
                color: COLORS.primary
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
                    <div>Đang tải dữ liệu dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 1400,
            margin: "40px auto",
            padding: "0 20px"
        }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                color: "white",
                padding: "2.5rem",
                borderRadius: "24px 24px 0 0",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,106,113,0.2)"
            }}>
                <h1 style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    margin: 0,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}>
                    📊 Dashboard Của TÒNNNNNNNN
                </h1>
                <p style={{
                    fontSize: "1.2rem",
                    margin: "15px 0 0 0",
                    opacity: 0.9
                }}>
                    Thống kê tổng quan hệ thống cai nghiện thuốc lá
                </p>
                {user && (
                    <p style={{
                        fontSize: "1rem",
                        margin: "10px 0 0 0",
                        opacity: 0.8
                    }}>
                        👋 Xin chào, {user.fullName || user.email || "Admin"}
                    </p>
                )}
            </div>

            {/* Main Dashboard */}
            <div style={{
                background: "#fff",
                padding: "2.5rem",
                boxShadow: "0 8px 32px rgba(0,106,113,0.1)",
            }}>

                {/* Account Stats Section */}
                {accountStats && (
                    <div style={{ marginBottom: "3rem" }}>
                        <SectionHeader icon="👥" title="Thống Kê Tài Khoản" />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: 25
                        }}>
                            <StatCard
                                icon="👤"
                                title="Tài khoản hoạt động"
                                value={formatNumber(accountStats.ActiveAccounts)}
                                color={COLORS.error}

                            />
                            <StatCard
                                icon="🎯"
                                title="Tổng Coach"
                                value={formatNumber(accountStats.TotalCoaches)}
                                color={COLORS.info}

                            />
                            <StatCard
                                icon="👥"
                                title="Tổng Member"
                                value={formatNumber(accountStats.TotalMembers)}
                                color={COLORS.success}

                            />
                            <StatCard
                                icon="📊"
                                title="Tài khoản ngưng hoạt động"
                                value={formatNumber(accountStats.InactiveAccounts)}
                                color={COLORS.purple}

                            />
                        </div>
                    </div>
                )}

                {/* Revenue Stats Section với Biểu Đồ Cột */}
                {revenueStats && (
                    <div style={{ marginBottom: "3rem" }}>
                        <SectionHeader icon="💰" title="Thống Kê Doanh Thu" />

                        {/* Stat Cards */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 25,
                            marginBottom: "2.5rem"
                        }}>
                            <StatCard
                                icon="💵"
                                title="Tổng Doanh Thu"
                                value={formatCurrency(revenueStats.TotalRevenue)}
                                color={COLORS.warning}
                                subtitle="Tất cả giao dịch thành công"
                            />

                            <StatCard
                                icon="✅"
                                title="Doanh Thu Gói Basic"
                                value={formatCurrency(revenueStats.Package1Revenue)}
                                color={COLORS.success}
                            />

                            <StatCard
                                icon="👑"
                                title="Doanh Thu Gói Plus"
                                value={formatCurrency(revenueStats.Package2Revenue)}
                                color={COLORS.indigo}
                            />
                        </div>

                        {/* Biểu đồ cột doanh thu */}
                        {revenueChartData && (
                            <div style={{
                                background: "#fff",
                                padding: "2rem",
                                borderRadius: "20px",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                                border: "1px solid #f0f0f0",
                                marginBottom: "2rem"
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "1.5rem"
                                }}>
                                    <div>
                                        <h3 style={{
                                            color: COLORS.primary,
                                            fontSize: "1.4rem",
                                            fontWeight: 700,
                                            margin: 0,
                                            marginBottom: "0.5rem"
                                        }}>
                                            📊 Biểu Đồ Doanh Thu Theo Gói
                                        </h3>
                                        <p style={{
                                            color: "#666",
                                            fontSize: "0.95rem",
                                            margin: 0
                                        }}>
                                            So sánh doanh thu từ các gói thành viên
                                        </p>
                                    </div>

                                    <div style={{
                                        background: "#f8f9fa",
                                        padding: "0.8rem 1.2rem",
                                        borderRadius: "12px",
                                        border: "1px solid #e9ecef"
                                    }}>
                                        <span style={{
                                            color: COLORS.primary,
                                            fontSize: "0.9rem",
                                            fontWeight: 600
                                        }}>
                                            🔄 LIVE VIEW
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    height: "400px",
                                    background: "#fafafa",
                                    borderRadius: "16px",
                                    padding: "1rem",
                                    border: "1px solid #f0f0f0"
                                }}>
                                    <Bar data={revenueChartData} options={barChartOptions} />
                                </div>

                                {/* Thống kê nhanh dưới biểu đồ */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "1rem",
                                    marginTop: "1.5rem",
                                    padding: "1.5rem",
                                    background: "#f8f9fa",
                                    borderRadius: "12px"
                                }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "800",
                                            color: COLORS.success,
                                            marginBottom: "0.5rem"
                                        }}>
                                            {formatCurrency(revenueStats.Package1Revenue)}
                                        </div>
                                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                            Doanh thu Basic
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center" }}>
                                        <div style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "800",
                                            color: COLORS.indigo,
                                            marginBottom: "0.5rem"
                                        }}>
                                            {formatCurrency(revenueStats.Package2Revenue)}
                                        </div>
                                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                            Doanh thu Plus
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "center" }}>
                                        <div style={{
                                            fontSize: "1.8rem",
                                            fontWeight: "800",
                                            color: COLORS.warning,
                                            marginBottom: "0.5rem"
                                        }}>
                                            {revenueStats.TotalRevenue > 0 ?
                                                formatPercentage((revenueStats.Package2Revenue / revenueStats.TotalRevenue) * 100) : "0%"}
                                        </div>
                                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                            Tỷ lệ Plus/Tổng
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Package Stats Section */}
                {packageStats && (
                    <div style={{ marginBottom: "3rem" }}>
                        <SectionHeader icon="📦" title="Thống Kê Gói Thành Viên" />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: 25
                        }}>
                            <StatCard
                                icon="📋"
                                title="Gói Free"
                                value={formatNumber(packageStats.Package1Sold)}
                                color={COLORS.purple}
                                subtitle="Tổng lượt mua gói Free"
                            />
                            <StatCard
                                icon="🟢"
                                title="Gói Basic"
                                value={formatNumber(packageStats.Package2Sold)}
                                color={COLORS.success}
                                subtitle="Tổng lượt mua gói Basic"
                            />
                            <StatCard
                                icon="🔴"
                                title="Gói Plus"
                                value={formatNumber(packageStats.Package3Sold)}
                                color={COLORS.error}
                                subtitle="Tổng lượt mua gói Plus"
                            />

                        </div>
                    </div>
                )}

                {/* Cessation Stats Section */}
                {cessationStats && (
                    <div style={{ marginBottom: "2rem" }}>
                        <SectionHeader icon="🚭" title="Thống Kê Cai Nghiện" />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 25
                        }}>

                            <StatCard
                                icon="✅"
                                title="Hoàn Thành"
                                value={formatNumber(cessationStats.SuccessfulCessations)}
                                color={COLORS.success}
                                subtitle="Người cai nghiện thành công"
                            />
                            <StatCard
                                icon="⏳"
                                title="Đang Thực Hiện"
                                value={formatNumber(cessationStats.OngoingCessations)}
                                color={COLORS.warning}
                                subtitle="Đang trong quá trình"
                            />
                            <StatCard
                                icon="📊"
                                title="Thất bại"
                                value={formatNumber(cessationStats.FailedCessations)}
                                color={COLORS.teal}
                                subtitle="Thất bại trong quá trình cai nghiện"
                            />
                        </div>
                    </div>
                )}

                {/* Summary Stats */}
                <div style={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    padding: "2rem",
                    borderRadius: 20,
                    border: "2px solid #e3f2fd",
                    textAlign: "center"
                }}>
                    <h3 style={{
                        color: COLORS.primary,
                        marginBottom: "1.5rem",
                        fontSize: "1.5rem",
                        fontWeight: 700
                    }}>
                        📈 Tóm Tắt Hiệu Suất
                    </h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 20
                    }}>
                        <SmallStatCard
                            icon="💼"
                            title="Doanh Thu / Member Hoạt Động"
                            value={accountStats && revenueStats && accountStats.TotalMembers > 0 ?
                                formatCurrency(Math.round(revenueStats.TotalRevenue / accountStats.TotalMembers)) : "0đ"}
                            color={COLORS.warning}
                        />
                        <SmallStatCard
                            icon="🎯"
                            title="Tỷ Lệ Coach"
                            value={accountStats && (accountStats.ActiveAccounts + accountStats.InactiveAccounts) > 0 ?
                                formatPercentage((accountStats.TotalCoaches / (accountStats.ActiveAccounts + accountStats.InactiveAccounts)) * 100) : "0%"}
                            color={COLORS.info}
                        />
                        <SmallStatCard
                            icon="👥"
                            title="Tỷ Lệ Tài Khoản Hoạt Động"
                            value={accountStats && (accountStats.ActiveAccounts + accountStats.InactiveAccounts) > 0 ?
                                formatPercentage((accountStats.ActiveAccounts / (accountStats.ActiveAccounts + accountStats.InactiveAccounts)) * 100) : "0%"}
                            color={COLORS.success}
                        />
                        <SmallStatCard
                            icon="🚭"
                            title="Hiệu Quả Cai Nghiện"
                            value={cessationStats && (cessationStats.SuccessfulCessations + cessationStats.OngoingCessations + cessationStats.FailedCessations) > 0 ?
                                formatPercentage((cessationStats.SuccessfulCessations / (cessationStats.SuccessfulCessations + cessationStats.OngoingCessations + cessationStats.FailedCessations)) * 100) : "0%"}
                            color={COLORS.teal}
                        />
                        <SmallStatCard
                            icon="📦"
                            title="Gói Phổ Biến Nhất"
                            value={packageStats ?
                                (Math.max(packageStats.Package1Sold, packageStats.Package2Sold, packageStats.Package3Sold) === packageStats.Package1Sold ? "Free" :
                                    Math.max(packageStats.Package1Sold, packageStats.Package2Sold, packageStats.Package3Sold) === packageStats.Package2Sold ? "Basic" : "Plus") : "N/A"}
                            color={COLORS.purple}
                        />
                        <SmallStatCard
                            icon="💰"
                            title="Doanh Thu Từ Gói Basic"
                            value={revenueStats ? formatPercentage(revenueStats.TotalRevenue > 0 ? (revenueStats.Package1Revenue / revenueStats.TotalRevenue) * 100 : 0) : "0%"}
                            color={COLORS.indigo}
                        />
                        <SmallStatCard
                            icon="👑"
                            title="Doanh Thu Từ Gói Plus"
                            value={revenueStats ? formatPercentage(revenueStats.TotalRevenue > 0 ? (revenueStats.Package2Revenue / revenueStats.TotalRevenue) * 100 : 0) : "0%"}
                            color={COLORS.pink}
                        />
                        <SmallStatCard
                            icon="⚡"
                            title="Tỷ Lệ Thành Công Cai Nghiện"
                            value={cessationStats && cessationStats.FailedCessations > 0 ?
                                formatPercentage((cessationStats.SuccessfulCessations / (cessationStats.SuccessfulCessations + cessationStats.FailedCessations)) * 100) : "0%"}
                            color={COLORS.error}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                background: "#f8f9fa",
                padding: "2rem",
                borderRadius: "0 0 24px 24px",
                textAlign: "center",
                color: "#666",
                fontSize: "0.95rem",
                borderTop: "1px solid #e9ecef"
            }}>
                <div style={{ marginBottom: "1rem" }}>
                    📅 Cập nhật lúc: {new Date().toLocaleString("vi-VN")}
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2rem",
                    flexWrap: "wrap",
                    fontSize: "0.85rem",
                    opacity: 0.8
                }}>
                    <span>📊 Account Stats API</span>
                    <span>💰 Revenue Stats API</span>
                    <span>📦 Package Stats API</span>
                    <span>🚭 Cessation Stats API</span>
                </div>
            </div>
        </div>
    );
}

// Component SectionHeader
function SectionHeader({ icon, title }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "2px solid #f0f0f0"
        }}>
            <span style={{ fontSize: "2rem", marginRight: "1rem" }}>{icon}</span>
            <h2 style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: COLORS.primary,
                margin: 0
            }}>{title}</h2>
        </div>
    );
}

// Component StatCard
function StatCard({ icon, title, value, color, subtitle }) {
    return (
        <div style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer"
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{icon}</div>
            <h3 style={{
                fontSize: "1.1rem",
                color: "#666",
                marginBottom: "0.8rem",
                fontWeight: 600
            }}>{title}</h3>
            <div style={{
                fontSize: "2.8rem",
                fontWeight: 900,
                color: color,
                marginBottom: "0.8rem",
                lineHeight: 1
            }}>{value}</div>
            <p style={{
                fontSize: "0.9rem",
                color: "#999",
                margin: 0,
                lineHeight: 1.4
            }}>{subtitle}</p>
        </div>
    );
}

// Component SmallStatCard
function SmallStatCard({ icon, title, value, color }) {
    return (
        <div style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid #f0f0f0",
            textAlign: "center",
            transition: "transform 0.2s ease"
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
            }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{icon}</div>
            <h4 style={{
                fontSize: "1rem",
                color: "#666",
                marginBottom: "0.5rem",
                fontWeight: 600
            }}>{title}</h4>
            <div style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: color
            }}>{value}</div>
        </div>
    );
}

export default AdminReport;