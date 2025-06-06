import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const demoAccounts = [
    { email: "admin@gmail.com", password: "admin123", role: "admin" },
    { email: "member@gmail.com", password: "member123", role: "member" },
];

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const found = demoAccounts.find(
            (acc) => acc.email === email && acc.password === password
        );
        if (found) {
            login(found.role, found.email);
            setSuccess("Đăng nhập thành công!");
            setError("");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                if (found.role === "admin") navigate("/admin");
                else navigate("/");
            }, 1200);
        } else {
            setError("Email hoặc mật khẩu không đúng!");
            setSuccess("");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1500);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href =
            "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.google.com%2F&ec=futura_exp_og_so_72776762_e&hl=vi&ifkv=AdBytiPDDUDuhc3aUIIzRrV7C8e9PgpgAWB6DVfyE6-zUhHOgySrIIYAI010MGrgvQA_wYeVeKMM&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1372533706%3A1748515862076999";
    };

    const handleFacebookLogin = () => {
        window.location.href = "https://www.facebook.com/login.php";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                fontFamily:
                    "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 10,
                    padding: "2.5rem 2rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    maxWidth: 380,
                    width: "100%",
                    color: "#222",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: 24,
                        fontWeight: "700",
                        color: "#000",
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
                            color: "#d32f2f",
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
                        color: "#000",
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
                        borderRadius: 6,
                        border: "1px solid #888",
                        marginBottom: 20,
                        fontSize: "1rem",
                        color: "#222",
                        outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#000")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#888")}
                />

                <label
                    htmlFor="password"
                    style={{
                        display: "block",
                        marginBottom: 6,
                        fontWeight: "600",
                        color: "#000",
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
                            borderRadius: 6,
                            border: "1px solid #888",
                            fontSize: "1rem",
                            color: "#222",
                            outline: "none",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#000")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#888")}
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
                            color: "#555",
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
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: "600",
                            transition: "color 0.3s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#555")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#000")}
                    >
                        Quên mật khẩu?
                    </a>
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.75rem",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
                >
                    Đăng nhập
                </button>

                <div
                    style={{
                        textAlign: "center",
                        margin: "20px 0 16px",
                        color: "#666",
                        fontWeight: "500",
                    }}
                >
                    hoặc
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    style={{
                        width: "100%",
                        backgroundColor: "#fff",
                        color: "#000",
                        border: "1px solid #000",
                        borderRadius: 6,
                        padding: "0.65rem",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#000";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.color = "#000";
                    }}
                >
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                        alt="google"
                        width={22}
                        height={22}
                        style={{ borderRadius: "50%" }}
                    />
                    Đăng nhập với Google
                </button>

                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    style={{
                        width: "100%",
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.65rem",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
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
                        color: "#444",
                        textAlign: "center",
                    }}
                >
                    Chưa có tài khoản?{" "}
                    <a
                        href="/register"
                        style={{
                            color: "#000",
                            fontWeight: "600",
                            textDecoration: "none",
                            transition: "color 0.3s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#555")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#000")}
                    >
                        Đăng ký
                    </a>
                </div>

                <div
                    style={{
                        marginTop: 24,
                        color: "#888",
                        fontSize: 13,
                        userSelect: "none",
                        lineHeight: 1.4,
                    }}
                >
                    <div>
                        <b>Tài khoản mẫu:</b>
                    </div>
                    <div>Admin: admin@gmail.com / admin123</div>
                    <div>Member: member@gmail.com / member123</div>
                </div>
            </form>
        </div>
    );
}
