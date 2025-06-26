import React, { useEffect, useState } from 'react';
import { useAuth } from "../../AuthContext/AuthContext";

export default function CoachProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, role } = useAuth();

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
    }, [token, role]);

    return (
        <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, padding: "2rem", boxShadow: "0 4px 24px #9ACBD033" }}>
            <h2 style={{ color: "#006A71", fontWeight: 900, marginBottom: 24, textAlign: "center" }}>Thông tin huấn luyện viên</h2>
            {loading ? (
                <div style={{ color: "#888", textAlign: "center" }}>Đang tải thông tin...</div>
            ) : !profile ? (
                <div style={{ color: "#888", textAlign: "center" }}>Không thể tải thông tin.</div>
            ) : (
                <div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Họ tên:</strong> {profile.fullName || profile.FullName || "Ẩn danh"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Email:</strong> {profile.email || profile.Email || "Không có thông tin"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Số điện thoại:</strong> {profile.phoneNumber || profile.PhoneNumber || profile.phone || "Không có thông tin"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Ngày sinh:</strong> {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString("vi-VN") : ""}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Giới thiệu:</strong> {profile.description || "Chưa có thông tin giới thiệu"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Kinh nghiệm:</strong> {profile.experience || "Chưa có thông tin kinh nghiệm"}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <strong>Chuyên môn:</strong> {profile.specialization || "Chưa có thông tin chuyên môn"}
                    </div>
                </div>
            )}
        </div>
    )
}
