import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

// Hàm tính số ngày, giờ, phút, giây đã cai thuốc
function useQuitTimer(startDate) {
    const [timer, setTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        function update() {
            const now = new Date();
            const diff = now - new Date(startDate);
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

export default function Plan() {
    const savedMoney = 350000;
    const cigarettesAllowed = 7;
    const [cigarettesToday, setCigarettesToday] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const quitProgress = 80;
    const quitStartDate = "2025-06-15T00:00:00";
    const timer = useQuitTimer(quitStartDate);
    const achievements = [
        "1 tuần không hút thuốc",
        "Tiết kiệm 300k",
        "Vượt qua ngày đầu tiên"
    ];

    const navigate = useNavigate();

    const handleCigaretteSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const [openStage, setOpenStage] = useState(null);

    const stages = [
        {
            name: "Giai đoạn 1",
            label: "Khởi đầu",
            start: "2024-06-01",
            end: "2024-06-07",
            status: "Hoàn thành",
            failDays: 0,
            totalDays: 7
        },
        {
            name: "Giai đoạn 2",
            label: "Ổn định",
            start: "2024-06-08",
            end: "2024-06-21",
            status: "Hoàn thành",
            failDays: 1,
            totalDays: 14
        },
        {
            name: "Giai đoạn 3",
            label: "Vượt khó",
            start: "2024-06-22",
            end: "2024-07-05",
            status: "Không hoàn thành",
            failDays: 2,
            totalDays: 14
        },
        {
            name: "Giai đoạn 4",
            label: "Thành công",
            start: "2024-07-06",
            end: "2024-07-20",
            status: "Chưa hoàn thành",
            failDays: 0,
            totalDays: 15
        }
    ];

    return (
        <>
            <div
                style={{
                    minHeight: "100vh",
                    background: "#F2EFE7", // Nền sáng
                    color: "#006A71",      // Text xanh đậm
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
                        onMouseOver={e => e.currentTarget.style.background = "#48A6A7"}
                        onMouseOut={e => e.currentTarget.style.background = "#006A71"}
                    >
                        Tham gia ngay
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
                            Thời gian bạn cai thuốc
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
                                style={{
                                    background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "0.5rem 1.2rem",
                                    fontWeight: 600,
                                    fontSize: "1.05rem",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(72,166,167,0.10)"
                                }}
                                onMouseOver={e => e.currentTarget.style.background = "#006A71"}
                                onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)"}
                            >
                                Lưu
                            </button>
                        </form>
                        {submitted && (
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
                                {savedMoney.toLocaleString()}₫
                            </div>
                        </div>
                        <div style={{
                            flex: "1 1 180px",
                            background: "#E6F4F4",
                            borderRadius: 12,
                            padding: "1.2rem",
                            boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                        }}>
                            <div style={{ fontWeight: 600, color: "#48A6A7" }}>Số điếu thuốc được hút trong ngày</div>
                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e67e22" }}>
                                {cigarettesAllowed}
                            </div>
                        </div>
                        <div style={{
                            flex: "1 1 180px",
                            background: "#E6F4F4",
                            borderRadius: 12,
                            padding: "1.2rem",
                            boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                        }}>
                            <div style={{ fontWeight: 600, color: "#48A6A7" }}>Số điếu đã hút hôm nay</div>
                            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e67e22" }}>
                                {cigarettesToday === "" ? 0 : cigarettesToday}
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
                                            onClick={() => setOpenStage(openStage === idx ? null : idx)}
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
                                                transform: openStage === idx ? "rotate(90deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s"
                                            }}>▼</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Thông tin từng giai đoạn */}
                        {openStage !== null && (
                            <div style={{
                                background: "#fff",
                                borderRadius: 10,
                                padding: "1rem 1.5rem",
                                margin: "0 auto 16px auto",
                                maxWidth: 400,
                                color: "#006A71",
                                boxShadow: "0 1px 6px rgba(154,203,208,0.10)"
                            }}>
                                <div style={{ fontWeight: 700, color: "#48A6A7", marginBottom: 8 }}>
                                    {stages[openStage].name} - {stages[openStage].label}
                                </div>
                                <div>Ngày bắt đầu: <span style={{ color: "#006A71" }}>{stages[openStage].start}</span></div>
                                <div>Ngày kết thúc: <span style={{ color: "#006A71" }}>{stages[openStage].end}</span></div>
                                <div>Trạng thái: <span style={{ color: stages[openStage].status === "Hoàn thành" ? "#27ae60" : "#e67e22" }}>{stages[openStage].status}</span></div>
                                <div>Số ngày thất bại: <span style={{ color: "#e74c3c" }}>{stages[openStage].failDays}</span></div>
                                <div>Tổng số ngày của giai đoạn: <span style={{ color: "#48A6A7" }}>{stages[openStage].totalDays}</span></div>
                            </div>
                        )}
                        <div style={{ color: "#006A71", fontWeight: 600, textAlign: "center" }}>
                            {quitProgress}% hoàn thành mục tiêu
                        </div>
                    </div>

                    {/* Danh hiệu */}
                    <div style={{
                        background: "#F2EFE7",
                        borderRadius: 12,
                        padding: "1.5rem",
                        boxShadow: "0 1px 6px rgba(154,203,208,0.10)",
                        marginBottom: 36
                    }}>
                        <div style={{ fontWeight: 600, color: "#48A6A7", marginBottom: 10 }}>Danh hiệu bạn đạt được</div>
                        <ul style={{ margin: 0, paddingLeft: 20, color: "#006A71", fontSize: "1.08rem" }}>
                            {achievements.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: 6 }}>🏅 {item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Lý do bạn muốn cai thuốc */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, marginBottom: 36 }}>
                        <div style={{ flex: "1 1 320px" }}>
                            <h1 style={{ color: "#006A71", fontWeight: 800, fontSize: "2.2rem", marginBottom: 12 }}>
                                Lý do bạn muốn cai thuốc
                            </h1>
                            <ul style={{ fontSize: "1.15rem", color: "#48A6A7", marginBottom: 18, paddingLeft: 20 }}>
                                <li>Vì sức khỏe bản thân và gia đình</li>
                                <li>Tiết kiệm chi phí</li>
                                <li>Cải thiện chất lượng cuộc sống</li>
                                <li>Trở thành tấm gương cho người thân</li>
                            </ul>
                        </div>
                        <div style={{ flex: "1 1 260px", textAlign: "center" }}>
                            <img
                                src="https://th.bing.com/th/id/R.7817708fda667cffccf24824423b12eb?rik=5xUZastZxf1y1w&pid=ImgRaw&r=0"
                                alt="Cai nghiện thuốc lá"
                                style={{ maxWidth: 220, width: "100%", borderRadius: 12, boxShadow: "0 2px 8px rgba(154,203,208,0.10)" }}
                            />
                        </div>
                    </div>

                    {/* Tips & Tools */}
                    <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 32 }}>
                        <div
                            style={{
                                flex: "1 1 320px",
                                background: "#E6F4F4",
                                borderRadius: 10,
                                padding: "1.5rem",
                                minWidth: 260,
                                boxShadow: "0 1px 4px rgba(154,203,208,0.10)",
                            }}
                        >
                            <h3 style={{ color: "#48A6A7", fontWeight: 700, marginBottom: 10 }}>Mẹo Vượt Qua Cơn Thèm</h3>
                            <ul style={{ paddingLeft: 18, color: "#006A71", fontSize: "1rem", marginBottom: 0 }}>
                                <li>Uống nước hoặc trà thảo mộc thay vì hút thuốc</li>
                                <li>Đi bộ hoặc tập thể dục nhẹ nhàng</li>
                                <li>Trò chuyện với bạn bè, người thân</li>
                                <li>Thở sâu và thư giãn</li>
                                <li>Tránh xa nơi có nhiều người hút thuốc</li>
                            </ul>
                        </div>
                        <div
                            style={{
                                flex: "1 1 320px",
                                background: "#9ACBD0",
                                borderRadius: 10,
                                padding: "1.5rem",
                                minWidth: 260,
                                boxShadow: "0 1px 4px rgba(154,203,208,0.10)",
                            }}
                        >
                            <h3 style={{ color: "#006A71", fontWeight: 700, marginBottom: 10 }}>Công Cụ Hỗ Trợ</h3>
                            <ul style={{ paddingLeft: 18, color: "#fff", fontSize: "1rem", marginBottom: 0 }}>
                                <li>Ứng dụng theo dõi tiến trình bỏ thuốc</li>
                                <li>Nhắc nhở động viên mỗi ngày</li>
                                <li>Tham gia nhóm cộng đồng online</li>
                                <li>Liên hệ chuyên gia tư vấn</li>
                                <li>Tài liệu hướng dẫn miễn phí</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <Outlet />
        </>
    );
}