import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function CoachProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    // Lấy token từ Redux store thay vì AuthContext
    const { token, user } = useSelector((state) => state.account || {});

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
            .then(data => {
                console.log("✅ Profile data:", data);
                setProfile(data);
            })
            .catch(error => {
                console.error("❌ Lỗi khi lấy dữ liệu huấn luyện viên:", error);
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

            console.log("🚀 Updating profile with:", body);

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
                throw new Error(`Cập nhật thất bại: ${res.status} - ${errorText}`);
            }

            const updatedProfile = await res.json();
            console.log("✅ Profile updated:", updatedProfile);

            setProfile({ ...profile, ...body });
            setIsEditing(false);
            alert("Cập nhật thành công!");
        } catch (e) {
            console.error("❌ Update error:", e);
            alert(e.message);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div style={{
                maxWidth: 600,
                margin: "40px auto",
                background: "#fff",
                borderRadius: 16,
                padding: "2rem",
                boxShadow: "0 8px 32px rgba(154, 203, 208, 0.15)",
                border: "1px solid #9ACBD0"
            }}>
                <div style={{
                    color: "#48A6A7",
                    textAlign: "center",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                }}>
                    <div style={{
                        width: "20px",
                        height: "20px",
                        border: "3px solid #9ACBD0",
                        borderTop: "3px solid #48A6A7",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}></div>
                    Đang tải thông tin...
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Error state
    if (!profile) {
        return (
            <div style={{
                maxWidth: 600,
                margin: "40px auto",
                background: "#fff",
                borderRadius: 16,
                padding: "2rem",
                boxShadow: "0 8px 32px rgba(154, 203, 208, 0.15)",
                border: "1px solid #ffcdd2"
            }}>
                <div style={{
                    color: "#e74c3c",
                    textAlign: "center",
                    fontSize: "1.1rem"
                }}>
                    ❌ Không thể tải thông tin profile.
                </div>
                <div style={{
                    color: "#666",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    marginTop: "10px"
                }}>
                    Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
                </div>
            </div>
        );
    }

    // Main component
    return (
        <div style={{
            maxWidth: 600,
            margin: "40px auto",
            background: "#fff",
            borderRadius: 16,
            padding: "2.5rem",
            boxShadow: "0 8px 32px rgba(154, 203, 208, 0.15)",
            border: "1px solid #9ACBD0"
        }}>
            <style jsx>{`
                .profile-container {
                    font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                }
                
                .profile-field {
                    margin-bottom: 20px;
                    padding: 12px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .profile-label {
                    color: #006A71;
                    font-weight: 600;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .profile-value {
                    color: #333;
                    font-size: 1.05rem;
                }
                
                .profile-input {
                    width: 100%;
                    padding: 10px 15px;
                    border: 2px solid #9ACBD0;
                    border-radius: 8px;
                    font-size: 1rem;
                    color: #006A71;
                    background: #F2EFE7;
                    transition: all 0.3s ease;
                    margin-top: 5px;
                }
                
                .profile-input:focus {
                    outline: none;
                    border-color: #48A6A7;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(72, 166, 167, 0.1);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #48A6A7 0%, #006A71 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-right: 12px;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(72, 166, 167, 0.3);
                }
                
                .btn-secondary {
                    background: #e0e0e0;
                    color: #666;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-secondary:hover {
                    background: #d0d0d0;
                    transform: translateY(-1px);
                }
            `}</style>

            <div className="profile-container">
                <h2 style={{
                    color: "#006A71",
                    fontWeight: 900,
                    marginBottom: 30,
                    textAlign: "center",
                    fontSize: "1.8rem",
                    background: "linear-gradient(135deg, #48A6A7 0%, #006A71 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                }}>
                    🏃‍♂️ Thông tin huấn luyện viên
                </h2>

                {isEditing ? (
                    <form onSubmit={handleSave}>
                        <div className="profile-field">
                            <label className="profile-label">Họ tên:</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                className="profile-input"
                                placeholder="Nhập họ tên"
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Số điện thoại:</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="profile-input"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Ngày sinh:</label>
                            <input
                                type="date"
                                value={formData.birthday}
                                onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                                className="profile-input"
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Giới tính:</label>
                            <select
                                value={formData.sex}
                                onChange={e => setFormData({ ...formData, sex: e.target.value })}
                                className="profile-input"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        <div style={{ marginTop: 30, textAlign: "center" }}>
                            <button type="submit" className="btn-primary">
                                💾 Lưu thay đổi
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn-secondary"
                            >
                                ❌ Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="profile-field">
                            <span className="profile-label">Họ tên:</span>
                            <div className="profile-value">
                                {profile.fullName || "Chưa cập nhật"}
                            </div>
                        </div>

                        <div className="profile-field">
                            <span className="profile-label">Email:</span>
                            <div className="profile-value">
                                {profile.email || "Không có thông tin"}
                            </div>
                        </div>

                        <div className="profile-field">
                            <span className="profile-label">Số điện thoại:</span>
                            <div className="profile-value">
                                {profile.phoneNumber || "Chưa cập nhật"}
                            </div>
                        </div>

                        <div className="profile-field">
                            <span className="profile-label">Ngày sinh:</span>
                            <div className="profile-value">
                                {profile.birthday ? new Date(profile.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                            </div>
                        </div>

                        <div className="profile-field">
                            <span className="profile-label">Giới tính:</span>
                            <div className="profile-value">
                                {profile.sex === true ? "Nam" : "Nữ"}
                            </div>
                        </div>

                        <div style={{ marginTop: 30, textAlign: "center" }}>
                            <button className="btn-primary" onClick={handleEdit}>
                                ✏️ Chỉnh sửa thông tin
                            </button>
                        </div>
                    </div>
                )}

                {/* Debug info - chỉ hiện trong development */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        marginTop: 30,
                        padding: 15,
                        background: "#f8f9fa",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        color: "#666"
                    }}>
                        <strong>Debug Info:</strong>
                        <div>Token: {token ? "✅" : "❌"}</div>
                        <div>User: {user ? "✅" : "❌"}</div>
                        <div>Profile: {profile ? "✅" : "❌"}</div>
                        <div>Loading: {loading ? "⏳" : "✅"}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
