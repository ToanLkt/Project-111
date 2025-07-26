import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../redux/login/loginSlice";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { user = null, token, loading, error } = useSelector((state) => state.account || {});

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccess("");
        setShowToast(false);

        if (!email || !password) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu");
            setShowToast(true);
            return;
        }

        console.log("🚀 Login attempt with:", { email, password: "***" });
        console.log("🔍 Current Redux state:", { user: !!user, token: !!token, loading, error });

        dispatch(fetchLogin({ email, password }));
    };

    // Handle Redux error
    useEffect(() => {
        if (error) {
            setSuccess(""); // Clear success
            setErrorMessage("Đăng nhập thất bại");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    }, [error]);

    // Handle successful login
    useEffect(() => {
        if (user && token && !loading && !error) {
            setErrorMessage(""); // Clear error
            setSuccess("Đăng nhập thành công");
            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
                // Redirect sau delay
                const userRole = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    user.role ||
                    null;
                switch (userRole?.toString().trim()) {
                    case "Admin":
                        navigate("/admin", { replace: true });
                        break;
                    case "Coach":
                        navigate("/coachpage", { replace: true });
                        break;
                    case "Member":
                        navigate("/", { replace: true });
                        break;
                    default:
                        navigate("/", { replace: true });
                }
            }, 1000);
        }
    }, [user, token, loading, error, navigate]);

    // Check if already logged in on mount
    useEffect(() => {
        try {
            if (user && token && !loading) {
                const userRole = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    user.role ||
                    null;

                console.log("🔍 User already logged in on mount, redirecting...", { userRole, user });

                switch (userRole?.toString().trim()) {
                    case "Admin":
                        navigate("/admin", { replace: true });
                        break;
                    case "Coach":
                        navigate("/coachpage", { replace: true });
                        break;
                    case "Member":
                        navigate("/", { replace: true });
                        break;
                    default:
                        navigate("/", { replace: true });
                }
            }
        } catch (err) {
            console.error("Error checking login status:", err);
        }
    }, []); // Run only on mount

    const handleFacebookLogin = () => {
        alert("Chức năng đăng nhập Facebook chưa được hỗ trợ.");
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        navigate("/forgot-password");
    };

    const handleRegister = (e) => {
        e.preventDefault();
        navigate("/register");
    };

    useEffect(() => {
        if (token && user) {
            login(token, user); // <-- Đảm bảo dòng này được gọi
        }
    }, [token, user, login]);

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
                    {success || errorMessage}
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

                {/* Hiển thị error từ Redux */}
                {errorMessage && (
                    <div
                        style={{
                            color: "#e74c3c",
                            marginBottom: 16,
                            textAlign: "center",
                            fontWeight: "600",
                            padding: "10px",
                            background: "#ffe6e6",
                            borderRadius: 8,
                            border: "1px solid #ffcdd2"
                        }}
                    >
                        {errorMessage}
                    </div>
                )}

                {/* Hiển thị success */}
                {success && (
                    <div
                        style={{
                            color: "#27ae60",
                            marginBottom: 16,
                            textAlign: "center",
                            fontWeight: "600",
                            padding: "10px",
                            background: "#e8f5e8",
                            borderRadius: 8,
                            border: "1px solid #c8e6c9"
                        }}
                    >
                        {success}
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
                    <Link
                        to="/forgot-password"
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
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: loading ? "#ccc" : "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "background 0.3s",
                        marginBottom: 10,
                        boxShadow: "0 2px 8px rgba(72,166,167,0.08)",
                    }}
                    onMouseOver={(e) => !loading && (e.currentTarget.style.background = "#006A71")}
                    onMouseOut={(e) => !loading && (e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)")}
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
                    <Link
                        to="/register"
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
                    </Link>
                </div>
            </form>
        </div>
    );
}