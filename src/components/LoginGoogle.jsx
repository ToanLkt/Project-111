import React, { useEffect, useState } from 'react';

const CLIENT_ID = "689372299676-3tkvjrffjc9o1vta6678oq80lq4gu3ih.apps.googleusercontent.com";
const LINK_GET_TOKEN =
    `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://localhost:5173/logingoogle&client_id=${CLIENT_ID}`;

export default function LoginGoogle() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    // Lấy access_token từ URL sau khi Google redirect về
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes("access_token")) {
            const params = new URLSearchParams(hash.substring(1));
            const access_token = params.get("access_token");
            setToken(access_token); // Lưu token vào state để hiển thị
            if (access_token) {
                fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
                    .then(res => res.json())
                    .then(data => setUser(data));
            }
        }
    }, []);

    const handleGoogleLogin = () => {
        window.location.href = LINK_GET_TOKEN;
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(120deg, #F2EFE7 60%, #9ACBD0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif"
            }}
        >
            <div
                style={{
                    background: "#fff",
                    border: "1.5px solid #9ACBD0",
                    borderRadius: 18,
                    padding: "2.5rem 2rem",
                    boxShadow: "0 6px 24px rgba(72,166,167,0.10)",
                    maxWidth: 400,
                    width: "100%",
                    color: "#006A71",
                    textAlign: "center"
                }}
            >
                <img
                    src={user?.picture || "https://cdn-icons-png.flaticon.com/512/281/281764.png"}
                    alt="Google"
                    width={60}
                    style={{ marginBottom: 18, borderRadius: "50%" }}
                />
                <h2 style={{ fontWeight: 700, marginBottom: 18, color: "#006A71" }}>
                    Đăng nhập với Google
                </h2>
                {token && (
                    <div style={{
                        background: "#f6f6f6",
                        color: "#006A71",
                        fontSize: 13,
                        wordBreak: "break-all",
                        border: "1px solid #9ACBD0",
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 16,
                        textAlign: "left"
                    }}>
                        <b>Access Token:</b>
                        <div style={{ fontFamily: "monospace", marginTop: 4 }}>{token}</div>
                    </div>
                )}
                {user ? (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontWeight: 600, fontSize: 18 }}>{user.name}</div>
                        <div style={{ color: "#48A6A7", fontSize: 15 }}>{user.email}</div>
                        <div style={{ marginTop: 18, color: "#27ae60", fontWeight: 600 }}>
                            Đăng nhập Google thành công!
                        </div>
                    </div>
                ) : (
                    <p style={{ marginBottom: 24, color: "#48A6A7" }}>
                        Nhấn nút bên dưới để đăng nhập bằng Google.
                    </p>
                )}
                {!user && (
                    <button
                        id="sign-in-button"
                        onClick={handleGoogleLogin}
                        style={{
                            width: "100%",
                            background: "#48A6A7",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.8rem",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            marginBottom: 10,
                            boxShadow: "0 2px 8px rgba(72,166,167,0.08)",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.background = "#006A71"}
                        onMouseOut={e => e.currentTarget.style.background = "#48A6A7"}
                    >
                        Đăng nhập Google
                    </button>
                )}
                <div style={{ marginTop: 18 }}>
                    <a
                        href="/login"
                        style={{
                            color: "#006A71",
                            textDecoration: "underline",
                            fontWeight: 600,
                            fontSize: 15
                        }}
                    >
                        Quay lại trang đăng nhập
                    </a>
                </div>
            </div>
        </div>
    );
}