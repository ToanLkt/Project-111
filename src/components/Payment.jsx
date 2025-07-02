import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext/AuthContext";
import NavBar from "./NavBar";
import Footer from "./Footer";

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
const TRANSACTION_API = "https://docs.google.com/spreadsheets/d/1Er2mUA9EE7PdsIc9YPzOFlxo_ErhmjRPGaYNYBXS00A/gviz/tq?tqx=out:json";

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

// Hàm format ngày chuẩn "YYYY-MM-DDTHH:mm:ss"
function formatDate(dt) {
    return dt.getFullYear() + "-" +
        String(dt.getMonth() + 1).padStart(2, "0") + "-" +
        String(dt.getDate()).padStart(2, "0") + "T" +
        String(dt.getHours()).padStart(2, "0") + ":" +
        String(dt.getMinutes()).padStart(2, "0") + ":" +
        String(dt.getSeconds()).padStart(2, "0");
}

// Lấy accountId từ token JWT của user hiện tại
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const token = auth?.token;
    const accountId = auth?.accountId;
    const [packages, setPackages] = useState([]);
    const [showQR, setShowQR] = useState(false);
    const [buyingPkg, setBuyingPkg] = useState(null);
    const [transactionCode, setTransactionCode] = useState("");

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

    // Sinh mã giao dịch mới mỗi lần mở QR
    useEffect(() => {
        if (showQR && buyingPkg) {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setTransactionCode(code);
        }
    }, [showQR, buyingPkg]);

    // Hàm gọi API tạo payment
    async function createPayment({
        packageMembershipId,
        totalPrice,
        paymentStatus,
        duration,
        transactionCode
    }) {
        const now = new Date();
        const startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const endDate = new Date(now.getTime() + (duration || 30) * 24 * 60 * 60 * 1000).toISOString();
        const timeBuy = new Date().toISOString();

        const body = {
            packageMembershipId,
            timeBuy,
            totalPrice,
            startDate,
            endDate,
            paymentStatus: paymentStatus === "SUCCESS" ? "Success" : paymentStatus,
            transactionCode
        };

        console.log("Body gửi lên:", body);

        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Payment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                showToast("Đã xác nhận");
            }
        } catch (e) {
            console.error("Lỗi tạo payment:", e);
        }
    }

    // Check giao dịch khi mở popup QR
    useEffect(() => {
        if (!showQR || !buyingPkg || !transactionCode) return;
        let stop = false;
        let timeoutId;
        const price = buyingPkg.price;
        const content = `THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}${transactionCode}`;

        async function checkPaid() {
            if (stop) return;
            try {
                const response = await fetch(TRANSACTION_API);
                const text = await response.text();
                const json = JSON.parse(text.substring(47, text.length - 2));
                const rows = json.table.rows.map(row =>
                    Object.fromEntries(
                        row.c.map((cell, i) => [json.table.cols[i].label, cell?.v])
                    )
                );
                if (rows.length === 0) return;

                // Thêm log để debug
                console.log("content cần tìm:", content);
                console.log("transactionCode:", transactionCode);
                console.log("buyingPkg:", buyingPkg);
                console.log("Các mô tả:", rows.map(r => r["Mô tả"]));
                console.log("Các giá trị:", rows.map(r => r["Giá trị"]));

                const lastPaid = rows.slice().reverse().find(row =>
                    Number(row["Giá trị"] || 0) === price &&
                    (row["Mô tả"] || "").toUpperCase().includes(content.toUpperCase())
                );

                console.log("lastPaid tìm được:", lastPaid);

                // Tạo endDate tại đây (không lấy từ Google Sheets)
                const endDate = formatDate(new Date(Date.now() + (buyingPkg.duration || 30) * 24 * 60 * 60 * 1000));
                if (lastPaid) {
                    if (!localStorage.getItem(`paid_success_${buyingPkg.package_membership_ID}_${accountId}`)) {
                        showToast("✅ Giao dịch thành công!");
                        createPayment({
                            packageMembershipId: buyingPkg.package_membership_ID,
                            totalPrice: buyingPkg.price,
                            paymentStatus: "SUCCESS",
                            duration: buyingPkg.duration,
                            transactionCode
                        });
                        // Lưu trạng thái đã thanh toán cho từng accountId
                        localStorage.setItem(`paid_success_${buyingPkg.package_membership_ID}_${accountId}`, "true");
                        localStorage.setItem(`current_package_${accountId}`, JSON.stringify({
                            package_membership_ID: buyingPkg.package_membership_ID,
                            category: buyingPkg.category,
                            description: buyingPkg.description,
                            price: buyingPkg.price,
                            duration: buyingPkg.duration,
                            endDate: endDate,
                            accountId: accountId
                        }));

                        // Chuyển về trang member để cập nhật UI
                        navigate("/member");
                    }
                    // Đóng QR mỗi khi tìm thấy giao dịch
                    stop = true;
                    clearTimeout(timeoutId);
                    setTimeout(() => setShowQR(false), 2000);
                }
            } catch (e) {
                console.error("Lỗi checkPaid:", e);
            }
        }

        const interval = setInterval(checkPaid, 2000);
        return () => { stop = true; clearInterval(interval); };
    }, [showQR, buyingPkg, transactionCode, accountId]);

    return (
        <>
            <NavBar />
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
                        {packages.map((pkg) => {
                            // Lấy gói đang dùng từ localStorage (nếu có)
                            const currentPkg = (() => {
                                try {
                                    const data = localStorage.getItem(`current_package_${accountId}`);
                                    if (!data) return null;
                                    const parsed = JSON.parse(data);
                                    if (new Date(parsed.endDate) > new Date()) return parsed;
                                    return null;
                                } catch {
                                    return null;
                                }
                            })();
                            // Nếu đã mua và còn hạn gói này thì khóa lại và ghi là đang dùng
                            const isCurrent = currentPkg && currentPkg.package_membership_ID === pkg.package_membership_ID;

                            return (
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
                                            {pkg.status === "Active"
                                                ? (isCurrent ? "Đang dùng" : "Đang mở")
                                                : "Đóng"}
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
                                    {!isCurrent && (
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
                                    )}
                                    {isCurrent && (
                                        <div
                                            style={{
                                                marginTop: 16,
                                                padding: "10px 24px",
                                                background: "#27ae60",
                                                color: "#fff",
                                                borderRadius: 8,
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                textAlign: "center",
                                                boxShadow: "0 2px 8px #48A6A733"
                                            }}
                                        >
                                            Bạn đang sử dụng gói này
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
                                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.jpg?amount=${buyingPkg.price}&addInfo=THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}${transactionCode}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`}
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
                                Nội dung (bắt buộc): <b style={{ color: "#ffd600" }}>THANHTOAN{buyingPkg.category.toUpperCase()}{buyingPkg.package_membership_ID}{transactionCode}</b>
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
            <Footer />
        </>
    );
}
