import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import Footer from "../../components/Footer";

export default function Feedback() {
    // Redux state thay vì useAuth
    const { user, token } = useSelector((state) => state.account || {});

    // Local state như cũ
    const [feedbacks, setFeedbacks] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [starFilter, setStarFilter] = useState(0);

    // Thông báo từ API
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

    // Extract user info từ Redux user object
    const getUserInfo = () => {
        if (!user) return { fullName: "Ẩn danh" };

        const fullName = user.fullName ||
            user.name ||
            user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            "Ẩn danh";

        return { fullName };
    };

    const userInfo = getUserInfo();

    // Hàm hiển thị thông báo
    const showNotification = (message, type = "info") => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 4000);
    };

    // Lấy danh sách feedback từ API
    useEffect(() => {
        setLoading(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback")
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                Array.isArray(data) ? setFeedbacks(data.reverse()) : setFeedbacks([]);
            })
            .catch(() => {
                setFeedbacks([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Gửi feedback mới lên API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            showNotification("Vui lòng nhập nội dung góp ý!", "error");
            return;
        }

        if (hasSubmittedFeedback) {
            showNotification("Mỗi tài khoản được gửi feedback 1 lần", "warning");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    FeedbackContent: comment.trim(),
                    FeedbackRating: rating,
                    FullName: userInfo.fullName
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                // Kiểm tra nếu là lỗi đã gửi feedback
                if (errorText.includes("đã gửi feedback") || errorText.includes("already submitted") || res.status === 409) {
                    setHasSubmittedFeedback(true);
                    showNotification("Mỗi tài khoản được gửi feedback 1 lần", "warning");
                } else {
                    showNotification(`Gửi feedback thất bại: ${errorText}`, "error");
                }
                return;
            }

            const resultText = await res.text();

            if (resultText && !resultText.startsWith("{")) {
                setSuccess(true);
                setHasSubmittedFeedback(true);
                setComment("");
                setRating(5);
                showNotification("Cảm ơn bạn đã gửi feedback!", "success");
                setTimeout(() => setSuccess(false), 2500);

                setTimeout(() => {
                    fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback")
                        .then(res => res.ok ? res.json() : [])
                        .then(data => Array.isArray(data) ? setFeedbacks(data.reverse()) : setFeedbacks([]))
                        .catch(() => setFeedbacks([]));
                }, 1000);
                return;
            }

            const newFeedback = JSON.parse(resultText);
            setFeedbacks(prev => [newFeedback, ...prev]);
            setComment("");
            setRating(5);
            setSuccess(true);
            setHasSubmittedFeedback(true);
            showNotification("Cảm ơn bạn đã gửi feedback!", "success");
            setTimeout(() => setSuccess(false), 2500);

        } catch (err) {
            showNotification(`Gửi feedback thất bại: ${err?.message || err}`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    // Lọc feedback theo số sao (nếu chọn)
    const filteredFeedbacks = starFilter > 0
        ? feedbacks.filter(fb => fb.feedback_rating === starFilter)
        : feedbacks;

    // Lấy 3 phản hồi nổi bật nhất từ danh sách đã lọc
    const topFeedbacks = [...filteredFeedbacks]
        .sort((a, b) => b.feedback_rating - a.feedback_rating || new Date(b.feedback_date) - new Date(a.feedback_date));

    return (
        <>
            <style jsx>{`
                .feedback-container {
                    min-height: 100vh;
                    background: #FAFAF9;
                    padding: 3rem 1rem;
                    color: #006A71;
                    font-family: 'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif;
                }

                .feedback-card {
                    max-width: 540px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 20px;
                    padding: 2.2rem 1.5rem;
                    box-shadow: 0 6px 32px rgba(72,166,167,0.13);
                    border: 2px solid #9ACBD0;
                }

                .feedback-title {
                    text-align: center;
                    font-size: 2rem;
                    color: #006A71;
                    margin-bottom: 24px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    text-shadow: 0 2px 8px rgba(72,166,167,0.08);
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-label {
                    font-weight: 600;
                    color: #48A6A7;
                    display: block;
                    margin-bottom: 6px;
                }

                .form-textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 10px;
                    border: 1.5px solid #9ACBD0;
                    background: #E6F4F4;
                    color: #006A71;
                    font-size: 1.07rem;
                    resize: vertical;
                    outline: none;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }

                .form-textarea:focus {
                    border-color: #48A6A7;
                }

                .submit-button {
                    width: 100%;
                    background: linear-gradient(90deg, #48A6A7 60%, #006A71 100%);
                    color: #fff;
                    font-weight: 700;
                    border: none;
                    border-radius: 10px;
                    padding: 0.8rem;
                    font-size: 1.08rem;
                    cursor: pointer;
                    letter-spacing: 0.5px;
                    box-shadow: 0 2px 8px rgba(72,166,167,0.10);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .submit-button:hover:not(:disabled) {
                    background: #006A71;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(72,166,167,0.20);
                }

                .submit-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }

                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .success-message {
                    color: #27ae60;
                    text-align: center;
                    margin-top: 12px;
                    font-weight: 600;
                    padding: 10px;
                    background: #27ae6020;
                    border-radius: 8px;
                    border: 1px solid #27ae60;
                }

                .filter-container {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .filter-button {
                    background: #E6F4F4;
                    color: #006A71;
                    border: 1px solid #9ACBD0;
                    border-radius: 6px;
                    padding: 2px 10px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 15px;
                    transition: all 0.2s ease;
                }

                .filter-button.active {
                    background: #48A6A7;
                    color: #fff;
                }

                .filter-button:hover {
                    background: #48A6A7;
                    color: #fff;
                }

                .feedbacks-container {
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 6px;
                }

                .feedback-item {
                    background: #E6F4F4;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 14px;
                    border: 1.5px solid #9ACBD0;
                    color: #006A71;
                    box-shadow: 0 1px 6px rgba(154,203,208,0.10);
                    position: relative;
                    transition: transform 0.2s ease;
                }

                .feedback-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 3px 12px rgba(154,203,208,0.15);
                }

                .feedback-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 6px;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .user-avatar {
                    background: #48A6A7;
                    color: #fff;
                    font-weight: 700;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }

                .user-name {
                    font-weight: 600;
                    color: #006A71;
                }

                .feedback-date {
                    color: #48A6A7;
                    font-size: 13px;
                }

                .featured-badge {
                    color: #bfa917;
                    font-weight: 700;
                    font-size: 15px;
                    background: #fffbe8;
                    border-radius: 10px;
                    padding: 2px 10px;
                    box-shadow: 0 1px 4px #bfa91722;
                    border: 1px solid #f3d46e;
                }

                .feedback-content {
                    margin-top: 6px;
                    font-size: 1rem;
                    color: #006A71;
                    line-height: 1.5;
                }

                .loading-state {
                    color: #aaa;
                    text-align: center;
                    padding: 2rem;
                    font-style: italic;
                }

                .empty-state {
                    color: #aaa;
                    text-align: center;
                    padding: 2rem;
                    font-style: italic;
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 600;
                    font-size: 1rem;
                    z-index: 9999;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    border: 2px solid transparent;
                    animation: slideIn 0.3s ease-out;
                    max-width: 400px;
                    word-wrap: break-word;
                }

                .notification.success {
                    background: linear-gradient(90deg, #27ae60, #2ecc71);
                    border-color: #27ae60;
                }

                .notification.error {
                    background: linear-gradient(90deg, #e74c3c, #c0392b);
                    border-color: #e74c3c;
                }

                .notification.warning {
                    background: linear-gradient(90deg, #f39c12, #e67e22);
                    border-color: #f39c12;
                    color: #fff;
                }

                .notification.info {
                    background: linear-gradient(90deg, #3498db, #2980b9);
                    border-color: #3498db;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @media (max-width: 768px) {
                    .feedback-container {
                        padding: 2rem 0.5rem;
                    }
                    
                    .feedback-card {
                        padding: 1.5rem 1rem;
                    }
                    
                    .feedback-title {
                        font-size: 1.5rem;
                    }
                    
                    .filter-container {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .feedback-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>

            {/* Thông báo từ API */}
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="feedback-container">
                <div className="feedback-card">
                    <h2 className="feedback-title">💬 Đánh giá & Góp ý</h2>

                    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                        <div className="form-group">
                            <label className="form-label">Đánh giá website</label>
                            <div style={{ marginTop: 6 }}>
                                <Rating value={rating} onChange={setRating} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nội dung góp ý</label>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Viết đánh giá hoặc góp ý cho website..."
                                rows={3}
                                className="form-textarea"
                                disabled={submitting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={submitting || !comment.trim() || hasSubmittedFeedback}
                        >
                            {submitting ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Đang gửi...
                                </>
                            ) : hasSubmittedFeedback ? (
                                "Đã gửi feedback"
                            ) : (
                                "Gửi feedback"
                            )}
                        </button>

                        {success && (
                            <div className="success-message">
                                🎉 Cảm ơn bạn đã gửi feedback!
                            </div>
                        )}

                        {hasSubmittedFeedback && (
                            <div style={{
                                color: "#f39c12",
                                textAlign: "center",
                                marginTop: 12,
                                fontWeight: 600,
                                padding: "10px",
                                background: "#fff8e1",
                                borderRadius: 8,
                                border: "1px solid #f39c12",
                                fontSize: "0.95rem"
                            }}>
                                ⚠️ Mỗi tài khoản được gửi feedback 1 lần
                            </div>
                        )}
                    </form>

                    <h3 style={{ color: "#48A6A7", fontSize: "1.15rem", marginBottom: 16, fontWeight: 700 }}>
                        🌟 Phản hồi của người dùng
                    </h3>

                    {/* Bộ lọc số sao */}
                    <div className="filter-container">
                        <span>Lọc theo số sao:</span>
                        {[0, 5, 4, 3, 2, 1].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setStarFilter(star)}
                                className={`filter-button ${starFilter === star ? 'active' : ''}`}
                            >
                                {star === 0 ? "Tất cả" : `${star}★`}
                            </button>
                        ))}
                    </div>

                    <div className="feedbacks-container">
                        {loading && (
                            <div className="loading-state">
                                Đang tải feedback...
                            </div>
                        )}

                        {!loading && topFeedbacks.length === 0 && (
                            <div className="empty-state">
                                {starFilter > 0
                                    ? `Chưa có feedback ${starFilter} sao nào.`
                                    : "Chưa có feedback nào."
                                }
                            </div>
                        )}

                        {topFeedbacks.map((fb, idx) => (
                            <div key={fb.id || idx} className="feedback-item">
                                <div className="feedback-header">
                                    <div className="user-avatar">
                                        {(fb.fullName || "Ẩn danh")[0].toUpperCase()}
                                    </div>
                                    <span className="user-name">{fb.fullName || "Ẩn danh"}</span>
                                    <span className="feedback-date">
                                        {fb.feedback_date ? new Date(fb.feedback_date).toLocaleDateString("vi-VN") : ""}
                                    </span>
                                    {idx === 0 && (
                                        <span className="featured-badge">
                                            Nổi bật nhất
                                        </span>
                                    )}
                                </div>
                                <Rating value={fb.feedback_rating} readOnly size={20} />
                                <div className="feedback-content">{fb.feedback_content}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />

                {/* Debug Panel - Development Only */}
                {/*
                    <div style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: 15,
                        borderRadius: 8,
                        fontSize: 12,
                        fontFamily: "monospace",
                        zIndex: 9998,
                        maxWidth: 300
                    }}>
                        <div><strong>🔍 Feedback Debug:</strong></div>
                        <div>Token: {token ? "✅" : "❌"}</div>
                        <div>User: {user ? "✅" : "❌"}</div>
                        <div>FullName: {userInfo.fullName}</div>
                        <div>Feedbacks: {feedbacks.length}</div>
                        <div>Loading: {loading ? "⏳" : "✅"}</div>
                        <div>Submitting: {submitting ? "⏳" : "✅"}</div>
                        <div>Filter: {starFilter || "All"}</div>
                    </div>
                */}
            </div>
        </>
    );
}
