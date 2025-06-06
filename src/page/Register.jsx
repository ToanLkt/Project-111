import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý đăng ký ở đây
        // Nếu thành công:
        navigate("/");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#000",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                padding: "1rem",
                position: "relative",
            }}
        >
            {/* Background image */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage:
                        "url('https://www.statnews.com/wp-content/uploads/2023/01/AdobeStock_562452567-768x432.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.25,
                    zIndex: 0,
                }}
            />

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "rgba(20, 20, 20, 0.85)",
                    padding: "2rem",
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(255, 255, 255, 0.05)",
                    width: "100%",
                    maxWidth: 420,
                    zIndex: 1,
                }}
            >
                <h2 style={{ color: "#d4af37", textAlign: "center", marginBottom: 24 }}>Tạo tài khoản</h2>

                {[
                    { label: "Họ và tên", type: "text", value: name, onChange: setName, placeholder: "Nhập họ và tên" },
                    { label: "Email", type: "email", value: email, onChange: setEmail, placeholder: "Nhập email" },
                    { label: "Số điện thoại", type: "tel", value: phone, onChange: setPhone, placeholder: "Nhập số điện thoại" },
                    { label: "Mật khẩu", type: "password", value: password, onChange: setPassword, placeholder: "Nhập mật khẩu" },
                    { label: "Nhập lại mật khẩu", type: "password", value: repassword, onChange: setRepassword, placeholder: "Nhập lại mật khẩu" }
                ].map(({ label, type, value, onChange, placeholder }, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 500, color: "#f1f2f6" }}>{label}</label>
                        <input
                            type={type}
                            required
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: 6,
                                border: "1px solid #444",
                                marginTop: 6,
                                fontSize: "1rem",
                                background: "#111",
                                color: "#fff"
                            }}
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        background: "linear-gradient(90deg, #d4af37 0%, #bfa233 100%)",
                        color: "#000",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.75rem",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        cursor: "pointer",
                        marginTop: 8
                    }}
                >
                    Đăng ký
                </button>

                <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.95rem" }}>
                    Đã có tài khoản?{" "}
                    <a href="/login" style={{ color: "#d4af37", fontWeight: 500, textDecoration: "none" }}>
                        Đăng nhập
                    </a>
                </div>
            </form>
        </div>
    );
}
