import React, { useState } from "react";

export default function MemberProfile() {
  // Bảng màu chủ đề
  const COLORS = {
    background: "#F2EFE7",
    primary: "#9ACBD0",
    secondary: "#48A6A7",
    accent: "#006A71",
    text: "#006A71",
    white: "#fff",
    light: "#E6F4F4",
  };

  const initialUser = {
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    name: "Lương Khánh Toàn",
    title: "Chủ tịch FPT",
    desc: "Mèo meo",
    email: "meomeo@gmail.com",
    phone: "0123 456 789",
    package: "Gói Premium",
    goal: "Mục tiêu của tui ở đây nè.",
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

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
          maxWidth: 650,
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
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <img
              src={user.avatar}
              alt="avatar"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: "50%",
                background: COLORS.light,
                border: `3px solid ${COLORS.secondary}`,
                boxShadow: "0 2px 8px rgba(72,166,167,0.13)",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                background: COLORS.light,
                color: COLORS.secondary,
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 600,
                fontSize: 15,
                textAlign: "center",
                border: `1.5px solid ${COLORS.primary}`,
                marginTop: 8,
              }}
            >
              {user.title}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {isEditing ? (
                <>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      fontSize: 22,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: `1.5px solid ${COLORS.primary}`,
                      fontWeight: 700,
                      marginBottom: 8,
                      width: "100%",
                      background: COLORS.light,
                      color: COLORS.text,
                      outline: "none",
                    }}
                  />
                </>
              ) : (
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>{user.name}</h2>
              )}

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  style={{
                    marginLeft: "auto",
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
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
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

            <div style={{ color: COLORS.secondary, margin: "10px 0 2px 0", fontSize: 16 }}>
              {isEditing ? (
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: `1.5px solid ${COLORS.primary}`,
                    background: COLORS.light,
                    color: COLORS.text,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              ) : (
                <span style={{ color: "#888" }}>{user.desc}</span>
              )}
            </div>

            <div style={{ margin: "8px 0", color: COLORS.text, fontSize: 15 }}>
              <div>
                Email:{" "}
                {isEditing ? (
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      border: `1.5px solid ${COLORS.primary}`,
                      width: "60%",
                      background: COLORS.light,
                      color: COLORS.text,
                      outline: "none",
                    }}
                  />
                ) : (
                  <b>{user.email}</b>
                )}
              </div>
              <div>
                Số ĐT:{" "}
                {isEditing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      border: `1.5px solid ${COLORS.primary}`,
                      width: "60%",
                      background: COLORS.light,
                      color: COLORS.text,
                      outline: "none",
                    }}
                  />
                ) : (
                  <b>{user.phone}</b>
                )}
              </div>
              <div>
                Gói đăng ký: <span style={{ color: COLORS.secondary, fontWeight: 600 }}>{user.package}</span>
              </div>
            </div>

            <div style={{ margin: "18px 0 0 0" }}>
              <div
                style={{
                  border: `1.5px solid ${COLORS.primary}`,
                  borderRadius: 12,
                  padding: 16,
                  background: COLORS.light,
                  boxShadow: "0 2px 8px rgba(72,166,167,0.07)",
                }}
              >
                <b style={{ color: COLORS.secondary }}>🎯 Mục tiêu</b>
                {isEditing ? (
                  <textarea
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      marginTop: 8,
                      padding: 10,
                      borderRadius: 8,
                      border: `1.5px solid ${COLORS.primary}`,
                      fontSize: 16,
                      background: COLORS.white,
                      color: COLORS.text,
                      outline: "none",
                    }}
                  />
                ) : (
                  <div style={{ marginTop: 8, color: "#333", fontSize: 15 }}>{user.goal}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
