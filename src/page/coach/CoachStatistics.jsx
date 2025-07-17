import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer';

export default function CoachStatistics() {
    const [stats, setStats] = useState({
        SuccessfulCessations: 0,
        OngoingCessations: 0,
        FailedCessations: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy token từ Redux store
    const { token } = useSelector(state => state.account);

    useEffect(() => {
        if (token) {
            fetchCessationStats();
        }
    }, [token]);

    const fetchCessationStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/AdminDashboard/cessation-stats',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📊 Cessation stats fetched:", data);

            setStats({
                SuccessfulCessations: data.SuccessfulCessations || 0,
                OngoingCessations: data.OngoingCessations || 0,
                FailedCessations: data.FailedCessations || 0
            });

        } catch (error) {
            console.error("❌ Error fetching cessation stats:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Calculate percentages for chart
    const total = stats.SuccessfulCessations + stats.OngoingCessations + stats.FailedCessations;
    const successPercentage = total > 0 ? (stats.SuccessfulCessations / total) * 100 : 0;
    const ongoingPercentage = total > 0 ? (stats.OngoingCessations / total) * 100 : 0;
    const failedPercentage = total > 0 ? (stats.FailedCessations / total) * 100 : 0;

    // Chart colors
    const colors = {
        success: '#10B981',
        ongoing: '#F59E0B',
        failed: '#EF4444',
        successBg: '#ECFDF5',
        ongoingBg: '#FFFBEB',
        failedBg: '#FEF2F2'
    };

    const StatCard = ({ title, value, percentage, color, bgColor, icon }) => (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${bgColor}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}>

            {/* Background gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: `linear-gradient(135deg, ${bgColor} 0%, ${color}20 100%)`,
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
            }} />

            {/* Icon */}
            <div style={{
                fontSize: '2.5rem',
                marginBottom: '12px',
                position: 'relative',
                zIndex: 2
            }}>
                {icon}
            </div>

            {/* Value */}
            <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: color,
                marginBottom: '8px',
                position: 'relative',
                zIndex: 2
            }}>
                {value}
            </div>

            {/* Title */}
            <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                position: 'relative',
                zIndex: 2
            }}>
                {title}
            </div>

            {/* Percentage */}
            <div style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                position: 'relative',
                zIndex: 2
            }}>
                {percentage.toFixed(1)}% của tổng số
            </div>

            {/* Progress bar */}
            <div style={{
                marginTop: '16px',
                height: '6px',
                backgroundColor: '#F3F4F6',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    height: '100%',
                    backgroundColor: color,
                    width: `${percentage}%`,
                    borderRadius: '3px',
                    transition: 'width 1s ease-in-out'
                }} />
            </div>
        </div>
    );

    // Donut Chart Component - FIX LỖI SYNTAX
    const DonutChart = () => {
        const size = 300;
        const strokeWidth = 20;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;

        const successOffset = circumference - (successPercentage / 100) * circumference;
        const ongoingOffset = circumference - (ongoingPercentage / 100) * circumference;
        const failedOffset = circumference - (failedPercentage / 100) * circumference;

        // FIX: Tạo array đúng cách
        const legendItems = [
            {
                label: 'Thành công',
                color: colors.success,
                value: stats.SuccessfulCessations
            },
            {
                label: 'Đang tiến hành',
                color: colors.ongoing,
                value: stats.OngoingCessations
            },
            {
                label: 'Thất bại',
                color: colors.failed,
                value: stats.FailedCessations
            }
        ];

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1F2937',
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    📊 Biểu đồ thống kê cai nghiện
                </h3>

                <div style={{ position: 'relative' }}>
                    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#F3F4F6"
                            strokeWidth={strokeWidth}
                        />

                        {/* Success arc */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={colors.success}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={successOffset}
                            strokeLinecap="round"
                            style={{
                                transition: 'stroke-dashoffset 1s ease-in-out',
                                transformOrigin: 'center'
                            }}
                        />

                        {/* Ongoing arc */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius - 25}
                            fill="none"
                            stroke={colors.ongoing}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={ongoingOffset}
                            strokeLinecap="round"
                            style={{
                                transition: 'stroke-dashoffset 1s ease-in-out',
                                transformOrigin: 'center'
                            }}
                        />

                        {/* Failed arc */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius - 50}
                            fill="none"
                            stroke={colors.failed}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={failedOffset}
                            strokeLinecap="round"
                            style={{
                                transition: 'stroke-dashoffset 1s ease-in-out',
                                transformOrigin: 'center'
                            }}
                        />
                    </svg>

                    {/* Center text */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: '#1F2937'
                        }}>
                            {total}
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            fontWeight: '600'
                        }}>
                            Tổng số ca
                        </div>
                    </div>
                </div>

                {/* Legend - FIX: Dùng array đúng cách */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '24px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {legendItems.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: item.color
                            }} />
                            <span style={{
                                fontSize: '0.875rem',
                                color: '#374151',
                                fontWeight: '500'
                            }}>
                                {item.label}: {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #E5E7EB',
                        borderTop: '4px solid #3B82F6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1.5rem'
                    }} />
                    <h3 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>Đang tải thống kê...</h3>
                    <p style={{ color: '#6B7280', margin: 0 }}>Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #FEE2E2'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3 style={{ color: '#DC2626', marginBottom: '1rem' }}>Lỗi tải dữ liệu</h3>
                    <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={fetchCessationStats}
                        style={{
                            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '3rem'
                    }}>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #1F2937 0%, #3B82F6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '1rem'
                        }}>
                            📊 Thống kê cai nghiện
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: '#6B7280',
                            margin: 0
                        }}>
                            Theo dõi tiến trình cai nghiện của học viên
                        </p>

                        {/* Refresh button */}
                        <button
                            onClick={fetchCessationStats}
                            disabled={loading}
                            style={{
                                background: loading
                                    ? '#9CA3AF'
                                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '25px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                marginTop: '1rem',
                                fontSize: '0.875rem',
                                transition: 'all 0.3s ease',
                                boxShadow: loading
                                    ? 'none'
                                    : '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                }
                            }}
                        >
                            {loading ? '🔄 Đang tải...' : '🔄 Làm mới dữ liệu'}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        <StatCard
                            title="Cai nghiện thành công"
                            value={stats.SuccessfulCessations}
                            percentage={successPercentage}
                            color={colors.success}
                            bgColor={colors.successBg}
                            icon="✅"
                        />
                        <StatCard
                            title="Đang trong quá trình"
                            value={stats.OngoingCessations}
                            percentage={ongoingPercentage}
                            color={colors.ongoing}
                            bgColor={colors.ongoingBg}
                            icon="⏳"
                        />
                        <StatCard
                            title="Cai nghiện thất bại"
                            value={stats.FailedCessations}
                            percentage={failedPercentage}
                            color={colors.failed}
                            bgColor={colors.failedBg}
                            icon="❌"
                        />
                    </div>

                    {/* Chart Section */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '2rem'
                    }}>
                        <DonutChart />
                    </div>

                    {/* Summary Info */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginTop: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: '#1F2937',
                            marginBottom: '1rem'
                        }}>
                            📈 Tóm tắt thống kê
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginTop: '1.5rem'
                        }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.success }}>
                                    {total > 0 ? ((stats.SuccessfulCessations / total) * 100).toFixed(1) : 0}%
                                </div>
                                <div style={{ color: '#6B7280', fontWeight: '600' }}>Tỷ lệ thành công</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3B82F6' }}>
                                    {total}
                                </div>
                                <div style={{ color: '#6B7280', fontWeight: '600' }}>Tổng số ca cai nghiện</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.ongoing }}>
                                    {stats.OngoingCessations}
                                </div>
                                <div style={{ color: '#6B7280', fontWeight: '600' }}>Đang cai nghiện</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* CSS Animations */}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                `}
            </style>
        </>

    );

}
