import React, { useState, useEffect } from "react";
import Rating from "./Rating";
import Footer from "../../components/Footer";
import { useAuth } from "../../AuthContext/AuthContext";

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [starFilter, setStarFilter] = useState(0); // Thêm state lọc số sao
    const { user, token } = useAuth();

    // Lấy danh sách feedback từ API
    useEffect(() => {
        setLoading(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback")
            .then(res => res.ok ? res.json() : [])
            .then(data => Array.isArray(data) ? setFeedbacks(data.reverse()) : setFeedbacks([]))
            .catch(() => setFeedbacks([]))
            .finally(() => setLoading(false));
    }, []);

    // Gửi feedback mới lên API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    comment,
                    rating,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            const newFeedback = await res.json();
            setFeedbacks(prev => [newFeedback, ...prev]);
            setComment("");
            setRating(5);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2500);
        } catch {
            alert("Gửi feedback thất bại!");
        }
    };

    // Lọc feedback theo số sao (nếu chọn)
    const filteredFeedbacks = starFilter > 0
        ? feedbacks.filter(fb => fb.feedback_rating === starFilter)
        : feedbacks;

    // Lấy 3 phản hồi nổi bật nhất từ danh sách đã lọc
    const topFeedbacks = [...filteredFeedbacks]
        .sort((a, b) => b.feedback_rating - a.feedback_rating || new Date(b.feedback_date) - new Date(a.feedback_date))
        .slice(0, 3);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#F2EFE7",
                padding: "3rem 1rem",
                color: "#006A71",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: 540,
                    margin: "0 auto",
                    background: "#fff",
                    borderRadius: 20,
                    padding: "2.2rem 1.5rem",
                    boxShadow: "0 6px 32px rgba(72,166,167,0.13)",
                    border: "2px solid #9ACBD0",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "2rem",
                        color: "#006A71",
                        marginBottom: 24,
                        fontWeight: 900,
                        letterSpacing: 1,
                        textShadow: "0 2px 8px rgba(72,166,167,0.08)",
                    }}
                >
                    💬 Đánh giá & Góp ý
                </h2>

                <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, color: "#48A6A7" }}>Đánh giá website</label>
                        <div style={{ marginTop: 6 }}>
                            <Rating value={rating} onChange={setRating} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, color: "#48A6A7" }}>Nội dung góp ý</label>
                        <textarea
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Viết đánh giá hoặc góp ý cho website..."
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: 10,
                                border: "1.5px solid #9ACBD0",
                                background: "#E6F4F4",
                                color: "#006A71",
                                fontSize: "1.07rem",
                                marginTop: 6,
                                resize: "vertical",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#48A6A7")}
                            onBlur={e => (e.target.style.borderColor = "#9ACBD0")}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            border: "none",
                            borderRadius: 10,
                            padding: "0.8rem",
                            fontSize: "1.08rem",
                            cursor: "pointer",
                            letterSpacing: 0.5,
                            boxShadow: "0 2px 8px rgba(72,166,167,0.10)",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "#006A71")}
                        onMouseOut={e => (e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)")}
                    >
                        Gửi feedback
                    </button>

                    {success && (
                        <div style={{ color: "#27ae60", textAlign: "center", marginTop: 12, fontWeight: 600 }}>
                            🎉 Cảm ơn bạn đã gửi feedback!
                        </div>
                    )}
                </form>

                <h3 style={{ color: "#48A6A7", fontSize: "1.15rem", marginBottom: 16, fontWeight: 700 }}>
                    🌟 Phản hồi của người dùng
                </h3>

                {/* Bộ lọc số sao */}
                <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                    <span>Lọc theo số sao:</span>
                    {[0, 5, 4, 3, 2, 1].map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setStarFilter(star)}
                            style={{
                                background: starFilter === star ? "#48A6A7" : "#E6F4F4",
                                color: starFilter === star ? "#fff" : "#006A71",
                                border: "1px solid #9ACBD0",
                                borderRadius: 6,
                                padding: "2px 10px",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: 15,
                            }}
                        >
                            {star === 0 ? "Tất cả" : `${star}★`}
                        </button>
                    ))}
                </div>

                <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 6 }}>
                    {loading && (
                        <div style={{ color: "#aaa", textAlign: "center" }}>Đang tải feedback...</div>
                    )}
                    {!loading && topFeedbacks.length === 0 && (
                        <div style={{ color: "#aaa", textAlign: "center" }}>Chưa có feedback nào.</div>
                    )}
                    {topFeedbacks.map((fb, idx) => (
                        <div
                            key={fb.id || idx}
                            style={{
                                background: "#E6F4F4",
                                borderRadius: 12,
                                padding: "1rem",
                                marginBottom: 14,
                                border: "1.5px solid #9ACBD0",
                                color: "#006A71",
                                boxShadow: "0 1px 6px rgba(154,203,208,0.10)",
                                position: "relative",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                                <span
                                    style={{
                                        background: "#48A6A7",
                                        color: "#fff",
                                        fontWeight: 700,
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 10,
                                        fontSize: 16,
                                    }}
                                >
                                    {(fb.fullName || "Ẩn danh")[0].toUpperCase()}
                                </span>
                                <span style={{ fontWeight: 600 }}>{fb.fullName || "Ẩn danh"}</span>
                                <span style={{ color: "#48A6A7", fontSize: 13, marginLeft: 10 }}>
                                    {fb.feedback_date ? new Date(fb.feedback_date).toLocaleDateString("vi-VN") : ""}
                                </span>
                                {idx === 0 && (
                                    <span style={{
                                        marginLeft: 10,
                                        color: "#bfa917",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        background: "#fffbe8",
                                        borderRadius: 10,
                                        padding: "2px 10px",
                                        boxShadow: "0 1px 4px #bfa91722",
                                    }}>
                                        Nổi bật nhất
                                    </span>
                                )}
                            </div>
                            <Rating value={fb.feedback_rating} readOnly size={20} />
                            <div style={{ marginTop: 6, fontSize: "1rem", color: "#006A71" }}>{fb.feedback_content}</div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
