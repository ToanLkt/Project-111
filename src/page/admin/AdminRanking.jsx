import React, { useState, useRef } from 'react';
import Ranking from '../member/Ranking';
import { useSelector } from "react-redux";

export default function AdminRanking() {
    const { token } = useSelector(state => state.account || {});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // Thêm state xác nhận
    const rankingRef = useRef();

    // Hàm thực hiện reset
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
                onClick={() => setShowConfirm(true)}
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

            {/* Popup xác nhận */}
            {showConfirm && (
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
                        <div style={{
                            fontSize: "1.15rem",
                            color: "#D32F2F",
                            fontWeight: 700,
                            marginBottom: 16
                        }}>
                            Bạn có chắc muốn reset bảng xếp hạng không?
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    handleResetRank();
                                }}
                                style={{
                                    padding: "8px 24px",
                                    background: "#006A71",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                    cursor: "pointer"
                                }}
                            >
                                Đồng ý
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{
                                    padding: "8px 24px",
                                    background: "#eee",
                                    color: "#333",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                    cursor: "pointer"
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
