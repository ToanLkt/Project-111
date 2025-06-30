import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext/AuthContext";

export default function HistoryPayment() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        setApiError(null);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/my-transactions", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                if (!res.ok) {
                    let errMsg = "Không thể tải lịch sử thanh toán";
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
                    throw new Error(errMsg);
                }
                return res.json();
            })
            .then(data => setTransactions(data))
            .catch(err => setApiError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <div style={{
            maxWidth: 700,
            margin: "40px auto",
            background: "#fff",
            borderRadius: 18,
            padding: 36,
            boxShadow: "0 4px 24px #9ACBD033",
            minHeight: 300
        }}>
            <h2 style={{
                color: "#006A71",
                fontWeight: 900,
                marginBottom: 28,
                textAlign: "center",
                fontSize: "2rem"
            }}>
                Lịch sử thanh toán
            </h2>
            {loading && <div style={{ color: "#888", textAlign: "center" }}>Đang tải...</div>}
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
            {!loading && !apiError && transactions.length === 0 && (
                <div style={{ color: "#888", textAlign: "center" }}>Chưa có giao dịch nào.</div>
            )}
            {!loading && !apiError && transactions.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
                    <thead>
                        <tr style={{ background: "#E6F4F4", color: "#006A71" }}>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Mã giao dịch</th>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Gói</th>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Số tiền</th>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Ngày mua</th>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Ngày bắt đầu</th>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Ngày kết thúc</th>
                            <th style={{ padding: 10, border: "1px solid #9ACBD0" }}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((item, idx) => (
                            <tr key={item.purchaseID || idx} style={{ background: idx % 2 === 0 ? "#fff" : "#F2EFE7" }}>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>{item.transactionCode || "N/A"}</td>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>{item.packageCategory || "N/A"}</td>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>{item.totalPrice ? item.totalPrice.toLocaleString() + " đ" : "N/A"}</td>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>{item.timeBuy ? new Date(item.timeBuy).toLocaleString("vi-VN") : "N/A"}</td>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>{item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "N/A"}</td>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>{item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "N/A"}</td>
                                <td style={{ padding: 10, border: "1px solid #9ACBD0" }}>
                                    {item.paymentStatus === "Success" ? <span style={{ color: "#27ae60" }}>Thành công</span> :
                                        item.paymentStatus === "Pending" ? <span style={{ color: "#f39c12" }}>Chờ xử lý</span> :
                                            <span style={{ color: "#e74c3c" }}>Thất bại</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
