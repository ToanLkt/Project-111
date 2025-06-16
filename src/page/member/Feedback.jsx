import React, { useState } from "react";
import Rating from "./Rating";
import Footer from "../../components/Footer";
import { useAuth } from "../../AuthContext/AuthContext";

const sampleFeedbacks = [
    {
        name: "Nguyễn Văn A",
        comment: "Trang web rất hữu ích, mình đã cai thuốc thành công nhờ các tài liệu và sự hỗ trợ từ cộng đồng!",
        time: "16/06/2025",
        rating: 5,
    },
    {
        name: "Trần Thị B",
        comment: "Giao diện thân thiện, dễ sử dụng. Mình rất thích tính năng theo dõi tiến trình.",
        time: "15/06/2025",
        rating: 4,
    },
    {
        name: "Lê Văn C",
        comment: "Cảm ơn đội ngũ phát triển đã tạo ra một nền tảng ý nghĩa cho cộng đồng.",
        time: "14/06/2025",
        rating: 5,
    },
];

export default function feedback() {
    const [feedbacks, setFeedbacks] = useState(sampleFeedbacks);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        const today = new Date();
        const newFeedback = {
            name: user?.fullName || "Ẩn danh",
            comment,
            time: today.toLocaleDateString("vi-VN"),
            rating,
        };
        setFeedbacks(prev => [newFeedback, ...prev].slice(0, 3));
        setComment("");
        setRating(5);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
    };

    // Lấy 3 phản hồi nổi bật nhất (rating cao nhất, nếu bằng nhau thì lấy mới nhất)
    const topFeedbacks = [...feedbacks]
        .sort((a, b) => b.rating - a.rating || new Date(b.time) - new Date(a.time))
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
                    🌟 3 Phản hồi nổi bật nhất
                </h3>

                <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 6 }}>
                    {topFeedbacks.length === 0 && (
                        <div style={{ color: "#aaa", textAlign: "center" }}>Chưa có feedback nào.</div>
                    )}
                    {topFeedbacks.map((fb, idx) => (
                        <div
                            key={idx}
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
                                    {fb.name ? fb.name[0].toUpperCase() : "?"}
                                </span>
                                <span style={{ fontWeight: 600 }}>{fb.name}</span>
                                <span style={{ color: "#48A6A7", fontSize: 13, marginLeft: 10 }}>{fb.time || ""}</span>
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
                            <Rating value={fb.rating} readOnly size={20} />
                            <div style={{ marginTop: 6, fontSize: "1rem", color: "#006A71" }}>{fb.comment}</div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
