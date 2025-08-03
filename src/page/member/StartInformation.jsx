import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTodayCigarettesRequest } from "../../redux/member/plan/planSlice";

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

    // Redux state thay vì AuthContext
    const { user, token } = useSelector((state) => {
        console.log('🔍 StartInformation Redux state:', state.account);
        return state.account || {};
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Extract user info từ Redux user object
    const getUserId = () => {
        if (!user) return null;
        return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            user.userId ||
            user.id ||
            null;
    };

    const accountId = getUserId();

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
    const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
    const [apiResult, setApiResult] = useState(null);

    // State cho custom input khi chọn "Khác"
    const [customReason, setCustomReason] = useState("");
    const [customMedicalHistory, setCustomMedicalHistory] = useState("");
    const [showCustomReason, setShowCustomReason] = useState(false);
    const [showCustomMedical, setShowCustomMedical] = useState(false);

    // Danh sách lý do cai thuốc phổ biến
    const reasonOptions = [
        "Vì sức khỏe của bản thân",
        "Vì gia đình và người thân",
        "Tiết kiệm chi phí",
        "Cải thiện ngoại hình (răng, da, mùi cơ thể)",
        "Tăng cường thể lực và sức bền",
        "Giảm nguy cơ ung thư và bệnh tim",
        "Tạo hình ảnh tốt trong công việc",
        "Vì con cái và thế hệ tương lai",
        "Khác"
    ];

    // Danh sách tiền sử bệnh án phổ biến
    const medicalOptions = [
        "Không có tiền sử bệnh án đặc biệt",
        "Bệnh tim mạch",
        "Bệnh phổi, hen suyễn",
        "Cao huyết áp",
        "Tiểu đường",
        "Bệnh dạ dày",
        "Stress, lo âu, trầm cảm",
        "Bệnh về xương khớp",
        "Khác"
    ];

    // Thời điểm thèm thuốc trong ngày
    const smokingTimeOptions = [
        "Sáng sớm (khi thức dậy)",
        "Buổi sáng (8-11h)",
        "Buổi trưa (12-14h)",
        "Chiều tối (15-18h)",
        "Tối muộn (19-22h)",
        "Đêm khuya (sau 22h)",
        "Khi căng thẳng/stress",
        "Sau bữa ăn",
        "Khi uống cà phê/bia rượu",
        "Khi rảnh rỗi/chán nản"
    ];

    // Load dữ liệu đã submit trước đó khi component mount
    useEffect(() => {
        if (accountId) {
            const savedInfo = localStorage.getItem(`user_quit_info_${accountId}`);
            const isSubmitted = localStorage.getItem(`info_submitted_${accountId}`);

            if (savedInfo && isSubmitted === "true") {
                try {
                    const parsedInfo = JSON.parse(savedInfo);
                    setForm({
                        cigarettesPerDay: parsedInfo.cigarettesPerDay || "",
                        smokingTime: parsedInfo.smokingTime || "",
                        goalTime: parsedInfo.goalTime || "",
                        reason: parsedInfo.reason || "",
                        costPerCigarette: parsedInfo.costPerCigarette || "",
                        medicalHistory: parsedInfo.medicalHistory || "",
                        mostSmokingTime: parsedInfo.mostSmokingTime || ""
                    });

                    // Kiểm tra xem có phải custom input không
                    if (parsedInfo.reason && !reasonOptions.slice(0, -1).includes(parsedInfo.reason)) {
                        setCustomReason(parsedInfo.reason);
                        setShowCustomReason(true);
                        setForm(prev => ({ ...prev, reason: "Khác" }));
                    }

                    if (parsedInfo.medicalHistory && !medicalOptions.slice(0, -1).includes(parsedInfo.medicalHistory)) {
                        setCustomMedicalHistory(parsedInfo.medicalHistory);
                        setShowCustomMedical(true);
                        setForm(prev => ({ ...prev, medicalHistory: "Khác" }));
                    }

                    setHasSubmittedBefore(true);
                    setSubmitted(true);
                    console.log('📋 Loaded saved user info:', parsedInfo);
                } catch (err) {
                    console.error('❌ Error loading saved info:', err);
                }
            }
        }
    }, [accountId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Xử lý hiển thị custom input
        if (name === "reason") {
            if (value === "Khác") {
                setShowCustomReason(true);
            } else {
                setShowCustomReason(false);
                setCustomReason("");
            }
        }

        if (name === "medicalHistory") {
            if (value === "Khác") {
                setShowCustomMedical(true);
            } else {
                setShowCustomMedical(false);
                setCustomMedicalHistory("");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError(null);

        try {
            console.log('🚀 Submitting form with Redux token...');

            // Sử dụng custom input nếu người dùng chọn "Khác"
            const finalReason = form.reason === "Khác" ? customReason : form.reason;
            const finalMedicalHistory = form.medicalHistory === "Khác" ? customMedicalHistory : form.medicalHistory;

            const body = {
                cigarettesPerDay: Number(form.cigarettesPerDay),
                smokingTime: form.smokingTime,
                goalTime: form.goalTime,
                reason: finalReason,
                costPerCigarette: Number(form.costPerCigarette),
                medicalHistory: finalMedicalHistory,
                mostSmokingTime: form.mostSmokingTime
            };

            console.log('📋 Form data:', body);

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

            const result = await res.json();
            console.log('✅ API Response:', result); // Debug log
            setApiResult(result); // Hiện popup

            setSubmitted(true);
            setHasSubmittedBefore(true);

            // Lưu thông tin vào localStorage
            if (accountId) {
                console.log('💾 Saving user data for accountId:', accountId);

                // Lưu flag đã gửi thông tin
                localStorage.setItem(`info_submitted_${accountId}`, "true");

                // Lưu thời điểm bắt đầu cai thuốc (chỉ lưu lần đầu)
                const existingStartDate = localStorage.getItem(`quit_start_${accountId}`);
                if (!existingStartDate) {
                    const quitStartDate = new Date().toISOString();
                    localStorage.setItem(`quit_start_${accountId}`, quitStartDate);
                }

                // Lưu thông tin form với custom values
                localStorage.setItem(`user_quit_info_${accountId}`, JSON.stringify({
                    ...body,
                    startDate: existingStartDate || new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                }));

                // Dispatch Redux action
                dispatch(updateTodayCigarettesRequest({
                    todayCigarettes: Number(form.cigarettesPerDay)
                }));
            }



        } catch (err) {
            console.error('❌ Form submission error:', err);
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm reset dữ liệu (để test)
    const handleReset = () => {
        if (accountId) {
            localStorage.removeItem(`info_submitted_${accountId}`);
            localStorage.removeItem(`user_quit_info_${accountId}`);
            localStorage.removeItem(`quit_start_${accountId}`);
            setForm({
                cigarettesPerDay: "",
                smokingTime: "",
                goalTime: "",
                reason: "",
                costPerCigarette: "",
                medicalHistory: "",
                mostSmokingTime: ""
            });
            setCustomReason("");
            setCustomMedicalHistory("");
            setShowCustomReason(false);
            setShowCustomMedical(false);
            setSubmitted(false);
            setHasSubmittedBefore(false);
            console.log('🔄 Reset all saved data');
        }
    };

    // Redirect nếu không có token
    React.useEffect(() => {
        if (!token) {
            console.log('❌ No token found, redirecting to login...');
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const num = Number(form.cigarettesPerDay);
        if (!num) return;

        if (num >= 1 && num <= 19) {
            setForm(prev => ({ ...prev, goalTime: "180" })); // 3-6 tháng
        } else if (num >= 20 && num <= 29) {
            setForm(prev => ({ ...prev, goalTime: "270" })); // 6-9 tháng
        } else if (num > 29) {
            setForm(prev => ({ ...prev, goalTime: "360" })); // 9-12 tháng
        }
    }, [form.cigarettesPerDay]);

    const [isCigarettesInputFocused, setIsCigarettesInputFocused] = useState(false);

    return (
        <>
            {/* Popup kết quả submit */}
            {apiResult && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.32)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    backdropFilter: "blur(2px)"
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: 24,
                        boxShadow: "0 12px 40px rgba(72,166,167,0.22)",
                        padding: "2.5rem 2.2rem 2rem 2.2rem",
                        maxWidth: 480,
                        width: "95%",
                        textAlign: "center",
                        border: "2.5px solid #48A6A7",
                        position: "relative",
                        transition: "box-shadow 0.2s"
                    }}>
                        {/* Debug info */}
                        {console.log('🔍 Popup apiResult:', apiResult)}

                        <h3 style={{
                            color: "#006A71",
                            fontWeight: 900,
                            marginBottom: 22,
                            fontSize: "2rem",
                            letterSpacing: 1,
                            textShadow: "0 2px 8px #9ACBD033",
                            lineHeight: 1.3
                        }}>
                            Cảm ơn bạn đã cung cấp<br />thông tin!
                        </h3>
                        <div style={{
                            background: "#f8fafc",
                            padding: "1.2rem",
                            borderRadius: 16,
                            marginBottom: "1.2rem",
                            boxShadow: "0 2px 8px rgba(44,130,201,0.07)",
                            textAlign: "left"
                        }}>
                            {apiResult.addictionEvaluation ? (
                                // Kiểm tra xem có dòng nào bắt đầu bằng "-" hay không
                                (() => {
                                    const lines = apiResult.addictionEvaluation.split("\n").filter(line => line.trim());
                                    const bulletLines = lines.filter(line => line.trim().startsWith("-"));

                                    // Nếu có dòng bullet points, hiển thị theo format đẹp
                                    if (bulletLines.length > 0) {
                                        return (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                                {bulletLines.map((line, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            gap: 12,
                                                            padding: "1rem 1.2rem",
                                                            background: idx % 2 === 0 ? "#e6f4f4" : "#f0f9f9",
                                                            borderRadius: 12,
                                                            borderLeft: `4px solid ${idx % 2 === 0 ? "#48A6A7" : "#9ACBD0"}`,
                                                            fontSize: "1.08rem",
                                                            color: "#23235a",
                                                            boxShadow: "0 2px 6px rgba(44,130,201,0.06)",
                                                            transition: "transform 0.2s ease",
                                                            position: "relative"
                                                        }}
                                                    >
                                                        {/* Icon bullet */}
                                                        <div style={{
                                                            width: "28px",
                                                            height: "28px",
                                                            borderRadius: "50%",
                                                            background: idx % 2 === 0 ? "#48A6A7" : "#9ACBD0",
                                                            color: "#fff",
                                                            fontSize: "1rem",
                                                            fontWeight: "700",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0,
                                                            marginTop: "2px"
                                                        }}>
                                                            •
                                                        </div>

                                                        {/* Nội dung bullet */}
                                                        <div style={{
                                                            flex: 1,
                                                            lineHeight: 1.6,
                                                            fontWeight: "500"
                                                        }}>
                                                            {line.replace(/^-/, "").trim().split('\n').map((subLine, subIdx) => (
                                                                <div key={subIdx} style={{ marginBottom: subIdx < line.replace(/^-/, "").trim().split('\n').length - 1 ? '0.3rem' : 0 }}>
                                                                    {subLine.trim() || '\u00A0'}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else {
                                        // Nếu không có bullet points, hiển thị từng đoạn như các mục riêng
                                        const paragraphs = apiResult.addictionEvaluation.split('\n').filter(line => line.trim());
                                        return (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                                {paragraphs.map((paragraph, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            padding: "1rem 1.2rem",
                                                            background: idx % 2 === 0 ? "#e6f4f4" : "#f0f9f9",
                                                            borderRadius: 12,
                                                            borderLeft: `4px solid ${idx % 2 === 0 ? "#48A6A7" : "#9ACBD0"}`,
                                                            fontSize: "1.08rem",
                                                            color: "#23235a",
                                                            lineHeight: 1.6,
                                                            textAlign: "left",
                                                            boxShadow: "0 2px 6px rgba(44,130,201,0.06)",
                                                            transition: "transform 0.2s ease",
                                                            position: "relative"
                                                        }}
                                                    >
                                                        {/* Số thứ tự */}
                                                        <div style={{
                                                            position: "absolute",
                                                            top: "0.8rem",
                                                            right: "1rem",
                                                            width: "24px",
                                                            height: "24px",
                                                            borderRadius: "50%",
                                                            background: idx % 2 === 0 ? "#48A6A7" : "#9ACBD0",
                                                            color: "#fff",
                                                            fontSize: "0.85rem",
                                                            fontWeight: "700",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            {idx + 1}
                                                        </div>

                                                        {/* Nội dung */}
                                                        <div style={{
                                                            paddingRight: "2.5rem",
                                                            fontWeight: "500"
                                                        }}>
                                                            {paragraph.trim()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                })()
                            ) : (
                                <div style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                    color: "#48A6A7",
                                    fontSize: "1.1rem"
                                }}>
                                    <div style={{ marginBottom: "1rem", fontSize: "2rem" }}>✅</div>
                                    <div>
                                        <strong>Form đã được gửi thành công!</strong>
                                        <br />
                                        {apiResult.message || "Cảm ơn bạn đã cung cấp thông tin."}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setApiResult(null);
                                navigate("/plan");
                            }}
                            style={{
                                padding: "0.8rem 2.2rem",
                                background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 14,
                                fontWeight: 800,
                                fontSize: "1.15rem",
                                letterSpacing: 1,
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(44,130,201,0.10)",
                                transition: "all 0.2s"
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
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
                        borderRadius: 28,
                        boxShadow: "0 8px 32px rgba(72,166,167,0.18)",
                        padding: "2.8rem 2.2rem",
                        border: `2.5px solid ${COLORS.primary}`,
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Decorative elements */}
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
                            zIndex: 1,
                            position: "relative"
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
                            zIndex: 1,
                            position: "relative"
                        }}
                    >
                        Hãy cung cấp các thông tin quan trọng dưới đây để cá nhân hóa lộ trình hỗ trợ bạn cai thuốc lá hiệu quả!
                    </p>

                    {/* Hiển thị trạng thái đã submit trước đó */}
                    {hasSubmittedBefore && !submitted && (
                        <div style={{
                            background: "linear-gradient(90deg, #e8f5e8 0%, #f0f8f0 100%)",
                            border: "2px solid #27ae60",
                            borderRadius: 12,
                            padding: "1rem",
                            marginBottom: "1.5rem",
                            textAlign: "center",
                            color: "#27ae60",
                            fontWeight: 600
                        }}>
                            ✅ Bạn đã gửi thông tin trước đó. Có thể cập nhật lại thông tin bên dưới.
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            marginTop: "2rem",
                            width: "100%",
                            borderTop: `2px solid ${COLORS.primary}`,
                            paddingTop: "1.5rem",
                            zIndex: 1,
                            position: "relative"
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
                                    padding: "12px 0",
                                    marginBottom: 20
                                }}
                            >
                                🎉 {hasSubmittedBefore ? "Thông tin đã được cập nhật!" : "Cảm ơn bạn đã cung cấp thông tin!"}
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

                        {/* Số điếu hút/ngày và thời gian hút */}
                        <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                    📊 Số điếu hút/ngày
                                </label>
                                <input
                                    type="number"
                                    name="cigarettesPerDay"
                                    value={form.cigarettesPerDay}
                                    onChange={handleChange}
                                    placeholder="Nhập số điếu"
                                    min={1}
                                    max={100}
                                    required
                                    onFocus={() => setIsCigarettesInputFocused(true)}
                                    onBlur={() => setIsCigarettesInputFocused(false)}
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
                                <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                    ⏰ Thời gian hút thuốc
                                </label>
                                <select
                                    name="smokingTime"
                                    value={form.smokingTime}
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
                                    <option value="">Chọn thời gian hút thuốc</option>
                                    <option value="Khoảng 1 năm">Khoảng 1 năm</option>
                                    <option value="Khoảng 2 năm">Khoảng 2 năm</option>
                                    <option value="Khoảng 3 năm">Khoảng 3 năm</option>
                                    <option value="Khoảng 4 năm">Khoảng 4 năm</option>
                                    <option value="Khoảng 5 năm">Khoảng 5 năm</option>
                                    <option value="Từ 6-10 năm">Từ 6-10 năm</option>
                                    <option value="Trên 10 năm">Trên 10 năm</option>
                                </select>
                            </div>
                        </div>

                        {/* Thời gian muốn cai và chi phí */}
                        <div style={{ marginBottom: 20, display: "flex", gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                    🎯 Thời gian muốn cai (ngày)
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
                                    <option value={90}>1-3 tháng (~90 ngày)</option>
                                    <option value={180}>3-6 tháng (~180 ngày)</option>
                                    <option value={270}>6-9 tháng (~270 ngày)</option>
                                    <option value={360}>9-12 tháng (~360 ngày)</option>
                                </select>
                                {form.cigarettesPerDay && isCigarettesInputFocused && (
                                    <div style={{ color: "#FF6666", fontWeight: 600, marginTop: 6, fontSize: "0.98rem" }}>
                                        {
                                            Number(form.cigarettesPerDay) >= 5 && Number(form.cigarettesPerDay) <= 9
                                                ? "Gợi ý từ 1-3 tháng"
                                                : Number(form.cigarettesPerDay) >= 10 && Number(form.cigarettesPerDay) <= 15
                                                    ? "Gợi ý từ 3-6 tháng"
                                                    : Number(form.cigarettesPerDay) >= 16 && Number(form.cigarettesPerDay) <= 20
                                                        ? "Gợi ý từ 6-9 tháng"
                                                        : Number(form.cigarettesPerDay) > 20
                                                            ? "Gợi ý từ 9-12 tháng"
                                                            : ""
                                        }
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                    💰 Chi phí (VND/điếu)
                                </label>
                                <select
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
                                    <option value={5000}>Khoảng 5.000 VND</option>
                                    <option value={10000}>Khoảng 10.000 VND</option>
                                    <option value={20000}>Khoảng 20.000 VND</option>
                                    <option value={30000}>Khoảng 30.000 VND</option>
                                </select>
                            </div>
                        </div>

                        {/* Lý do muốn cai thuốc */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                💪 Lý do bạn muốn cai thuốc lá
                            </label>
                            <select
                                name="reason"
                                value={form.reason}
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
                                <option value="">Chọn lý do chính</option>
                                {reasonOptions.map((reason, index) => (
                                    <option key={index} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>

                            {/* Custom reason input */}
                            {showCustomReason && (
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Nhập lý do của bạn..."
                                    rows={3}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.7rem",
                                        borderRadius: 10,
                                        border: "1.5px solid #27ae60",
                                        fontSize: "1rem",
                                        backgroundColor: "#f8fff8",
                                        color: COLORS.text,
                                        resize: "vertical",
                                        outline: "none",
                                        marginTop: "0.5rem"
                                    }}
                                />
                            )}
                        </div>

                        {/* Tiền sử bệnh án */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                🏥 Tiền sử bệnh án
                            </label>
                            <select
                                name="medicalHistory"
                                value={form.medicalHistory}
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
                                <option value="">Chọn tình trạng sức khỏe</option>
                                {medicalOptions.map((medical, index) => (
                                    <option key={index} value={medical}>
                                        {medical}
                                    </option>
                                ))}
                            </select>

                            {/* Custom medical history input */}
                            {showCustomMedical && (
                                <textarea
                                    value={customMedicalHistory}
                                    onChange={(e) => setCustomMedicalHistory(e.target.value)}
                                    placeholder="Mô tả tình trạng sức khỏe của bạn..."
                                    rows={3}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.7rem",
                                        borderRadius: 10,
                                        border: "1.5px solid #27ae60",
                                        fontSize: "1rem",
                                        backgroundColor: "#f8fff8",
                                        color: COLORS.text,
                                        resize: "vertical",
                                        outline: "none",
                                        marginTop: "0.5rem"
                                    }}
                                />
                            )}
                        </div>

                        {/* Thời điểm thèm thuốc nhất */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ fontWeight: 700, display: "block", marginBottom: 6, color: COLORS.text }}>
                                🕐 Thời điểm bạn thèm thuốc nhất trong ngày
                            </label>
                            <select
                                name="mostSmokingTime"
                                value={form.mostSmokingTime}
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
                                <option value="">Chọn thời điểm thèm thuốc nhất</option>
                                {smokingTimeOptions.map((timeOption, index) => (
                                    <option key={index} value={timeOption}>
                                        {timeOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                                type="submit"
                                disabled={loading || !token}
                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    background: (loading || !token)
                                        ? "#b2bec3"
                                        : "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                    border: "none",
                                    borderRadius: 12,
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: "1.15rem",
                                    letterSpacing: 1,
                                    cursor: (loading || !token) ? "not-allowed" : "pointer",
                                    boxShadow: "0 2px 8px rgba(44,130,201,0.10)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {loading ? "Đang gửi..." : !token ? "Cần đăng nhập" : hasSubmittedBefore ? "Cập nhật thông tin" : "Gửi thông tin"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
