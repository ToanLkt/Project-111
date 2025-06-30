import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";

export default function StartInformation() {
    // Bảng màu chủ đề
    const COLORS = {
        background: "#F2EFE7",
        primary: "#9ACBD0",
        secondary: "#48A6A7",
        accent: "#006A71",
        text: "#006A71",
        white: "#fff",
        light: "#E6F4F4",
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
                goalTime: Number(form.goalTime),
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
                    maxWidth: 700,
                    width: "100%",
                    background: COLORS.white,
                    borderRadius: 22,
                    boxShadow: "0 8px 32px rgba(72,166,167,0.13)",
                    padding: "2.5rem 2rem",
                    border: `2px solid ${COLORS.primary}`,
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        color: COLORS.accent,
                        fontWeight: 900,
                        fontSize: "2.2rem",
                        marginBottom: 24,
                        letterSpacing: 1,
                        textShadow: "0 2px 8px #9ACBD033",
                        userSelect: "none",
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
                    }}
                >
                    Hành trình cai thuốc lá là một quá trình đầy thử thách nhưng hoàn toàn có thể thành công nếu bạn quyết tâm và có sự chuẩn bị kỹ lưỡng. Hãy bắt đầu bằng việc cung cấp các thông tin quan trọng dưới đây!
                </p>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        marginTop: "2rem",
                        width: "100%",
                        borderTop: `2px solid ${COLORS.primary}`,
                        paddingTop: "1.5rem",
                    }}
                >
                    {submitted && (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: 18,
                                color: "#27ae60",
                                fontWeight: 600,
                                fontSize: "1.08rem",
                            }}
                        >
                            Cảm ơn bạn đã cung cấp thông tin!
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

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                            Số điếu bạn hút 1 ngày
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
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
                                outline: "none",
                                boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                            Thời gian hút thuốc (năm)
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
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
                                outline: "none",
                                boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                            Thời gian muốn cai thuốc lá (ngày)
                        </label>
                        <input
                            type="number"
                            name="goalTime"
                            value={form.goalTime}
                            onChange={handleChange}
                            placeholder="Ví dụ: 30"
                            min={1}
                            max={365}
                            required
                            style={{
                                width: "100%",
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
                                outline: "none",
                                boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
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
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
                                resize: "vertical",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                            Chi phí (VND/1 điếu)
                        </label>
                        <input
                            type="number"
                            name="costPerCigarette"
                            value={form.costPerCigarette}
                            onChange={handleChange}
                            placeholder="? VND"
                            min={100}
                            max={100000}
                            required
                            style={{
                                width: "100%",
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
                                outline: "none",
                                boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
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
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
                                resize: "vertical",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
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
                                padding: "0.65rem",
                                borderRadius: 10,
                                border: "1.5px solid #2d98da",
                                fontSize: "1rem",
                                backgroundColor: "#222e3a",
                                color: "#fff",
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
                            padding: "0.9rem",
                            background: loading
                                ? "#b2bec3"
                                : "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                            border: "none",
                            borderRadius: 10,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1.1rem",
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
