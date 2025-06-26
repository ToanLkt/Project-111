import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!token) {
            setError("Không tìm thấy mã xác nhận.");
            return;
        }
        if (password !== repassword) {
            setError("Mật khẩu nhập lại không khớp.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password })
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            setSuccess("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
            setTimeout(() => navigate("/login"), 1800);
        } catch (err) {
            setError("Không thể đặt lại mật khẩu: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(120deg, #F2EFE7 60%, #9ACBD0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}>
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
                <h2 style={{
                    textAlign: "center",
                    marginBottom: 24,
                    fontWeight: "700",
                    color: "#006A71",
                    letterSpacing: 1,
                }}>
                    Đặt lại mật khẩu
                </h2>
                {success && (
                    <div style={{
                        color: "#27ae60",
                        marginBottom: 16,
                        textAlign: "center",
                        fontWeight: "600",
                    }}>
                        {success}
                    </div>
                )}
                {error && (
                    <div style={{
                        color: "#e74c3c",
                        marginBottom: 16,
                        textAlign: "center",
                        fontWeight: "600",
                    }}>
                        {error}
                    </div>
                )}
                <label style={{ display: "block", marginBottom: 6, fontWeight: "600", color: "#006A71" }}>
                    Mật khẩu mới
                </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    style={{
                        width: "100%",
                        padding: "0.7rem",
                        borderRadius: 8,
                        border: "1.5px solid #9ACBD0",
                        marginBottom: 16,
                        fontSize: "1rem",
                        color: "#006A71",
                        outline: "none",
                        background: "#F2EFE7",
                        transition: "border-color 0.2s",
                    }}
                />
                <label style={{ display: "block", marginBottom: 6, fontWeight: "600", color: "#006A71" }}>
                    Nhập lại mật khẩu
                </label>
                <input
                    type="password"
                    required
                    value={repassword}
                    onChange={e => setRepassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
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
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginBottom: 10,
                        boxShadow: "0 2px 8px rgba(72,166,167,0.08)",
                        transition: "background 0.3s",
                    }}
                >
                    {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
            </form>
        </div>
    );
}