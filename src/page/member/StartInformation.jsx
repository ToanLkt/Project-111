import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";

export default function StartInformation() {
    // Bảng màu chủ đề
    const COLORS = {
        background: "linear-gradient(120deg, #F2EFE7 60%, #9ACBD0 100%)",
        primary: "#9ACBD0",
        secondary: "#48A6A7",
        accent: "#006A71",
        text: "#006A71",
        white: "#fff",
        light: "#E6F4F4",
        gold: "#FFD700",
        dark: "#23235a"
    };

    const { token } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        cigarettesPerDay: "",
        smokingTime: "",
        goalTime: "",
        reason: "",
        costPerCigarette: "",
        medicalHistory: "",
        mostSmokingTime: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError(null);
        try {
            const body = {
                cigarettesPerDay: Number(form.cigarettesPerDay),
                smokingTime: form.smokingTime,
                goalTime: form.goalTime,
                reason: form.reason,
                costPerCigarette: Number(form.costPerCigarette),
                medicalHistory: form.medicalHistory,
                mostSmokingTime: form.mostSmokingTime
            };
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                let errMsg = "Gửi thông tin thất bại";
                let dataText = await res.text();
                let data;
                try {
                    data = JSON.parse(dataText);
                } catch {
                    data = dataText;
                }
                if (data && typeof data === "object" && data.errors) {
                    errMsg = Object.values(data.errors).flat().join("\n");
                } else if (data && typeof data === "object" && data.message) {
                    errMsg = data.message;
                } else if (typeof data === "string") {
                    errMsg = data;
                }
                setApiError(errMsg);
                setLoading(false);
                return;
            }
            setSubmitted(true);
            // Lưu flag đã gửi thông tin cho user hiện tại
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const accountId = user?.accountId ?? user?.id ?? null;
                if (accountId) {
                    localStorage.setItem(`info_submitted_${accountId}`, "true");
                    // Lưu thời điểm bắt đầu cai thuốc
                    localStorage.setItem(`quit_start_${accountId}`, new Date().toISOString());
                }
            } catch { }
            setTimeout(() => navigate("/plan"), 1200);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            style={{
                minHeight: "100vh",
                background: COLORS.background,
                padding: "3rem 0",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                color: COLORS.text,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    maxWidth: 600,
                    width: "100%",
                    background: COLORS.white,
                    borderRadius: 28,
                    boxShadow: "0 8px 32px rgba(72,166,167,0.18)",
                    padding: "2.8rem 2.2rem",
                    border: `2.5px solid ${COLORS.primary}`,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Decorative top circle */}
                <div style={{
                    position: "absolute",
                    top: -60,
                    left: -60,
                    width: 120,
                    height: 120,
                    background: COLORS.primary,
                    borderRadius: "50%",
                    opacity: 0.18,
                    zIndex: 0
                }} />
                {/* Decorative bottom circle */}
                <div style={{
                    position: "absolute",
                    bottom: -70,
                    right: -70,
                    width: 140,
                    height: 140,
                    background: COLORS.secondary,
                    borderRadius: "50%",
                    opacity: 0.13,
                    zIndex: 0
                }} />

                <h2
                    style={{
                        color: COLORS.accent,
                        fontWeight: 900,
                        fontSize: "2.3rem",
                        marginBottom: 18,
                        letterSpacing: 1,
                        textShadow: "0 2px 8px #9ACBD033",
                        userSelect: "none",
                        zIndex: 1
                    }}
                >
                    🚀 Bắt đầu hành trình cai thuốc lá
                </h2>
                <p
                    style={{
                        color: COLORS.secondary,
                        fontSize: "1.18rem",
                        marginBottom: 24,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        zIndex: 1
                    }}
                >
                    Hãy cung cấp các thông tin quan trọng dưới đây để cá nhân hóa lộ trình hỗ trợ bạn cai thuốc lá hiệu quả!
                </p>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        marginTop: "2rem",
                        width: "100%",
                        borderTop: `2px solid ${COLORS.primary}`,
                        paddingTop: "1.5rem",
                        zIndex: 1
                    }}
                >
                    {submitted && (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: 18,
                                color: "#27ae60",
                                fontWeight: 700,
                                fontSize: "1.13rem",
                                letterSpacing: 0.5,
                                background: "#eafaf1",
                                borderRadius: 8,
                                padding: "12px 0"
                            }}
                        >
                            🎉 Cảm ơn bạn đã cung cấp thông tin!
                        </div>
                    )}

                    {apiError && (
                        <div style={{
                            color: "#e74c3c",
                            background: "#fff6f6",
                            border: "1.5px solid #e74c3c",
                            borderRadius: 8,
                            padding: "10px 18px",
                            marginBottom: 18,
                            textAlign: "left",
                            whiteSpace: "pre-line"
                        }}>
                            {apiError}
                        </div>
                    )}

                    <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                                Số điếu hút/ngày
                            </label>
                            <input
                                type="number"
                                name="cigarettesPerDay"
                                value={form.cigarettesPerDay}
                                onChange={handleChange}
                                placeholder="? điếu"
                                min={1}
                                max={100}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    borderRadius: 10,
                                    border: "1.5px solid #2d98da",
                                    fontSize: "1rem",
                                    backgroundColor: "#f8fafc",
                                    color: COLORS.text,
                                    outline: "none",
                                    boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                                Thời gian hút (năm)
                            </label>
                            <input
                                type="text"
                                name="smokingTime"
                                value={form.smokingTime}
                                onChange={handleChange}
                                placeholder="3 năm, 5 năm..."
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    borderRadius: 10,
                                    border: "1.5px solid #2d98da",
                                    fontSize: "1rem",
                                    backgroundColor: "#f8fafc",
                                    color: COLORS.text,
                                    outline: "none",
                                    boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                                Thời gian muốn cai (ngày)
                            </label>
                            <select
                                name="goalTime"
                                value={form.goalTime}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    borderRadius: 10,
                                    border: "1.5px solid #2d98da",
                                    fontSize: "1rem",
                                    backgroundColor: "#f8fafc",
                                    color: COLORS.text,
                                    outline: "none",
                                    boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                                }}
                            >
                                <option value="">Chọn thời gian</option>
                                <option value={180}>3-6 tháng (~180 ngày)</option>
                                <option value={270}>6-9 tháng (~270 ngày)</option>
                                <option value={360}>9-12 tháng (~360 ngày)</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                                Chi phí (VND/điếu)
                            </label>
                            <select
                                type="number"
                                name="costPerCigarette"
                                value={form.costPerCigarette}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    borderRadius: 10,
                                    border: "1.5px solid #2d98da",
                                    fontSize: "1rem",
                                    backgroundColor: "#f8fafc",
                                    color: COLORS.text,
                                    outline: "none",
                                    boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                                }}
                            >
                                <option value="">Chọn chi phí</option>
                                <option value={10000}>Khoảng 10.000 VND</option>
                                <option value={20000}>Khoảng 20.000 VND</option>
                                <option value={30000}>Khoảng 30.000 VND</option>
                            </select>


                        </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                            Lý do bạn muốn cai thuốc lá
                        </label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Chia sẻ lý do của bạn..."
                            rows={3}
                            required
                            style={{
                                width: "100%",
                                padding: "0.7rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#f8fafc",
                                color: COLORS.text,
                                resize: "vertical",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                            Tiền sử bệnh án (nếu có)
                        </label>
                        <textarea
                            name="medicalHistory"
                            value={form.medicalHistory}
                            onChange={handleChange}
                            placeholder="Nhập nếu có..."
                            rows={2}
                            style={{
                                width: "100%",
                                padding: "0.7rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#f8fafc",
                                color: COLORS.text,
                                resize: "vertical",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.gold }}>
                            Thời điểm bạn thèm thuốc nhất trong ngày
                        </label>
                        <input
                            type="text"
                            name="mostSmokingTime"
                            value={form.mostSmokingTime}
                            onChange={handleChange}
                            placeholder="Sáng, trưa, tối..."
                            required
                            style={{
                                width: "100%",
                                padding: "0.7rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#f8fafc",
                                color: COLORS.text,
                                outline: "none",
                                boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "1rem",
                            background: loading
                                ? "#b2bec3"
                                : "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                            border: "none",
                            borderRadius: 12,
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: "1.15rem",
                            letterSpacing: 1,
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 8px rgba(44,130,201,0.10)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {loading ? "Đang gửi..." : "Gửi thông tin"}
                    </button>
                </form>
            </div>
        </section>
    );
}
