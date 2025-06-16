import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const [form, setForm] = useState({
        cigarettesPerDay: "",
        quitDuration: "",
        costPerCigarette: "",
        cravingTime: "",
        smokingDuration: "",
        gender: "",
        birthday: "",
        reason: "",
        medicalHistory: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/plan");
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
                    Hành trình cai thuốc lá là một quá trình đầy thử thách nhưng hoàn toàn có thể thành công nếu bạn quyết tâm và có sự chuẩn bị kỹ lưỡng. Hãy bắt đầu bằng việc tìm hiểu các thông tin quan trọng dưới đây!
                </p>

                <a
                    href="/roadmap"
                    style={{
                        display: "inline-block",
                        background: `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`,
                        color: COLORS.white,
                        fontWeight: 700,
                        fontSize: "1.13rem",
                        border: "none",
                        borderRadius: 10,
                        padding: "0.9rem 2.2rem",
                        textDecoration: "none",
                        boxShadow: "0 2px 10px rgba(72,166,167,0.13)",
                        transition: "background 0.3s",
                        letterSpacing: 0.5,
                        cursor: "pointer",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = COLORS.accent)}
                    onMouseOut={e => (e.currentTarget.style.background = `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`)}
                >
                    Xem lộ trình chi tiết
                </a>

                {/* Form Fields */}
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

                    {[
                        { label: "Số điếu bạn hút 1 ngày", name: "cigarettesPerDay", type: "number", placeholder: "? điếu", min: 1, max: 100 },
                        { label: "Chi phí (VND/1 điếu)", name: "costPerCigarette", type: "number", placeholder: "? VND", min: 100, max: 100000 },
                        { label: "Thời gian thèm nhất trong ngày", name: "cravingTime", type: "text", placeholder: "Sáng, trưa, tối..." },
                        { label: "Thời gian bạn đã hút thuốc", name: "smokingDuration", type: "text", placeholder: "3 năm, 5 năm..." },
                    ].map((item) => (
                        <div style={{ marginBottom: 20 }} key={item.name}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                                {item.label}
                            </label>
                            <input
                                type={item.type}
                                name={item.name}
                                value={form[item.name]}
                                onChange={handleChange}
                                placeholder={item.placeholder}
                                min={item.min}
                                max={item.max}
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
                    ))}

                    {/* Thời gian muốn cai */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                            Bạn muốn cai thuốc lá trong bao lâu
                        </label>
                        <select
                            name="quitDuration"
                            value={form.quitDuration}
                            onChange={handleChange}
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
                            }}
                        >
                            <option value="">Chọn thời gian</option>
                            <option value="1 tuần">1 tuần</option>
                            <option value="2 tuần">2 tuần</option>
                            <option value="1 tháng">1 tháng</option>
                            <option value="3 tháng">3 tháng</option>
                            <option value="6 tháng">6 tháng</option>
                            <option value="1 năm">1 năm</option>
                        </select>
                    </div>

                    {/* Giới tính */}
                    <div style={{ margin: "18px 0" }}>
                        <label style={{ color: "#006A71", fontWeight: 600, marginBottom: 8, display: "block" }}>
                            Giới tính
                        </label>
                        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                            <label style={{ color: "#006A71", fontWeight: 500 }}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={form.gender === "male"}
                                    onChange={handleChange}
                                    required
                                    style={{ marginRight: 6, accentColor: "#2d98da" }}
                                />
                                Nam
                            </label>
                            <label style={{ color: "#006A71", fontWeight: 500 }}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={form.gender === "female"}
                                    onChange={handleChange}
                                    required
                                    style={{ marginRight: 6, accentColor: "#2d98da" }}
                                />
                                Nữ
                            </label>
                        </div>
                    </div>

                    {/* Ngày sinh */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: 6, color: "#d4af37" }}>
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            value={form.birthday}
                            onChange={handleChange}
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
                            }}
                        />
                    </div>

                    {/* Lý do cai thuốc */}
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

                    {/* Tiền sử bệnh */}
                    <div style={{ marginBottom: 28 }}>
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

                    {/* Submit button */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "0.9rem",
                            background: "linear-gradient(90deg, #2d98da 60%, #3867d6 100%)",
                            border: "none",
                            borderRadius: 10,
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            letterSpacing: 1,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(44,130,201,0.10)",
                            transition: "all 0.2s ease",
                        }}
                    >
                        Gửi thông tin
                    </button>
                </form>
            </div>
        </section>
    );
}
