import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import AuthContext from "../../AuthContext/AuthContext";

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

// Modal component
function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.25)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <div style={{
                background: "#fff", borderRadius: 12, padding: "2rem 2.5rem", minWidth: 320, maxWidth: "90vw", boxShadow: "0 4px 32px #0002", position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, color: "#888", cursor: "pointer"
                }} aria-label="Đóng">&times;</button>
                {children}
            </div>
        </div>
    );
}

export default function Plan() {
    const [cigarettesToday, setCigarettesToday] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const quitProgress = 2;

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const token = auth?.token;

    // Thêm state cho dữ liệu từ API Plan
    const [planData, setPlanData] = useState({
        totalSaveMoney: 0,
        totalCigarettesQuit: 0,
        maxCigarettes: 0,
        phases: []
    });
    const [planLoading, setPlanLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            setPlanLoading(true);
            try {
                const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Plan", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    // Tạo mảng phases từ dữ liệu API
                    const phases = [
                        {
                            phase: 1,
                            phaseId: data.phaseId1,
                            start: data.startDatePhase1,
                            end: data.endDatePhase1,
                            status: data.statusPhase1
                        },
                        {
                            phase: 2,
                            phaseId: data.phaseId2,
                            start: data.startDatePhase2,
                            end: data.endDatePhase2,
                            status: data.statusPhase2
                        },
                        {
                            phase: 3,
                            phaseId: data.phaseId3,
                            start: data.startDatePhase3,
                            end: data.endDatePhase3,
                            status: data.statusPhase3
                        },
                        {
                            phase: 4,
                            phaseId: data.phaseId4,
                            start: data.startDatePhase4,
                            end: data.endDatePhase4,
                            status: data.statusPhase4
                        },
                        {
                            phase: 5,
                            phaseId: data.phaseId5,
                            start: data.startDatePhase5,
                            end: data.endDatePhase5,
                            status: data.statusPhase5
                        }
                    ];
                    setPlanData({
                        totalSaveMoney: data.totalSaveMoney ?? 0,
                        totalCigarettesQuit: data.totalCigarettesQuit ?? 0,
                        maxCigarettes: data.maxCigarettes ?? 0,
                        phases
                    });
                }
            } catch (err) {
                // Có thể xử lý lỗi nếu muốn
            }
            setPlanLoading(false);
        };
        if (token) fetchPlan();
    }, [token]);

    const handleCigaretteSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(false);
        setLoading(true);
        setApiError("");
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/today-cigarettes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    todayCigarettes: Number(cigarettesToday)
                })
            });
            const text = await res.text();
            console.log("API trả về:", text);
            if (!res.ok) {
                // Lấy message chi tiết từ API (ưu tiên json, fallback text)
                let errorMsg = "Lưu thất bại";
                try {
                    const data = await res.json();
                    errorMsg = data.message || JSON.stringify(data);
                } catch {
                    errorMsg = await res.text();
                }
                setApiError(errorMsg);
                setLoading(false);
                return;
            }
            setSubmitted(true);
        } catch (err) {
            setApiError("Lưu thất bại, vui lòng thử lại!");
        }
        setLoading(false);
    };

    // Modal state
    const [modalStageIdx, setModalStageIdx] = useState(null);
    const [modalPhaseId, setModalPhaseId] = useState(null);
    const [phaseDetail, setPhaseDetail] = useState(null);
    const [phaseLoading, setPhaseLoading] = useState(false);
    const [phaseError, setPhaseError] = useState("");

    // Hàm lấy fail-stat khi mở chi tiết phase
    const handleOpenModal = async (idx, phaseId) => {
        setModalStageIdx(idx);
        setModalPhaseId(phaseId);
        setPhaseLoading(true);
        setPhaseError("");
        try {
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Phase/fail-stat?phaseId=${phaseId}`,
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Không lấy được dữ liệu phase");
            const data = await res.json();
            setPhaseDetail(data);
        } catch (err) {
            setPhaseError("Không lấy được dữ liệu phase");
            setPhaseDetail(null);
        }
        setPhaseLoading(false);
    };

    // Lấy trạng thái đã gửi thông tin
    const user = JSON.parse(localStorage.getItem("user"));
    const accountId = user?.accountId ?? user?.id ?? null;
    const infoSubmitted = !!localStorage.getItem(`info_submitted_${accountId}`);

    // Lấy thời điểm bắt đầu cai thuốc cho user hiện tại (theo giờ Việt Nam)
    const quitStartDate = localStorage.getItem(`quit_start_${accountId}`) || toVietnamTime(new Date()).toISOString();

    // Chỉ gọi useQuitTimer nếu đã submit
    const timer = infoSubmitted ? useQuitTimer(quitStartDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 };

    // Dữ liệu các giai đoạn
    const stages = planData.phases.map(phase => ({
        name: `Giai đoạn ${phase.phase}`,
        label: phase.status,
        start: phase.start,
        end: phase.end,
        status: phase.status,
        phaseId: phase.phaseId
    }));

    return (
        <>
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
                        disabled={infoSubmitted}
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
                            cursor: infoSubmitted ? "not-allowed" : "pointer"
                        }}
                        onMouseOver={e => { if (!infoSubmitted) e.currentTarget.style.background = "#48A6A7"; }}
                        onMouseOut={e => { if (!infoSubmitted) e.currentTarget.style.background = "#006A71"; }}
                    >
                        {infoSubmitted ? "Đang tham gia" : "Tham gia ngay"}
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
                    }}
                >
                    {/* Đồng hồ đếm số ngày đã cai thuốc */}
                    <div style={{
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
                        {infoSubmitted ? (
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
                        ) : (
                            <div style={{ color: "#888", fontWeight: 500, fontSize: "1.15rem" }}>
                                Hãy nhập thông tin bắt đầu cai thuốc để bắt đầu đếm thời gian!
                            </div>
                        )}
                    </div>

                    {/* Mục nhập số điếu thuốc hôm nay đã hút */}
                    <section
                        style={{
                            maxWidth: 500,
                            margin: "0 auto 2rem auto",
                            background: "#F2EFE7",
                            padding: "1.2rem 2rem",
                            borderRadius: 12,
                            boxShadow: "0 2px 12px rgba(154,203,208,0.10)",
                            textAlign: "center"
                        }}
                    >
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
                                    setApiError("");
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
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "0.5rem 1.2rem",
                                    fontWeight: 600,
                                    fontSize: "1.05rem",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    boxShadow: "0 2px 8px rgba(72,166,167,0.10)"
                                }}
                                onMouseOver={e => e.currentTarget.style.background = "#006A71"}
                                onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)"}
                            >
                                {loading ? "Đang lưu..." : "Lưu"}
                            </button>
                        </form>
                        {apiError && (
                            <div style={{ color: "#e74c3c", marginTop: 10, fontWeight: 500 }}>
                                {apiError}
                            </div>
                        )}
                        {submitted && !apiError && (
                            <div style={{ color: "#27ae60", marginTop: 10, fontWeight: 500 }}>
                                Đã lưu: {cigarettesToday} điếu thuốc hôm nay!
                            </div>
                        )}
                    </section>

                    {/* Thông tin cá nhân hóa */}
                    <div style={{
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
                                {planLoading ? "..." : planData.totalSaveMoney.toLocaleString()}₫
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
                                {planLoading ? "..." : planData.totalCigarettesQuit}
                            </div>
                        </div>
                        <div style={{
                            flex: "1 1 180px",
                            background: "#E6F4F4",
                            borderRadius: 12,
                            padding: "1.2rem",
                            boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                        }}>
                            <div style={{ fontWeight: 600, color: "#48A6A7" }}>Số điếu được hút trong ngày</div>
                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e67e22" }}>
                                {planLoading ? "..." : planData.maxCigarettes}
                            </div>
                        </div>
                    </div>

                    {/* Quá trình cai thuốc */}
                    <div style={{
                        background: "#E6F4F4",
                        borderRadius: 12,
                        padding: "1.5rem",
                        boxShadow: "0 1px 6px rgba(154,203,208,0.10)",
                        marginBottom: 36
                    }}>
                        <div style={{ fontWeight: 600, color: "#48A6A7", marginBottom: 18, fontSize: "1.15rem" }}>
                            Quá trình cai thuốc
                        </div>
                        <div style={{ position: "relative", marginBottom: 40 }}>
                            {/* Thanh nền */}
                            <div style={{
                                width: "100%",
                                height: 28,
                                background: "#9ACBD0",
                                borderRadius: 10,
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                {/* Thanh tiến trình */}
                                <div style={{
                                    width: `${quitProgress}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                    borderRadius: 10,
                                    transition: "width 0.5s"
                                }} />
                                {/* Vạch chia 4 đoạn */}
                                {[1, 2, 3].map(i => (
                                    <div key={i}
                                        style={{
                                            position: "absolute",
                                            left: `${(i * 25)}%`,
                                            top: 0,
                                            bottom: 0,
                                            width: 2,
                                            background: "#F2EFE7",
                                            opacity: 0.7
                                        }}
                                    />
                                ))}
                            </div>
                            {/* Nhãn giai đoạn và mũi tên */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 32
                            }}>
                                {stages.map((stage, idx) => (
                                    <div key={stage.name} style={{ textAlign: idx === 0 ? "left" : idx === 3 ? "right" : "center", minWidth: 80 }}>
                                        <span style={{ color: "#006A71", fontWeight: 600, fontSize: "1rem" }}>{stage.name}</span>
                                        <br />
                                        <button
                                            onClick={() => handleOpenModal(idx, stage.phaseId)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                marginTop: 2,
                                                color: "#48A6A7",
                                                fontSize: 18,
                                                transition: "transform 0.2s"
                                            }}
                                            aria-label={`Xem thông tin ${stage.name}`}
                                        >
                                            <span style={{
                                                display: "inline-block",
                                                transition: "transform 0.2s"
                                            }}>▼</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ color: "#006A71", fontWeight: 600, textAlign: "center" }}>
                            {quitProgress}% hoàn thành mục tiêu
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            {/* Modal hiển thị chi tiết phase */}
            <Modal open={modalStageIdx !== null} onClose={() => { setModalStageIdx(null); setPhaseDetail(null); }}>
                {phaseLoading ? (
                    <div>Đang tải...</div>
                ) : phaseError ? (
                    <div style={{ color: "#e74c3c" }}>{phaseError}</div>
                ) : phaseDetail && modalStageIdx !== null ? (
                    <>
                        <div style={{ fontWeight: 700, color: "#48A6A7", marginBottom: 8, fontSize: 20 }}>
                            {stages[modalStageIdx]?.name} - {stages[modalStageIdx]?.label}
                        </div>
                        <div>Ngày bắt đầu: <span style={{ color: "#006A71" }}>{stages[modalStageIdx]?.start}</span></div>
                        <div>Ngày kết thúc: <span style={{ color: "#006A71" }}>{stages[modalStageIdx]?.end}</span></div>
                        <div>Trạng thái: <span style={{ color: stages[modalStageIdx]?.status === "Hoàn thành" ? "#27ae60" : "#e67e22" }}>{stages[modalStageIdx]?.status}</span></div>
                        <div>Số ngày thất bại: <span style={{ color: "#e74c3c" }}>{phaseDetail.failedDays}</span></div>
                        <div>Tổng số ngày của giai đoạn: <span style={{ color: "#48A6A7" }}>{phaseDetail.totalDays}</span></div>
                        <div style={{ marginTop: 16, fontWeight: 600, color: "#48A6A7" }}>
                            Chi tiết số điếu thuốc đã hút trong giai đoạn
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            gap: 8,
                            marginTop: 12
                        }}>
                            {Array.from({ length: 7 }, (_, i) => {
                                const dayData = phaseDetail.dayStats?.find(stat => new Date(stat.date).getDate() === new Date().getDate() - i);
                                return (
                                    <div key={i} style={{
                                        background: dayData ? "#E6F4F4" : "#fff",
                                        borderRadius: 8,
                                        padding: "0.8rem",
                                        textAlign: "center",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
                                    }}>
                                        <div style={{ fontSize: "1.1rem", color: "#006A71" }}>
                                            {dayData ? dayData.cigarettes : 0}
                                        </div>
                                        <div style={{ fontSize: "0.9rem", color: "#888" }}>
                                            {dayData ? new Date(dayData.date).toLocaleDateString("vi-VN", { weekday: 'short' }) : ""}
                                        </div>
                                    </div>
                                );
                            }).reverse()}
                        </div>
                    </>
                ) : null}
            </Modal>
        </>
    );
}