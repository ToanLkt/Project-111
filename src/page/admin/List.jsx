import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { useAuth } from "../../AuthContext/AuthContext";

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
    const { token } = useAuth();
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

    // Lấy danh sách member
    useEffect(() => {
        if (!token) return;
        setLoadingMember(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
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
    }, [token]);

    // Lấy danh sách coach
    useEffect(() => {
        if (!token) return;
        setLoadingCoach(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Coach", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
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
    }, [token, addingCoach]);

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
        setAddingCoach(true);
        setAddCoachError("");
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Coach", {
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
                    sex: coachForm.sex === "true" || coachForm.sex === true // true: Nam, false: Nữ
                })
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
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
            // Tự động reload danh sách coach
        } catch (err) {
            setAddCoachError("Thêm coach thất bại: " + err.message);
            setAddingCoach(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: 1100,
                margin: "40px auto",
                background: COLORS.card,
                borderRadius: 18,
                padding: 40,
                boxShadow: "0 6px 32px #9ACBD022",
                minHeight: 500,
                color: COLORS.text,
            }}
        >
            {/* Member Section */}
            <h2 style={{
                color: COLORS.accent,
                marginBottom: 18,
                fontWeight: 800,
                fontSize: "1.6rem",
                letterSpacing: 0.5,
                textShadow: "0 2px 8px #9ACBD033"
            }}>
                Danh sách Member
            </h2>
            <div style={{ marginBottom: 18, display: "flex", justifyContent: "flex-end" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên hoặc email..."
                    value={searchMember}
                    onChange={e => setSearchMember(e.target.value)}
                    style={{
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: `1.5px solid ${COLORS.primary}`,
                        fontSize: 15,
                        minWidth: 220,
                        outline: "none",
                        background: COLORS.tableBg,
                        color: COLORS.accent,
                        fontWeight: 600,
                    }}
                />
            </div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {loadingMember ? (
                            <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>Đang tải...</td></tr>
                        ) : filteredMembers.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>Không có member nào.</td></tr>
                        ) : filteredMembers.map((m, idx) => (
                            <tr key={m.accountId || idx} style={{ background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt }}>
                                <td style={tdStyle}>{m.accountId}</td>
                                <td style={tdStyle}>{m.email}</td>
                                <td style={tdStyle}>{m.fullName}</td>
                                <td style={tdStyle}>{m.phoneNumber}</td>
                                <td style={tdStyle}>{m.birthday ? new Date(m.birthday).toLocaleDateString("vi-VN") : ""}</td>
                                <td style={tdStyle}>{m.sex === true ? "Nam" : m.sex === false ? "Nữ" : m.sex}</td>
                                <td style={tdStyle}>{renderStatus(m.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Coach Section */}
            <h2 style={{
                color: COLORS.accent,
                marginBottom: 18,
                fontWeight: 800,
                fontSize: "1.6rem",
                letterSpacing: 0.5,
                marginTop: 40,
                textShadow: "0 2px 8px #9ACBD033"
            }}>
                Danh sách Coach
            </h2>
            <div style={{
                marginBottom: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <button
                    type="button"
                    onClick={() => setShowAddCoach(true)}
                    style={{
                        background: COLORS.primary,
                        color: COLORS.white,
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 22px",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontSize: 16,
                        boxShadow: "0 2px 8px #9ACBD022",
                        letterSpacing: 0.2,
                        transition: "background 0.18s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = COLORS.accent}
                    onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
                >
                    Thêm Coach
                </button>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên hoặc email..."
                    value={searchCoach}
                    onChange={e => setSearchCoach(e.target.value)}
                    style={{
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: `1.5px solid ${COLORS.primary}`,
                        fontSize: 15,
                        minWidth: 220,
                        outline: "none",
                        background: COLORS.tableBg,
                        color: COLORS.accent,
                        fontWeight: 600,
                    }}
                />
            </div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {loadingCoach ? (
                            <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>Đang tải...</td></tr>
                        ) : filteredCoaches.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>Không có coach nào.</td></tr>
                        ) : filteredCoaches.map((c, idx) => (
                            <tr key={c.coachId || idx} style={{ background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt }}>
                                <td style={tdStyle}>{c.coachId}</td>
                                <td style={tdStyle}>{c.email}</td>
                                <td style={tdStyle}>{c.fullName}</td>
                                <td style={tdStyle}>{c.phoneNumber}</td>
                                <td style={tdStyle}>{c.birthday ? new Date(c.birthday).toLocaleDateString("vi-VN") : ""}</td>
                                <td style={tdStyle}>{c.sex === true ? "Nam" : c.sex === false ? "Nữ" : c.sex}</td>
                                <td style={tdStyle}>{renderStatus(c.status)}</td>
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
                        background: "rgba(0,0,0,0.18)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <form
                        onSubmit={handleAddCoach}
                        style={{
                            background: COLORS.card,
                            borderRadius: 14,
                            padding: "2rem 2.2rem 1.5rem 2.2rem",
                            minWidth: 340,
                            boxShadow: "0 8px 32px #9ACBD033",
                            border: `2px solid ${COLORS.primary}`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                            position: "relative"
                        }}
                    >
                        <h3 style={{ color: COLORS.accent, marginBottom: 8, textAlign: "center" }}>Thêm Coach mới</h3>
                        <input
                            name="email"
                            type="email"
                            value={coachForm.email}
                            onChange={handleCoachFormChange}
                            placeholder="Email"
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                background: COLORS.tableBg,
                                color: COLORS.accent,
                                fontWeight: 600,
                            }}
                        />
                        <input
                            name="password"
                            type="password"
                            value={coachForm.password}
                            onChange={handleCoachFormChange}
                            placeholder="Password"
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                background: COLORS.tableBg,
                                color: COLORS.accent,
                                fontWeight: 600,
                            }}
                        />
                        <input
                            name="fullName"
                            value={coachForm.fullName}
                            onChange={handleCoachFormChange}
                            placeholder="Họ và tên"
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                background: COLORS.tableBg,
                                color: COLORS.accent,
                                fontWeight: 600,
                            }}
                        />
                        <input
                            name="phoneNumber"
                            value={coachForm.phoneNumber}
                            onChange={handleCoachFormChange}
                            placeholder="Số điện thoại"
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                background: COLORS.tableBg,
                                color: COLORS.accent,
                                fontWeight: 600,
                            }}
                        />
                        <input
                            name="birthday"
                            type="date"
                            value={coachForm.birthday}
                            onChange={handleCoachFormChange}
                            placeholder="Ngày sinh"
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                background: COLORS.tableBg,
                                color: COLORS.accent,
                                fontWeight: 600,
                            }}
                        />
                        <select
                            name="sex"
                            value={coachForm.sex}
                            onChange={handleCoachFormChange}
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                color: coachForm.sex ? COLORS.accent : "#888",
                                background: COLORS.tableBg,
                                fontWeight: 600,
                            }}
                        >
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                        </select>
                        {addCoachError && (
                            <div style={{ color: COLORS.danger, fontWeight: 700, textAlign: "center" }}>{addCoachError}</div>
                        )}
                        <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={() => setShowAddCoach(false)}
                                style={{
                                    background: "#bbb",
                                    color: COLORS.white,
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "8px 18px",
                                    fontWeight: 700,
                                    cursor: "pointer"
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={addingCoach}
                                style={{
                                    background: COLORS.primary,
                                    color: COLORS.white,
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "8px 18px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "background 0.18s",
                                }}
                            >
                                {addingCoach ? "Đang thêm..." : "Thêm Coach"}
                                {addingCoach && (
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background: COLORS.btnHover,
                                        borderRadius: 7,
                                        zIndex: 1,
                                        animation: "fadeIn 0.4s",
                                    }} />
                                )}
                            </button>
                        </div>
                        <div style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            cursor: "pointer",
                            color: "#888",
                            transition: "color 0.18s",
                        }}
                            onClick={() => setShowAddCoach(false)}
                            onMouseEnter={e => e.currentTarget.style.color = "#555"}
                            onMouseLeave={e => e.currentTarget.style.color = "#888"}
                        >
                            &times;
                        </div>
                    </form>
                </div>
            )}

            <Footer />


        </div>

    );

}
