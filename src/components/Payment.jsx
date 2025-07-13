"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Footer from "./Footer"
import "bootstrap/dist/css/bootstrap.min.css"

// Import actions từ paymentSlice
import {
  createPaymentRequest,
  setCurrentPackage,
  clearPaymentState,
  fetchPackagesRequest
} from "../redux/components/payment/paymentSlice"

// Thông tin ngân hàng
const BANK_ID = "970422" // MB Bank
const ACCOUNT_NO = "0869705418"
const ACCOUNT_NAME = "Hà Việt Thành"
const TEMPLATE = "compact2"

const COLORS = {
  background: "#FAFAF9",
  color1: "#CFE8EF",
  color2: "#6AB7C5",
  color3: "#336B73",
  white: "#FFFFFF",
  text: "#2D3748",
  textLight: "#718096",
  gradient: "linear-gradient(135deg, #6AB7C5 0%, #336B73 100%)",
  gradientLight: "linear-gradient(135deg, #CFE8EF 0%, #6AB7C5 50%)",
  success: "#10B981",
  warning: "#F59E0B",
}

// API kiểm tra giao dịch
const TRANSACTION_API =
  "https://docs.google.com/spreadsheets/d/1Er2mUA9EE7PdsIc9YPzOFlxo_ErhmjRPGaYNYBXS00A/gviz/tq?tqx=out:json"

function showToast(message) {
  console.log('📢 Showing toast:', message)

  const old = document.getElementById("toast-paid")
  if (old) {
    console.log('🗑️ Removing old toast')
    old.remove()
  }

  const toast = document.createElement("div")
  toast.id = "toast-paid"
  toast.innerText = message
  toast.style.position = "fixed"
  toast.style.top = "32px"
  toast.style.right = "32px"
  toast.style.background = COLORS.success
  toast.style.color = COLORS.white
  toast.style.padding = "16px 32px"
  toast.style.borderRadius = "12px"
  toast.style.fontWeight = "600"
  toast.style.fontSize = "16px"
  toast.style.zIndex = "9999"
  toast.style.boxShadow = "0 8px 32px rgba(16, 185, 129, 0.3)"
  toast.style.transition = "all 0.3s ease"

  document.body.appendChild(toast)
  console.log('✅ Toast added to DOM')

  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove()
      console.log('🗑️ Toast auto-removed after 5s')
    }
  }, 5000)
}

// Hàm format ngày chuẩn "YYYY-MM-DDTHH:mm:ss"
function formatDate(dt) {
  return (
    dt.getFullYear() +
    "-" +
    String(dt.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(dt.getDate()).padStart(2, "0") +
    "T" +
    String(dt.getHours()).padStart(2, "0") +
    ":" +
    String(dt.getMinutes()).padStart(2, "0") +
    ":" +
    String(dt.getSeconds()).padStart(2, "0")
  )
}

// Hàm lấy thời gian hiện tại theo múi giờ Việt Nam (ISO string)
function getVietnamNowISO() {
  const now = new Date()
  const vn = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }))
  return vn.toISOString()
}

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux state
  const { user, token } = useSelector((state) => state.account || {})
  const {
    // Payment state
    paymentLoading,
    paymentSuccess,
    paymentError,

    // Package state
    packages,
    packagesLoading,
    packagesError,

    // Current package
    currentPackage,

    // Completed payments
    completedPayments
  } = useSelector((state) => {
    console.log('🔍 Current Redux payment state:', state.payment)
    return state.payment || {}
  })

  // Extract user info từ Redux user object
  const getUserId = () => {
    if (!user) return null
    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      user.userId ||
      user.id ||
      null
  }

  const accountId = getUserId()

  const [showQR, setShowQR] = useState(false)
  const [buyingPkg, setBuyingPkg] = useState(null)
  const [transactionCode, setTransactionCode] = useState("")

  // Fetch packages khi component mount
  useEffect(() => {
    console.log("🚀 Dispatching fetchPackagesRequest...")
    dispatch(fetchPackagesRequest())
  }, [dispatch])

  // Sinh mã giao dịch mới mỗi lần mở QR
  useEffect(() => {
    if (showQR && buyingPkg) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setTransactionCode(code)
    }
  }, [showQR, buyingPkg])

  // Handle payment success - version đơn giản
  useEffect(() => {
    console.log('🔍 Payment success useEffect triggered, paymentSuccess:', paymentSuccess)

    if (paymentSuccess) {
      console.log('✅ Payment successful! Starting success flow...')

      // Hiển thị thông báo thành công
      showToast("✅ Thanh toán thành công!")
      console.log('📢 Success toast displayed')

      // Đóng QR popup ngay lập tức
      setShowQR(false)
      console.log('❌ QR modal closed')

      // Chuyển về trang Home sau 2 giây
      setTimeout(() => {
        console.log('🏠 Navigating to home page...')
        navigate("/")
      }, 2000)

      // Clear payment state sau khi đã xử lý xong
      setTimeout(() => {
        console.log('🧹 Clearing payment state...')
        dispatch(clearPaymentState())
      }, 3000)
    }
  }, [paymentSuccess, navigate, dispatch])

  // Handle payment error
  useEffect(() => {
    console.log('🔍 Payment error state changed:', paymentError)

    if (paymentError) {
      console.log('❌ Triggering error flow:', paymentError)
      showToast(`❌ Thanh toán thất bại: ${paymentError}`)
      dispatch(clearPaymentState())
    }
  }, [paymentError, dispatch])

  // Debug Redux state changes
  useEffect(() => {
    console.log('🔍 Redux payment state updated:', {
      paymentLoading,
      paymentSuccess,
      paymentError,
      packagesLoading,
      packagesError,
      packagesCount: packages?.length || 0,
      currentPackage: !!currentPackage,
      completedPayments: completedPayments?.length || 0
    })
  }, [paymentLoading, paymentSuccess, paymentError, packagesLoading, packagesError, packages, currentPackage, completedPayments])

  // Check giao dịch khi mở popup QR
  useEffect(() => {
    if (!showQR || !buyingPkg || !transactionCode) return

    let stop = false
    let timeoutId

    const price = buyingPkg.price
    const content = `THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}${transactionCode}`

    async function checkPaid() {
      if (stop) return

      try {
        const response = await fetch(TRANSACTION_API)
        const text = await response.text()
        const json = JSON.parse(text.substring(47, text.length - 2))

        const rows = json.table.rows.map((row) =>
          Object.fromEntries(row.c.map((cell, i) => [json.table.cols[i].label, cell?.v])),
        )

        if (rows.length === 0) return

        console.log("🔍 Checking payment with content:", content)

        const lastPaid = rows
          .slice()
          .reverse()
          .find(
            (row) =>
              Number(row["Giá trị"] || 0) === price &&
              (row["Mô tả"] || "").toUpperCase().includes(content.toUpperCase()),
          )

        console.log("💳 Payment found:", !!lastPaid)

        if (lastPaid) {
          // Kiểm tra xem đã thanh toán gói này chưa
          const paymentKey = `${buyingPkg.package_membership_ID}_${accountId}`
          const isAlreadyPaid = completedPayments?.includes(paymentKey)

          if (!isAlreadyPaid) {
            console.log('💳 New payment detected, creating payment record...')

            const nowVN = getVietnamNowISO()
            const startDate = new Date(new Date(nowVN).setHours(0, 0, 0, 0)).toISOString()
            const endDate = new Date(new Date(nowVN).getTime() + (buyingPkg.duration || 30) * 24 * 60 * 60 * 1000).toISOString()

            // Dispatch payment creation via Redux
            console.log('📤 Dispatching createPaymentRequest...')
            dispatch(createPaymentRequest({
              packageMembershipId: buyingPkg.package_membership_ID,
              totalPrice: buyingPkg.price,
              paymentStatus: "Success",
              duration: buyingPkg.duration,
              transactionCode,
              timeBuy: nowVN,
              startDate,
              endDate
            }))

            // Set current package in Redux
            dispatch(setCurrentPackage({
              package_membership_ID: buyingPkg.package_membership_ID,
              category: buyingPkg.category,
              description: buyingPkg.description,
              price: buyingPkg.price,
              duration: buyingPkg.duration,
              endDate: endDate,
              accountId: accountId,
            }))
          } else {
            console.log('⚠️ Payment already processed for this package')
          }

          // Dừng việc check payment
          stop = true
          clearTimeout(timeoutId)
        }
      } catch (e) {
        console.error("❌ Check payment error:", e)
      }
    }

    const interval = setInterval(checkPaid, 2000)
    return () => {
      stop = true
      clearInterval(interval)
    }
  }, [showQR, buyingPkg, transactionCode, accountId, dispatch, completedPayments])

  const getPackageIcon = (category) => {
    const icons = {
      basic: "🌱",
      premium: "⭐",
      vip: "👑",
      standard: "📦",
      pro: "🚀",
      starter: "🎯",
      advanced: "🔥",
    }
    return icons[category?.toLowerCase()] || "📋"
  }

  const getPackageColor = (index) => {
    const colors = [COLORS.color1, COLORS.color2, "#E0F2FE", "#FEF3C7", "#F3E8FF", "#FEE2E2"]
    return colors[index % colors.length]
  }

  return (
    <>
      <style jsx>{`
        .payment-section {
          min-height: 80vh;
          background: ${COLORS.background};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 0;
        }

        .payment-container {
          background: ${COLORS.white};
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          border: 1px solid ${COLORS.color1};
          padding: 3rem;
          max-width: 1000px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .payment-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .payment-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .payment-subtitle {
          text-align: center;
          color: ${COLORS.textLight};
          font-size: 1.1rem;
          margin-bottom: 3rem;
          font-weight: 500;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .package-card {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid ${COLORS.color1};
          box-shadow: 0 8px 24px rgba(51, 107, 115, 0.06);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .package-card.active {
          border-color: ${COLORS.color2};
        }

        .package-card.inactive {
          opacity: 0.6;
          filter: grayscale(0.3);
        }

        .package-card.current {
          border-color: ${COLORS.success};
          background: linear-gradient(135deg, ${COLORS.white} 0%, #F0FDF4 100%);
        }

        .package-card:hover:not(.inactive):not(.current) {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(51, 107, 115, 0.12);
        }

        .package-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${COLORS.gradientLight};
        }

        .package-card.current::before {
          background: linear-gradient(90deg, ${COLORS.success}, #34D399);
        }

        .package-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .package-icon-badge {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .package-status {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-active {
          background: ${COLORS.color1};
          color: ${COLORS.color3};
        }

        .status-current {
          background: ${COLORS.success};
          color: ${COLORS.white};
        }

        .status-inactive {
          background: #F3F4F6;
          color: #6B7280;
        }

        .package-category {
          font-size: 1.3rem;
          font-weight: 700;
          color: ${COLORS.color3};
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .package-description {
          color: ${COLORS.text};
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .package-price {
          font-size: 1.8rem;
          font-weight: 800;
          color: ${COLORS.color2};
          margin-bottom: 0.5rem;
        }

        .package-price.free {
          color: ${COLORS.success};
        }

        .package-duration {
          color: ${COLORS.textLight};
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .package-button {
          width: 100%;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-buy {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          box-shadow: 0 4px 16px rgba(106, 183, 197, 0.3);
        }

        .btn-buy:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.4);
        }

        .btn-current {
          background: ${COLORS.success};
          color: ${COLORS.white};
          cursor: default;
        }

        .btn-disabled {
          background: #F3F4F6;
          color: #9CA3AF;
          cursor: not-allowed;
        }

        .back-button {
          background: #F3F4F6;
          color: ${COLORS.text};
          border: none;
          border-radius: 12px;
          padding: 0.8rem 2rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: ${COLORS.color1};
          transform: translateY(-1px);
        }

        .qr-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .qr-modal {
          background: ${COLORS.white};
          border-radius: 24px;
          padding: 2.5rem;
          min-width: 400px;
          max-width: 90vw;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          text-align: center;
        }

        .qr-close {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          color: ${COLORS.textLight};
          font-size: 1.5rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .qr-close:hover {
          background: ${COLORS.color1};
          color: ${COLORS.color3};
        }

        .qr-image {
          width: 250px;
          height: 250px;
          border-radius: 16px;
          background: ${COLORS.white};
          display: block;
          margin: 0 auto 1.5rem auto;
          box-shadow: 0 8px 32px rgba(51, 107, 115, 0.1);
        }

        .qr-title {
          color: ${COLORS.color3};
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }

        .qr-info {
          background: ${COLORS.background};
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid ${COLORS.color1};
        }

        .qr-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .qr-info-item:last-child {
          margin-bottom: 0;
        }

        .qr-info-label {
          color: ${COLORS.textLight};
          font-weight: 500;
        }

        .qr-info-value {
          color: ${COLORS.text};
          font-weight: 600;
        }

        .qr-content-highlight {
          color: ${COLORS.color2};
          font-weight: 700;
          word-break: break-all;
        }

        .qr-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: ${COLORS.color2};
          font-weight: 600;
          margin-top: 1rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid ${COLORS.color1};
          border-radius: 50%;
          border-top-color: ${COLORS.color2};
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-skeleton {
          background: linear-gradient(90deg, ${COLORS.color1} 25%, ${COLORS.background} 50%, ${COLORS.color1} 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          height: 1rem;
          margin-bottom: 1rem;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .error-message {
          text-align: center;
          color: #e74c3c;
          padding: 2rem;
          background: #ffe6e6;
          border-radius: 12px;
          margin: 2rem 0;
        }

        /* Debug panel */
        .debug-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 15px;
          border-radius: 8px;
          font-size: 12px;
          font-family: monospace;
          z-index: 9998;
          max-width: 300px;
        }

        @media (max-width: 768px) {
          .payment-section {
            padding: 2rem 0;
          }

          .payment-container {
            margin: 0 1rem;
            padding: 2rem;
            border-radius: 20px;
          }

          .payment-title {
            font-size: 2rem;
          }

          .packages-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .qr-modal {
            min-width: 350px;
            padding: 2rem;
          }

          .qr-image {
            width: 200px;
            height: 200px;
          }

          .debug-panel {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .payment-title {
            font-size: 1.8rem;
          }

          .package-card {
            padding: 1.5rem;
          }

          .qr-modal {
            min-width: 300px;
            padding: 1.5rem;
          }
        }
      `}</style>

      <section className="payment-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="payment-container">
                <h2 className="payment-title">💳 Thanh toán & Đăng ký</h2>
                <p className="payment-subtitle">Chọn gói thành viên phù hợp để bắt đầu hành trình của bạn</p>

                {/* Show loading skeleton while fetching packages */}
                {packagesLoading ? (
                  <div className="packages-grid">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="package-card">
                        <div className="loading-skeleton" style={{ height: "2rem", width: "60%" }}></div>
                        <div className="loading-skeleton" style={{ height: "1rem", width: "100%" }}></div>
                        <div className="loading-skeleton" style={{ height: "1rem", width: "80%" }}></div>
                        <div className="loading-skeleton" style={{ height: "2rem", width: "40%" }}></div>
                        <div className="loading-skeleton" style={{ height: "3rem", width: "100%" }}></div>
                      </div>
                    ))}
                  </div>
                ) : packagesError ? (
                  <div className="error-message">
                    <h4>❌ Lỗi tải gói thành viên</h4>
                    <p>{packagesError}</p>
                    <button
                      className="package-button btn-buy"
                      style={{ maxWidth: "200px", margin: "1rem auto" }}
                      onClick={() => dispatch(fetchPackagesRequest())}
                    >
                      🔄 Thử lại
                    </button>
                  </div>
                ) : packages && packages.length > 0 ? (
                  <div className="packages-grid">
                    {packages.map((pkg, index) => {
                      // Kiểm tra gói hiện tại từ Redux
                      const isCurrent = currentPackage &&
                        currentPackage.package_membership_ID === pkg.package_membership_ID &&
                        new Date(currentPackage.endDate) > new Date()

                      const isActive = pkg.status === "Active"
                      const canBuy = isActive && !isCurrent

                      return (
                        <div
                          key={pkg.package_membership_ID}
                          className={`package-card ${isCurrent ? "current" : isActive ? "active" : "inactive"}`}
                        >
                          <div className="package-header">
                            <div className="package-icon-badge" style={{ background: getPackageColor(index) }}>
                              {getPackageIcon(pkg.category)}
                            </div>
                            <div
                              className={`package-status ${isCurrent ? "status-current" : isActive ? "status-active" : "status-inactive"}`}
                            >
                              {isCurrent ? "Đang dùng" : isActive ? "Đang mở" : "Đóng"}
                            </div>
                          </div>

                          <h3 className="package-category">{pkg.category}</h3>
                          <p className="package-description">{pkg.description}</p>

                          <div className={`package-price ${pkg.price === 0 ? "free" : ""}`}>
                            {pkg.price === 0 ? "Miễn phí" : pkg.price.toLocaleString("vi-VN") + "đ"}
                          </div>

                          <div className="package-duration">
                            <i className="fas fa-clock"></i>
                            Thời hạn: {pkg.duration} ngày
                          </div>

                          {isCurrent ? (
                            <button className="package-button btn-current">
                              <i className="fas fa-check-circle"></i>
                              Bạn đang sử dụng gói này
                            </button>
                          ) : canBuy ? (
                            <button
                              className="package-button btn-buy"
                              disabled={paymentLoading}
                              onClick={() => {
                                setBuyingPkg(pkg)
                                setShowQR(true)
                              }}
                            >
                              {paymentLoading ? (
                                <>
                                  <div className="loading-spinner"></div>
                                  Đang xử lý...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-shopping-cart"></i>
                                  Mua gói ngay
                                </>
                              )}
                            </button>
                          ) : (
                            <button className="package-button btn-disabled" disabled>
                              <i className="fas fa-lock"></i>
                              Không khả dụng
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="error-message">
                    <h4>📦 Không có gói thành viên nào</h4>
                    <p>Hiện tại chưa có gói thành viên nào được cung cấp.</p>
                  </div>
                )}

                <div className="text-center">
                  <button className="back-button" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Modal */}
      {showQR && buyingPkg && (
        <div className="qr-overlay">
          <div className="qr-modal">
            <button className="qr-close" onClick={() => setShowQR(false)}>
              <i className="fas fa-times"></i>
            </button>

            <img
              src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.jpg?amount=${buyingPkg.price
                }&addInfo=THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID
                }${transactionCode}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`}
              alt="QR chuyển khoản"
              className="qr-image"
            />

            <h3 className="qr-title">
              <i className="fas fa-qrcode me-2"></i>
              Thanh toán tự động
            </h3>

            <div className="qr-info">
              <div className="qr-info-item">
                <span className="qr-info-label">Số tiền:</span>
                <span className="qr-info-value">{buyingPkg.price.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="qr-info-item">
                <span className="qr-info-label">Người thụ hưởng:</span>
                <span className="qr-info-value">{ACCOUNT_NAME}</span>
              </div>
              <div className="qr-info-item">
                <span className="qr-info-label">Nội dung:</span>
                <span className="qr-content-highlight">
                  THANHTOAN{buyingPkg.category.toUpperCase()}
                  {buyingPkg.package_membership_ID}
                  {transactionCode}
                </span>
              </div>
            </div>

            <div className="qr-status">
              <div className="loading-spinner"></div>
              <span>
                {paymentLoading ? "Đang xử lý thanh toán..." : "Đang chờ thanh toán..."}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Debug Panel - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-panel">
          <div><strong>🔍 Payment Debug:</strong></div>
          <div>Token: {token ? "✅" : "❌"}</div>
          <div>User: {user ? "✅" : "❌"}</div>
          <div>AccountId: {accountId || "null"}</div>
          <div>Packages: {packages?.length || 0}</div>
          <div>Packages Loading: {packagesLoading ? "⏳" : "✅"}</div>
          <div>Packages Error: {packagesError ? "❌" : "✅"}</div>
          <div>Current Package: {currentPackage ? "✅" : "❌"}</div>
          <div>Payment Loading: {paymentLoading ? "⏳" : "✅"}</div>
          <div>Payment Success: {paymentSuccess ? "✅" : "❌"}</div>
          <div>Payment Error: {paymentError ? "❌" : "✅"}</div>
          <div>Completed Payments: {completedPayments?.length || 0}</div>
        </div>
      )}
    </>
  )
}