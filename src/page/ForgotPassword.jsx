import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi email lấy lại mật khẩu ở đây
        alert("Đã gửi hướng dẫn lấy lại mật khẩu (demo)!");
        navigate("/login");
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(120deg, #eaf6ff 60%, #f5f6fa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "2.5rem 2rem",
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(44,130,201,0.10)",
                    minWidth: 340,
                    maxWidth: 370,
                    width: "100%"
                }}
            >
                <h2 style={{ color: "#2d98da", textAlign: "center", marginBottom: 24 }}>Quên mật khẩu</h2>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: "#3867d6" }}>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Nhập email đã đăng ký"
                        style={{
                            width: "100%",
                            padding: "0.7rem",
                            borderRadius: 6,
                            border: "1px solid #cfd8dc",
                            marginTop: 6,
                            fontSize: "1rem"
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        background: "linear-gradient(90deg, #2d98da 60%, #3867d6 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.7rem",
                        fontWeight: 600,
                        fontSize: "1.08rem",
                        cursor: "pointer",
                        marginBottom: 10
                    }}
                >
                    Gửi yêu cầu
                </button>
                <div style={{ textAlign: "center", marginTop: 10, fontSize: "0.98rem" }}>
                    Đã nhớ mật khẩu?{" "}
                    <a href="/login" style={{ color: "#2d98da", fontWeight: 500, textDecoration: "none" }}>
                        Đăng nhập
                    </a>
                </div>
            </form>
        </div>
    );
}