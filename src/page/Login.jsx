import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

// Thêm hàm này ở đây
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setShowToast(false);
        try {
            const role = await login(email, password); 
            setSuccess("Đăng nhập thành công!");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                if (role === "admin") navigate("/admin");
                else if (role === "coach") navigate("/coachpage");
                else if (role === "member") navigate("/member");
                else navigate("/");
            }, 1200);
        } catch (err) {
            setError("Email hoặc mật khẩu không đúng!");
            setSuccess("");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1500);
        }
    };

    const handleFacebookLogin = () => {
        alert("Chức năng đăng nhập Facebook chưa được hỗ trợ.");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(120deg, #F2EFE7 60%, #9ACBD0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            {/* Toast notification */}
            {showToast && (
                <div
                    style={{
                        position: "fixed",
                        top: 32,
                        right: 32,
                        zIndex: 9999,
                        background: success ? "#27ae60" : "#e74c3c",
                        color: "#fff",
                        padding: "16px 32px",
                        borderRadius: 10,
                        fontWeight: 600,
                        fontSize: 17,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        transition: "all 0.3s",
                        animation: "fadeIn 0.5s",
                    }}
                >
                    {success || error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    border: "1px solid #9ACBD0",
                    borderRadius: 16,
                    padding: "2.5rem 2rem",
                    boxShadow: "0 6px 24px rgba(72,166,167,0.10)",
                    maxWidth: 400,
                    width: "100%",
                    color: "#006A71",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: 24,
                        fontWeight: "700",
                        color: "#006A71",
                        letterSpacing: 1,
                    }}
                >
                    Đăng nhập
                </h2>

                {/* Thông báo thành công */}
                {success && (
                    <div
                        style={{
                            color: "#27ae60",
                            marginBottom: 16,
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        {success}
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            color: "#e74c3c",
                            marginBottom: 16,
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        {error}
                    </div>
                )}

                <label
                    htmlFor="email"
                    style={{
                        display: "block",
                        marginBottom: 6,
                        fontWeight: "600",
                        color: "#006A71",
                    }}
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    style={{
                        width: "100%",
                        padding: "0.7rem",
                        borderRadius: 8,
                        border: "1.5px solid #9ACBD0",
                        marginBottom: 20,
                        fontSize: "1rem",
                        color: "#006A71",
                        outline: "none",
                        background: "#F2EFE7",
                        transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#48A6A7")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#9ACBD0")}
                />

                <label
                    htmlFor="password"
                    style={{
                        display: "block",
                        marginBottom: 6,
                        fontWeight: "600",
                        color: "#006A71",
                    }}
                >
                    Mật khẩu
                </label>
                <div style={{ position: "relative", marginBottom: 20 }}>
                    <input
                        id="password"
                        type={showPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={{
                            width: "100%",
                            padding: "0.7rem",
                            borderRadius: 8,
                            border: "1.5px solid #9ACBD0",
                            fontSize: "1rem",
                            color: "#006A71",
                            outline: "none",
                            background: "#F2EFE7",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#48A6A7")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#9ACBD0")}
                    />
                    <span
                        onClick={() => setShowPass(!showPass)}
                        title={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#48A6A7",
                            userSelect: "none",
                            fontSize: 18,
                        }}
                    >
                        {showPass ? "🙈" : "👁️"}
                    </span>
                </div>

                <div
                    style={{
                        textAlign: "right",
                        marginBottom: 24,
                        fontSize: 14,
                    }}
                >
                    <a
                        href="/forgot-password"
                        style={{
                            color: "#48A6A7",
                            textDecoration: "none",
                            fontWeight: "600",
                            transition: "color 0.3s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#006A71")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#48A6A7")}
                    >
                        Quên mật khẩu?
                    </a>
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        transition: "background 0.3s",
                        marginBottom: 10,
                        boxShadow: "0 2px 8px rgba(72,166,167,0.08)",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#006A71")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)")}
                >
                    Đăng nhập
                </button>

                {/* Nút chuyển đến trang loginGoogle.jsx */}
                <button
                    type="button"
                    onClick={() => navigate("/logingoogle")}
                    style={{
                        width: "100%",
                        background: "#fff",
                        color: "#006A71",
                        border: "2px solid #48A6A7",
                        borderRadius: 8,
                        padding: "0.7rem",
                        fontWeight: "700",
                        fontSize: "1.05rem",
                        cursor: "pointer",
                        marginBottom: 12,
                        marginTop: 4,
                        transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = "#48A6A7";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#006A71";
                    }}
                >
                    Đăng nhập bằng Google (chuyển trang)
                </button>

                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    style={{
                        width: "100%",
                        background: "#48A6A7",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.65rem",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transition: "background 0.3s",
                        marginBottom: 8,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#006A71")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#48A6A7")}
                >
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
                        alt="facebook"
                        width={22}
                        height={22}
                        style={{ borderRadius: "50%", backgroundColor: "#fff" }}
                    />
                    Đăng nhập với Facebook
                </button>

                <div
                    style={{
                        marginTop: 28,
                        fontSize: 14,
                        color: "#006A71",
                        textAlign: "center",
                    }}
                >
                    Chưa có tài khoản?{" "}
                    <a
                        href="/register"
                        style={{
                            color: "#48A6A7",
                            fontWeight: "600",
                            textDecoration: "none",
                            transition: "color 0.3s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#006A71")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#48A6A7")}
                    >
                        Đăng ký
                    </a>
                </div>
            </form>
        </div>
    );
}