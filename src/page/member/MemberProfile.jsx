import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import HistoryPayment from "./HistoryPayment";

export default function MemberProfile() {
  const COLORS = {
    background: "#F2EFE7",
    primary: "#9ACBD0",
    secondary: "#48A6A7",
    accent: "#006A71",
    text: "#006A71",
    white: "#fff",
    light: "#E6F4F4",
  };

  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!token) throw new Error("Không tìm thấy token");
        const url = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile";
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Unauthorized");
        const profile = await res.json();
        setUser({
          email: profile.email || "",
          fullName: profile.fullName || "",
          phoneNumber: profile.phoneNumber || "",
          birthday: profile.birthday || "",
          sex: profile.sex === true ? "Nam" : profile.sex === false ? "Nữ" : "",
          status: profile.status === true ? "Hoạt động" : profile.status === false ? "Khóa" : "",
        });
        setFormData({
          email: profile.email || "",
          fullName: profile.fullName || "",
          phoneNumber: profile.phoneNumber || "",
          birthday: profile.birthday || "",
          sex: profile.sex === true ? "Nam" : profile.sex === false ? "Nữ" : "",
          status: profile.status === true ? "Hoạt động" : profile.status === false ? "Khóa" : "",
        });
      } catch (e) {
        setUser(null);
        alert(e.message);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };
  const handleSave = async () => {
    try {
      // Chuyển sex về boolean
      const sexBool = formData.sex === "Nam" ? true : formData.sex === "Nữ" ? false : null;
      const body = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        birthday: formData.birthday ? formData.birthday.slice(0, 10) : "",
        sex: sexBool
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
      setUser({ ...user, ...formData, sex: formData.sex });
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (e) {
      alert(e.message);
    }
  };

  if (!user) return <div style={{ textAlign: "center", marginTop: 40 }}>Đang tải...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: COLORS.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 0 32px 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: COLORS.white,
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(72,166,167,0.10)",
          padding: "2.2rem 2rem 1.5rem 2rem",
          border: `1.5px solid ${COLORS.primary}`,
        }}
      >
        <h2
          style={{
            color: COLORS.accent,
            textAlign: "center",
            marginBottom: 28,
            fontWeight: 800,
            fontSize: "2rem",
            userSelect: "none",
            letterSpacing: 0.5,
          }}
        >
          👤 Thông tin cá nhân
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <b>Email:</b>{" "}
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  width: "70%",
                  background: COLORS.light,
                  color: COLORS.text,
                  outline: "none",
                }}
              />
            ) : (
              <span>{user.email}</span>
            )}
          </div>
          <div>
            <b>Họ tên:</b>{" "}
            {isEditing ? (
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  width: "70%",
                  background: COLORS.light,
                  color: COLORS.text,
                  outline: "none",
                }}
              />
            ) : (
              <span>{user.fullName}</span>
            )}
          </div>
          <div>
            <b>Số điện thoại:</b>{" "}
            {isEditing ? (
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  width: "70%",
                  background: COLORS.light,
                  color: COLORS.text,
                  outline: "none",
                }}
              />
            ) : (
              <span>{user.phoneNumber}</span>
            )}
          </div>
          <div>
            <b>Ngày sinh:</b>{" "}
            {isEditing ? (
              <input
                name="birthday"
                type="date"
                value={formData.birthday ? formData.birthday.slice(0, 10) : ""}
                onChange={handleChange}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  width: "70%",
                  background: COLORS.light,
                  color: COLORS.text,
                  outline: "none",
                }}
              />
            ) : (
              <span>{user.birthday ? user.birthday.slice(0, 10) : ""}</span>
            )}
          </div>
          <div>
            <b>Giới tính:</b>{" "}
            {isEditing ? (
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  background: COLORS.light,
                  color: COLORS.text,
                  outline: "none",
                }}
              >
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            ) : (
              <span>{user.sex}</span>
            )}
          </div>
          <div>
            <b>Trạng thái:</b> <span>{user.status}</span>
          </div>
        </div>
        <div style={{ marginTop: 28, textAlign: "center" }}>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              style={{
                padding: "7px 20px",
                fontSize: 15,
                background: `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`,
                color: COLORS.white,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(72,166,167,0.10)",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.background = `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`)}
            >
              Chỉnh sửa
            </button>
          ) : (
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "7px 20px",
                  fontSize: 15,
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Lưu
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: "7px 20px",
                  fontSize: 15,
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
      <HistoryPayment />
    </div>

  );
}
