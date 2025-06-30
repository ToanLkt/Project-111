import React, { useEffect, useState } from 'react';
import { useAuth } from "../../AuthContext/AuthContext";

export default function CoachProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Không thể truy cập API. Lỗi: " + res.statusText);
                return res.json();
            })
            .then(data => setProfile(data))
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu huấn luyện viên:", error);
                setProfile(null);
            })
            .finally(() => setLoading(false));
    }, [token]);

    // Khi bấm "Chỉnh sửa"
    const handleEdit = () => {
        setFormData({
            fullName: profile.fullName || "",
            phoneNumber: profile.phoneNumber || "",
            birthday: profile.birthday ? profile.birthday.slice(0, 10) : "",
            sex: profile.sex === true ? "Nam" : "Nữ"
        });
        setIsEditing(true);
    };

    // Khi bấm "Lưu"
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const body = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                birthday: formData.birthday,
                sex: formData.sex === "Nam" ? true : false
            };
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error("Cập nhật thất bại");
            setProfile({ ...profile, ...body });
            setIsEditing(false);
            alert("Cập nhật thành công!");
        } catch (e) {
            alert(e.message);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 24px #9ACBD033" }}>
                <div style={{ color: "#888", textAlign: "center" }}>Đang tải thông tin...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 24px #9ACBD033" }}>
                <div style={{ color: "#888", textAlign: "center" }}>Không thể tải thông tin.</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 24px #9ACBD033" }}>
            <h2 style={{ color: "#006A71", fontWeight: 900, marginBottom: 24, textAlign: "center" }}>Thông tin huấn luyện viên</h2>
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Họ tên:</strong>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="border rounded px-2 py-1 ml-2"
                        />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Số điện thoại:</strong>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="border rounded px-2 py-1 ml-2"
                        />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Ngày sinh:</strong>
                        <input
                            type="date"
                            value={formData.birthday}
                            onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                            className="border rounded px-2 py-1 ml-2"
                        />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Giới tính:</strong>
                        <select
                            value={formData.sex}
                            onChange={e => setFormData({ ...formData, sex: e.target.value })}
                            className="border rounded px-2 py-1 ml-2"
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        style={{ background: "#006A71", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, cursor: "pointer" }}
                    >
                        Lưu
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        style={{ marginLeft: 12, background: "#ccc", color: "#333", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, cursor: "pointer" }}
                    >
                        Hủy
                    </button>
                </form>
            ) : (
                <div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Họ tên:</strong> {profile.fullName || "Ẩn danh"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Email:</strong> {profile.email || "Không có thông tin"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Số điện thoại:</strong> {profile.phoneNumber || "Không có thông tin"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Ngày sinh:</strong> {profile.birthday ? new Date(profile.birthday).toLocaleDateString("vi-VN") : ""}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Giới tính:</strong> {profile.sex === true ? "Nam" : "Nữ"}
                    </div>
                    <button
                        style={{ marginTop: 12, background: "#48A6A7", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, cursor: "pointer" }}
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </button>
                </div>
            )}
        </div>
    );
}
