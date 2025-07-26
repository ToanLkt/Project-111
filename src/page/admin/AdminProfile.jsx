import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const COLORS = {
    background: "#F2EFE7",
    primary: "#9ACBD0",
    secondary: "#48A6A7",
    accent: "#006A71",
    text: "#006A71",
    white: "#fff",
    light: "#E6F4F4",
};

function AdminProfile() {
    const { user, token } = useSelector((state) => state.account || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserRole = () => {
        if (!user) return null;
        const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            user.role ||
            null;
        return role ? role.toString().trim() : null;
    };

    const userRole = getUserRole();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        if (userRole && userRole !== "Admin") {
            navigate("/");
            return;
        }
    }, [token, userRole, navigate]);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Không thể truy cập API. Lỗi: " + res.statusText);
                return res.json();
            })
            .then(data => {
                const adminData = {
                    name: data.fullName || "",
                    email: data.email || "",
                    phone: data.phoneNumber || "",
                    dob: data.birthday ? data.birthday.slice(0, 10) : "",
                    gender: data.sex === true ? "Nam" : data.sex === false ? "Nữ" : "Khác",
                    role: "Quản trị viên"
                };
                setAdmin(adminData);
                setForm({ ...adminData });
            })
            .catch(error => {
                setAdmin(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const body = {
            fullName: form.name,
            phoneNumber: form.phone,
            birthday: form.dob,
            sex: form.gender === "Nam" ? true : form.gender === "Nữ" ? false : null
        };
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error("Cập nhật thất bại: " + errorText);
            }
            setAdmin({ ...form });
            setEdit(false);
            alert("Cập nhật thành công!");
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div style={{
                maxWidth: 500,
                margin: "40px auto",
                background: COLORS.white,
                borderRadius: 18,
                padding: 36,
                color: COLORS.secondary,
                boxShadow: "0 4px 24px #9ACBD033",
                textAlign: "center"
            }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                <div>Đang tải thông tin...</div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div style={{
                maxWidth: 500,
                margin: "40px auto",
                background: COLORS.white,
                borderRadius: 18,
                padding: 36,
                color: COLORS.secondary,
                boxShadow: "0 4px 24px #9ACBD033",
                textAlign: "center"
            }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
                <div style={{ marginBottom: "1rem" }}>Không thể tải thông tin quản trị viên.</div>
                <button
                    onClick={() => navigate("/admin")}
                    style={{
                        background: COLORS.primary,
                        color: COLORS.accent,
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 24px",
                        fontSize: 14,
                        cursor: "pointer"
                    }}
                >
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: 520,
                margin: "40px auto",
                background: COLORS.white,
                borderRadius: 20,
                padding: 40,
                boxShadow: "0 8px 32px #9ACBD033",
                color: COLORS.text,
                border: `2px solid ${COLORS.primary}`,
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif"
            }}
        >
            <h2 style={{
                color: COLORS.accent,
                fontWeight: 900,
                marginBottom: 28,
                textAlign: "center",
                fontSize: "2rem",
                letterSpacing: 1
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
                        border: `3px solid ${COLORS.primary}`,
                        background: COLORS.light,
                        objectFit: "cover",
                        boxShadow: "0 2px 8px #9ACBD022"
                    }}
                />
            </div>

            {!edit ? (
                <div style={{ fontSize: 17, lineHeight: 2 }}>
                    <div><b>Họ tên:</b> {admin.name || "Chưa cập nhật"}</div>
                    <div><b>Email:</b> {admin.email || "Chưa cập nhật"}</div>
                    <div><b>Số điện thoại:</b> {admin.phone || "Chưa cập nhật"}</div>
                    <div><b>Ngày sinh:</b> {admin.dob || "Chưa cập nhật"}</div>
                    <div><b>Giới tính:</b> {admin.gender || "Chưa cập nhật"}</div>
                    <div><b>Vai trò:</b> {admin.role}</div>
                    <div style={{ marginTop: 28, textAlign: "center" }}>
                        <button
                            onClick={() => setEdit(true)}
                            style={{
                                background: COLORS.primary,
                                color: COLORS.accent,
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 32px",
                                fontSize: 16,
                                cursor: "pointer",
                                boxShadow: "0 2px 8px #9ACBD022",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = COLORS.secondary}
                            onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSave} style={{ fontSize: 17, lineHeight: 2 }}>
                    <div style={{ marginBottom: 16 }}>
                        <label><b>Họ tên:</b></label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                background: COLORS.light,
                                color: COLORS.text,
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label><b>Số điện thoại:</b></label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                background: COLORS.light,
                                color: COLORS.text,
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label><b>Ngày sinh:</b></label>
                        <input
                            name="dob"
                            type="date"
                            value={form.dob}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                background: COLORS.light,
                                color: COLORS.text,
                                fontWeight: 600,
                                marginTop: 4
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label><b>Giới tính:</b></label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: 8,
                                border: `1.5px solid ${COLORS.primary}`,
                                background: COLORS.light,
                                color: COLORS.text,
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
                            onClick={() => {
                                setEdit(false);
                                setForm({ ...admin });
                            }}
                            style={{
                                background: COLORS.secondary,
                                color: "#fff",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 32px",
                                fontSize: 16,
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = COLORS.accent}
                            onMouseOut={e => e.currentTarget.style.background = COLORS.secondary}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            style={{
                                background: COLORS.primary,
                                color: COLORS.accent,
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 32px",
                                fontSize: 16,
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = COLORS.secondary}
                            onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
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