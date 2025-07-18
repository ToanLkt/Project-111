import React, { useState, useRef } from 'react';
import Ranking from '../member/Ranking';
import { useSelector } from "react-redux";

export default function AdminRanking() {
    const { token } = useSelector(state => state.account || {});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const rankingRef = useRef();

    const handleResetRank = async () => {
        if (!token) {
            setMessage("Bạn chưa đăng nhập!");
            setShowPopup(true);
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(
                "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Ranking/reset-rankings",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (res.ok) {
                setMessage("Đã reset bảng xếp hạng thành công!");
                setShowPopup(true);
                if (rankingRef.current && rankingRef.current.fetchRanking) {
                    rankingRef.current.fetchRanking();
                }
            } else {
                const err = await res.text();
                setMessage("Reset thất bại: " + err);
                setShowPopup(true);
            }
        } catch (error) {
            setMessage("Có lỗi xảy ra!");
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setMessage("");
    };

    return (
        <div>
            <button
                onClick={handleResetRank}
                disabled={loading}
                style={{
                    marginBottom: 20,
                    padding: "10px 24px",
                    background: "#006A71",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "1rem"
                }}
            >
                {loading ? "Đang reset..." : "Reset bảng xếp hạng"}
            </button>

            {/* Popup thông báo */}
            {showPopup && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <div style={{
                        background: "#fff",
                        padding: "32px 40px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        minWidth: "320px",
                        maxWidth: "90vw",
                        textAlign: "center",
                        position: "relative"
                    }}>
                        <button
                            onClick={closePopup}
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 18,
                                background: "none",
                                border: "none",
                                fontSize: "1.5rem",
                                color: "#888",
                                cursor: "pointer"
                            }}
                            aria-label="Đóng"
                        >
                            ×
                        </button>
                        <div style={{
                            fontSize: "1.15rem",
                            color: message.includes("thành công") ? "#2E7D32" : "#D32F2F",
                            fontWeight: 700,
                            marginBottom: 8
                        }}>
                            {message}
                        </div>
                    </div>
                </div>
            )}

            <Ranking ref={rankingRef} />
        </div>
    )
}
