import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

export default function Plan() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showGuide, setShowGuide] = useState(false);

    // Lấy user info từ Redux hoặc AuthContext với debug
    // SỬA: Chỉ lấy từ Redux
    const { user, token } = useSelector((state) => state.account || {});



    const getUserId = () => {
        if (!user) return null;
        const claimId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const userId = user.userId;
        const id = user.id;
        const accountId = user.accountId;
        return claimId || userId || id || accountId || null;
    };

    const accountId = getUserId();

    // State cho việc kiểm tra status process
    const [statusProcess, setStatusProcess] = useState(null);
    const [statusLoading, setStatusLoading] = useState(true);
    const [planData, setPlanData] = useState(null);
    const [phaseData, setPhaseData] = useState(null);
    const [goalTime, setGoalTime] = useState(null);

    // State cho popup chi tiết giai đoạn
    const [showPhaseDetail, setShowPhaseDetail] = useState(false);
    const [selectedPhaseId, setSelectedPhaseId] = useState(null);
    const [phaseDetailData, setPhaseDetailData] = useState(null);
    const [phaseDetailLoading, setPhaseDetailLoading] = useState(false);

    // Lấy packageMembershipId từ user (Redux)
    const packageMembershipId = user?.packageMembershipId ?? 0;
    const [hasValidMembership, setHasValidMembership] = useState(
        packageMembershipId !== 0 && packageMembershipId !== null && packageMembershipId !== undefined
    );

    // Luôn cập nhật quyền truy cập khi packageMembershipId thay đổi
    useEffect(() => {
        setHasValidMembership(
            packageMembershipId !== 0 && packageMembershipId !== null && packageMembershipId !== undefined
        );
    }, [packageMembershipId]);

    // Định nghĩa các hàm fetch ở ngoài
    const fetchStatusProcess = async () => {
        if (!accountId || !token) {
            setStatusLoading(false);
            return;
        }
        try {
            setStatusLoading(true);
            const statusUrl = `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/status-process?accountId=${accountId}`;
            const response = await fetch(statusUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStatusProcess(data);
            } else {
                const text = await response.text();
                setStatusProcess({ statusProcess: text });
            }
        } catch (error) {
            setStatusProcess(null);
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchPlanAndPhaseData = async () => {
        if (!token || !accountId) return;
        try {
            // Fetch Plan data
            const planResponse = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Plan?accountId=${accountId}`,
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
                setPlanData(planResult);
            } else {
                setPlanData(null);
            }
            // Fetch Phase data
            const phaseResponse = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Phase/fail-stat?accountId=${accountId}`,
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
                setPhaseData(phaseResult);
            }
        } catch (error) {
            // ignore
        }
    };

    // Hàm fetch chi tiết giai đoạn
    const fetchPhaseDetail = async (phaseNumber) => {
        if (!token || !phaseNumber) return;
        try {
            setPhaseDetailLoading(true);
            console.log('🔍 Fetching phase detail for phaseNumber:', phaseNumber);
            const response = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PhaseDetail/${phaseNumber}`,
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
                console.log('✅ Phase detail data:', data);
                setPhaseDetailData(data);
            } else {
                console.error('❌ Failed to fetch phase detail:', response.status, response.statusText);
                setPhaseDetailData(null);
            }
        } catch (error) {
            console.error('❌ Error fetching phase detail:', error);
            setPhaseDetailData(null);
        } finally {
            setPhaseDetailLoading(false);
        }
    };

    // Hàm xử lý khi nhấn vào giai đoạn
    const handlePhaseClick = (phaseNumber) => {
        console.log('🔍 Phase clicked:', phaseNumber);
        console.log('🔍 Token available:', !!token);
        console.log('🔍 AccountId:', accountId);
        setSelectedPhaseId(phaseNumber);
        setShowPhaseDetail(true);
        fetchPhaseDetail(phaseNumber);
    };

    // BƯỚC 1: FETCH STATUS PROCESS TỪ API
    useEffect(() => {
        fetchStatusProcess();
    }, [accountId, token, packageMembershipId]); // Đảm bảo phụ thuộc packageMembershipId

    // BƯỚC 2: FETCH PLAN & PHASE DATA CHỈ KHI STATUS = "processing"
    useEffect(() => {
        const fetchData = async () => {
            const status = statusProcess?.statusProcess?.toLowerCase();
            if (status === "processing" || status === "success" || status === "fail") {
                await fetchPlanAndPhaseData();
            }
        };
        fetchData();
    }, [statusProcess, token, accountId]);

    // Fetch goalTime từ API khi có accountId và token
    useEffect(() => {
        const fetchGoalTime = async () => {
            if (!accountId || !token) return;
            try {
                const res = await fetch(
                    `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/myForm?accountId=${accountId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    setGoalTime(data.goalTime);
                }
            } catch (e) {
                setGoalTime(null);
            }
        };
        fetchGoalTime();
    }, [accountId, token]);

    // Hàm chuyển goalTime sang số ngày thất bại
    function getAllowedFailDays(goalTime) {
        if (goalTime === 180) return 8;
        if (goalTime === 270) return 11;
        if (goalTime === 365) return 15;
        return "-";
    }

    // Hàm chuyển đổi sang giờ Việt Nam (Asia/Ho_Chi_Minh)
    function toVietnamTime(date) {
        return new Date(new Date(date).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    }

    // Component nhập điếu thuốc riêng
    function CigaretteInputSection({ fetchPlanAndPhaseData, fetchStatusProcess }) {
        const [cigarettesToday, setCigarettesToday] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [error, setError] = useState(null);

        const handleSaveCigarettes = async () => {
            if (!cigarettesToday.trim()) {
                alert("Vui lòng nhập số điếu thuốc!");
                return;
            }

            const count = parseInt(cigarettesToday);
            if (isNaN(count) || count < 0) {
                alert("Vui lòng nhập số hợp lệ!");
                return;
            }

            if (!token || !accountId) {
                alert("Vui lòng đăng nhập để lưu dữ liệu!");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                setSuccess(false);

                const response = await fetch(
                    "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/today-cigarettes",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            todayCigarettes: count
                        })
                    }
                );

                if (response.ok) {
                    setSuccess(true);
                    setCigarettesToday("");
                    // Hiển thị thông báo thành công trước, sau đó mới cập nhật dữ liệu
                    setTimeout(() => {
                        if (fetchPlanAndPhaseData) fetchPlanAndPhaseData();
                        if (fetchStatusProcess) fetchStatusProcess();
                    }, 1000);
                } else {
                    let errorText;
                    try {
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.includes("application/json")) {
                            const errorJson = await response.json();
                            errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson);
                        } else {
                            errorText = await response.text();
                        }
                    } catch (parseError) {
                        errorText = `Parse error: ${parseError.message}`;
                    }

                    if (
                        response.status === 400 &&
                        errorText &&
                        (
                            errorText.toLowerCase().includes("phase deatil is entered for today") ||
                            errorText.toLowerCase().includes("already entered") ||
                            errorText.toLowerCase().includes("đã nhập") ||
                            errorText.toLowerCase().includes("exists for today")
                        )
                    ) {
                        setError("Ngày hôm nay bạn đã nhập rồi, ngày mai bạn hãy nhập lại nhé");
                    } else {
                        setError(`Lỗi ${response.status}: ${errorText || "Không thể lưu dữ liệu"}`);
                    }
                }
            } catch (error) {
                setError("Lỗi kết nối: " + error.message);
            } finally {
                setIsLoading(false);
            }
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
                    📊 Giới hạn cho phép: {planData?.maxCigarettes || 0} điếu/ngày<br />
                    Vượt quá giới hạn này sẽ được tính là thất bại
                </p>

                {/* Warning nếu vượt quá giới hạn */}
                {cigarettesToday && parseInt(cigarettesToday) > (planData?.maxCigarettes || 0) && (
                    <div style={{
                        background: "#FEF3C7",
                        border: "1px solid #F59E0B",
                        borderRadius: 8,
                        padding: "1rem",
                        marginBottom: "1rem",
                        color: "#92400E"
                    }}>
                        ⚠️ Cảnh báo: Bạn đã nhập {cigarettesToday} điếu, vượt quá giới hạn {planData?.maxCigarettes || 0} điếu/ngày!<br />
                        <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                            Điều này sẽ được tính là ngày thất bại trong kế hoạch cai thuốc.
                        </span>
                    </div>
                )}
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
                        disabled={isLoading}
                        style={{
                            background: isLoading ? "#9CA3AF" : "#48A6A7",
                            color: "white",
                            padding: "0.8rem 1.5rem",
                            borderRadius: 8,
                            border: "none",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontSize: "1rem",
                            fontWeight: 600,
                            transition: "all 0.3s ease"
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{ marginRight: "0.5rem" }}>⏳</span>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <span style={{ marginRight: "0.5rem" }}>💾</span>
                                Lưu
                            </>
                        )}
                    </button>
                </div>

                {/* Success Message */}
                {success && (
                    <div style={{
                        color: "#10B981",
                        marginTop: "1rem",
                        padding: "0.8rem",
                        background: "#D1FAE5",
                        borderRadius: 8,
                        border: "1px solid #10B981"
                    }}>
                        ✅ Đã lưu thành công {cigarettesToday || "số điếu"} hôm nay!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{
                        color: "#EF4444",
                        marginTop: "1rem",
                        padding: "0.8rem",
                        background: "#FEE2E2",
                        borderRadius: 8,
                        border: "1px solid #EF4444"
                    }}>
                        ❌ {error}
                    </div>
                )}
            </section>
        );
    }

    // Component hiển thị thống kê progress phases từ API
    function ProgressPhasesSection() {
        // Nếu không có dữ liệu, hiển thị lỗi rõ ràng
        if (!planData && !phaseData) {
            return (
                <div style={{ textAlign: "center", padding: "2rem", color: "#EF4444", background: "#FEE2E2", borderRadius: 12 }}>
                    ❌ Không thể tải dữ liệu kế hoạch!<br />
                    <span style={{ color: "#6B7280", fontSize: "0.95rem" }}>
                        planData: {JSON.stringify(planData)}<br />
                        phaseData: {JSON.stringify(phaseData)}
                    </span>
                    <br />
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: 16,
                            background: "#6B7280",
                            color: "white",
                            fontWeight: 700,
                            padding: "0.6rem 2rem",
                            borderRadius: 20,
                            fontSize: "1rem",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        🔄 Thử tải lại
                    </button>
                </div>
            );
        }

        // Debug log dữ liệu từ API
        console.log("📊 ProgressPhasesSection data:", {
            planData: planData ? {
                phaseNumber: planData.phaseNumber,
                numberOfDays: planData.numberOfDays,
                totalSaveMoney: planData.totalSaveMoney,
                maxCigarettes: planData.maxCigarettes
            } : null,
            phaseData: phaseData ? phaseData.map(phase => ({
                phaseNumber: phase.phaseNumber,
                totalDays: phase.totalDays,
                failedDays: phase.failedDays
            })) : null
        });

        // Tính tổng ngày và tổng ngày fail từ Phase API
        const calculateTotals = () => {
            if (!phaseData || !Array.isArray(phaseData)) {
                console.log("⚠️ No phase data available for calculations");
                return { totalDays: 0, totalFailedDays: 0 };
            }

            console.log("📊 Calculating totals from phase data:", phaseData);

            const totalDays = phaseData.reduce((sum, phase) => sum + (phase.totalDays || 0), 0);
            const totalFailedDays = phaseData.reduce((sum, phase) => sum + (phase.failedDays || 0), 0);

            console.log("📊 Calculated totals:", {
                totalDays,
                totalFailedDays,
                phaseBreakdown: phaseData.map(phase => ({
                    phaseNumber: phase.phaseNumber,
                    totalDays: phase.totalDays,
                    failedDays: phase.failedDays
                }))
            });

            return { totalDays, totalFailedDays };
        };

        const { totalDays, totalFailedDays } = calculateTotals();
        const successDays = totalDays - totalFailedDays;
        const successRate = totalDays > 0 ? (successDays / totalDays * 100) : 0;

        // Tìm phase hiện tại
        const getCurrentPhase = () => {
            if (!planData) return null;

            // Dựa vào phaseNumber từ Plan API
            const currentPhaseNum = planData.phaseNumber || 1;
            return {
                phase: currentPhaseNum,
                startDate: planData[`startDatePhase${currentPhaseNum}`],
                endDate: planData[`endDatePhase${currentPhaseNum}`],
                status: planData[`statusPhase${currentPhaseNum}`] || "Đang thực hiện"
            };
        };

        const currentPhase = getCurrentPhase();

        return (
            <section style={{
                background: "#FAFAFA",
                borderRadius: 12,
                padding: "2rem",
                marginBottom: 24,
                maxWidth: 900,
                margin: "2rem auto"
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

                {/* Thông tin tổng quan từ APIs */}
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
                                {planData?.phaseNumber || 1}/5
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#059669" }}>Giai đoạn hiện tại</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16A34A" }}>
                                {planData?.numberOfDays || 0}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#059669" }}>Ngày đã cai thuốc</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#059669" }}>
                                {(() => {
                                    const money = planData?.totalSaveMoney || 0;
                                    if (money === 0) return "0₫";
                                    return money.toLocaleString('vi-VN') + "₫";
                                })()}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#059669" }}>Tiền đã tiết kiệm</div>
                        </div>
                        {/* Thêm mục số điếu đã bỏ */}
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3B82F6" }}>
                                {planData?.totalCigarettesQuit ?? 0}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#3B82F6" }}>Số điếu đã bỏ</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#DC2626" }}>
                                {planData?.maxCigarettes || 0}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#DC2626" }}>Giới hạn điếu/ngày</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#DC2626" }}>
                                {totalFailedDays}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#DC2626" }}>Số ngày thất bại</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#DC2626" }}>
                                {getAllowedFailDays(goalTime)}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#DC2626" }}>
                                Số ngày thất bại cho phép
                            </div>
                        </div>
                    </div>


                </div>

                {/* Danh sách các phases từ Plan API */}
                <div style={{ marginTop: "2rem" }}>
                    <h4 style={{ color: "#374151", marginBottom: "1rem", textAlign: "center" }}>
                        📅 Chi tiết 5 giai đoạn cai thuốc
                    </h4>
                    {[1, 2, 3, 4, 5].map((phaseNum) => {
                        const startDate = planData?.[`startDatePhase${phaseNum}`];
                        const endDate = planData?.[`endDatePhase${phaseNum}`];
                        const statusApi = planData?.[`statusPhase${phaseNum}`] || "Chưa bắt đầu";
                        const phaseStats = Array.isArray(phaseData)
                            ? phaseData.find(p => p.phaseId === (15 + phaseNum))
                            : null;

                        // Xác định màu sắc dựa vào statusApi
                        let badgeColor = "#6B7280"; // xám
                        let bgColor = "#F9FAFB";
                        let borderColor = "#E5E7EB";
                        let progressColor = "#9CA3AF";
                        let progressWidth = "0%";

                        if (statusApi.toLowerCase().includes("thành công") || statusApi.toLowerCase().includes("hoàn thành")) {
                            badgeColor = "#10B981"; // xanh lá
                            bgColor = "#ECFDF5";
                            borderColor = "#6EE7B7";
                            progressColor = "#10B981";
                            progressWidth = "100%";
                        } else if (statusApi.toLowerCase().includes("thất bại")) {
                            badgeColor = "#EF4444"; // đỏ
                            bgColor = "#FEE2E2";
                            borderColor = "#FCA5A5";
                            progressColor = "#EF4444";
                            progressWidth = "100%";
                        } else if (statusApi.toLowerCase().includes("đang tiến hành") || statusApi.toLowerCase().includes("đang thực hiện")) {
                            badgeColor = "#F59E0B"; // vàng
                            bgColor = "#FEF9C3";
                            borderColor = "#FDE68A";
                            progressColor = "#F59E0B";
                            progressWidth = "50%";
                        } else if (statusApi.toLowerCase().includes("chưa bắt đầu") || statusApi.toLowerCase().includes("sắp tới")) {
                            badgeColor = "#6B7280"; // xám
                            bgColor = "#F9FAFB";
                            borderColor = "#E5E7EB";
                            progressColor = "#9CA3AF";
                            progressWidth = "0%";
                        } else {
                            badgeColor = "#3B82F6";
                            bgColor = "#DBEAFE";
                            borderColor = "#93C5FD";
                            progressColor = "#3B82F6";
                            progressWidth = "0%";
                        }

                        return (
                            <div
                                key={phaseNum}
                                style={{
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: 12,
                                    padding: "1.5rem",
                                    marginBottom: "1rem",
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                                onClick={() => handlePhaseClick(phaseNum)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background: badgeColor,
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold"
                                        }}>
                                            {phaseNum}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: "#111827", fontSize: "1.1rem" }}>
                                                Giai đoạn {phaseNum}
                                            </h4>
                                            <p style={{ margin: "4px 0 0 0", color: "#6B7280", fontSize: "0.9rem" }}>
                                                {statusApi}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{
                                        background: badgeColor,
                                        color: "white",
                                        padding: "0.3rem 0.8rem",
                                        borderRadius: 20,
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        minWidth: 100,
                                        textAlign: "center"
                                    }}>
                                        {statusApi}
                                    </div>
                                </div>

                                <div style={{ marginBottom: "1rem" }}>
                                    <div style={{ color: "#374151", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                        📅 {startDate ? new Date(startDate).toLocaleDateString("vi-VN") : "N/A"} - {endDate ? new Date(endDate).toLocaleDateString("vi-VN") : "N/A"}
                                    </div>
                                    {phaseStats && (
                                        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#6B7280" }}>
                                            <span>❌ Ngày thất bại: {phaseStats.failedDays || 0}</span>
                                            <span>📈 Tổng ngày: {phaseStats.totalDays || 0}</span>
                                            <span>Trạng thái: {phaseStats.statusPhase || "N/A"}</span>
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
                                        background: progressColor,
                                        height: "100%",
                                        width: progressWidth,
                                        transition: "width 0.3s ease"
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    // Hàm xử lý khi nhấn "Tham gia ngay"
    const handleJoinNow = () => {
        // Kiểm tra đăng nhập
        if (!token || !accountId) {
            alert("Vui lòng đăng nhập để tham gia!");
            navigate("/login");
            return;
        }


        if (!hasValidMembership) {
            alert("Bạn cần mua gói thành viên còn hạn sử dụng để tham gia chương trình!");
            navigate("/payment");
            return;
        }


        navigate("/start-information");
    };


    return (
        <div
            style={{

                minHeight: "100vh",
                color: "#006A71",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                padding: "0 0 2rem 0"
            }}
        >
            {/* Nút bấm hiện/ẩn hướng dẫn */}
            <div style={{ maxWidth: 900, margin: "32px auto 0 auto", textAlign: "center", }}>
                <button
                    onClick={() => setShowGuide(v => !v)}
                    style={{
                        background: showGuide
                            ? "linear-gradient(90deg, #0284C7 0%, #48A6A7 100%)"
                            : "linear-gradient(90deg, #48A6A7 0%, #0EA5E9 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "0.85rem 2.2rem",
                        fontWeight: 800,
                        fontSize: "1.08rem",
                        cursor: "pointer",
                        boxShadow: showGuide
                            ? "0 4px 18px rgba(2,132,199,0.15)"
                            : "0 2px 10px rgba(56,189,248,0.13)",
                        marginBottom: showGuide ? 0 : 24,
                        transition: "all 0.25s cubic-bezier(.4,2,.6,1)",
                        letterSpacing: 0.5,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        outline: "none",
                        position: "relative",
                        overflow: "hidden"
                    }}
                    onMouseOver={e => {
                        e.target.style.transform = "translateY(-2px) scale(1.04)";
                        e.target.style.boxShadow = "0 8px 28px rgba(2,132,199,0.18)";
                    }}
                    onMouseOut={e => {
                        e.target.style.transform = "none";
                        e.target.style.boxShadow = showGuide
                            ? "0 4px 18px rgba(2,132,199,0.15)"
                            : "0 2px 10px rgba(56,189,248,0.13)";
                    }}
                >
                    <span style={{
                        fontSize: "1.3rem",
                        display: "inline-block",
                        animation: showGuide ? "spin 0.7s linear" : "none"
                    }}>
                        📖
                    </span>
                    {showGuide ? "Ẩn hướng dẫn" : "Xem hướng dẫn sử dụng"}
                </button>
            </div>

            {/* HƯỚNG DẪN SỬ DỤNG KẾ HOẠCH CAI THUỐC */}
            {showGuide && (
                <div
                    style={{
                        maxWidth: 900,
                        margin: "16px auto 24px auto",
                        background: "linear-gradient(135deg, #E0F2FE 0%, #F1F5F9 100%)",
                        border: "2px solid #38BDF8",
                        borderRadius: 16,
                        padding: "2rem 2rem 1.5rem 2rem",
                        boxShadow: "0 4px 24px rgba(56,189,248,0.08)",
                        color: "#0F172A"
                    }}
                >
                    <h2 style={{ color: "#0284C7", fontWeight: 800, marginBottom: 12, fontSize: "1.5rem" }}>
                        📖 Nguyên tắc hoạt động của Kế hoạch cai thuốc
                    </h2>
                    <ul style={{ paddingLeft: 20, marginBottom: 18 }}>
                        <li style={{ marginBottom: 8 }}>
                            <b>✅ Chia nhỏ hành trình thành 5 giai đoạn (phase)</b>
                            <ul style={{ marginTop: 6, marginBottom: 6 }}>
                                <li>
                                    Tổng thời gian bạn đặt ra để cai thuốc sẽ được chia thành 5 giai đoạn.
                                </li>
                                <li>
                                    4 giai đoạn đầu là chính thức, giai đoạn thứ 5 là <b>dự phòng (backup phase)</b>.
                                </li>
                                <li>
                                    Mỗi giai đoạn có số ngày bằng nhau và mục tiêu giảm dần số điếu thuốc được phép hút.
                                </li>
                            </ul>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <b>🛡️ Giai đoạn dự phòng là gì?</b>
                            <ul style={{ marginTop: 6, marginBottom: 6 }}>
                                <li>
                                    Giai đoạn dự phòng sẽ không được sử dụng nếu bạn hoàn thành 4 giai đoạn đầu thành công.
                                </li>
                                <li>
                                    Nếu bạn thất bại 1 trong 4 giai đoạn chính, hệ thống sẽ kích hoạt giai đoạn dự phòng để thay thế cho giai đoạn bị thất bại đó.
                                </li>
                                <li>
                                    Như vậy, bạn vẫn có thể hoàn thành quá trình cai thuốc trong 4 giai đoạn, nếu bạn làm tốt.
                                </li>
                            </ul>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <b>🚬 Giới hạn số điếu hút mỗi ngày</b>
                            <ul style={{ marginTop: 6, marginBottom: 6 }}>
                                <li>
                                    Mỗi ngày, hệ thống sẽ tự động tính toán và hiển thị số điếu tối đa bạn được phép hút.
                                </li>
                                <li>
                                    Mức độ giảm sẽ được điều chỉnh đều theo từng giai đoạn.
                                </li>
                            </ul>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <b>📝 Báo cáo số điếu đã hút</b>
                            <ul style={{ marginTop: 6, marginBottom: 6 }}>
                                <li>
                                    Cuối mỗi ngày, bạn cần nhập số điếu thuốc thực tế bạn đã hút hôm nay.
                                </li>
                            </ul>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <b>⚠️ Quy tắc đánh giá thất bại</b>
                            <ul style={{ marginTop: 6, marginBottom: 6 }}>
                                <li>
                                    <b>❌ Thất bại trong một ngày:</b> Nếu bạn hút vượt quá số điếu cho phép hoặc không nhập số liệu, ngày đó sẽ bị đánh là thất bại.
                                </li>
                                <li>
                                    <b>❌ Thất bại cả giai đoạn:</b> Nếu số ngày thất bại &gt; 20% tổng số ngày của một giai đoạn, giai đoạn đó bị đánh dấu là thất bại.
                                </li>
                                <li>
                                    <b>🔁 Kích hoạt giai đoạn dự phòng:</b> Khi một giai đoạn thất bại, các giai đoạn tiếp theo sẽ được tự động cập nhật lại, bắt đầu từ ngày kế tiếp. Mức độ cai thuốc sẽ được giữ nguyên như giai đoạn thất bại, và quá trình tiếp tục từ đó.
                                </li>
                                <li>
                                    <b>❌ Thất bại toàn bộ kế hoạch:</b> Nếu bạn thất bại từ 2 giai đoạn trở lên (kể cả giai đoạn dự phòng), bạn sẽ bị đánh giá là thất bại toàn bộ kế hoạch. Khi đó, bạn cần khởi tạo lại một kế hoạch cai thuốc mới từ đầu.
                                </li>
                            </ul>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <b>📌 Lưu ý quan trọng</b>
                            <ul style={{ marginTop: 6, marginBottom: 6 }}>
                                <li>
                                    Hãy đăng nhập mỗi ngày và cập nhật số điếu thuốc bạn hút chính xác để hệ thống ghi nhận kết quả đúng.
                                </li>
                                <li>
                                    Chúng tôi khuyến khích bạn kiên trì và thành thật với chính mình để đạt được kết quả tốt nhất.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <b>🎯 Lợi ích nếu bạn làm tốt</b>
                            <ul style={{ marginTop: 6 }}>
                                <li>
                                    Nếu bạn hoàn thành tốt cả 4 giai đoạn chính, bạn không cần dùng đến giai đoạn dự phòng, và có thể kết thúc quá trình cai thuốc sớm hơn.
                                </li>
                                <li>
                                    Điều này giúp bạn rút ngắn thời gian, tiết kiệm chi phí và tăng sự tự tin vào bản thân!
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            )}

            {/* 1. Nếu chưa có gói thành viên */}
            {!hasValidMembership ? (
                <div
                    style={{
                        margin: "20px auto",
                        maxWidth: 900,
                        background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                        border: "2px solid #EF4444",
                        borderRadius: 12,
                        padding: "1rem 1.5rem",
                        textAlign: "center"
                    }}
                >
                    <div style={{
                        color: "#991B1B",
                        fontWeight: 600,
                        fontSize: "1rem"
                    }}>
                        ❌ Bạn chưa có gói thành viên hoặc đã hết hạn
                    </div>
                    <div style={{
                        marginTop: "0.5rem",
                        color: "#EF4444",
                        fontWeight: 600
                    }}>
                        Vui lòng mua gói thành viên để sử dụng chức năng này!
                    </div>
                </div>
            ) : statusLoading ? (
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
            ) : (
                <>
                    {/* Nếu statusProcess trả về "Không tìm thấy StatusProcess." */}
                    {statusProcess?.statusProcess?.toLowerCase().includes("không tìm thấy statusprocess") ? (
                        <div
                            style={{
                                maxWidth: 900,
                                margin: "4rem auto",
                                background: "#F3F4F6",
                                borderRadius: 20,
                                padding: "4rem 2rem",
                                color: "#374151",
                                textAlign: "center",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                            }}
                        >
                            <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>📝</div>
                            <h1 style={{
                                fontSize: "2.2rem",
                                fontWeight: 800,
                                marginBottom: "1rem"
                            }}>
                                Bạn chưa bắt đầu kế hoạch cai thuốc
                            </h1>
                            <p style={{
                                fontSize: "1.2rem",
                                marginBottom: "2rem",
                                lineHeight: 1.6
                            }}>
                                Hãy điền thông tin để bắt đầu kế hoạch của bạn!
                            </p>
                            <button
                                onClick={() => navigate("/start-information")}
                                style={{
                                    background: "#48A6A7",
                                    color: "white",
                                    fontWeight: 700,
                                    padding: "0.8rem 2.5rem",
                                    borderRadius: 30,
                                    fontSize: "1.1rem",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    transition: "all 0.2s"
                                }}
                            >
                                👉 Điền thông tin bắt đầu
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Các trạng thái khác giữ nguyên như cũ */}
                            {statusProcess?.statusProcess?.toLowerCase() === "success" ? (
                                <>
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
                                        </div>
                                    </div>
                                    <ProgressPhasesSection />
                                </>
                            ) : statusProcess?.statusProcess?.toLowerCase() === "fail" ? (
                                <>
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
                                    <ProgressPhasesSection />
                                </>
                            ) : statusProcess?.statusProcess?.toLowerCase() === "processing" ? (
                                // STATUS = PROCESSING - HIỆN PLAN CONTENT
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
                                        <h2 style={{ fontWeight: 800, marginBottom: 10 }}>Bạn đang trong quá trình cai thuốc</h2>
                                        <p style={{ fontSize: "1.15rem", marginBottom: 18 }}>
                                            Hãy theo dõi tiến trình và nhập số điếu thuốc hàng ngày để hoàn thành kế hoạch!
                                        </p>
                                        <div
                                            style={{
                                                background: "#27ae60",
                                                color: "#fff",
                                                fontWeight: 700,
                                                padding: "0.7rem 2.2rem",
                                                borderRadius: 30,
                                                fontSize: "1.1rem",
                                                boxShadow: "0 2px 8px rgba(72,166,167,0.10)",
                                                border: "none",
                                                display: "inline-block"
                                            }}
                                        >
                                            ✅ Đang tham gia
                                        </div>
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
                                        {/* Chuyển CigaretteInputSection lên trên */}
                                        <CigaretteInputSection
                                            fetchPlanAndPhaseData={fetchPlanAndPhaseData}
                                            fetchStatusProcess={fetchStatusProcess}
                                        />

                                        {/* Progress Phases section - CHỨA THỐNG KÊ TỪ API */}
                                        <ProgressPhasesSection />
                                    </div>
                                </>
                            ) : (
                                // DEFAULT CASE - Trạng thái không xác định
                                <div
                                    style={{
                                        maxWidth: 900,
                                        margin: "4rem auto",
                                        background: "#F3F4F6",
                                        borderRadius: 20,
                                        padding: "4rem 2rem",
                                        color: "#374151",
                                        textAlign: "center",
                                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>❓</div>
                                    <h1 style={{
                                        fontSize: "2.2rem",
                                        fontWeight: 800,
                                        marginBottom: "1rem"
                                    }}>
                                        Trạng thái không xác định
                                    </h1>
                                    <p style={{
                                        fontSize: "1.2rem",
                                        marginBottom: "2rem",
                                        lineHeight: 1.6
                                    }}>
                                        Không thể xác định trạng thái hiện tại của bạn.
                                        <br />
                                        Vui lòng thử lại hoặc liên hệ hỗ trợ.
                                    </p>
                                    <div style={{
                                        color: "#6B7280",
                                        fontSize: "0.9rem",
                                        marginBottom: "2rem",
                                        padding: "1rem",
                                        background: "#F9FAFB",
                                        borderRadius: 8
                                    }}>
                                        Trạng thái hiện tại: {statusProcess?.statusProcess || "Không có"}
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        style={{
                                            background: "#6B7280",
                                            color: "white",
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
                                        🔄 Thử lại
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    <Footer />
                </>
            )}

            {/* Popup chi tiết giai đoạn */}
            {showPhaseDetail && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "2rem",
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        width: "600px",
                        overflow: "auto",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1.5rem"
                        }}>
                            <h2 style={{
                                margin: 0,
                                color: "#006A71",
                                fontSize: "1.5rem",
                                fontWeight: 800
                            }}>
                                📊 Chi tiết giai đoạn {selectedPhaseId || ''}
                            </h2>
                            <button
                                onClick={() => setShowPhaseDetail(false)}
                                style={{
                                    background: "#EF4444",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 40,
                                    height: 40,
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {phaseDetailLoading ? (
                            <div style={{
                                textAlign: "center",
                                padding: "3rem",
                                color: "#48A6A7"
                            }}>
                                🔄 Đang tải chi tiết...
                            </div>
                        ) : phaseDetailData && Array.isArray(phaseDetailData) ? (
                            <div style={{ maxHeight: "60vh", overflow: "auto" }}>
                                <div style={{
                                    background: "#F0F9FF",
                                    padding: "1rem",
                                    borderRadius: 12,
                                    marginBottom: "1rem",
                                    textAlign: "center"
                                }}>
                                    <strong style={{ color: "#0369A1" }}>
                                        Tổng số ngày: {phaseDetailData.length}
                                    </strong>
                                </div>

                                {phaseDetailData.map((detail, index) => {
                                    // Kiểm tra ngày hiện tại để xác định trạng thái
                                    const currentDate = new Date();
                                    const detailDate = new Date(detail.date);
                                    const isUpcoming = detailDate > currentDate;

                                    // Xác định trạng thái hiển thị
                                    let status, statusText, bgColor, borderColor, textColor;

                                    if (isUpcoming) {
                                        // Ngày chưa tới -> Sắp tới
                                        status = "upcoming";
                                        statusText = "⏳ Sắp tới";
                                        bgColor = "#F8FAFC";
                                        borderColor = "#94A3B8";
                                        textColor = "#475569";
                                    } else if (detail.isSuccess) {
                                        // Ngày đã qua + thành công
                                        status = "success";
                                        statusText = "✅ Thành công";
                                        bgColor = "#F0FDF4";
                                        borderColor = "#10B981";
                                        textColor = "#059669";
                                    } else {
                                        // Ngày đã qua + thất bại
                                        status = "failed";
                                        statusText = "❌ Thất bại";
                                        bgColor = "#FEF2F2";
                                        borderColor = "#EF4444";
                                        textColor = "#DC2626";
                                    }

                                    return (
                                        <div
                                            key={detail.phaseDetailId}
                                            style={{
                                                background: bgColor,
                                                border: `2px solid ${borderColor}`,
                                                borderRadius: 12,
                                                padding: "1rem",
                                                marginBottom: "0.8rem"
                                            }}
                                        >
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "0.5rem"
                                            }}>
                                                <div style={{
                                                    fontWeight: 700,
                                                    color: textColor
                                                }}>
                                                    📅 Ngày {detail.clock}: {new Date(detail.date).toLocaleDateString("vi-VN")}
                                                </div>
                                                <div style={{
                                                    background: status === "upcoming" ? "#94A3B8" : (detail.isSuccess ? "#10B981" : "#EF4444"),
                                                    color: "#fff",
                                                    padding: "0.2rem 0.8rem",
                                                    borderRadius: 20,
                                                    fontSize: "0.8rem",
                                                    fontWeight: 600
                                                }}>
                                                    {statusText}
                                                </div>
                                            </div>

                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                                                gap: "0.8rem",
                                                fontSize: "0.9rem"
                                            }}>
                                                <div>
                                                    <strong>🚬 Điếu đã hút:</strong><br />
                                                    <span style={{ color: detail.todayCigarettes === -1 ? "#6B7280" : "#DC2626" }}>
                                                        {detail.todayCigarettes === -1 ? "Chưa nhập" : detail.todayCigarettes}
                                                    </span>
                                                </div>
                                                <div>
                                                    <strong>📊 Giới hạn:</strong><br />
                                                    <span style={{ color: "#059669" }}>{detail.maxCigarettes}</span>
                                                </div>
                                                <div>
                                                    <strong>💰 Tiền tiết kiệm:</strong><br />
                                                    <span style={{ color: "#059669" }}>
                                                        {detail.saveMoney.toLocaleString('vi-VN')}₫
                                                    </span>
                                                </div>
                                                <div>
                                                    <strong>🚭 Điếu đã bỏ:</strong><br />
                                                    <span style={{ color: "#3B82F6" }}>{detail.cigarettesQuit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: "center",
                                padding: "3rem",
                                color: "#EF4444"
                            }}>
                                ❌ Không thể tải chi tiết giai đoạn
                            </div>
                        )}

                        <div style={{
                            textAlign: "center",
                            marginTop: "1.5rem"
                        }}>
                            <button
                                onClick={() => setShowPhaseDetail(false)}
                                style={{
                                    background: "#48A6A7",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 12,
                                    padding: "0.8rem 2rem",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}