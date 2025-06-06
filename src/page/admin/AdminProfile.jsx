import React, { useState } from "react";

const mockAdmin = {
    name: "Admin",
    email: "admin@gmail.com",
    phone: "0123456789",
    dob: "1990-01-01",
    gender: "Nam",
    role: "Quản trị viên"
};

function AdminProfile() {
    const [admin, setAdmin] = useState(mockAdmin);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(admin);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setAdmin(form);
        setEdit(false);
    };

    return (
        <div
            style={{
                maxWidth: 500,
                margin: "40px auto",
                background: "#181c24",
                borderRadius: 18,
                padding: 36,
                boxShadow: "0 6px 32px #bfa91722",
                color: "#fff"
            }}
        >
            <h2 style={{
                color: "#f3d46e",
                fontWeight: 800,
                marginBottom: 28,
                textAlign: "center",
                fontSize: "1.7rem"
            }}>
                Thông tin Quản trị viên
            </h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="avatar"
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        border: "3px solid #bfa917",
                        background: "#fffbe8",
                        objectFit: "cover"
                    }}
                />
            </div>
            {!edit ? (
                <div style={{ fontSize: 17, lineHeight: 2 }}>
                    <div><b>Họ tên:</b> {admin.name}</div>
                    <div><b>Email:</b> {admin.email}</div>
                    <div><b>Số điện thoại:</b> {admin.phone}</div>
                    <div><b>Ngày sinh:</b> {admin.dob}</div>
                    <div><b>Giới tính:</b> {admin.gender}</div>
                    <div><b>Vai trò:</b> {admin.role}</div>
                    <div style={{ marginTop: 28, textAlign: "center" }}>
                        <button
                            onClick={() => setEdit(true)}
                            style={{
                                background: "#bfa917",
                                color: "#222",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 32px",
                                fontSize: 16,
                                cursor: "pointer",
                                boxShadow: "0 2px 8px #bfa91722"
                            }}
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSave} style={{ fontSize: 17, lineHeight: 2 }}>
                    <div style={{ marginBottom: 12 }}>
                        <label><b>Họ tên:</b></label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 7,
                                border: "1.5px solid #bfa91788",
                                background: "#232323",
                                color: "#f3d46e",
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label><b>Số điện thoại:</b></label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 7,
                                border: "1.5px solid #bfa91788",
                                background: "#232323",
                                color: "#f3d46e",
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label><b>Ngày sinh:</b></label>
                        <input
                            name="dob"
                            type="date"
                            value={form.dob}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 7,
                                border: "1.5px solid #bfa91788",
                                background: "#232323",
                                color: "#f3d46e",
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label><b>Giới tính:</b></label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 7,
                                border: "1.5px solid #bfa91788",
                                background: "#232323",
                                color: "#f3d46e",
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div style={{ marginTop: 28, textAlign: "center", display: "flex", gap: 16, justifyContent: "center" }}>
                        <button
                            type="button"
                            onClick={() => { setEdit(false); setForm(admin); }}
                            style={{
                                background: "#888",
                                color: "#fff",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 32px",
                                fontSize: 16,
                                cursor: "pointer"
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            style={{
                                background: "#bfa917",
                                color: "#222",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 32px",
                                fontSize: 16,
                                cursor: "pointer"
                            }}
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default AdminProfile;