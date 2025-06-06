import React, { useState } from "react";
import Rating from "./Rating";
import Footer from "../../components/Footer";

const initialFeedbacks = [
    {
        name: "Bạch Nguyệt Quang",
        rating: 5,
        comment: "Website rất hữu ích, tôi đã tìm được Bạch Tấn Phú nhờ bỏ thuốc.",
        time: "2 ngày trước",
    },
    {
        name: "Hà Việt Thành",
        rating: 4,
        comment: "Mình rất thích chức năng cộng đồng, mọi người hỗ trợ nhau rất tốt.",
        time: "1 ngày trước",
    },
];

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) return;

        const newFeedback = {
            name,
            rating,
            comment,
            time: "Vừa xong",
        };

        setFeedbacks([newFeedback, ...feedbacks]);
        setName("");
        setRating(5);
        setComment("");
        setSuccess(true);

        setTimeout(() => setSuccess(false), 2500);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#000", padding: "3rem 1rem", color: "#fff" }}>
            <div
                style={{
                    maxWidth: 540,
                    margin: "0 auto",
                    background: "#111",
                    borderRadius: 20,
                    padding: "2rem",
                    boxShadow: "0 8px 30px rgba(212, 175, 55, 0.2)",
                }}
            >
                <h2 style={{ textAlign: "center", fontSize: "2rem", color: "#d4af37", marginBottom: 24 }}>
                    💬 Đánh giá & Góp ý
                </h2>

                <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, color: "#fff" }}>Tên của bạn</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên của bạn"
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: 8,
                                border: "1px solid #444",
                                background: "#222",
                                color: "#fff",
                                fontSize: "1rem",
                                marginTop: 6,
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, color: "#fff" }}>Đánh giá website</label>
                        <div style={{ marginTop: 6 }}>
                            <Rating value={rating} onChange={setRating} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 600, color: "#fff" }}>Nội dung góp ý</label>
                        <textarea
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Viết đánh giá hoặc góp ý cho website..."
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: 8,
                                border: "1px solid #444",
                                background: "#222",
                                color: "#fff",
                                fontSize: "1rem",
                                marginTop: 6,
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "linear-gradient(90deg, #d4af37, #a37f2d)",
                            color: "#000",
                            fontWeight: 700,
                            border: "none",
                            borderRadius: 8,
                            padding: "0.8rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                            letterSpacing: 0.5,
                        }}
                    >
                        Gửi feedback
                    </button>

                    {success && (
                        <div style={{ color: "#27ae60", textAlign: "center", marginTop: 12, fontWeight: 600 }}>
                            🎉 Cảm ơn bạn đã gửi feedback!
                        </div>
                    )}
                </form>

                <h3 style={{ color: "#d4af37", fontSize: "1.2rem", marginBottom: 16 }}>
                    🗣 Phản hồi từ người dùng
                </h3>

                <div style={{ maxHeight: 300, overflowY: "auto", paddingRight: 6 }}>
                    {feedbacks.length === 0 && (
                        <div style={{ color: "#aaa", textAlign: "center" }}>Chưa có feedback nào.</div>
                    )}
                    {feedbacks.map((fb, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: "#1a1a1a",
                                borderRadius: 12,
                                padding: "1rem",
                                marginBottom: 14,
                                border: "1px solid #333",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                                <span
                                    style={{
                                        background: "#d4af37",
                                        color: "#000",
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
                                    {fb.name[0].toUpperCase()}
                                </span>
                                <span style={{ fontWeight: 600 }}>{fb.name}</span>
                                <span style={{ color: "#888", fontSize: 13, marginLeft: 10 }}>{fb.time}</span>
                            </div>
                            <Rating value={fb.rating} readOnly size={20} />
                            <div style={{ marginTop: 6, fontSize: "1rem", color: "#ddd" }}>{fb.comment}</div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
