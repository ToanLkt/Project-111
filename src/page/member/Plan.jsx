import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../AuthContext/AuthContext";
import Footer from "../../components/Footer"; // Thêm import Footer
import { updateTodayCigarettesRequest } from "../../redux/components/payment/paymentSlice"; // Thêm import action

export default function Plan() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    // Lấy user info từ Redux hoặc AuthContext
    const { user: reduxUser, token: reduxToken } = useSelector((state) => state.account || {});
    const token = reduxToken || auth?.token;
    const user = reduxUser || auth?.user;

    const getUserId = () => {
        if (!user) return null;
        return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            user.userId ||
            user.id ||
            null;
    };

    const accountId = getUserId();

    // State cho việc kiểm tra đã tham gia chưa
    const [hasJoined, setHasJoined] = useState(false);
    const [userQuitInfo, setUserQuitInfo] = useState(null);
    const [quitStartDate, setQuitStartDate] = useState(null);

    // Check xem user đã submit thông tin chưa
    useEffect(() => {
        if (accountId) {
            const isSubmitted = localStorage.getItem(`info_submitted_${accountId}`);
            const savedInfo = localStorage.getItem(`user_quit_info_${accountId}`);
            const startDate = localStorage.getItem(`quit_start_${accountId}`);

            if (isSubmitted === "true") {
                setHasJoined(true);
                console.log('✅ User has joined the program');

                if (savedInfo) {
                    try {
                        const parsedInfo = JSON.parse(savedInfo);
                        setUserQuitInfo(parsedInfo);
                        console.log('📋 Loaded user quit info:', parsedInfo);
                    } catch (err) {
                        console.error('❌ Error parsing saved info:', err);
                    }
                }

                if (startDate) {
                    setQuitStartDate(startDate);
                    console.log('📅 Quit start date:', startDate);
                }
            } else {
                setHasJoined(false);
                console.log('❌ User has not joined yet');
            }
        }
    }, [accountId]);

    // Hàm chuyển đổi sang giờ Việt Nam (Asia/Ho_Chi_Minh)
    function toVietnamTime(date) {
        return new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    }

    // Hàm tính số ngày, giờ, phút, giây đã cai thuốc (theo giờ Việt Nam)
    function useQuitTimer(startDate) {
        const [timer, setTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        useEffect(() => {
            function update() {
                const now = toVietnamTime(new Date());
                const start = toVietnamTime(new Date(startDate));
                const diff = now - start;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimer({ days, hours, minutes, seconds });
            }
            update();
            const interval = setInterval(update, 1000);
            return () => clearInterval(interval);
        }, [startDate]);

        return timer;
    }

    // Component Timer riêng
    function TimerSection({ startDate }) {
        const timer = useQuitTimer(startDate);

        return (
            <section style={{
                background: "#E6F4F4",
                borderRadius: 12,
                padding: "1.5rem",
                boxShadow: "0 1px 6px rgba(154,203,208,0.10)",
                marginBottom: 36,
                textAlign: "center"
            }}>
                <div style={{ fontWeight: 600, color: "#48A6A7", marginBottom: 18, fontSize: "1.15rem" }}>
                    Thời gian bạn cai thuốc (giờ Việt Nam)
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 24,
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: "#006A71"
                }}>
                    <div>
                        <span style={{ fontSize: "2.6rem", color: "#006A71" }}>{timer.days}</span>
                        <div style={{ fontSize: "1rem", color: "#48A6A7", marginTop: 2 }}>ngày</div>
                    </div>
                    <span style={{ fontSize: "2rem", color: "#48A6A7" }}>:</span>
                    <div>
                        <span style={{ fontSize: "2.6rem", color: "#006A71" }}>{timer.hours.toString().padStart(2, "0")}</span>
                        <div style={{ fontSize: "1rem", color: "#48A6A7", marginTop: 2 }}>giờ</div>
                    </div>
                    <span style={{ fontSize: "2rem", color: "#48A6A7" }}>:</span>
                    <div>
                        <span style={{ fontSize: "2.6rem", color: "#006A71" }}>{timer.minutes.toString().padStart(2, "0")}</span>
                        <div style={{ fontSize: "1rem", color: "#48A6A7", marginTop: 2 }}>phút</div>
                    </div>
                    <span style={{ fontSize: "2rem", color: "#48A6A7" }}>:</span>
                    <div>
                        <span style={{ fontSize: "2.6rem", color: "#006A71" }}>{timer.seconds.toString().padStart(2, "0")}</span>
                        <div style={{ fontSize: "1rem", color: "#48A6A7", marginTop: 2 }}>giây</div>
                    </div>
                </div>
            </section>
        );
    }

    // Component nhập điếu thuốc riêng - CẬP NHẬT
    function CigaretteInputSection() {
        const {
            todayCigarettesLoading,
            todayCigarettesSuccess,
            todayCigarettesError
        } = useSelector((state) => state.payment || {});

        const [cigarettesToday, setCigarettesToday] = useState("");
        const [submitted, setSubmitted] = useState(false);

        // Handle form submission
        const handleCigaretteSubmit = async (e) => {
            e.preventDefault();

            if (!token) {
                console.error("Không có token để lưu dữ liệu!");
                return;
            }

            try {
                console.log('🚬 Submitting cigarettes today:', cigarettesToday);

                const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/today-cigarettes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        todayCigarettes: Number(cigarettesToday)
                    })
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                console.log('✅ Cigarettes data submitted successfully');
                setSubmitted(true);

                // Reload lại phaseData để cập nhật thống kê mới
                window.location.reload(); // Hoặc có thể dispatch một action để refresh data

                // Reset sau 3 giây
                setTimeout(() => {
                    setSubmitted(false);
                }, 3000);

            } catch (error) {
                console.error('❌ Error submitting cigarettes:', error);
            }
        };

        return (
            <section style={{
                maxWidth: 500,
                margin: "0 auto 2rem auto",
                background: "#F2EFE7",
                padding: "1.2rem 2rem",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(154,203,208,0.10)",
                textAlign: "center"
            }}>
                <h3 style={{ color: "#48A6A7", fontWeight: 700, marginBottom: 14 }}>
                    Nhập số điếu thuốc bạn đã hút hôm nay
                </h3>
                <form onSubmit={handleCigaretteSubmit} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <input
                        type="number"
                        min={0}
                        value={cigarettesToday}
                        onChange={e => {
                            setCigarettesToday(e.target.value);
                            setSubmitted(false);
                        }}
                        placeholder="Số điếu"
                        style={{
                            width: 100,
                            padding: "0.5rem",
                            borderRadius: 8,
                            border: "1px solid #9ACBD0",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            color: "#006A71",
                            background: "#fff"
                        }}
                        required
                        disabled={todayCigarettesLoading}
                    />
                    <button
                        type="submit"
                        disabled={todayCigarettesLoading || !token}
                        style={{
                            background: todayCigarettesLoading ? "#ccc" : "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.5rem 1.2rem",
                            fontWeight: 600,
                            fontSize: "1.05rem",
                            cursor: todayCigarettesLoading || !token ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 8px rgba(72,166,167,0.10)"
                        }}
                        onMouseOver={e => !todayCigarettesLoading && (e.currentTarget.style.background = "#006A71")}
                        onMouseOut={e => !todayCigarettesLoading && (e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)")}
                    >
                        {todayCigarettesLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                </form>

                {/* Success message */}
                {submitted && (
                    <div style={{ color: "#27ae60", marginTop: 10, fontWeight: 500 }}>
                        ✅ Đã lưu: {cigarettesToday} điếu thuốc hôm nay!
                    </div>
                )}

                {/* Error message */}
                {todayCigarettesError && (
                    <div style={{ color: "#e74c3c", marginTop: 10, fontWeight: 500 }}>
                        Lỗi: {todayCigarettesError}
                    </div>
                )}
            </section>
        );
    }

    // Component thống kê riêng
    function StatisticsSection({ userInfo }) {
        // Tính toán thống kê từ userInfo
        const calculateStats = () => {
            if (!userInfo || !quitStartDate) return { totalSaveMoney: 0, totalCigarettesQuit: 0 };

            const startDate = new Date(quitStartDate);
            const now = new Date();
            const daysQuit = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

            const cigarettesPerDay = userInfo.cigarettesPerDay || 0;
            const costPerCigarette = userInfo.costPerCigarette || 0;

            const totalCigarettesQuit = daysQuit * cigarettesPerDay;
            const totalSaveMoney = totalCigarettesQuit * costPerCigarette;

            return { totalSaveMoney, totalCigarettesQuit };
        };

        const { totalSaveMoney, totalCigarettesQuit } = calculateStats();

        return (
            <section style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginBottom: 36,
                justifyContent: "space-between"
            }}>
                <div style={{
                    flex: "1 1 180px",
                    background: "#E6F4F4",
                    borderRadius: 12,
                    padding: "1.2rem",
                    boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                }}>
                    <div style={{ fontWeight: 600, color: "#48A6A7" }}>Số tiền tiết kiệm được</div>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "#27ae60" }}>
                        {totalSaveMoney.toLocaleString()}₫
                    </div>
                </div>
                <div style={{
                    flex: "1 1 180px",
                    background: "#E6F4F4",
                    borderRadius: 12,
                    padding: "1.2rem",
                    boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                }}>
                    <div style={{ fontWeight: 600, color: "#48A6A7" }}>Số điếu đã cai</div>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e67e22" }}>
                        {totalCigarettesQuit}
                    </div>
                </div>
                <div style={{
                    flex: "1 1 180px",
                    background: "#E6F4F4",
                    borderRadius: 12,
                    padding: "1.2rem",
                    boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                }}>
                    <div style={{ fontWeight: 600, color: "#48A6A7" }}>Mục tiêu ban đầu</div>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e67e22" }}>
                        {userInfo?.cigarettesPerDay || 0} điếu/ngày
                    </div>
                </div>
            </section>
        );
    }

    // Thêm component Progress Phases
    function ProgressPhasesSection() {
        const [phaseData, setPhaseData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            if (!token) {
                setLoading(false);
                return;
            }

            // Fetch phase data từ API
            fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Plan", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    console.log('📊 Phase data loaded:', data);
                    setPhaseData(data);
                })
                .catch(err => {
                    console.error('❌ Error loading phase data:', err);
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, [token]);

        if (loading) {
            return (
                <section style={{
                    background: "#F8FAFC",
                    borderRadius: 12,
                    padding: "2rem",
                    marginBottom: 36,
                    textAlign: "center"
                }}>
                    <div style={{ color: "#48A6A7", fontSize: "1.1rem" }}>
                        🔄 Đang tải thông tin tiến trình...
                    </div>
                </section>
            );
        }

        if (error || !phaseData) {
            return (
                <section style={{
                    background: "#FEF2F2",
                    borderRadius: 12,
                    padding: "2rem",
                    marginBottom: 36,
                    textAlign: "center",
                    border: "1px solid #FECACA"
                }}>
                    <div style={{ color: "#DC2626", fontSize: "1.1rem" }}>
                        ❌ Không thể tải thông tin tiến trình
                    </div>
                    {error && <div style={{ color: "#7F1D1D", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                        {error}
                    </div>}
                </section>
            );
        }

        // Tính toán ngày hiện tại để xác định phase nào đang active
        const getCurrentPhase = () => {
            if (!quitStartDate) return 0;

            const startDate = new Date(quitStartDate);
            const now = new Date();
            const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

            if (daysDiff < 1) return 1;
            if (daysDiff < 7) return 1;
            if (daysDiff < 30) return 2;
            if (daysDiff < 90) return 3;
            if (daysDiff < 365) return 4;
            return 5;
        };

        const currentPhase = getCurrentPhase();

        const phases = [
            {
                number: 1,
                title: "Giai đoạn 1",
                description: phaseData.statusPhase1 || "Bắt đầu hành trình",
                dateRange: `${phaseData.startDatePhase1} - ${phaseData.endDatePhase1}`,
                color: "#EF4444",
                bgColor: "#FEF2F2",
                borderColor: "#FECACA"
            },
            {
                number: 2,
                title: "Giai đoạn 2",
                description: phaseData.statusPhase2 || "Vượt qua khó khăn ban đầu",
                dateRange: `${phaseData.startDatePhase2} - ${phaseData.endDatePhase2}`,
                color: "#F97316",
                bgColor: "#FFF7ED",
                borderColor: "#FDBA74"
            },
            {
                number: 3,
                title: "Giai đoạn 3",
                description: phaseData.statusPhase3 || "Thích nghi với cuộc sống mới",
                dateRange: `${phaseData.startDatePhase3} - ${phaseData.endDatePhase3}`,
                color: "#EAB308",
                bgColor: "#FEFCE8",
                borderColor: "#FDE047"
            },
            {
                number: 4,
                title: "Giai đoạn 4",
                description: phaseData.statusPhase4 || "Ổn định thói quen tốt",
                dateRange: `${phaseData.startDatePhase4} - ${phaseData.endDatePhase4}`,
                color: "#22C55E",
                bgColor: "#F0FDF4",
                borderColor: "#BBF7D0"
            },
            {
                number: 5,
                title: "Giai đoạn 5",
                description: phaseData.statusPhase5 || "Hoàn thành mục tiêu",
                dateRange: `${phaseData.startDatePhase5} - ${phaseData.endDatePhase5}`,
                color: "#8B5CF6",
                bgColor: "#FAF5FF",
                borderColor: "#DDD6FE"
            }
        ];

        // Helper function để lấy độ dài của mỗi phase (THÊM VÀO TRƯỚC return)
        function getPhaseLength(phaseNumber) {
            switch (phaseNumber) {
                case 1: return 1;   // 1 ngày
                case 2: return 7;   // 7 ngày 
                case 3: return 30;  // 30 ngày
                case 4: return 90;  // 90 ngày
                case 5: return 365; // 365 ngày
                default: return 1;
            }
        }

        return (
            <section style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: "2rem",
                marginBottom: 36,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #E5E7EB"
            }}>
                <div style={{
                    textAlign: "center",
                    marginBottom: "2rem"
                }}>
                    <h3 style={{
                        color: "#006A71",
                        fontSize: "1.8rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem"
                    }}>
                        🎯 Tiến trình cai thuốc của bạn
                    </h3>
                    <p style={{
                        color: "#6B7280",
                        fontSize: "1rem"
                    }}>
                        Theo dõi hành trình cai thuốc qua 5 giai đoạn quan trọng
                    </p>
                </div>

                {/* Progress Timeline */}
                <div style={{
                    position: "relative",
                    paddingLeft: "2rem"
                }}>
                    {/* Vertical line */}
                    <div style={{
                        position: "absolute",
                        left: "1rem",
                        top: "2rem",
                        bottom: "2rem",
                        width: "3px",
                        background: "linear-gradient(to bottom, #E5E7EB 0%, #9CA3AF 50%, #E5E7EB 100%)",
                        borderRadius: "2px"
                    }}></div>

                    {phases.map((phase, index) => {
                        const isCompleted = currentPhase > phase.number;
                        const isCurrent = currentPhase === phase.number;
                        const isPending = currentPhase < phase.number;

                        return (
                            <div key={phase.number} style={{
                                position: "relative",
                                marginBottom: index < phases.length - 1 ? "2.5rem" : "0",
                                paddingLeft: "2rem"
                            }}>
                                {/* Phase indicator circle */}
                                <div style={{
                                    position: "absolute",
                                    left: "-0.75rem",
                                    top: "0.5rem",
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    borderRadius: "50%",
                                    background: isCompleted ? phase.color :
                                        isCurrent ? `linear-gradient(135deg, ${phase.color}, ${phase.color}DD)` :
                                            "#F3F4F6",
                                    border: `3px solid ${isCompleted || isCurrent ? phase.color : "#D1D5DB"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: isCompleted || isCurrent ? "#FFFFFF" : "#9CA3AF",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    boxShadow: isCompleted || isCurrent ? `0 4px 12px ${phase.color}30` : "none",
                                    transition: "all 0.3s ease"
                                }}>
                                    {isCompleted ? "✓" : phase.number}
                                </div>

                                {/* Phase content */}
                                <div style={{
                                    background: isCurrent ? phase.bgColor :
                                        isCompleted ? `${phase.color}10` : "#F9FAFB",
                                    border: `2px solid ${isCurrent ? phase.borderColor :
                                        isCompleted ? `${phase.color}30` : "#E5E7EB"}`,
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                    transition: "all 0.3s ease",
                                    transform: isCurrent ? "scale(1.02)" : "scale(1)",
                                    boxShadow: isCurrent ? `0 8px 24px ${phase.color}20` : "0 2px 8px rgba(0,0,0,0.05)"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "0.75rem"
                                    }}>
                                        <h4 style={{
                                            color: isCompleted || isCurrent ? phase.color : "#374151",
                                            fontSize: "1.2rem",
                                            fontWeight: 600,
                                            margin: 0
                                        }}>
                                            {phase.title}
                                        </h4>
                                        <div style={{
                                            background: isCompleted ? `${phase.color}20` :
                                                isCurrent ? `${phase.color}15` : "#F3F4F6",
                                            color: isCompleted || isCurrent ? phase.color : "#6B7280",
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "20px",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em"
                                        }}>
                                            {isCompleted ? "Hoàn thành" :
                                                isCurrent ? "Đang tiến hành" : "Sắp tới"}
                                        </div>
                                    </div>

                                    <p style={{
                                        color: "#6B7280",
                                        fontSize: "1rem",
                                        lineHeight: 1.5,
                                        margin: "0 0 0.75rem 0"
                                    }}>
                                        {phase.description}
                                    </p>

                                    <div style={{
                                        color: "#9CA3AF",
                                        fontSize: "0.875rem",
                                        fontWeight: 500
                                    }}>
                                        📅 {phase.dateRange}
                                    </div>

                                    {/* Progress bar for current phase */}
                                    {isCurrent && quitStartDate && (
                                        <div style={{ marginTop: "1rem" }}>
                                            <div style={{
                                                background: "#F3F4F6",
                                                borderRadius: "8px",
                                                height: "8px",
                                                overflow: "hidden"
                                            }}>
                                                <div style={{
                                                    background: `linear-gradient(90deg, ${phase.color}, ${phase.color}CC)`,
                                                    height: "100%",
                                                    width: `${Math.min(((new Date() - new Date(quitStartDate)) / (1000 * 60 * 60 * 24)) / getPhaseLength(phase.number) * 100, 100)}%`,
                                                    borderRadius: "8px",
                                                    transition: "width 0.3s ease"
                                                }}></div>
                                            </div>
                                            <div style={{
                                                fontSize: "0.75rem",
                                                color: phase.color,
                                                fontWeight: 600,
                                                marginTop: "0.5rem"
                                            }}>
                                                {Math.min(Math.floor((new Date() - new Date(quitStartDate)) / (1000 * 60 * 60 * 24)), getPhaseLength(phase.number))} / {getPhaseLength(phase.number)} ngày
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Overall stats */}
                <div style={{
                    background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                    border: "2px solid #BBF7D0",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginTop: "2rem",
                    textAlign: "center"
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "1rem"
                    }}>
                        <div>
                            <div style={{ color: "#16A34A", fontSize: "1.5rem", fontWeight: 700 }}>
                                {currentPhase}/5
                            </div>
                            <div style={{ color: "#15803D", fontSize: "0.875rem", fontWeight: 500 }}>
                                Giai đoạn hoàn thành
                            </div>
                        </div>
                        <div>
                            <div style={{ color: "#16A34A", fontSize: "1.5rem", fontWeight: 700 }}>
                                {phaseData.numberOfDays || 0}
                            </div>
                            <div style={{ color: "#15803D", fontSize: "0.875rem", fontWeight: 500 }}>
                                Ngày đã cai thuốc
                            </div>
                        </div>
                        <div>
                            <div style={{ color: "#16A34A", fontSize: "1.5rem", fontWeight: 700 }}>
                                {phaseData.totalSaveMoney ? phaseData.totalSaveMoney.toLocaleString() + "₫" : "0₫"}
                            </div>
                            <div style={{ color: "#15803D", fontSize: "0.875rem", fontWeight: 500 }}>
                                Tiền đã tiết kiệm
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // SỬA LẠI PHẦN RETURN CHÍNH CỦA COMPONENT PLAN
    return (
        <div
            style={{
                minHeight: "100vh",
                color: "#006A71",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                padding: "0 0 2rem 0"
            }}
        >
            {/* Call to action lên đầu */}
            <div
                style={{
                    margin: "40px auto 36px auto",
                    background: "linear-gradient(90deg, #9ACBD0 60%, #48A6A7 100%)",
                    borderRadius: 14,
                    padding: "2rem",
                    color: "#006A71",
                    textAlign: "center",
                    boxShadow: "0 2px 12px rgba(72,166,167,0.13)",
                    maxWidth: 900,
                }}
            >
                <h2 style={{ fontWeight: 800, marginBottom: 10 }}>Bạn đã sẵn sàng bắt đầu?</h2>
                <p style={{ fontSize: "1.15rem", marginBottom: 18 }}>
                    Hãy cho chúng tớ xin vài thông tin để bắt đầu quá trình bạn nhé!
                </p>
                <button
                    onClick={() => navigate("/start-information")}
                    disabled={hasJoined}
                    style={{
                        background: hasJoined ? "#27ae60" : "#006A71",
                        color: "#fff",
                        fontWeight: 700,
                        padding: "0.7rem 2.2rem",
                        borderRadius: 30,
                        textDecoration: "none",
                        fontSize: "1.1rem",
                        boxShadow: "0 2px 8px rgba(72,166,167,0.10)",
                        transition: "background 0.2s, color 0.2s",
                        border: "none",
                        cursor: hasJoined ? "default" : "pointer"
                    }}
                    onMouseOver={e => { if (!hasJoined) e.currentTarget.style.background = "#48A6A7"; }}
                    onMouseOut={e => { if (!hasJoined) e.currentTarget.style.background = "#006A71"; }}
                >
                    {hasJoined ? "✅ Đang tham gia" : "🚀 Tham gia ngay"}
                </button>
            </div>

            {/* Nội dung chính */}
            <div
                style={{
                    maxWidth: 900,
                    margin: "2rem auto",
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(72,166,167,0.13)",
                    padding: "2.5rem 2rem",
                }}
            >
                {/* Chỉ hiển thị nội dung chính khi đã tham gia */}
                {hasJoined ? (
                    <>
                        {/* Timer section */}
                        {quitStartDate && (
                            <TimerSection startDate={quitStartDate} />
                        )}

                        {/* Progress Phases section - CHỨA THỐNG KÊ TỪ API */}
                        <ProgressPhasesSection />

                        {/* Cigarette input section */}
                        <CigaretteInputSection />

                        {/* XÓA StatisticsSection vì đã được thay thế bằng data từ API trong ProgressPhasesSection */}
                    </>
                ) : (
                    <section style={{ padding: "3rem 0", textAlign: "center" }}>
                        <div style={{
                            color: "#48A6A7",
                            fontSize: "1.3rem",
                            fontWeight: 600,
                            marginBottom: "1rem"
                        }}>
                            🎯 Chưa tham gia chương trình cai thuốc
                        </div>
                        <div style={{ color: "#718096", fontSize: "1.1rem" }}>
                            Vui lòng nhấn "Tham gia ngay" để bắt đầu hành trình cai thuốc của bạn.
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </div>
    );

} // ĐÓNG COMPONENT PLAN
