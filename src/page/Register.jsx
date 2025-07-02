import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [sex, setSex] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Palette
    const colorBg = "#F2EFE7";
    const color1 = "#9ACBD0";
    const color2 = "#48A6A7";
    const color3 = "#006A71";
    const colorWhite = "#FFFFFF";

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
                    sex // boolean true/false
                })
            });
            let apiMsg = "";
            try {
                const apiJson = await res.json();
                if (apiJson.errors) {
                    apiMsg = Object.entries(apiJson.errors)
                        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
                        .join("\n");
                } else if (apiJson.message) {
                    apiMsg = apiJson.message;
                } else {
                    apiMsg = JSON.stringify(apiJson);
                }
            } catch {
                apiMsg = "Không đọc được phản hồi từ máy chủ.";
            }
            if (!res.ok) {
                setError("Đăng ký thất bại:\n" + apiMsg);
                setLoading(false);
                return;
            }
            setError("Đăng ký thành công!\n" + apiMsg);
            setLoading(false);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError("Đăng ký thất bại: " + err.message);
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: `linear-gradient(180deg, ${colorBg} 0%, ${color1} 40%, ${color2} 80%, ${color3} 100%)`,
                color: color3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                padding: "1rem",
                position: "relative",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: colorWhite,
                    padding: "2.5rem 2rem",
                    borderRadius: 16,
                    boxShadow: "0 4px 24px #48A6A733",
                    width: "100%",
                    maxWidth: 420,
                    zIndex: 1,
                    border: `2px solid ${color1}`,
                }}
            >
                <h2 style={{
                    color: color2,
                    textAlign: "center",
                    marginBottom: 28,
                    fontWeight: 700,
                    letterSpacing: 1
                }}>
                    Tạo tài khoản
                </h2>

                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Họ và tên</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nhập họ và tên"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    />
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Nhập email"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    />
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Số điện thoại</label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    />
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Ngày sinh</label>
                    <input
                        type="date"
                        required
                        value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                        placeholder="Ngày sinh"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    />
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Giới tính</label>
                    <select
                        required
                        value={sex}
                        onChange={e => setSex(e.target.value === 'true')}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    >
                        <option value={true}>Nam</option>
                        <option value={false}>Nữ</option>
                    </select>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Mật khẩu</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    />
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontWeight: 500, color: color3 }}>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        required
                        value={repassword}
                        onChange={e => setRepassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: 8,
                            border: `1.5px solid ${color1}`,
                            marginTop: 6,
                            fontSize: "1rem",
                            background: colorBg,
                            color: color3,
                            outline: "none",
                        }}
                    />
                </div>

                {error && (
                    <div style={{ color: "#d9534f", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: `linear-gradient(90deg, ${color2} 0%, ${color1} 100%)`,
                        color: colorWhite,
                        border: "none",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginTop: 8,
                        transition: "background 0.3s ease",
                    }}
                >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>

                <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.95rem" }}>
                    Đã có tài khoản?{" "}
                    <a href="/login" style={{ color: color2, fontWeight: 500, textDecoration: "none" }}>
                        Đăng nhập
                    </a>
                </div>
            </form>
        </div>
    );
}
