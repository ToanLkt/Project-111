import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";

// Bảng màu đồng bộ
const COLORS = {
    background: "#F2EFE7",
    card: "#fff",
    tableBg: "#E6F4F4",
    tableRow: "#fff",
    tableRowAlt: "#E6F4F4",
    thBg: "#9ACBD0",
    thText: "#006A71",
    tdText: "#006A71",
    border: "#9ACBD0",
    accent: "#006A71",
    primary: "#48A6A7",
    gold: "#bfa917",
    goldBg: "#fffbe8",
    goldBorder: "#f3d46e",
    btn: "#48A6A7",
    btnHover: "#006A71",
    danger: "#e74c3c",
    dangerHover: "#c0392b",
    success: "#27ae60",
    warning: "#e67e22",
    white: "#ffffff",
    text: "#2D3748",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 32,
    background: COLORS.tableBg,
    borderRadius: 14,
    boxShadow: "0 2px 12px #9ACBD022",
    overflow: "hidden"
};

const thStyle = {
    background: COLORS.thBg,
    color: COLORS.thText,
    fontWeight: 700,
    padding: "12px 10px",
    borderBottom: `2px solid ${COLORS.border}`,
    textAlign: "left",
    fontSize: 16,
    letterSpacing: 0.2,
};

const tdStyle = {
    padding: "12px 10px",
    borderBottom: `1px solid ${COLORS.border}`,
    fontSize: 15,
    color: COLORS.tdText,
    background: COLORS.tableRow,
};

export default function List() {
    // Redux state thay vì AuthContext
    const { user, token } = useSelector((state) => state.account || {});

    // Extract user role từ Redux user object
    const getUserRole = () => {
        if (!user) return null;
        const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            user.role ||
            null;
        return role ? role.toString().trim() : null;
    };

    const userRole = getUserRole();
    const isAdmin = userRole === "Admin";

    const [members, setMembers] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [searchMember, setSearchMember] = useState("");
    const [searchCoach, setSearchCoach] = useState("");
    const [loadingMember, setLoadingMember] = useState(true);
    const [loadingCoach, setLoadingCoach] = useState(true);

    // State cho modal thêm coach
    const [showAddCoach, setShowAddCoach] = useState(false);
    const [coachForm, setCoachForm] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        birthday: "",
        sex: "true"
    });
    const [addingCoach, setAddingCoach] = useState(false);
    const [addCoachError, setAddCoachError] = useState("");

    // State cho chức năng khóa/mở khóa member
    const [updatingMemberStatus, setUpdatingMemberStatus] = useState({});
    const [statusUpdateError, setStatusUpdateError] = useState("");

    // State cho chức năng khóa/mở khóa coach
    const [updatingCoachStatus, setUpdatingCoachStatus] = useState({});
    const [statusUpdateCoachError, setStatusUpdateCoachError] = useState("");

    // Lấy danh sách member
    useEffect(() => {
        if (!token || !isAdmin) {
            setLoadingMember(false);
            return;
        }

        setLoadingMember(true);

        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                setMembers(Array.isArray(data) ? data : []);
                setLoadingMember(false);
            })
            .catch(() => {
                setMembers([]);
                setLoadingMember(false);
            });
    }, [token, isAdmin]);

    // Lấy danh sách coach
    useEffect(() => {
        if (!token || !isAdmin) {
            setLoadingCoach(false);
            return;
        }

        setLoadingCoach(true);

        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Coach", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                setCoaches(Array.isArray(data) ? data : []);
                setLoadingCoach(false);
            })
            .catch(() => {
                setCoaches([]);
                setLoadingCoach(false);
            });
    }, [token, isAdmin, addingCoach]);

    // Lọc member
    const filteredMembers = members.filter(m =>
        (m.fullName || "").toLowerCase().includes(searchMember.toLowerCase()) ||
        (m.email || "").toLowerCase().includes(searchMember.toLowerCase())
    );

    // Lọc coach
    const filteredCoaches = coaches.filter(c =>
        (c.fullName || "").toLowerCase().includes(searchCoach.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchCoach.toLowerCase())
    );

    // Helper để hiển thị trạng thái
    const renderStatus = (status) => {
        if (!status) return "";
        if (typeof status === "boolean") return status ? "Hoạt động" : "Tạm khóa";
        if (typeof status === "string") {
            if (status.toLowerCase() === "active") return "Hoạt động";
            if (status.toLowerCase() === "inactive" || status.toLowerCase() === "locked") return "Tạm khóa";
            return status;
        }
        return status;
    };

    // Xử lý thêm coach
    const handleCoachFormChange = (e) => {
        const { name, value } = e.target;
        setCoachForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCoach = async (e) => {
        e.preventDefault();

        if (!isAdmin) {
            setAddCoachError("Chỉ Admin mới có thể thêm Coach!");
            return;
        }

        setAddingCoach(true);
        setAddCoachError("");

        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Coach/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: coachForm.email,
                    password: coachForm.password,
                    fullName: coachForm.fullName,
                    phoneNumber: coachForm.phoneNumber,
                    birthday: coachForm.birthday,
                    sex: coachForm.sex === "true" || coachForm.sex === true
                })
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }

            // Hiển thị thông báo thành công
            alert(`✅ Đăng ký coach thành công!\n📧 Mail xác nhận đã được gửi về email: ${coachForm.email}`);

            setShowAddCoach(false);
            setCoachForm({
                email: "",
                password: "",
                fullName: "",
                phoneNumber: "",
                birthday: "",
                sex: "true"
            });
            setAddingCoach(false);
        } catch (err) {
            setAddCoachError("Thêm coach thất bại: " + err.message);
            setAddingCoach(false);
        }
    };

    // Xử lý khóa/mở khóa member
    const handleToggleMemberStatus = async (member) => {
        if (!isAdmin) {
            setStatusUpdateError("Chỉ Admin mới có thể thay đổi trạng thái member!");
            return;
        }

        const newStatus = !member.status;
        const memberId = member.accountId;

        setUpdatingMemberStatus(prev => ({ ...prev, [memberId]: true }));
        setStatusUpdateError("");

        try {
            const response = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/status/${memberId}?status=${newStatus}`,
                {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            setMembers(prevMembers =>
                prevMembers.map(m =>
                    m.accountId === memberId
                        ? { ...m, status: newStatus }
                        : m
                )
            );

            const action = newStatus ? "mở khóa" : "khóa";
            alert(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản ${member.fullName || member.email} thành công!`);

        } catch (error) {
            setStatusUpdateError(`Lỗi khi cập nhật trạng thái: ${error.message}`);
        } finally {
            setUpdatingMemberStatus(prev => ({ ...prev, [memberId]: false }));
        }
    };

    // Confirmation dialog cho việc khóa/mở khóa
    const confirmToggleStatus = (member) => {
        const action = member.status ? "khóa" : "mở khóa";
        const confirmMessage = `Bạn có chắc chắn muốn ${action} tài khoản của ${member.fullName || member.email}?`;

        if (window.confirm(confirmMessage)) {
            handleToggleMemberStatus(member);
        }
    };

    // Xử lý khóa/mở khóa coach
    const handleToggleCoachStatus = async (coach) => {
        if (!isAdmin) {
            setStatusUpdateCoachError("Chỉ Admin mới có thể thay đổi trạng thái coach!");
            return;
        }

        const newStatus = !coach.status;
        const coachId = coach.accountId || coach.coachId;

        setUpdatingCoachStatus(prev => ({ ...prev, [coachId]: true }));
        setStatusUpdateCoachError("");

        try {
            const response = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Coach/status/${coachId}?status=${newStatus}`,
                {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            setCoaches(prevCoaches =>
                prevCoaches.map(c =>
                    (c.accountId || c.coachId) === coachId
                        ? { ...c, status: newStatus }
                        : c
                )
            );

            const action = newStatus ? "mở khóa" : "khóa";
            alert(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản ${coach.fullName || coach.email} thành công!`);

        } catch (error) {
            setStatusUpdateCoachError(`Lỗi khi cập nhật trạng thái: ${error.message}`);
        } finally {
            setUpdatingCoachStatus(prev => ({ ...prev, [coachId]: false }));
        }
    };

    // Confirmation dialog cho việc khóa/mở khóa coach
    const confirmToggleCoachStatus = (coach) => {
        const action = coach.status ? "khóa" : "mở khóa";
        const confirmMessage = `Bạn có chắc chắn muốn ${action} tài khoản của ${coach.fullName || coach.email}?`;

        if (window.confirm(confirmMessage)) {
            handleToggleCoachStatus(coach);
        }
    };

    // Kiểm tra quyền Admin
    if (!token) {
        return (
            <div style={{
                maxWidth: 1100,
                margin: "40px auto",
                background: COLORS.card,
                borderRadius: 18,
                padding: 40,
                textAlign: "center",
                color: COLORS.danger
            }}>
                <h3>⚠️ Cần đăng nhập để truy cập trang này</h3>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div style={{
                maxWidth: 1100,
                margin: "40px auto",
                background: COLORS.card,
                borderRadius: 18,
                padding: 40,
                textAlign: "center",
                color: COLORS.danger
            }}>
                <h3>🚫 Chỉ Admin mới có thể truy cập trang này</h3>
                <p>Role hiện tại: {userRole || "Unknown"}</p>
            </div>
        );
    }

    return (
        <>
            {/* ...existing styles... */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid ${COLORS.border};
                    border-radius: 50%;
                    border-top-color: ${COLORS.primary};
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .button-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(72, 166, 167, 0.3);
                }
                
                .input-focus:focus {
                    outline: none;
                    border-color: ${COLORS.primary};
                    box-shadow: 0 0 0 3px rgba(72, 166, 167, 0.1);
                }

                .status-button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    min-width: 80px;
                    justify-content: center;
                }

                .status-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .status-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                    transform: none;
                }
            `}</style>

            <div style={{
                maxWidth: 1100,
                margin: "40px auto",
                background: COLORS.card,
                borderRadius: 18,
                padding: 40,
                boxShadow: "0 6px 32px #9ACBD022",
                minHeight: 500,
                color: COLORS.text,
            }}>
                {/* Status Update Error Alert */}
                {statusUpdateError && (
                    <div style={{
                        background: COLORS.danger + "20",
                        border: `2px solid ${COLORS.danger}`,
                        color: COLORS.danger,
                        padding: "12px 16px",
                        borderRadius: 10,
                        marginBottom: 20,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        ❌ {statusUpdateError}
                        <button
                            onClick={() => setStatusUpdateError("")}
                            style={{
                                marginLeft: "auto",
                                background: "none",
                                border: "none",
                                color: COLORS.danger,
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Coach Status Update Error Alert */}
                {statusUpdateCoachError && (
                    <div style={{
                        background: COLORS.danger + "20",
                        border: `2px solid ${COLORS.danger}`,
                        color: COLORS.danger,
                        padding: "12px 16px",
                        borderRadius: 10,
                        marginBottom: 20,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        ❌ {statusUpdateCoachError}
                        <button
                            onClick={() => setStatusUpdateCoachError("")}
                            style={{
                                marginLeft: "auto",
                                background: "none",
                                border: "none",
                                color: COLORS.danger,
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Member Section */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24
                }}>
                    <h2 style={{
                        color: COLORS.accent,
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        letterSpacing: 0.5,
                        textShadow: "0 2px 8px #9ACBD033",
                        margin: 0
                    }}>
                        👥 Danh sách Member ({filteredMembers.length})
                    </h2>
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm tên hoặc email..."
                        value={searchMember}
                        onChange={e => setSearchMember(e.target.value)}
                        className="input-focus"
                        style={{
                            padding: "12px 16px",
                            borderRadius: 10,
                            border: `2px solid ${COLORS.primary}`,
                            fontSize: 15,
                            minWidth: 280,
                            outline: "none",
                            background: COLORS.tableBg,
                            color: COLORS.accent,
                            fontWeight: 600,
                            transition: "all 0.3s ease"
                        }}
                    />
                </div>

                <div style={{ overflowX: "auto", marginBottom: 60 }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>STT</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Họ và tên</th>
                                <th style={thStyle}>SĐT</th>
                                <th style={thStyle}>Ngày sinh</th>
                                <th style={thStyle}>Giới tính</th>
                                <th style={thStyle}>Trạng thái</th>
                                <th style={thStyle}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingMember ? (
                                <tr>
                                    <td colSpan={8} style={{
                                        textAlign: "center",
                                        color: COLORS.primary,
                                        padding: "30px",
                                        fontSize: "1.1rem"
                                    }}>
                                        <div className="loading-spinner" style={{ marginRight: "10px" }}></div>
                                        Đang tải danh sách members...
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{
                                        textAlign: "center",
                                        color: "#888",
                                        padding: "30px",
                                        fontSize: "1.1rem"
                                    }}>
                                        {searchMember ? `❌ Không tìm thấy member với từ khóa "${searchMember}"` : "📭 Chưa có member nào."}
                                    </td>
                                </tr>
                            ) : filteredMembers.map((m, idx) => (
                                <tr
                                    key={m.accountId || idx}
                                    style={{
                                        background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt,
                                        transition: "background 0.3s ease"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = COLORS.primary + "20"}
                                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt}
                                >
                                    <td style={tdStyle}>{m.accountId}</td>
                                    <td style={tdStyle}>{m.email}</td>
                                    <td style={tdStyle}>{m.fullName || "Chưa cập nhật"}</td>
                                    <td style={tdStyle}>{m.phoneNumber || "Chưa cập nhật"}</td>
                                    <td style={tdStyle}>{m.birthday ? new Date(m.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</td>
                                    <td style={tdStyle}>{m.sex === true ? "👨 Nam" : m.sex === false ? "👩 Nữ" : "❓"}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            background: renderStatus(m.status) === "Hoạt động" ? COLORS.success + "20" : COLORS.danger + "20",
                                            color: renderStatus(m.status) === "Hoạt động" ? COLORS.success : COLORS.danger
                                        }}>
                                            {renderStatus(m.status) === "Hoạt động" ? "✅ Hoạt động" : "🔒 Tạm khóa"}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            className="status-button"
                                            onClick={() => confirmToggleStatus(m)}
                                            disabled={updatingMemberStatus[m.accountId]}
                                            style={{
                                                background: m.status ? COLORS.danger : COLORS.success,
                                                color: COLORS.white,
                                            }}
                                        >
                                            {updatingMemberStatus[m.accountId] ? (
                                                <>
                                                    <div className="loading-spinner" style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        border: "2px solid rgba(255,255,255,0.3)",
                                                        borderTopColor: "white"
                                                    }}></div>
                                                    Đang xử lý...
                                                </>
                                            ) : m.status ? (
                                                <>🔒 Khóa</>
                                            ) : (
                                                <>🔓 Mở khóa</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Coach Section - cập nhật colspan cho table header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24
                }}>
                    <h2 style={{
                        color: COLORS.accent,
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        letterSpacing: 0.5,
                        textShadow: "0 2px 8px #9ACBD033",
                        margin: 0
                    }}>
                        🏃‍♂️ Danh sách Coach ({filteredCoaches.length})
                    </h2>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <button
                            type="button"
                            onClick={() => setShowAddCoach(true)}
                            className="button-hover"
                            style={{
                                background: COLORS.primary,
                                color: COLORS.white,
                                border: "none",
                                borderRadius: 10,
                                padding: "12px 24px",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: 15,
                                boxShadow: "0 4px 12px rgba(72, 166, 167, 0.2)",
                                letterSpacing: 0.3,
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            ➕ Thêm Coach
                        </button>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm tên hoặc email..."
                            value={searchCoach}
                            onChange={e => setSearchCoach(e.target.value)}
                            className="input-focus"
                            style={{
                                padding: "12px 16px",
                                borderRadius: 10,
                                border: `2px solid ${COLORS.primary}`,
                                fontSize: 15,
                                minWidth: 280,
                                outline: "none",
                                background: COLORS.tableBg,
                                color: COLORS.accent,
                                fontWeight: 600,
                                transition: "all 0.3s ease"
                            }}
                        />
                    </div>
                </div>

                {/* Coach Table - thêm cột Thao tác */}
                <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>STT</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Họ và tên</th>
                                <th style={thStyle}>SĐT</th>
                                <th style={thStyle}>Ngày sinh</th>
                                <th style={thStyle}>Giới tính</th>
                                <th style={thStyle}>Trạng thái</th>
                                <th style={thStyle}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingCoach ? (
                                <tr>
                                    <td colSpan={8} style={{
                                        textAlign: "center",
                                        color: COLORS.primary,
                                        padding: "30px",
                                        fontSize: "1.1rem"
                                    }}>
                                        <div className="loading-spinner" style={{ marginRight: "10px" }}></div>
                                        Đang tải danh sách coaches...
                                    </td>
                                </tr>
                            ) : filteredCoaches.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{
                                        textAlign: "center",
                                        color: "#888",
                                        padding: "30px",
                                        fontSize: "1.1rem"
                                    }}>
                                        {searchCoach ? `❌ Không tìm thấy coach với từ khóa "${searchCoach}"` : "📭 Chưa có coach nào."}
                                    </td>
                                </tr>
                            ) : filteredCoaches.map((c, idx) => (
                                <tr
                                    key={c.accountId || c.coachId || idx}
                                    style={{
                                        background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt,
                                        transition: "background 0.3s ease"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = COLORS.primary + "20"}
                                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt}
                                >
                                    <td style={tdStyle}>{c.coachId || c.accountId}</td>
                                    <td style={tdStyle}>{c.email}</td>
                                    <td style={tdStyle}>{c.fullName || "Chưa cập nhật"}</td>
                                    <td style={tdStyle}>{c.phoneNumber || "Chưa cập nhật"}</td>
                                    <td style={tdStyle}>{c.birthday ? new Date(c.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</td>
                                    <td style={tdStyle}>{c.sex === true ? "👨 Nam" : c.sex === false ? "👩 Nữ" : "❓"}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            background: renderStatus(c.status) === "Hoạt động" ? COLORS.success + "20" : COLORS.danger + "20",
                                            color: renderStatus(c.status) === "Hoạt động" ? COLORS.success : COLORS.danger
                                        }}>
                                            {renderStatus(c.status) === "Hoạt động" ? "✅ Hoạt động" : "🔒 Tạm khóa"}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            className="status-button"
                                            onClick={() => confirmToggleCoachStatus(c)}
                                            disabled={updatingCoachStatus[c.accountId || c.coachId]}
                                            style={{
                                                background: c.status ? COLORS.danger : COLORS.success,
                                                color: COLORS.white,
                                            }}
                                        >
                                            {updatingCoachStatus[c.accountId || c.coachId] ? (
                                                <>
                                                    <div className="loading-spinner" style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        border: "2px solid rgba(255,255,255,0.3)",
                                                        borderTopColor: "white"
                                                    }}></div>
                                                    Đang xử lý...
                                                </>
                                            ) : c.status ? (
                                                <>🔒 Khóa</>
                                            ) : (
                                                <>🔓 Mở khóa</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal thêm coach */}
                {showAddCoach && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 1000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(5px)"
                        }}
                        onClick={e => e.target === e.currentTarget && setShowAddCoach(false)}
                    >
                        <form
                            onSubmit={handleAddCoach}
                            style={{
                                background: COLORS.card,
                                borderRadius: 20,
                                padding: "2.5rem",
                                minWidth: 420,
                                maxWidth: "90vw",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                border: `3px solid ${COLORS.primary}`,
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                                position: "relative",
                                animation: "fadeIn 0.3s ease"
                            }}
                        >
                            <h3 style={{
                                color: COLORS.accent,
                                marginBottom: 10,
                                textAlign: "center",
                                fontSize: "1.5rem",
                                fontWeight: 800
                            }}>
                                ➕ Thêm Coach mới
                            </h3>

                            <input
                                name="email"
                                type="email"
                                value={coachForm.email}
                                onChange={handleCoachFormChange}
                                placeholder="📧 Email"
                                required
                                className="input-focus"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: `2px solid ${COLORS.primary}`,
                                    fontSize: 15,
                                    background: COLORS.tableBg,
                                    color: COLORS.accent,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease"
                                }}
                            />

                            <input
                                name="password"
                                type="password"
                                value={coachForm.password}
                                onChange={handleCoachFormChange}
                                placeholder="🔒 Mật khẩu"
                                required
                                className="input-focus"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: `2px solid ${COLORS.primary}`,
                                    fontSize: 15,
                                    background: COLORS.tableBg,
                                    color: COLORS.accent,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease"
                                }}
                            />

                            <input
                                name="fullName"
                                value={coachForm.fullName}
                                onChange={handleCoachFormChange}
                                placeholder="👤 Họ và tên"
                                required
                                className="input-focus"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: `2px solid ${COLORS.primary}`,
                                    fontSize: 15,
                                    background: COLORS.tableBg,
                                    color: COLORS.accent,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease"
                                }}
                            />

                            <input
                                name="phoneNumber"
                                value={coachForm.phoneNumber}
                                onChange={handleCoachFormChange}
                                placeholder="📞 Số điện thoại"
                                required
                                className="input-focus"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: `2px solid ${COLORS.primary}`,
                                    fontSize: 15,
                                    background: COLORS.tableBg,
                                    color: COLORS.accent,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease"
                                }}
                            />

                            <input
                                name="birthday"
                                type="date"
                                value={coachForm.birthday}
                                onChange={handleCoachFormChange}
                                placeholder="🎂 Ngày sinh"
                                required
                                className="input-focus"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: `2px solid ${COLORS.primary}`,
                                    fontSize: 15,
                                    background: COLORS.tableBg,
                                    color: COLORS.accent,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease"
                                }}
                            />

                            <select
                                name="sex"
                                value={coachForm.sex}
                                onChange={handleCoachFormChange}
                                required
                                className="input-focus"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 10,
                                    border: `2px solid ${COLORS.primary}`,
                                    fontSize: 15,
                                    color: COLORS.accent,
                                    background: COLORS.tableBg,
                                    fontWeight: 600,
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <option value="true">👨 Nam</option>
                                <option value="false">👩 Nữ</option>
                            </select>

                            {addCoachError && (
                                <div style={{
                                    color: COLORS.danger,
                                    fontWeight: 700,
                                    textAlign: "center",
                                    background: COLORS.danger + "20",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: `1px solid ${COLORS.danger}`
                                }}>
                                    ❌ {addCoachError}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "flex-end" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCoach(false)}
                                    style={{
                                        background: "#ddd",
                                        color: "#666",
                                        border: "none",
                                        borderRadius: 10,
                                        padding: "12px 24px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontSize: 15,
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    ❌ Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingCoach}
                                    className="button-hover"
                                    style={{
                                        background: addingCoach ? COLORS.btnHover : COLORS.primary,
                                        color: COLORS.white,
                                        border: "none",
                                        borderRadius: 10,
                                        padding: "12px 24px",
                                        fontWeight: 700,
                                        cursor: addingCoach ? "not-allowed" : "pointer",
                                        fontSize: 15,
                                        transition: "all 0.3s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    {addingCoach ? (
                                        <>
                                            <div className="loading-spinner" style={{ width: "16px", height: "16px" }}></div>
                                            Đang thêm...
                                        </>
                                    ) : (
                                        "✅ Thêm Coach"
                                    )}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddCoach(false)}
                                style={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "#999",
                                    transition: "color 0.3s ease",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = COLORS.danger}
                                onMouseLeave={e => e.currentTarget.style.color = "#999"}
                            >
                                ×
                            </button>
                        </form>
                    </div>
                )}


            </div>
        </>
    );
}
