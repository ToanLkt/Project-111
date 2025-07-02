"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../AuthContext/AuthContext"
import "bootstrap/dist/css/bootstrap.min.css"

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

function getCurrentPackage(accountId) {
    if (!accountId) return null
    try {
        const data = localStorage.getItem(`current_package_${accountId}`)
        if (!data) return null
        const pkg = JSON.parse(data)
        if (pkg.accountId !== accountId) return null
        if (new Date(pkg.endDate) > new Date()) return pkg
        return null
    } catch {
        return null
    }
}

function showToast(message) {
    const old = document.getElementById("toast-msg")
    if (old) old.remove()

    const toast = document.createElement("div")
    toast.id = "toast-msg"
    toast.innerText = message
    toast.style.position = "fixed"
    toast.style.top = "32px"
    toast.style.right = "32px"
    toast.style.background = COLORS.warning
    toast.style.color = COLORS.white
    toast.style.padding = "16px 32px"
    toast.style.borderRadius = "12px"
    toast.style.fontWeight = "600"
    toast.style.fontSize = "16px"
    toast.style.zIndex = "9999"
    toast.style.boxShadow = "0 8px 32px rgba(245, 158, 11, 0.3)"
    document.body.appendChild(toast)

    setTimeout(() => {
        toast.remove()
    }, 3000)
}

export default function MembershipPackage() {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const auth = useContext(AuthContext)
    const [currentPkg, setCurrentPkg] = useState(() => getCurrentPackage(auth?.accountId))
    const navigate = useNavigate()

    // Cập nhật lại currentPkg khi accountId thay đổi
    useEffect(() => {
        setCurrentPkg(getCurrentPackage(auth?.accountId))
    }, [auth?.accountId])

    // Cập nhật lại currentPkg mỗi 3s để bắt kịp giao dịch mới
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPkg(getCurrentPackage(auth?.accountId))
        }, 3000)
        return () => clearInterval(interval)
    }, [auth?.accountId])

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(
                    "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership",
                )
                const data = await res.json()
                setPackages(Array.isArray(data) ? data : [])
            } catch {
                setPackages([])
            } finally {
                setLoading(false)
            }
        }

        fetchPackages()
    }, [])

    const handleRegister = (pkg) => {
        if (!auth?.token) {
            showToast("Đăng nhập để mua gói")
            return
        }
        navigate("/payment", { state: { package: pkg } })
    }

    const getPackageIcon = (category) => {
        const icons = {
            basic: "🌱",
            premium: "⭐",
            vip: "👑",
            standard: "📦",
            pro: "🚀",
        }
        return icons[category?.toLowerCase()] || "📋"
    }

    const getPackageColor = (index) => {
        const colors = [COLORS.color1, COLORS.color2, "#E0F2FE", "#FEF3C7"]
        return colors[index % colors.length]
    }

    return (
        <>
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
          transition: all 0.3s ease;
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
          transform: translateY(-8px);
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
          line-height: 1.5;
          margin-bottom: 1.5rem;
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
        }

        .btn-register {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          box-shadow: 0 4px 16px rgba(106, 183, 197, 0.3);
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

        .skeleton-header {
          height: 50px;
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .skeleton-title {
          height: 1.5rem;
          width: 60%;
          margin-bottom: 1rem;
        }

        .skeleton-desc {
          height: 1rem;
          width: 100%;
          margin-bottom: 0.5rem;
        }

        .skeleton-price {
          height: 2rem;
          width: 40%;
          margin-bottom: 2rem;
        }

        .skeleton-button {
          height: 3rem;
          width: 100%;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .membership-section {
            padding: 3rem 0;
          }

          .membership-container {
            margin: 0 1rem;
            padding: 2.5rem 2rem;
            border-radius: 20px;
          }

          .membership-title {
            font-size: 2.2rem;
          }

          .packages-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .package-card {
            padding: 2rem;
          }

          .membership-icon-wrapper {
            width: 60px;
            height: 60px;
          }

          .membership-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .membership-title {
            font-size: 1.8rem;
          }

          .package-card {
            padding: 1.5rem;
          }

          .package-price {
            font-size: 1.6rem;
          }
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
                                <p className="membership-subtitle">Chọn gói phù hợp để bắt đầu hành trình cai thuốc lá của bạn</p>

                                {loading ? (
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
                                            const isCurrent =
                                                auth?.token && currentPkg && currentPkg.package_membership_ID === pkg.package_membership_ID
                                            const isActive = pkg.status === "Active"
                                            const canRegister = isActive && !isCurrent

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
                                                            className={`package-status ${isCurrent ? "status-current" : isActive ? "status-active" : "status-inactive"
                                                                }`}
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
                                                    ) : canRegister ? (
                                                        <button className="package-button btn-register" onClick={() => handleRegister(pkg)}>
                                                            <i className="fas fa-shopping-cart"></i>
                                                            Đăng ký ngay
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
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
