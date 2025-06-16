import React, { useState } from "react";
import Footer from "../../components/Footer";

// Demo dữ liệu member và coach
const initialMembers = [
    { id: 1, name: "Nguyễn Văn A", email: "member1@gmail.com", membership: "Gói Pro", active: true },
    { id: 2, name: "Trần Thị B", email: "member2@gmail.com", membership: "Gói Cơ bản", active: true },
];

const initialCoaches = [
    { id: 1, name: "Lê Văn C", email: "coach1@gmail.com", active: true },
    { id: 2, name: "Phạm Thị D", email: "coach2@gmail.com", active: true },
];

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
    const [members, setMembers] = useState(initialMembers);
    const [coaches, setCoaches] = useState(initialCoaches);

    // State cho modal thêm coach
    const [showAddCoach, setShowAddCoach] = useState(false);
    const [coachForm, setCoachForm] = useState({
        name: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
    });

    // State search
    const [searchMember, setSearchMember] = useState("");
    const [searchCoach, setSearchCoach] = useState("");

    const handleCoachFormChange = (e) => {
        const { name, value } = e.target;
        setCoachForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCoach = (e) => {
        e.preventDefault();
        setCoaches([
            ...coaches,
            {
                id: Date.now(),
                name: coachForm.name,
                dob: coachForm.dob,
                gender: coachForm.gender,
                phone: coachForm.phone,
                email: coachForm.email,
                active: true,
            },
        ]);
        setCoachForm({
            name: "",
            dob: "",
            gender: "",
            phone: "",
            email: "",
            password: "",
        });
        setShowAddCoach(false);
    };

    // Tạm khóa hoặc mở khóa member
    const handleToggleActiveMember = (id) => {
        setMembers(members =>
            members.map(m =>
                m.id === id ? { ...m, active: !m.active } : m
            )
        );
    };

    // Tạm khóa hoặc mở khóa coach
    const handleToggleActiveCoach = (id) => {
        setCoaches(coaches =>
            coaches.map(c =>
                c.id === id ? { ...c, active: !c.active } : c
            )
        );
    };

    // Lọc theo search
    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchMember.toLowerCase())
    );
    const filteredCoaches = coaches.filter(c =>
        c.name.toLowerCase().includes(searchCoach.toLowerCase())
    );

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
                Danh sách Member đã đăng ký
            </h2>
            <div style={{ marginBottom: 18, display: "flex", justifyContent: "flex-end" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm tên member..."
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
                            <th style={thStyle}>Họ tên</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Gói membership</th>
                            <th style={thStyle}>Trạng thái</th>
                            <th style={thStyle}>Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((m, idx) => (
                            <tr key={m.id} style={{ background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt }}>
                                <td style={tdStyle}>{idx + 1}</td>
                                <td style={tdStyle}>{m.name}</td>
                                <td style={tdStyle}>{m.email}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        background: m.membership === "Gói Pro" ? COLORS.primary : "#bbb",
                                        color: COLORS.white,
                                        padding: "4px 12px",
                                        borderRadius: 16,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        boxShadow: "0 2px 8px #9ACBD022"
                                    }}>
                                        {m.membership}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={{
                                        color: m.active ? COLORS.success : COLORS.warning,
                                        fontWeight: 700
                                    }}>
                                        {m.active ? "Hoạt động" : "Tạm khóa"}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleToggleActiveMember(m.id)}
                                        style={{
                                            background: m.active ? COLORS.warning : COLORS.success,
                                            color: COLORS.white,
                                            border: "none",
                                            borderRadius: 8,
                                            padding: "8px 22px",
                                            cursor: "pointer",
                                            fontWeight: 700,
                                            fontSize: 16,
                                            transition: "background 0.2s",
                                            boxShadow: "0 2px 8px #9ACBD022"
                                        }}
                                    >
                                        {m.active ? "Tạm khóa" : "Mở khóa"}
                                    </button>
                                </td>
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
                Danh sách Coach đã đăng ký
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
                    placeholder="Tìm kiếm tên coach..."
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
                            <th style={thStyle}>Họ tên</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Trạng thái</th>
                            <th style={thStyle}>Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCoaches.map((c, idx) => (
                            <tr key={c.id} style={{ background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt }}>
                                <td style={tdStyle}>{idx + 1}</td>
                                <td style={tdStyle}>{c.name}</td>
                                <td style={tdStyle}>{c.email}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        color: c.active ? COLORS.success : COLORS.warning,
                                        fontWeight: 700
                                    }}>
                                        {c.active ? "Hoạt động" : "Tạm khóa"}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleToggleActiveCoach(c.id)}
                                        style={{
                                            background: c.active ? COLORS.warning : COLORS.success,
                                            color: COLORS.white,
                                            border: "none",
                                            borderRadius: 8,
                                            padding: "8px 22px",
                                            cursor: "pointer",
                                            fontWeight: 700,
                                            fontSize: 16,
                                            transition: "background 0.2s",
                                            boxShadow: "0 2px 8px #9ACBD022"
                                        }}
                                    >
                                        {c.active ? "Tạm khóa" : "Mở khóa"}
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
                            name="name"
                            value={coachForm.name}
                            onChange={handleCoachFormChange}
                            placeholder="Họ tên"
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
                            name="dob"
                            type="date"
                            value={coachForm.dob}
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
                            name="gender"
                            value={coachForm.gender}
                            onChange={handleCoachFormChange}
                            required
                            style={{
                                padding: "9px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                fontSize: 15,
                                color: coachForm.gender ? COLORS.accent : "#888",
                                background: COLORS.tableBg,
                                fontWeight: 600,
                            }}
                        >
                            <option value="">Giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                        <input
                            name="phone"
                            value={coachForm.phone}
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
                                style={{
                                    background: COLORS.primary,
                                    color: COLORS.white,
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "8px 18px",
                                    fontWeight: 800,
                                    cursor: "pointer"
                                }}
                                onMouseOver={e => e.currentTarget.style.background = COLORS.accent}
                                onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
                            >
                                Thêm
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <Footer />

        </div>

    );

}
