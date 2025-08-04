import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Thay đổi import
import Footer from "../../components/Footer";

export default function HistoryPayment() {
    // Sử dụng Redux thay vì AuthContext
    const { user, token } = useSelector((state) => state.account || {});

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // Extract user ID từ Redux user object
    const getUserId = () => {
        if (!user) return null;
        return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            user.userId ||
            user.id ||
            null;
    };

    const accountId = getUserId();

    useEffect(() => {
        // XÓA debug log ở đây
        if (!token) {
            setLoading(false);
            return;
        }

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
            .then(data => {
                setTransactions(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                setApiError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, accountId]);

    return (
        <>
            <style jsx>{`
                .history-container {
                    min-height: 80vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    padding: 2rem 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                .history-card {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 8px 32px rgba(0, 106, 113, 0.1);
                    border: 1px solid #e2e8f0;
                    position: relative;
                    overflow: hidden;
                }

                .history-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #006A71, #48A6A7);
                }

                .history-title {
                    color: #006A71;
                    font-weight: 800;
                    margin-bottom: 2rem;
                    text-align: center;
                    font-size: 2.5rem;
                    letter-spacing: -0.025em;
                    background: linear-gradient(135deg, #006A71 0%, #48A6A7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .loading-state {
                    text-align: center;
                    padding: 3rem;
                    color: #6b7280;
                    font-size: 1.1rem;
                }

                .loading-spinner {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    border: 3px solid #e2e8f0;
                    border-radius: 50%;
                    border-top-color: #48A6A7;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 0.5rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .error-state {
                    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1rem 0;
                    color: #dc2626;
                    font-weight: 500;
                    white-space: pre-line;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #6b7280;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 1rem;
                }

                .empty-state p {
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }

                .transactions-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
                }

                .table-header {
                    background: linear-gradient(135deg, #006A71 0%, #48A6A7 100%);
                    color: white;
                }

                .table-header th {
                    padding: 1rem;
                    font-weight: 600;
                    text-align: left;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: none;
                }

                .table-row {
                    transition: all 0.2s ease;
                }

                .table-row:hover {
                    background: #f8fafc;
                }

                .table-row:nth-child(even) {
                    background: #f9fafb;
                }

                .table-row:nth-child(even):hover {
                    background: #f1f5f9;
                }

                .table-cell {
                    padding: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 0.875rem;
                    color: #374151;
                    vertical-align: middle;
                }

                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-success {
                    background: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }

                .status-pending {
                    background: #fef3c7;
                    color: #92400e;
                    border: 1px solid #fde68a;
                }

                .status-failed {
                    background: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }

                .price-amount {
                    font-weight: 600;
                    color: #059669;
                    font-size: 0.9rem;
                }

                .transaction-code {
                    font-family: 'Monaco', 'Consolas', monospace;
                    font-size: 0.8rem;
                    background: #f3f4f6;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    color: #374151;
                }

                .package-name {
                    font-weight: 600;
                    color: #1f2937;
                    text-transform: capitalize;
                }

                .auth-warning {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    border: 2px solid #f59e0b;
                    border-radius: 12px;
                    padding: 1.5rem;
                    text-align: center;
                    color: #92400e;
                    font-weight: 500;
                }

                @media (max-width: 1024px) {
                    .history-card {
                        margin: 0 1rem;
                        padding: 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .history-title {
                        font-size: 2rem;
                    }

                    .transactions-table {
                        font-size: 0.75rem;
                    }

                    .table-header th,
                    .table-cell {
                        padding: 0.5rem;
                    }
                }

                @media (max-width: 576px) {
                    .history-card {
                        padding: 1.5rem;
                        border-radius: 16px;
                    }

                    .history-title {
                        font-size: 1.75rem;
                    }
                }
            `}</style>

            <div className="history-container">
                <div className="history-card">
                    <h2 className="history-title">
                        Lịch sử thanh toán
                    </h2>

                    {!token ? (
                        <div className="auth-warning">
                            <h3>🔐 Cần đăng nhập</h3>
                            <p>Vui lòng đăng nhập để xem lịch sử thanh toán của bạn.</p>
                        </div>
                    ) : loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            Đang tải lịch sử thanh toán...
                        </div>
                    ) : apiError ? (
                        <div className="error-state">
                            <strong>❌ Có lỗi xảy ra:</strong><br />
                            {apiError}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">
                            <h3>📭 Chưa có giao dịch nào</h3>
                            <p>Bạn chưa thực hiện giao dịch thanh toán nào.</p>
                            <button
                                onClick={() => window.location.href = '/payment'}
                                style={{
                                    background: 'linear-gradient(135deg, #48A6A7 0%, #006A71 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                🛒 Mua gói thành viên
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="transactions-table">
                                <thead className="table-header">
                                    <tr>
                                        <th>Mã giao dịch</th>
                                        <th>Gói thành viên</th>
                                        <th>Số tiền</th>
                                        <th>Ngày mua</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((item, idx) => (
                                        <tr key={item.purchaseID || item.paymentId || idx} className="table-row">
                                            <td className="table-cell">
                                                <span className="transaction-code">
                                                    {item.transactionCode || "N/A"}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                <span className="package-name">
                                                    {item.packageCategory || item.category || "N/A"}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                <span className="price-amount">
                                                    {item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') + " đ" : "0 đ"}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                {item.timeBuy ? new Date(item.timeBuy).toLocaleString("vi-VN") : "N/A"}
                                            </td>
                                            <td className="table-cell">
                                                {item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "N/A"}
                                            </td>
                                            <td className="table-cell">
                                                {item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "N/A"}
                                            </td>
                                            <td className="table-cell">
                                                <span className={`status-badge ${item.paymentStatus === "Success" ? "status-success" :
                                                    item.paymentStatus === "Pending" ? "status-pending" :
                                                        "status-failed"
                                                    }`}>
                                                    {item.paymentStatus === "Success" ? "✅ Thành công" :
                                                        item.paymentStatus === "Pending" ? "⏳ Chờ xử lý" :
                                                            "❌ Thất bại"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
