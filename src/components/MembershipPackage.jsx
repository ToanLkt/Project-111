"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux" // Thêm useDispatch
import "bootstrap/dist/css/bootstrap.min.css"

// Import Redux actions
import { fetchPackagesRequest, fetchUserTransactionsRequest } from "../redux/components/payment/paymentSlice"

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

function showToast(message, type = "warning") {
  const old = document.getElementById("toast-msg")
  if (old) old.remove()

  const toast = document.createElement("div")
  toast.id = "toast-msg"
  toast.innerText = message
  toast.style.position = "fixed"
  toast.style.top = "32px"
  toast.style.right = "32px"
  toast.style.background = type === "warning" ? COLORS.warning : COLORS.success
  toast.style.color = COLORS.white
  toast.style.padding = "16px 32px"
  toast.style.borderRadius = "12px"
  toast.style.fontWeight = "600"
  toast.style.fontSize = "16px"
  toast.style.zIndex = "9999"
  toast.style.boxShadow = `0 8px 32px ${type === "warning" ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)"}`
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

export default function MembershipPackage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux state
  const { user, token } = useSelector((state) => state.account || {})
  const {
    packages = [],
    packagesLoading = false,
    packagesError = null,
    currentPackage = null,
    completedPayments = []
  } = useSelector((state) => {
    console.log('🔍 MembershipPackage Redux state:', state.payment)
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

  const getUserRole = () => {
    if (!user) return null
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null
    return role ? role.toString().trim() : null
  }

  const userId = getUserId()
  const userRole = getUserRole()

  // Fetch packages và current package từ Redux khi component mount
  useEffect(() => {
    console.log("🚀 Dispatching fetchPackagesRequest from MembershipPackage...")
    dispatch(fetchPackagesRequest())

    // Nếu user đã login, fetch transactions để lấy gói đang dùng
    if (token && userId) {
      console.log("🚀 Dispatching fetchUserTransactionsRequest to get current package...")
      dispatch(fetchUserTransactionsRequest())
    }
  }, [dispatch, token, userId])

  // Debug Redux state changes
  useEffect(() => {
    console.log('🔍 MembershipPackage state updated:', {
      packagesLoading,
      packagesError,
      packagesCount: packages?.length || 0,
      currentPackage: !!currentPackage,
      completedPayments: completedPayments?.length || 0,
      userId,
      userRole
    })
  }, [packagesLoading, packagesError, packages, currentPackage, completedPayments, userId, userRole])

  const handleRegister = (pkg) => {
    console.log("🎯 Register attempt:", {
      hasToken: !!token,
      userRole,
      packageId: pkg.package_membership_ID
    })

    if (!token) {
      showToast("Vui lòng đăng nhập để mua gói")
      navigate("/login")
      return
    }

    if (userRole !== "Member") {
      showToast("Chỉ tài khoản thành viên mới được mua gói!")
      return
    }

    // Kiểm tra gói hiện tại từ Redux
    if (currentPackage && currentPackage.package_membership_ID === pkg.package_membership_ID) {
      showToast("Bạn đã đang sử dụng gói này!")
      return
    }

    // Kiểm tra completedPayments
    const paymentKey = `${pkg.package_membership_ID}_${userId}`
    if (completedPayments.includes(paymentKey)) {
      showToast("Bạn đã mua gói này rồi!")
      return
    }

    console.log("✅ Navigating to payment with package:", pkg)
    navigate("/payment", { state: { package: pkg } })
  }

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

  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí"
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Kiểm tra gói hiện tại dựa vào giao dịch gần nhất từ API
  const isCurrentPackage = (pkg) => {
    if (!userId || !currentPackage) return false

    // Kiểm tra gói từ currentPackage (giao dịch gần nhất từ API)
    const isMatchingPackage = currentPackage.package_membership_ID === pkg.package_membership_ID ||
      currentPackage.packageMembershipId === pkg.package_membership_ID

    if (isMatchingPackage) {
      const now = new Date()
      const endDate = new Date(currentPackage.endDate)
      const isNotExpired = endDate > now && currentPackage.paymentStatus === 'Success'

      console.log('🔍 Checking current package from API:', {
        packageId: pkg.package_membership_ID,
        currentPackageId: currentPackage.package_membership_ID || currentPackage.packageMembershipId,
        endDate: currentPackage.endDate,
        endDateObj: endDate,
        now: now,
        isNotExpired,
        paymentStatus: currentPackage.paymentStatus
      })

      return isNotExpired
    }

    return false
  }

  // Kiểm tra có thể đăng ký gói không
  const canRegisterPackage = (pkg) => {
    // Không thể đăng ký nếu chưa đăng nhập
    if (!token) return false

    // Không thể đăng ký nếu không phải Member
    if (userRole !== "Member") return false

    // Không thể đăng ký nếu gói không active
    if (pkg.status !== "Active") return false

    // Không thể đăng ký nếu có gói đang hoạt động (dựa vào giao dịch gần nhất)
    if (currentPackage) {
      const now = new Date()
      const endDate = new Date(currentPackage.endDate)
      const hasActivePackage = endDate > now && currentPackage.paymentStatus === 'Success'

      if (hasActivePackage) {
        console.log('🚫 Cannot register - user has active package:', {
          currentPackageId: currentPackage.package_membership_ID || currentPackage.packageMembershipId,
          endDate: currentPackage.endDate,
          paymentStatus: currentPackage.paymentStatus
        })
        return false
      }
    }

    return true
  }

  return (
    <>
      {/* Giữ nguyên style CSS */}
      <style jsx>{`
        /* ... Giữ nguyên tất cả CSS ... */
        .membership-section {
          background: ${COLORS.background};
          padding: 5rem 0;
          position: relative;
        }

        .membership-container {
          background: ${COLORS.white};
          border-radius: 24px;
          padding: 4rem 3rem;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
        }

        .membership-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .membership-icon-wrapper {
          width: 80px;
          height: 80px;
          background: ${COLORS.gradientLight};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          border: 3px solid ${COLORS.color1};
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .membership-icon {
          font-size: 2.5rem;
          filter: grayscale(0.2);
        }

        .membership-title {
          font-size: 2.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .membership-subtitle {
          text-align: center;
          color: ${COLORS.textLight};
          font-size: 1.1rem;
          margin-bottom: 3rem;
          font-weight: 500;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .package-card {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid ${COLORS.color1};
          box-shadow: 0 8px 24px rgba(51, 107, 115, 0.06);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
          transform: scale(1.02);
        }

        .package-card:hover:not(.inactive):not(.current) {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(51, 107, 115, 0.15);
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
          height: 4px;
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
          transition: all 0.3s ease;
        }

        .package-card:hover .package-icon-badge {
          transform: scale(1.1) rotate(5deg);
        }

        .package-status {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-active {
          background: ${COLORS.color1};
          color: ${COLORS.color3};
        }

        .status-current {
          background: ${COLORS.success};
          color: ${COLORS.white};
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .status-inactive {
          background: #F3F4F6;
          color: #6B7280;
        }

        .package-category {
          font-size: 1.4rem;
          font-weight: 700;
          color: ${COLORS.color3};
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .package-description {
          color: ${COLORS.text};
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          min-height: 3rem;
        }

        .package-price {
          font-size: 2rem;
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
          margin-bottom: 2rem;
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
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-register {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          box-shadow: 0 4px 16px rgba(106, 183, 197, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-register::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }

        .btn-register:hover::before {
          left: 100%;
        }

        .btn-register:hover {
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

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: ${COLORS.textLight};
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .empty-state-text {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .loading-card {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid ${COLORS.color1};
        }

        .loading-skeleton {
          background: linear-gradient(90deg, ${COLORS.color1} 25%, ${COLORS.background} 50%, ${COLORS.color1} 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .skeleton-header { height: 50px; width: 100%; margin-bottom: 1.5rem; }
        .skeleton-title { height: 1.5rem; width: 60%; margin-bottom: 1rem; }
        .skeleton-desc { height: 1rem; width: 100%; margin-bottom: 0.5rem; }
        .skeleton-price { height: 2rem; width: 40%; margin-bottom: 2rem; }
        .skeleton-button { height: 3rem; width: 100%; }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .debug-panel {
          position: fixed;
          bottom: 20px;
          left: 20px;
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
          .membership-section { padding: 3rem 0; }
          .membership-container { margin: 0 1rem; padding: 2.5rem 2rem; border-radius: 20px; }
          .membership-title { font-size: 2.2rem; }
          .packages-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .package-card { padding: 2rem; }
          .membership-icon-wrapper { width: 60px; height: 60px; }
          .membership-icon { font-size: 2rem; }
          .debug-panel { display: none; }
        }

        @media (max-width: 576px) {
          .membership-title { font-size: 1.8rem; }
          .package-card { padding: 1.5rem; }
          .package-price { font-size: 1.6rem; }
        }
      `}</style>

      <section id="membership" className="membership-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="membership-container">
                <div className="membership-icon-wrapper">
                  <div className="membership-icon">💎</div>
                </div>

                <h2 className="membership-title">Gói thành viên</h2>
                <p className="membership-subtitle">
                  Chọn gói phù hợp để bắt đầu hành trình cai thuốc lá của bạn
                </p>

                {packagesLoading ? (
                  <div className="packages-grid">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="loading-card">
                        <div className="loading-skeleton skeleton-header"></div>
                        <div className="loading-skeleton skeleton-title"></div>
                        <div className="loading-skeleton skeleton-desc"></div>
                        <div className="loading-skeleton skeleton-desc"></div>
                        <div className="loading-skeleton skeleton-price"></div>
                        <div className="loading-skeleton skeleton-button"></div>
                      </div>
                    ))}
                  </div>
                ) : packagesError ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <div className="empty-state-text">Lỗi tải gói thành viên</div>
                    <p style={{ color: COLORS.textLight, marginTop: "0.5rem" }}>
                      {packagesError}
                    </p>
                    <button
                      className="package-button btn-register"
                      style={{ maxWidth: "200px", margin: "1rem auto" }}
                      onClick={() => dispatch(fetchPackagesRequest())}
                    >
                      🔄 Thử lại
                    </button>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <div className="empty-state-text">Chưa có gói thành viên nào</div>
                    <p style={{ color: COLORS.textLight, marginTop: "0.5rem" }}>
                      Các gói thành viên sẽ sớm được cập nhật
                    </p>
                  </div>
                ) : (
                  <div className="packages-grid">
                    {packages.map((pkg, index) => {
                      const isCurrent = isCurrentPackage(pkg)
                      const isActive = pkg.status === "Active"
                      const canRegister = canRegisterPackage(pkg)

                      // Debug log cho mỗi package
                      console.log(`📦 Package ${pkg.category}:`, {
                        id: pkg.package_membership_ID,
                        isCurrent,
                        isActive,
                        canRegister,
                        hasCurrentPackage: !!currentPackage,
                        currentPackageId: currentPackage?.package_membership_ID,
                        paymentKey: `${pkg.package_membership_ID}_${userId}`,
                        hasPayment: completedPayments.includes(`${pkg.package_membership_ID}_${userId}`)
                      })

                      return (
                        <div
                          key={pkg.package_membership_ID}
                          className={`package-card ${isCurrent ? "current" :
                            isActive ? "active" :
                              "inactive"
                            }`}
                        >
                          <div className="package-header">
                            <div className="package-icon-badge" style={{ background: getPackageColor(index) }}>
                              {getPackageIcon(pkg.category)}
                            </div>
                            <div
                              className={`package-status ${isCurrent ? "status-current" :
                                isActive ? "status-active" :
                                  "status-inactive"
                                }`}
                            >
                              {isCurrent ? "Đang dùng" : isActive ? "Đang mở" : "Đóng"}
                            </div>
                          </div>

                          <h3 className="package-category">{pkg.category}</h3>
                          <p className="package-description">{pkg.description}</p>

                          <div className={`package-price ${pkg.price === 0 ? "free" : ""}`}>
                            {formatPrice(pkg.price)}
                          </div>

                          <div className="package-duration">
                            <i className="fas fa-clock"></i>
                            Thời hạn: {pkg.duration} ngày
                          </div>

                          {isCurrent ? (
                            <button className="package-button btn-current">
                              <i className="fas fa-check-circle"></i>
                              Đang sử dụng
                            </button>
                          ) : canRegister ? (
                            <button className="package-button btn-register" onClick={() => handleRegister(pkg)}>
                              <i className="fas fa-shopping-cart"></i>
                              Đăng ký ngay
                            </button>
                          ) : (
                            <button className="package-button btn-disabled" disabled>
                              <i className="fas fa-lock"></i>
                              {!token ? "Cần đăng nhập" :
                                userRole !== "Member" ? "Chỉ dành cho Member" :
                                  completedPayments.includes(`${pkg.package_membership_ID}_${userId}`) ? "Đã mua" :
                                    "Không khả dụng"}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel - Development Only
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-panel">
            <div><strong>🔍 Membership Debug:</strong></div>
            <div>Token: {token ? "✅" : "❌"}</div>
            <div>User: {user ? "✅" : "❌"}</div>
            <div>UserId: {userId || "null"}</div>
            <div>Role: {userRole || "null"}</div>
            <div>Packages: {packages.length}</div>
            <div>Packages Loading: {packagesLoading ? "⏳" : "✅"}</div>
            <div>Packages Error: {packagesError ? "❌" : "✅"}</div>
            <div>Current Pkg: {currentPackage ? "✅" : "❌"}</div>
            <div>Completed Payments: {completedPayments?.length || 0}</div>
            {currentPackage && (
              <>
                <div>Current Pkg ID: {currentPackage.package_membership_ID}</div>
                <div>End Date: {currentPackage.endDate ? new Date(currentPackage.endDate).toLocaleDateString() : "N/A"}</div>
                <div>Account ID: {currentPackage.accountId}</div>
              </>
            )}
            {completedPayments.length > 0 && (
              <div>
                <div>Payment Keys:</div>
                {completedPayments.map((key, i) => (
                  <div key={i} style={{ fontSize: "10px" }}>• {key}</div>
                ))}
              </div>
            )}
          </div>
        )} */}
      </section>
    </>
  )
}
