import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Thông tin ngân hàng
const BANK_ID = "970422"; // MB Bank
const ACCOUNT_NO = "0869705418";
const ACCOUNT_NAME = "Hà Việt Thành";
const TEMPLATE = "compact2";

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

// API kiểm tra giao dịch
const TRANSACTION_API = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLi3DVmTC2Cb0E123k45BAI9CQTZ6KCJquKy9yMRLa5_PoizZNWjnlOgiTYXR7wctmCYM1cg8Pq85AWw9LUxjS2px4t9oz-vU-6PFOdDzxWATXHU6mZioRWJR8MutSwZ4Srx2Zrm7dZV1-nkF6OXpF5xJbEfmGSuTOvQLaaV7HaK80-j_LiUEeJQ8s2-KGq874XDWhGjS2VemZrLT32ngzvg_93eaJOwMDp89yDd2RkB0FzCKLt7w-3Q-WudzrOf1XpN-YPiEAhYzvlHLncfVaGvAdVyC-P_zTivytVW&lib=M5rsz0LObIrYq6B7I3qrvfDHtpZslzeUn";

function showToast(message) {
    let old = document.getElementById("toast-paid");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.id = "toast-paid";
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "32px";
    toast.style.right = "32px";
    toast.style.background = "#27ae60";
    toast.style.color = "#fff";
    toast.style.padding = "16px 32px";
    toast.style.borderRadius = "10px";
    toast.style.fontWeight = "600";
    toast.style.fontSize = "17px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [showQR, setShowQR] = useState(false);
    const [buyingPkg, setBuyingPkg] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(
                    "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership"
                );
                const data = await res.json();
                setPackages(Array.isArray(data) ? data : []);
            } catch {
                setPackages([]);
            }
        };
        fetchPackages();
    }, []);

    // Hàm gọi API tạo payment
    async function createPayment({ packageMembershipId, totalPrice, paymentStatus, transactionCode, duration }) {
        const now = new Date();
        const startDate = now.toISOString();
        const endDate = new Date(now.getTime() + (duration || 30) * 24 * 60 * 60 * 1000).toISOString();
        const body = {
            packageMembershipId,
            timeBuy: startDate,
            totalPrice,
            startDate,
            endDate,
            paymentStatus,
            transactionCode
        };
        try {
            await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } catch (e) {
            console.error("Lỗi tạo payment:", e);
        }
    }

    // Check giao dịch khi mở popup QR
    useEffect(() => {
        if (!showQR || !buyingPkg) return;
        let stop = false;
        let timeoutId;
        const price = buyingPkg.price;
        const content = `THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}`;

        async function checkPaid() {
            if (stop) return;
            try {
                const response = await fetch(TRANSACTION_API);
                const data = await response.json();
                const list = Array.isArray(data.data) ? data.data : [];
                if (list.length === 0) return;
                const lastPaid = list[list.length - 1];
                const lastPrice = Number(lastPaid["Giá trị"] || 0);
                const lastContent = lastPaid["Mô tả"] || "";
                if (
                    lastPrice >= price &&
                    lastContent.toLowerCase().includes(content.toLowerCase())
                ) {
                    if (!localStorage.getItem(`paid_success_${buyingPkg.package_membership_ID}`)) {
                        showToast("✅ Giao dịch thành công!");
                        createPayment({
                            packageMembershipId: buyingPkg.package_membership_ID,
                            totalPrice: buyingPkg.price,
                            paymentStatus: "SUCCESS",
                            transactionCode: lastPaid["Số giao dịch"] || lastPaid["Mã GD"] || "N/A",
                            duration: buyingPkg.duration
                        });
                    }
                    localStorage.setItem(`paid_success_${buyingPkg.package_membership_ID}`, "true");
                    localStorage.setItem("current_package", JSON.stringify({
                        package_membership_ID: buyingPkg.package_membership_ID,
                        endDate: endDate
                    }));
                    stop = true;
                    clearTimeout(timeoutId);
                    setTimeout(() => setShowQR(false), 2000);
                }
            } catch { }
        }

        const interval = setInterval(checkPaid, 2000);
        return () => { stop = true; clearInterval(interval); };
    }, [showQR, buyingPkg]);

    return (
        <section
            style={{
                minHeight: "70vh",
                background: COLORS.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 0",
            }}
        >
            <div
                style={{
                    background: COLORS.white,
                    borderRadius: 20,
                    boxShadow: "0 6px 32px rgba(72,166,167,0.13)",
                    border: `2px solid ${COLORS.primary}`,
                    padding: "2.5rem 2.5rem",
                    maxWidth: 950,
                    width: "100%",
                }}
            >
                <h2
                    style={{
                        color: COLORS.accent,
                        fontWeight: 900,
                        fontSize: "2rem",
                        marginBottom: 18,
                        textAlign: "center",
                        letterSpacing: 1,
                    }}
                >
                    Thanh toán & Đăng ký gói thành viên
                </h2>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
                    {packages.map((pkg) => (
                        <div
                            key={pkg.package_membership_ID}
                            style={{
                                background: COLORS.light,
                                borderRadius: 14,
                                border: `2.5px solid ${COLORS.primary}`,
                                boxShadow: "0 2px 8px #9ACBD022",
                                padding: "1.5rem 1.2rem 1.2rem 1.2rem",
                                minWidth: 220,
                                maxWidth: 270,
                                flex: "1 1 220px",
                                opacity: pkg.status === "Active" ? 1 : 0.6,
                                position: "relative",
                                marginBottom: 8,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderColor: COLORS.primary,
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 6,
                                minHeight: 24,
                            }}>
                                <span style={{
                                    color: COLORS.accent,
                                    fontWeight: 700,
                                    fontSize: "1.15rem",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                }}>
                                    {pkg.category}
                                </span>
                                <span style={{
                                    color: pkg.status === "Active" ? COLORS.secondary : "#aaa",
                                    fontWeight: 600,
                                    fontSize: "0.98rem",
                                    marginLeft: 8,
                                    whiteSpace: "nowrap"
                                }}>
                                    {pkg.status === "Active" ? "Đang mở" : "Đóng"}
                                </span>
                            </div>
                            <div style={{
                                color: COLORS.text,
                                fontSize: "1.07rem",
                                marginBottom: 10,
                                fontWeight: 500
                            }}>
                                {pkg.description}
                            </div>
                            <div style={{
                                color: COLORS.secondary,
                                fontWeight: 700,
                                fontSize: "1.15rem",
                                marginBottom: 8
                            }}>
                                {pkg.price === 0 ? "Miễn phí" : pkg.price.toLocaleString("vi-VN") + "đ"}
                            </div>
                            <div style={{ color: "#888", fontSize: "0.98rem" }}>
                                Thời hạn: {pkg.duration} ngày
                            </div>
                            <button
                                style={{
                                    marginTop: 16,
                                    padding: "10px 24px",
                                    background: COLORS.primary,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px #9ACBD022"
                                }}
                                disabled={pkg.status !== "Active"}
                                onClick={() => {
                                    setBuyingPkg(pkg);
                                    setShowQR(true);
                                }}
                            >
                                Mua gói
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: 32 }}>
                    <button
                        style={{
                            padding: "0.7rem 2rem",
                            background: "#eee",
                            color: COLORS.text,
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>
                </div>
            </div>

            {/* Popup QR */}
            {showQR && buyingPkg && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
                }}>
                    <div style={{
                        background: "#23235a", borderRadius: 18, padding: 32, minWidth: 340, boxShadow: "0 8px 32px #0005", position: "relative"
                    }}>
                        <button
                            onClick={() => setShowQR(false)}
                            style={{
                                position: "absolute", top: 12, right: 16, background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer"
                            }}
                        >×</button>
                        <img
                            src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.jpg?amount=${buyingPkg.price}&addInfo=THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`}
                            alt="QR chuyển khoản"
                            style={{ width: 220, height: 220, borderRadius: 12, background: "#fff", display: "block", margin: "0 auto 18px auto" }}
                        />
                        <div style={{ color: "#ffd600", fontWeight: 700, fontSize: "1.15rem", textAlign: "center", marginBottom: 8 }}>
                            Mã QR thanh toán tự động
                        </div>
                        <div style={{ color: "#fff", textAlign: "center", marginBottom: 8, fontSize: 15 }}>
                            Số tiền: <b>{buyingPkg.price.toLocaleString("vi-VN")}đ</b>
                        </div>
                        <div style={{ color: "#fff", textAlign: "center", marginBottom: 8, fontSize: 15 }}>
                            Nội dung (bắt buộc): <b style={{ color: "#ffd600" }}>THANHTOAN{buyingPkg.category.toUpperCase()}{buyingPkg.package_membership_ID}</b>
                        </div>
                        <div style={{ color: "#fff", textAlign: "center", marginBottom: 8, fontSize: 15 }}>
                            Người thụ hưởng: <b>{ACCOUNT_NAME}</b>
                        </div>
                        <div style={{ color: "#fff", textAlign: "center", marginBottom: 8, fontSize: 15 }}>
                            Đang chờ thanh toán...
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
