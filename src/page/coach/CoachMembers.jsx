import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import Footer from '../../components/Footer';

export default function CoachMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [memberForm, setMemberForm] = useState(null);
    const [memberPlan, setMemberPlan] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [planLoading, setPlanLoading] = useState(false);

    // Lấy token và role từ Redux
    const { token, user } = useSelector(state => state.account || {});
    const role = user?.role;

    useEffect(() => {
        setLoading(true);
        console.log("Token từ Redux:", token);
        if (!token) {
            setMembers([]);
            setLoading(false);
            return;
        }
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/members-with-package3", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                console.log("API DATA:", data);
                setMembers(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setMembers([]);
            })
            .finally(() => setLoading(false));
    }, [token]);

    // Function để fetch form data
    const fetchMemberForm = async (accountId) => {
        try {
            setFormLoading(true);
            const response = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/form/${accountId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const formData = await response.json();
                console.log("📋 Member form fetched:", formData);
                setMemberForm(formData);
            } else {
                console.warn("⚠️ Form data not found");
                setMemberForm(null);
            }
        } catch (error) {
            console.error("❌ Error fetching member form:", error);
            setMemberForm(null);
        } finally {
            setFormLoading(false);
        }
    };

    // Function để fetch plan data
    const fetchMemberPlan = async (accountId) => {
        try {
            setPlanLoading(true);
            const response = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Plan/${accountId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const planData = await response.json();
                console.log("📋 Member plan fetched:", planData);
                setMemberPlan(planData);
            } else {
                console.warn("⚠️ Plan data not found");
                setMemberPlan(null);
            }
        } catch (error) {
            console.error("❌ Error fetching member plan:", error);
            setMemberPlan(null);
        } finally {
            setPlanLoading(false);
        }
    };

    const handleMemberClick = (member) => {
        setSelectedMember(member);
        setShowPopup(true);
        setMemberForm(null);
        setMemberPlan(null);

        // Fetch thêm data cho member được chọn
        if (member.accountId) {
            fetchMemberForm(member.accountId);
            fetchMemberPlan(member.accountId);
        }

        // Ngăn body scroll khi popup mở
        document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedMember(null);
        setMemberForm(null);
        setMemberPlan(null);
        // Cho phép body scroll lại
        document.body.style.overflow = 'unset';
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatGender = (sex) => {
        return sex ? "Nam" : "Nữ";
    };

    const formatStatus = (status) => {
        return status ? "Hoạt động" : "Không hoạt động";
    };

    const formatStatusProcess = (statusProcess) => {
        switch (statusProcess) {
            case "processing": return "Đang xử lý";
            case "completed": return "Hoàn thành";
            case "pending": return "Chờ xử lý";
            default: return statusProcess || "Không xác định";
        }
    };

    // Helper function để format tiền
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Component hiển thị Form Data - CẬP NHẬT CÁC TRƯỜNG MỚI
    const FormDataSection = () => {
        if (formLoading) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #E0E0E0',
                        borderTop: '2px solid #006A71',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 10px'
                    }} />
                    Đang tải thông tin form...
                </div>
            );
        }

        if (!memberForm) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#888',
                    fontStyle: 'italic'
                }}>
                    Chưa có thông tin form
                </div>
            );
        }

        return (
            <div>
                <h4 style={{
                    color: '#006A71',
                    fontWeight: '700',
                    marginBottom: '15px',
                    fontSize: '1.1rem',
                    borderBottom: '2px solid #E6F4F4',
                    paddingBottom: '8px'
                }}>
                    📋 Thông tin Form đăng ký
                </h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: '12px',
                    fontSize: '0.9rem'
                }}>
                    {memberForm.cigarettesPerDay !== undefined && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Số điếu/ngày:</div>
                            <div style={{ color: '#333', fontWeight: '600' }}>
                                <span style={{
                                    background: '#FFE8E8',
                                    color: '#D32F2F',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '700'
                                }}>
                                    {memberForm.cigarettesPerDay} điếu
                                </span>
                            </div>
                        </>
                    )}

                    {memberForm.smokingTime && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Thời gian hút:</div>
                            <div style={{ color: '#333' }}>{memberForm.smokingTime}</div>
                        </>
                    )}

                    {memberForm.goalTime !== undefined && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Mục tiêu (ngày):</div>
                            <div style={{ color: '#333', fontWeight: '600' }}>
                                <span style={{
                                    background: '#E8F5E8',
                                    color: '#2E7D32',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '700'
                                }}>
                                    {memberForm.goalTime} ngày
                                </span>
                            </div>
                        </>
                    )}

                    {memberForm.reason && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Lý do cai thuốc:</div>
                            <div style={{
                                color: '#333',
                                fontStyle: 'italic',
                                background: '#FFF9E6',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #FFE082'
                            }}>
                                "{memberForm.reason}"
                            </div>
                        </>
                    )}

                    {memberForm.costPerCigarette !== undefined && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Giá/điếu:</div>
                            <div style={{ color: '#333', fontWeight: '600' }}>
                                {formatMoney(memberForm.costPerCigarette)}
                            </div>
                        </>
                    )}

                    {memberForm.medicalHistory && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Tiền sử bệnh:</div>
                            <div style={{
                                color: '#D32F2F',
                                fontWeight: '600',
                                background: '#FFEBEE',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid #FFCDD2'
                            }}>
                                ⚠️ {memberForm.medicalHistory}
                            </div>
                        </>
                    )}

                    {memberForm.mostSmokingTime && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Thời gian hút nhiều:</div>
                            <div style={{ color: '#333' }}>{memberForm.mostSmokingTime}</div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Component hiển thị Plan Data - CẬP NHẬT CÁC TRƯỜNG MỚI
    const PlanDataSection = () => {
        if (planLoading) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #E0E0E0',
                        borderTop: '2px solid #006A71',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 10px'
                    }} />
                    Đang tải kế hoạch...
                </div>
            );
        }

        if (!memberPlan) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#888',
                    fontStyle: 'italic'
                }}>
                    Chưa có kế hoạch cai nghiện
                </div>
            );
        }

        // Helper function để format trạng thái phase
        const getPhaseStatusColor = (status) => {
            switch (status) {
                case "Thành công":
                case "Hoàn thành":
                    return { bg: '#E8F5E8', color: '#2E7D32', icon: '✅' };
                case "Đang thực hiện":
                    return { bg: '#FFF3E0', color: '#F57C00', icon: '⏳' };
                case "Thất bại":
                    return { bg: '#FFEBEE', color: '#D32F2F', icon: '❌' };
                case "Chưa bắt đầu":
                default:
                    return { bg: '#F5F5F5', color: '#757575', icon: '⏸️' };
            }
        };

        return (
            <div>
                <h4 style={{
                    color: '#006A71',
                    fontWeight: '700',
                    marginBottom: '15px',
                    fontSize: '1.1rem',
                    borderBottom: '2px solid #E6F4F4',
                    paddingBottom: '8px'
                }}>
                    📅 Kế hoạch cai nghiện
                </h4>

                {/* Thống kê tổng quan */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        background: '#E3F2FD',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid #BBDEFB'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1976D2' }}>
                            {memberPlan.numberOfDays || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Số ngày đã cai</div>
                    </div>

                    <div style={{
                        background: '#E8F5E8',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid #C8E6C9'
                    }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2E7D32' }}>
                            {formatMoney(memberPlan.totalSaveMoney || 0)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Tiền tiết kiệm</div>
                    </div>

                    <div style={{
                        background: '#FFF3E0',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid #FFE0B2'
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#F57C00' }}>
                            {memberPlan.totalCigarettesQuit || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Điếu đã cai</div>
                    </div>
                </div>

                {/* Thông tin bổ sung */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: '12px',
                    fontSize: '0.9rem',
                    marginBottom: '20px'
                }}>
                    {memberPlan.maxCigarettes !== undefined && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Số điếu tối đa:</div>
                            <div style={{ color: '#333', fontWeight: '600' }}>
                                <span style={{
                                    background: '#FFE8E8',
                                    color: '#D32F2F',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem'
                                }}>
                                    {memberPlan.maxCigarettes} điếu/ngày
                                </span>
                            </div>
                        </>
                    )}

                    {memberPlan.phaseNumber !== undefined && (
                        <>
                            <div style={{ fontWeight: '600', color: '#006A71' }}>Giai đoạn hiện tại:</div>
                            <div style={{ color: '#333', fontWeight: '700', fontSize: '1rem' }}>
                                <span style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem'
                                }}>
                                    Giai đoạn {memberPlan.phaseNumber}/5
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Chi tiết các giai đoạn */}
                <div style={{
                    marginTop: '20px'
                }}>
                    <h5 style={{
                        color: '#006A71',
                        fontWeight: '600',
                        marginBottom: '15px',
                        fontSize: '1rem'
                    }}>
                        📈 Tiến trình theo giai đoạn
                    </h5>

                    <div style={{
                        display: 'grid',
                        gap: '10px'
                    }}>
                        {[1, 2, 3, 4, 5].map(phase => {
                            const startDate = memberPlan[`startDatePhase${phase}`];
                            const endDate = memberPlan[`endDatePhase${phase}`];
                            const status = memberPlan[`statusPhase${phase}`];

                            if (!startDate) return null;

                            const statusStyle = getPhaseStatusColor(status);
                            const isCurrentPhase = memberPlan.phaseNumber === phase;

                            return (
                                <div key={phase} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: isCurrentPhase ? '#F0F9FF' : '#FAFAFA',
                                    borderRadius: '8px',
                                    border: isCurrentPhase ? '2px solid #3B82F6' : '1px solid #E0E0E0',
                                    position: 'relative'
                                }}>
                                    {isCurrentPhase && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            left: '10px',
                                            background: '#3B82F6',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.7rem',
                                            fontWeight: '600'
                                        }}>
                                            HIỆN TẠI
                                        </div>
                                    )}

                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: statusStyle.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '12px',
                                        fontSize: '1.2rem'
                                    }}>
                                        {statusStyle.icon}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '4px'
                                        }}>
                                            Giai đoạn {phase}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#666',
                                            marginBottom: '6px'
                                        }}>
                                            {formatDate(startDate)} - {formatDate(endDate)}
                                        </div>
                                        <span style={{
                                            background: statusStyle.bg,
                                            color: statusStyle.color,
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Component code tiếp tục với phần return và các components khác...
    return (
        <>
            <div style={{
                maxWidth: 1000,
                margin: "0 auto",
                padding: "2rem",
                position: 'relative',
                zIndex: 1
            }}>
                <h2 style={{
                    color: "#006A71",
                    fontWeight: 900,
                    marginBottom: 24,
                    fontSize: "2rem",
                    textAlign: "left"
                }}>
                    Danh sách học viên Package 3
                </h2>

                {loading ? (
                    <div style={{
                        color: "#888",
                        textAlign: "center",
                        padding: "2rem",
                        fontSize: "1.1rem"
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            border: "4px solid #E0E0E0",
                            borderTop: "4px solid #006A71",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 1rem"
                        }}></div>
                        Đang tải danh sách...
                    </div>
                ) : members.length === 0 ? (
                    <div style={{
                        color: "#888",
                        textAlign: "center",
                        padding: "2rem",
                        fontSize: "1.1rem",
                        background: "#F5F5F5",
                        borderRadius: "8px"
                    }}>
                        Không có học viên Package 3 nào.
                    </div>
                ) : (
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}>
                        <thead>
                            <tr style={{
                                background: "linear-gradient(135deg, #E6F4F4 0%, #B8E5E8 100%)",
                                color: "#006A71"
                            }}>
                                <th style={{
                                    padding: "15px 10px",
                                    border: "1px solid #9ACBD0",
                                    fontWeight: "700",
                                    fontSize: "1rem"
                                }}>STT</th>
                                <th style={{
                                    padding: "15px 10px",
                                    border: "1px solid #9ACBD0",
                                    fontWeight: "700",
                                    fontSize: "1rem"
                                }}>Họ tên</th>
                                <th style={{
                                    padding: "15px 10px",
                                    border: "1px solid #9ACBD0",
                                    fontWeight: "700",
                                    fontSize: "1rem"
                                }}>Email</th>
                                <th style={{
                                    padding: "15px 10px",
                                    border: "1px solid #9ACBD0",
                                    fontWeight: "700",
                                    fontSize: "1rem"
                                }}>Ngày tham gia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, idx) => (
                                <tr
                                    key={member.accountId || idx}
                                    style={{
                                        borderBottom: "1px solid #E0E0E0",
                                        transition: "background-color 0.2s ease",
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#F8FDFD"; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                    onClick={() => handleMemberClick(member)}
                                >
                                    <td style={{
                                        padding: "12px 10px",
                                        textAlign: "center",
                                        fontWeight: "600",
                                        color: "#006A71"
                                    }}>
                                        {idx + 1}
                                    </td>
                                    <td style={{
                                        padding: "12px 10px",
                                        color: "#2E7D8A",
                                        fontWeight: "600",
                                        textDecoration: "underline",
                                        cursor: "pointer"
                                    }}>
                                        {member.fullName || "N/A"}
                                    </td>
                                    <td style={{
                                        padding: "12px 10px",
                                        color: "#333"
                                    }}>
                                        {member.email || "N/A"}
                                    </td>
                                    <td style={{
                                        padding: "12px 10px",
                                        textAlign: "center",
                                        color: "#666"
                                    }}>
                                        {formatDate(member.startDate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Popup Modal - CẬP NHẬT LAYOUT CHO DỮ LIỆU MỚI */}
            {showPopup && selectedMember && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px"
                    }}
                    onClick={closePopup}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            padding: "0",
                            minWidth: "700px", // Tăng thêm để chứa nhiều thông tin hơn
                            maxWidth: "900px",
                            width: "95%",
                            maxHeight: "90vh",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                            position: "relative",
                            overflowY: "auto",
                            transform: "scale(1)",
                            transition: "all 0.3s ease"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{
                            background: "linear-gradient(135deg, #006A71 0%, #4A9D9C 100%)",
                            color: "white",
                            padding: "25px 30px",
                            borderTopLeftRadius: "16px",
                            borderTopRightRadius: "16px",
                            position: "relative"
                        }}>
                            <button
                                onClick={closePopup}
                                style={{
                                    position: "absolute",
                                    top: "15px",
                                    right: "20px",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                                }}
                            >
                                ×
                            </button>

                            <h3 style={{
                                margin: 0,
                                fontSize: "1.6rem",
                                fontWeight: "700",
                                marginBottom: "8px"
                            }}>
                                Thông tin chi tiết học viên
                            </h3>
                            <p style={{
                                margin: 0,
                                fontSize: "1rem",
                                opacity: 0.9
                            }}>
                                👑 Package 3 - {selectedMember.fullName || "N/A"}
                            </p>
                        </div>

                        {/* Body Content - CHIA THÀNH 3 SECTIONS */}
                        <div style={{
                            padding: "30px",
                            lineHeight: "1.6"
                        }}>
                            {/* Section 1: Thông tin cơ bản */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{
                                    color: '#006A71',
                                    fontWeight: '700',
                                    marginBottom: '15px',
                                    fontSize: '1.1rem',
                                    borderBottom: '2px solid #E6F4F4',
                                    paddingBottom: '8px'
                                }}>
                                    👤 Thông tin cơ bản
                                </h4>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "150px 1fr",
                                    gap: "15px",
                                    alignItems: "start",
                                    fontSize: '0.9rem'
                                }}>
                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Họ và tên:</div>
                                    <div style={{ color: "#333", fontWeight: "600", fontSize: "1rem" }}>
                                        {selectedMember.fullName || "Không có thông tin"}
                                    </div>

                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Email:</div>
                                    <div style={{ color: "#333" }}>
                                        {selectedMember.email || "Không có thông tin"}
                                    </div>

                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Số điện thoại:</div>
                                    <div style={{ color: "#333" }}>
                                        {selectedMember.phoneNumber || "Không có thông tin"}
                                    </div>

                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Ngày sinh:</div>
                                    <div style={{ color: "#333" }}>
                                        {formatDate(selectedMember.birthday) || "Không có thông tin"}
                                    </div>

                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Giới tính:</div>
                                    <div style={{ color: "#333" }}>
                                        {selectedMember.sex !== undefined ? formatGender(selectedMember.sex) : "Không có thông tin"}
                                    </div>

                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Trạng thái:</div>
                                    <div>
                                        <span style={{
                                            padding: "6px 16px",
                                            borderRadius: "25px",
                                            fontSize: "0.85rem",
                                            fontWeight: "600",
                                            backgroundColor: selectedMember.status ? "#E8F5E8" : "#FFE8E8",
                                            color: selectedMember.status ? "#2E7D32" : "#D32F2F",
                                            border: `2px solid ${selectedMember.status ? "#C8E6C9" : "#FFCDD2"}`
                                        }}>
                                            {selectedMember.status !== undefined ? formatStatus(selectedMember.status) : "Không có thông tin"}
                                        </span>
                                    </div>

                                    <div style={{ fontWeight: "700", color: "#006A71" }}>Tiến trình:</div>
                                    <div>
                                        <span style={{
                                            padding: "6px 16px",
                                            borderRadius: "25px",
                                            fontSize: "0.85rem",
                                            fontWeight: "600",
                                            backgroundColor: "#E3F2FD",
                                            color: "#1976D2",
                                            border: "2px solid #BBDEFB"
                                        }}>
                                            {formatStatusProcess(selectedMember.statusProcess)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Form Data */}
                            <div style={{
                                marginBottom: '30px',
                                padding: '20px',
                                backgroundColor: '#FAFAFA',
                                borderRadius: '12px',
                                border: '1px solid #E0E0E0'
                            }}>
                                <FormDataSection />
                            </div>

                            {/* Section 3: Plan Data */}
                            <div style={{
                                marginBottom: '20px',
                                padding: '20px',
                                backgroundColor: '#F0F9FF',
                                borderRadius: '12px',
                                border: '1px solid #BFDBFE'
                            }}>
                                <PlanDataSection />
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: "20px 30px",
                            borderTop: "2px solid #F0F0F0",
                            textAlign: "right",
                            background: "#FAFAFA",
                            borderBottomLeftRadius: "16px",
                            borderBottomRightRadius: "16px"
                        }}>
                            <button
                                onClick={closePopup}
                                style={{
                                    background: "linear-gradient(135deg, #006A71 0%, #4A9D9C 100%)",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 30px",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 12px rgba(0, 106, 113, 0.3)"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 16px rgba(0, 106, 113, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 12px rgba(0, 106, 113, 0.3)";
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            {/* CSS Animation */}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </>
    );
}