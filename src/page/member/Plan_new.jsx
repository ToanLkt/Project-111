import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../AuthContext/AuthContext";
import Footer from "../../components/Footer";

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

    // State cho việc kiểm tra status process
    const [statusProcess, setStatusProcess] = useState(null);
    const [statusLoading, setStatusLoading] = useState(true);
    const [planData, setPlanData] = useState(null);
    const [phaseData, setPhaseData] = useState(null);

    // BƯỚC 1: FETCH STATUS PROCESS TỪ API
    useEffect(() => {
        const fetchStatusProcess = async () => {
            if (!accountId || !token) {
                console.log("⏸️ No accountId or token, skipping status check");
                setStatusLoading(false);
                return;
            }

            try {
                setStatusLoading(true);
                console.log("🔍 Fetching status-process for accountId:", accountId);

                const response = await fetch(
                    `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/status-process?accountId=${accountId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ Status process data:", data);
                    setStatusProcess(data);
                } else {
                    console.error("❌ Failed to fetch status process:", response.status);
                    setStatusProcess(null);
                }
            } catch (error) {
                console.error("❌ Error fetching status process:", error);
                setStatusProcess(null);
            } finally {
                setStatusLoading(false);
            }
        };

        fetchStatusProcess();
    }, [accountId, token]);

    // BƯỚC 2: FETCH PLAN & PHASE DATA CHỈ KHI STATUS = "processing"
    useEffect(() => {
        const fetchPlanAndPhaseData = async () => {
            // CHỈ FETCH KHI STATUS = "processing" (case-insensitive)
            if (!statusProcess || statusProcess.statusProcess?.toLowerCase() !== "processing" || !token || !accountId) {
                console.log("⏸️ Not fetching plan data - conditions:", {
                    hasStatus: !!statusProcess,
                    status: statusProcess?.statusProcess,
                    statusLower: statusProcess?.statusProcess?.toLowerCase(),
                    hasToken: !!token,
                    accountId
                });
                return;
            }

            try {
                console.log("🔍 Fetching Plan and Phase data...");

                // Fetch Plan data
                const planResponse = await fetch(
                    `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/Plan?accountId=${accountId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (planResponse.ok) {
                    const planResult = await planResponse.json();
                    console.log("✅ Plan data:", planResult);
                    setPlanData(planResult);
                } else {
                    console.error("❌ Failed to fetch plan data:", planResponse.status);
                }

                // Fetch Phase data
                const phaseResponse = await fetch(
                    `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/Phase/fail-stat?accountId=${accountId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (phaseResponse.ok) {
                    const phaseResult = await phaseResponse.json();
                    console.log("✅ Phase data:", phaseResult);
                    setPhaseData(phaseResult);
                } else {
                    console.error("❌ Failed to fetch phase data:", phaseResponse.status);
                }

            } catch (error) {
                console.error("❌ Error fetching plan/phase data:", error);
            }
        };

        fetchPlanAndPhaseData();
    }, [statusProcess, token, accountId]);

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

    // Component nhập điếu thuốc riêng
    function CigaretteInputSection() {
        const {
            todayCigarettesLoading,
            todayCigarettesSuccess,
            todayCigarettesError
        } = useSelector((state) => state.payment || {});

        const [cigarettesToday, setCigarettesToday] = useState("");

        const handleSaveCigarettes = () => {
            if (!cigarettesToday.trim()) {
                alert("Vui lòng nhập số điếu thuốc!");
                return;
            }

            const count = parseInt(cigarettesToday);
            if (isNaN(count) || count < 0) {
                alert("Vui lòng nhập số hợp lệ!");
                return;
            }

            console.log("Saving cigarettes count:", count);
            setCigarettesToday("");
        };

        return (
            <section style={{
                background: "#F9F9F9",
                borderRadius: 12,
                padding: "2rem",
                marginTop: 24,
                textAlign: "center"
            }}>
                <h3 style={{ color: "#48A6A7", marginBottom: "1rem" }}>
                    📝 Nhập số điếu thuốc bạn đã hút hôm nay
                </h3>
                <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>
                    📊 Giới hạn cho phép: {phaseData?.maxCigarettes || 0} điếu/ngày<br />
                    Vượt quá giới hạn này sẽ được tính là thất bại
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center" }}>
                    <input
                        type="number"
                        min="0"
                        value={cigarettesToday}
                        onChange={(e) => setCigarettesToday(e.target.value)}
                        placeholder="Số điếu"
                        style={{
                            padding: "0.8rem 1rem",
                            borderRadius: 8,
                            border: "1px solid #D1D5DB",
                            fontSize: "1rem",
                            width: "120px",
                            textAlign: "center"
                        }}
                    />
                    <button
                        onClick={handleSaveCigarettes}
                        disabled={todayCigarettesLoading}
                        style={{
                            background: "#48A6A7",
                            color: "white",
                            padding: "0.8rem 1.5rem",
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: 600
                        }}
                    >
                        {todayCigarettesLoading ? "Đang lưu..." : "💾 Lưu"}
                    </button>
                </div>
                {todayCigarettesError && (
                    <p style={{ color: "#EF4444", marginTop: "1rem" }}>
                        ❌ {todayCigarettesError}
                    </p>
                )}
                {todayCigarettesSuccess && (
                    <p style={{ color: "#10B981", marginTop: "1rem" }}>
                        ✅ Đã lưu thành công!
                    </p>
                )}
            </section>
        );
    }

    // Component hiển thị thống kê progress phases từ API
    function ProgressPhasesSection() {
        if (!planData || !phaseData) {
            return (
                <div style={{ textAlign: "center", padding: "2rem", color: "#6B7280" }}>
                    📊 Đang tải dữ liệu kế hoạch...
                </div>
            );
        }

        const formatDate = (dateString) => {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            return date.toLocaleDateString("vi-VN");
        };

        const calculateProgress = (phase) => {
            const now = new Date();
            const start = new Date(phase.startDate);
            const end = new Date(phase.endDate);

            if (now < start) return 0;
            if (now > end) return 100;

            const total = end - start;
            const elapsed = now - start;
            return Math.round((elapsed / total) * 100);
        };

        const currentPhase = planData.phases?.find(phase => {
            const now = new Date();
            const start = new Date(phase.startDate);
            const end = new Date(phase.endDate);
            return now >= start && now <= end;
        });

        return (
            <section style={{
                background: "#FAFAFA",
                borderRadius: 12,
                padding: "2rem",
                marginBottom: 24
            }}>
                {/* Kế hoạch cai thuốc cá nhân */}
                <h3 style={{
                    color: "#DC2626",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    fontSize: "1.3rem",
                    fontWeight: 700
                }}>
                    🎯 Kế hoạch cai thuốc cá nhân
                </h3>
                <div style={{ color: "#374151", lineHeight: 1.6, marginBottom: "2rem", textAlign: "center" }}>
                    Theo dõi hành trình cai thuốc qua 5 giai đoạn quan trọng
                </div>

                {/* Thông tin tổng quan */}
                {currentPhase && (
                    <div style={{
                        background: "#D1FAE5",
                        borderRadius: 12,
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        textAlign: "center"
                    }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "1rem",
                            marginBottom: "1rem"
                        }}>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16A34A" }}>
                                    {currentPhase.phase}/{planData.phases?.length || 5}
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "#059669" }}>Giai đoạn hiện tại</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16A34A" }}>
                                    {planData.daysQuit || 0}
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "#059669" }}>Ngày đã cai thuốc</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#059669" }}>
                                    {planData.moneySaved || 0}₫
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "#059669" }}>Tiền đã tiết kiệm</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#DC2626" }}>
                                    {phaseData.maxCigarettes || 0}
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "#DC2626" }}>Giới hạn điếu/ngày</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#DC2626" }}>
                                    {phaseData.failedDays || 0}
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "#DC2626" }}>Tổng ngày thất bại</div>
                            </div>
                        </div>

                        {/* Tỷ lệ thành công */}
                        <div style={{
                            background: "#F0FDF4",
                            borderRadius: 8,
                            padding: "1rem",
                            marginTop: "1rem"
                        }}>
                            <div style={{ fontWeight: 600, color: "#16A34A", marginBottom: "0.5rem" }}>
                                📈 Tỷ lệ thành công tổng quan
                            </div>
                            <div style={{ color: "#6B7280", fontSize: "0.8rem", marginBottom: "1rem", fontStyle: "italic" }}>
                                * Thất bại được tính khi số điếu hút {'>'} giới hạn ({phaseData.maxCigarettes || 0} điếu/ngày)
                            </div>
                            {(() => {
                                const totalFail = phaseData.failedDays || 0;
                                const totalDays = planData.daysQuit || 0;
                                const successDays = totalDays - totalFail;
                                const successRate = totalDays > 0 ? (successDays / totalDays * 100) : 0;

                                return (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "1rem"
                                    }}>
                                        <div style={{
                                            fontSize: "2rem",
                                            fontWeight: 700,
                                            color: successRate >= 80 ? "#16A34A" :
                                                successRate >= 60 ? "#EAB308" : "#DC2626"
                                        }}>
                                            {successRate.toFixed(1)}%
                                        </div>
                                        <div style={{
                                            color: "#6B7280",
                                            fontSize: "0.9rem",
                                            textAlign: "left"
                                        }}>
                                            <div>Ngày thành công: {successDays}</div>
                                            <div>Ngày thất bại: {totalFail}</div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* Danh sách các phases */}
                {planData.phases && planData.phases.map((phase, index) => {
                    const progress = calculateProgress(phase);
                    const isActive = currentPhase?.phase === phase.phase;
                    const isCompleted = progress === 100;
                    const isUpcoming = progress === 0;

                    return (
                        <div
                            key={phase.phase}
                            style={{
                                background: isActive ? "#FEF3F2" : isCompleted ? "#F0F9FF" : "#F9FAFB",
                                border: `2px solid ${isActive ? "#FECACA" : isCompleted ? "#BFDBFE" : "#E5E7EB"}`,
                                borderRadius: 12,
                                padding: "1.5rem",
                                marginBottom: "1rem",
                                position: "relative"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        background: isActive ? "#DC2626" : isCompleted ? "#2563EB" : "#9CA3AF",
                                        color: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "bold"
                                    }}>
                                        {phase.phase}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, color: "#111827", fontSize: "1.1rem" }}>
                                            Giai đoạn {phase.phase}
                                        </h4>
                                        <p style={{ margin: "4px 0 0 0", color: "#6B7280", fontSize: "0.9rem" }}>
                                            {phase.description || "Đang thực hiện"}
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    background: isActive ? "#DC2626" : isCompleted ? "#059669" : "#6B7280",
                                    color: "white",
                                    padding: "0.3rem 0.8rem",
                                    borderRadius: 20,
                                    fontSize: "0.8rem",
                                    fontWeight: 600
                                }}>
                                    {isActive ? "ĐANG TIẾN HÀNH" : isCompleted ? "HOÀN THÀNH" : "SẮP TỚI"}
                                </div>
                            </div>

                            <div style={{ marginBottom: "1rem" }}>
                                <div style={{ color: "#374151", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                    📅 {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                                </div>

                                {phase.statistics && (
                                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#6B7280" }}>
                                        <span>❌ Ngày thất bại: {phase.statistics.failedDays || 0}</span>
                                        <span>📈 Tổng ngày: {phase.statistics.totalDays || 0}</span>
                                        <span>Tỷ lệ thành công: {phase.statistics.successRate || "0%"}</span>
                                    </div>
                                )}
                            </div>

                            {/* Progress bar */}
                            <div style={{
                                background: "#E5E7EB",
                                height: 8,
                                borderRadius: 4,
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    background: isActive ? "#DC2626" : isCompleted ? "#059669" : "#9CA3AF",
                                    height: "100%",
                                    width: `${progress}%`,
                                    transition: "width 0.3s ease"
                                }} />
                            </div>
                        </div>
                    );
                })}
            </section>
        );
    }

    // RETURN CHÍNH CỦA COMPONENT
    return (
        <div
            style={{
                minHeight: "100vh",
                color: "#006A71",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                padding: "0 0 2rem 0"
            }}
        >
            {/* HIỂN THỊ LOADING KHI ĐANG FETCH STATUS */}
            {statusLoading ? (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                    fontSize: "1.2rem",
                    color: "#48A6A7"
                }}>
                    🔄 Đang kiểm tra trạng thái...
                </div>
            ) : !statusProcess ? (
                // KHÔNG CÓ STATUS - HIỆN CALL TO ACTION
                <>
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
                            style={{
                                background: "#006A71",
                                color: "#fff",
                                fontWeight: 700,
                                padding: "0.7rem 2.2rem",
                                borderRadius: 30,
                                textDecoration: "none",
                                fontSize: "1.1rem",
                                boxShadow: "0 2px 8px rgba(72,166,167,0.10)",
                                transition: "background 0.2s, color 0.2s",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            🚀 Tham gia ngay
                        </button>
                    </div>

                    <div
                        style={{
                            maxWidth: 900,
                            margin: "2rem auto",
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 4px 24px rgba(72,166,167,0.13)",
                            padding: "2.5rem 2rem",
                            textAlign: "center"
                        }}
                    >
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
                    </div>
                </>
            ) : statusProcess.statusProcess?.toLowerCase() === "success" ? (
                // STATUS = SUCCESS - HIỆN THÔNG BÁO CHÚC MỪNG
                <div
                    style={{
                        maxWidth: 900,
                        margin: "4rem auto",
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        borderRadius: 20,
                        padding: "4rem 2rem",
                        color: "#fff",
                        textAlign: "center",
                        boxShadow: "0 8px 32px rgba(16,185,129,0.3)"
                    }}
                >
                    <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎉</div>
                    <h1 style={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        marginBottom: "1rem",
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        Chúc mừng!
                    </h1>
                    <p style={{
                        fontSize: "1.3rem",
                        marginBottom: "2rem",
                        opacity: 0.95,
                        lineHeight: 1.6
                    }}>
                        Bạn đã hoàn thành thành công chương trình cai thuốc lá! 🚭✨
                        <br />
                        Hành trình này không dễ dàng, nhưng bạn đã làm được!
                    </p>
                    <div style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 12,
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        backdropFilter: "blur(10px)"
                    }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                            🏆 Bạn đã chiến thắng thói quen xấu và tạo ra một tương lai khỏe mạnh hơn!
                        </div>
                    </div>

                    {/* Nút tiếp tục cai nghiện */}
                    <div style={{ marginTop: "2rem" }}>
                        <p style={{
                            fontSize: "1.1rem",
                            marginBottom: "1.5rem",
                            opacity: 0.9
                        }}>
                            🤔 Bạn có muốn tiếp tục hành trình cai nghiện và thử thách bản thân ở mức độ cao hơn không?
                        </p>
                        <button
                            onClick={() => navigate("/start-information")}
                            style={{
                                background: "#fff",
                                color: "#059669",
                                fontWeight: 700,
                                padding: "1rem 3rem",
                                borderRadius: 30,
                                fontSize: "1.2rem",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                                transition: "all 0.3s ease",
                                marginRight: "1rem"
                            }}
                            onMouseOver={e => {
                                e.target.style.transform = "translateY(-3px)";
                                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
                            }}
                            onMouseOut={e => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                            }}
                        >
                            🚀 Tiếp tục cai nghiện
                        </button>
                        <button
                            onClick={() => navigate("/member/dashboard")}
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                color: "#fff",
                                fontWeight: 600,
                                padding: "1rem 2.5rem",
                                borderRadius: 30,
                                fontSize: "1.1rem",
                                border: "2px solid rgba(255,255,255,0.3)",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={e => {
                                e.target.style.background = "rgba(255,255,255,0.3)";
                                e.target.style.borderColor = "rgba(255,255,255,0.5)";
                            }}
                            onMouseOut={e => {
                                e.target.style.background = "rgba(255,255,255,0.2)";
                                e.target.style.borderColor = "rgba(255,255,255,0.3)";
                            }}
                        >
                            📊 Về Dashboard
                        </button>
                    </div>
                </div>
            ) : statusProcess.statusProcess?.toLowerCase() === "fail" ? (
                // STATUS = FAIL - HIỆN THÔNG BÁO THẤT BẠI
                <div
                    style={{
                        maxWidth: 900,
                        margin: "4rem auto",
                        background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                        borderRadius: 20,
                        padding: "4rem 2rem",
                        color: "#fff",
                        textAlign: "center",
                        boxShadow: "0 8px 32px rgba(239,68,68,0.3)"
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>😔</div>
                    <h1 style={{
                        fontSize: "2.2rem",
                        fontWeight: 800,
                        marginBottom: "1rem",
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        Thất bại quá trình
                    </h1>
                    <p style={{
                        fontSize: "1.2rem",
                        marginBottom: "2rem",
                        opacity: 0.95,
                        lineHeight: 1.6
                    }}>
                        Rất tiếc, bạn chưa hoàn thành được chương trình cai thuốc lần này. 💪
                        <br />
                        Đừng nản lòng - mỗi lần thử đều là một bước tiến!
                    </p>
                    <div style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 12,
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        backdropFilter: "blur(10px)"
                    }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
                            💡 Đừng từ bỏ! Hãy thử lại và học hỏi từ kinh nghiệm này.
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/start-information")}
                        style={{
                            background: "#fff",
                            color: "#DC2626",
                            fontWeight: 700,
                            padding: "0.8rem 2.5rem",
                            borderRadius: 30,
                            fontSize: "1.1rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
                        onMouseOut={e => e.target.style.transform = "translateY(0)"}
                    >
                        🔄 Thử lại ngay
                    </button>
                </div>
            ) : (
                // STATUS = PROCESSING - HIỆN PLAN CONTENT (LIKE IN IMAGE)
                <>
                    {/* Call to action - với trạng thái đang tham gia */}
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
                            disabled={true}
                            style={{
                                background: "#27ae60",
                                color: "#fff",
                                fontWeight: 700,
                                padding: "0.7rem 2.2rem",
                                borderRadius: 30,
                                textDecoration: "none",
                                fontSize: "1.1rem",
                                boxShadow: "0 2px 8px rgba(72,166,167,0.10)",
                                border: "none",
                                cursor: "default"
                            }}
                        >
                            ✅ Đang tham gia
                        </button>
                    </div>

                    {/* Nội dung chính - Plan content */}
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
                        {/* Timer section */}
                        {planData?.startDate && (
                            <TimerSection startDate={planData.startDate} />
                        )}

                        {/* Progress Phases section - CHỨA THỐNG KÊ TỪ API */}
                        <ProgressPhasesSection />

                        {/* Cigarette input section */}
                        <CigaretteInputSection />
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}
