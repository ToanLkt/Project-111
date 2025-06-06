import React, { useState } from "react";

export default function MemberProfile() {
  const initialUser = {
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    name: "Lương Khánh Toàn",
    title: "Danh hiệu",
    desc: "Mèo meo",
    email: "meomeo@gmail.com",
    phone: "0123 456 789",
    package: "Gói Premium",
    goal:
      "Mục tiêu của tui ở đây nè.",
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
        background: "#f7f7fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
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
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(44,130,201,0.07)",
          padding: "2.2rem 2rem 1.5rem 2rem",
          border: "1.5px solid #f3d46e",
        }}
      >
        <h2
          style={{
            color: "#bfa917",
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
                background: "#fffbe8",
                border: "3px solid #bfa917",
                boxShadow: "0 2px 8px rgba(243,212,110,0.13)",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                background: "#fffbe8",
                color: "#bfa917",
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 600,
                fontSize: 15,
                textAlign: "center",
                border: "1.5px solid #f3d46e",
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
                      border: "1.5px solid #f3d46e",
                      fontWeight: 700,
                      marginBottom: 8,
                      width: "100%",
                      background: "#fffbe8",
                      color: "#222",
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
                    background: "linear-gradient(90deg, #f3d46e 60%, #bfa917 100%)",
                    color: "#222",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(191,169,23,0.10)",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#bfa917")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #f3d46e 60%, #bfa917 100%)")}
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

            <div style={{ color: "#444", margin: "10px 0 2px 0", fontSize: 16 }}>
              {isEditing ? (
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1.5px solid #f3d46e",
                    background: "#fffbe8",
                    color: "#222",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              ) : (
                <span style={{ color: "#888" }}>{user.desc}</span>
              )}
            </div>

            <div style={{ margin: "8px 0", color: "#222", fontSize: 15 }}>
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
                      border: "1.5px solid #f3d46e",
                      width: "60%",
                      background: "#fffbe8",
                      color: "#222",
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
                      border: "1.5px solid #f3d46e",
                      width: "60%",
                      background: "#fffbe8",
                      color: "#222",
                      outline: "none",
                    }}
                  />
                ) : (
                  <b>{user.phone}</b>
                )}
              </div>
              <div>
                Gói đăng ký: <span style={{ color: "#bfa917", fontWeight: 600 }}>{user.package}</span>
              </div>
            </div>

            <div style={{ margin: "18px 0 0 0" }}>
              <div
                style={{
                  border: "1.5px solid #f3d46e",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fffbe8",
                  boxShadow: "0 2px 8px rgba(243,212,110,0.07)",
                }}
              >
                <b style={{ color: "#bfa917" }}>🎯 Mục tiêu</b>
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
                      border: "1.5px solid #f3d46e",
                      fontSize: 16,
                      background: "#fff",
                      color: "#222",
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
