import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [sex, setSex] = useState("true");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== repassword) {
            setError("Mật khẩu nhập lại không khớp.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    fullName: name,
                    phoneNumber: phone,
                    birthday,
                    sex: sex === "true" || sex === true
                })
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            // Đăng ký thành công
            navigate("/login");
        } catch (err) {
            setError("Đăng ký thất bại: " + err.message);
        }
        setLoading(false);
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

                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Họ và tên</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nhập họ và tên"
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
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Nhập email"
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
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Số điện thoại</label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
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
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Ngày sinh</label>
                    <input
                        type="date"
                        required
                        value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                        placeholder="Ngày sinh"
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
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Giới tính</label>
                    <select
                        required
                        value={sex}
                        onChange={e => setSex(e.target.value)}
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
                    >
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                    </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Mật khẩu</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
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
                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 500, color: "#f1f2f6" }}>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        required
                        value={repassword}
                        onChange={e => setRepassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
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

                {error && (
                    <div style={{ color: "#ff7675", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "linear-gradient(90deg, #d4af37 0%, #bfa233 100%)",
                        color: "#000",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.75rem",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginTop: 8
                    }}
                >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
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
