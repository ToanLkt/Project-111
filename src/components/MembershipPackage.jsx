"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
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
  } = useSelector((state) => {
    console.log('🔍 MembershipPackage Redux state:', state.payment)
    return state.payment || {}
  })

  // State chỉ lấy packageMembershipId từ profile API
  const [currentPackageMembershipId, setCurrentPackageMembershipId] = useState(null);

  // Extract user info từ Redux user object
  const getUserRole = () => {
    if (!user) return null
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null
    return role ? role.toString().trim() : null
  }
  const userRole = getUserRole()

  // Fetch packages khi component mount - KHÔNG CẦN TOKEN
  useEffect(() => {
    console.log("🚀 Dispatching fetchPackagesRequest from MembershipPackage...")
    dispatch(fetchPackagesRequest())
  }, [dispatch])

  // Fetch current package từ profile API
  useEffect(() => {
    const fetchCurrentPackageFromProfile = async () => {
      if (!token) {
        // Reset packageMembershipId khi không có token (đã logout)
        setCurrentPackageMembershipId(null);
        return;
      }
      try {
        const response = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.ok) {
          const profile = await response.json();
          // Lưu packageMembershipId hiện tại
          setCurrentPackageMembershipId(profile.packageMembershipId || null);
        } else {
          setCurrentPackageMembershipId(null);
        }
      } catch (error) {
        setCurrentPackageMembershipId(null);
      }
    };
    fetchCurrentPackageFromProfile();
  }, [token]);

  // Reset currentPackageMembershipId khi user thay đổi hoặc logout
  useEffect(() => {
    if (!user) {
      setCurrentPackageMembershipId(null);
    }
  }, [user]);

  // Kiểm tra gói hiện tại dựa vào packageMembershipId
  const isCurrentPackage = (pkg) => {
    return currentPackageMembershipId === pkg.package_membership_ID;
  }

  // Kiểm tra có thể đăng ký gói không
  const canRegisterPackage = (pkg) => {
    if (!token) return false
    if (userRole !== "Member") return false
    if (pkg.status !== "Active") return false

    // Nếu chưa có gói nào hoặc gói đã hết hạn thì được mua tất cả các gói
    if (!currentPackageMembershipId || currentPackageMembershipId === 0) return true

    // FREE: cho phép mua BASIC hoặc PLUS
    if (currentPackageMembershipId === 1) return pkg.package_membership_ID !== 1
    // BASIC: chỉ cho phép mua PLUS
    if (currentPackageMembershipId === 2) return pkg.package_membership_ID === 3
    // PLUS: không cho phép mua gì nữa
    if (currentPackageMembershipId === 3) return false
    return false
  }

  // Hàm lấy nhãn button phù hợp
  const getButtonLabel = (pkg) => {
    if (!token) return "Đăng nhập để mua"
    if (userRole !== "Member") return "Chỉ dành cho Member"
    if (pkg.status !== "Active") return "Không khả dụng"
    if (isCurrentPackage(pkg)) return `Đang sử dụng (${pkg.category})`
    return "Đăng ký ngay"
  }

  // Hàm lấy icon button phù hợp
  const getButtonIcon = (pkg) => {
    if (!token) return "fas fa-sign-in-alt"
    if (isCurrentPackage(pkg)) return "fas fa-check-circle"
    if (!canRegisterPackage(pkg)) return "fas fa-lock"
    return "fas fa-shopping-cart"
  }

  // Hàm kiểm tra có phải gói upgrade không
  const isUpgradePackage = (pkg) => {
    return currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1
  }

  // Hàm xử lý đăng ký
  const handleRegister = (pkg) => {
    if (!token) {
      showToast("Vui lòng đăng nhập để mua gói", "warning")
      navigate("/login")
      return
    }
    if (userRole !== "Member") {
      showToast("Chỉ tài khoản thành viên mới được mua gói!", "warning")
      return
    }
    if (!canRegisterPackage(pkg)) {
      if (!currentPackageMembershipId) {
        showToast("Không xác định gói hiện tại!", "warning")
        return
      }
      // FREE: không cho mua lại FREE
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        showToast("Bạn đã có gói Free!", "warning")
        return
      }
      // BASIC: chỉ cho phép nâng cấp lên PLUS
      if (currentPackageMembershipId === 2) {
        showToast("Chỉ có thể nâng cấp lên gói Plus!", "warning")
        return
      }
      // PLUS: không cho phép mua gì nữa
      if (currentPackageMembershipId === 3) {
        showToast("Bạn đang sử dụng gói cao nhất!", "warning")
        return
      }
      showToast("Không thể đăng ký gói này!", "warning")
      return
    }
    navigate("/payment", {
      state: {
        selectedPackage: pkg,
        fromMembership: true
      }
    })
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
      free: "🆓",
      plus: "💎"
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

  // Format thời gian còn lại
  const formatTimeLeft = (daysLeft) => {
    if (daysLeft <= 0) return "Đã hết hạn"
    if (daysLeft === 1) return "Còn 1 ngày"
    return `Còn ${daysLeft} ngày`
  }

  // Log packages data khi có sự thay đổi
  useEffect(() => {
    console.log("📦 Packages data:", packages)
  }, [packages])

  return (
    <div>
      <style jsx>{`
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

        .current-package-info {
          background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
          border: 2px solid ${COLORS.success};
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .current-package-title {
          color: ${COLORS.success};
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .current-package-details {
          color: #166534;
          font-size: 0.9rem;
          line-height: 1.5;
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
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: 100%;
        }

        .package-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .package-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
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

        .btn-upgrade {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: ${COLORS.white};
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-upgrade::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }

        .btn-upgrade:hover::before {
          left: 100%;
        }

        .btn-upgrade:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
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

        .package-card.upgrade-available {
          border-color: #F59E0B;
          background: linear-gradient(135deg, ${COLORS.white} 0%, #FEF3C7 100%);
        }

        .package-card.upgrade-available::before {
          background: linear-gradient(90deg, #F59E0B, #FBBF24);
          height: 4px;
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

        @media (max-width: 768px) {
          .membership-section { padding: 3rem 0; }
          .membership-container { margin: 0 1rem; padding: 2.5rem 2rem; border-radius: 20px; }
          .membership-title { font-size: 2.2rem; }
          .packages-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .package-card { padding: 2rem; }
          .membership-icon-wrapper { width: 60px; height: 60px; }
          .membership-icon { font-size: 2rem; }
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
                {token && user && currentPackageMembershipId && (
                  <div className="current-package-info">
                    <div className="current-package-title">
                      🎉 Bạn đang sử dụng gói {
                        (packages.find(p => p.package_membership_ID === currentPackageMembershipId)?.category) || "Không xác định"
                      }
                    </div>
                  </div>
                )}
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
                      const isUpgrade = isUpgradePackage(pkg)
                      return (
                        <div
                          key={pkg.package_membership_ID}
                          className={`package-card ${isCurrent ? "current" :
                            isUpgrade ? "upgrade-available" :
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
                              {isCurrent ? "Đang dùng" :
                                isUpgrade ? "Có thể nâng cấp" :
                                  isActive ? "Đang mở" : "Đóng"}
                            </div>
                          </div>
                          <h3 className="package-category">{pkg.category}</h3>
                          <p className="package-description" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
                            {pkg.description
                              .split('.')
                              .map((line, idx) =>
                                line.trim() ? (
                                  <span
                                    key={idx}
                                    style={{
                                      background: "#f8fafc",
                                      borderRadius: "10px",
                                      padding: "10px 14px",
                                      color: "#23235a",
                                      fontSize: "1rem",
                                      boxShadow: "0 1px 6px rgba(44,130,201,0.07)",
                                      borderLeft: "4px solid #48A6A7",
                                      display: "block",
                                      fontWeight: 500,
                                      lineHeight: 1.6
                                    }}
                                  >
                                    {line.trim()}.
                                  </span>
                                ) : null
                              )}
                          </p>
                          <div className="package-footer">
                            <div className="package-info">
                              <div className={`package-price ${pkg.price === 0 ? "free" : ""}`}>
                                {formatPrice(pkg.price)}
                              </div>
                              <div className="package-duration">
                                <i className="fas fa-clock"></i>
                                Thời hạn: {pkg.duration} ngày
                              </div>
                            </div>
                            {isCurrent ? (
                              <button className="package-button btn-current">
                                <i className={getButtonIcon(pkg)}></i>
                                {getButtonLabel(pkg)}
                              </button>
                            ) : token && canRegister ? (
                              <button
                                className={`package-button ${isUpgrade ? 'btn-upgrade' : 'btn-register'}`}
                                onClick={() => handleRegister(pkg)}
                              >
                                <i className={getButtonIcon(pkg)}></i>
                                {getButtonLabel(pkg)}
                              </button>
                            ) : (
                              <button
                                className="package-button btn-disabled"
                                onClick={!token ? () => navigate("/login") : undefined}
                                style={!token ? { cursor: "pointer" } : {}}
                              >
                                <i className={getButtonIcon(pkg)}></i>
                                {getButtonLabel(pkg)}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}