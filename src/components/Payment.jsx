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
  fetchPackagesRequest,
  fetchUserTransactionsRequest
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

function showToast(message, type = "success") {
  const old = document.getElementById("toast-paid")
  if (old) {
    old.remove()
  }

  const toast = document.createElement("div")
  toast.id = "toast-paid"
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
  toast.style.transition = "all 0.3s ease"

  document.body.appendChild(toast)

  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove()
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

  // Lấy selected package từ navigation state
  const selectedPackageFromNav = location.state?.selectedPackage || null
  const fromMembership = location.state?.fromMembership || false

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
    currentPackageLoading,

    // Completed payments
    completedPayments
  } = useSelector((state) => {
    return state.payment || {}
  })

  // Lấy current package từ user object (từ login saga) - giống MembershipPackage
  const currentPackageFromUser = user?.currentPackage || null

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

  const accountId = getUserId()
  const userRole = getUserRole()

  const [showQR, setShowQR] = useState(false)
  const [buyingPkg, setBuyingPkg] = useState(null)
  const [transactionCode, setTransactionCode] = useState("")
  const [selectedPackageId, setSelectedPackageId] = useState(null)

  // Scroll to top khi component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Set selected package và scroll to package khi có selectedPackageFromNav
  useEffect(() => {
    if (selectedPackageFromNav && fromMembership && packages.length > 0) {
      console.log("🎯 Payment received selected package from MembershipPackage:", selectedPackageFromNav)
      setSelectedPackageId(selectedPackageFromNav.package_membership_ID)

      // Delay để đảm bảo DOM đã render xong
      const scrollTimer = setTimeout(() => {
        const selectedElement = document.getElementById(`package-${selectedPackageFromNav.package_membership_ID}`)
        if (selectedElement) {
          // Scroll to element với offset để không bị che bởi header
          const elementPosition = selectedElement.offsetTop
          const offsetPosition = elementPosition - 100 // Offset 100px từ top

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })

          // Add highlight effect
          selectedElement.classList.add('package-highlighted')
          setTimeout(() => {
            selectedElement.classList.remove('package-highlighted')
          }, 3000)
        } else {
          // Nếu không tìm thấy element, scroll to payment container
          const paymentContainer = document.querySelector('.payment-container')
          if (paymentContainer) {
            paymentContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }
        }
      }, 300) // Delay 300ms để đảm bảo packages đã render

      return () => clearTimeout(scrollTimer)
    }
  }, [selectedPackageFromNav, fromMembership, packages])

  // Fetch current package và packages khi user login
  useEffect(() => {
    if (token && accountId) {
      console.log("🚀 Fetching user transactions to get current package...")
      dispatch(fetchUserTransactionsRequest())
    }
  }, [token, accountId, dispatch])

  // Fetch packages khi component mount
  useEffect(() => {
    dispatch(fetchPackagesRequest())
  }, [dispatch])

  // Sinh mã giao dịch mới mỗi lần mở QR
  useEffect(() => {
    if (showQR && buyingPkg) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      setTransactionCode(code)
    }
  }, [showQR, buyingPkg])

  // Handle payment success
  useEffect(() => {
    if (paymentSuccess) {
      showToast("✅ Thanh toán thành công! Gói đã được kích hoạt.", "success")

      if (buyingPkg && accountId) {
        const paymentKey = `${buyingPkg.package_membership_ID}_${accountId}`
        // Dispatch action để add completed payment nếu cần
      }

      if (accountId) {
        // Fetch lại current package để đảm bảo sync
      }

      setShowQR(false)
      setBuyingPkg(null)

      setTimeout(() => {
        navigate("/")
      }, 2000)

      setTimeout(() => {
        dispatch(clearPaymentState())
      }, 3000)
    }
  }, [paymentSuccess, navigate, dispatch, buyingPkg, accountId])

  // Handle payment error
  useEffect(() => {
    if (paymentError) {
      showToast(`❌ Thanh toán thất bại: ${paymentError}`, "warning")
      dispatch(clearPaymentState())
    }
  }, [paymentError, dispatch])

  // Check giao dịch khi mở popup QR
  useEffect(() => {
    if (!showQR || !buyingPkg || !transactionCode || !accountId) return

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

        const lastPaid = rows
          .slice()
          .reverse()
          .find(
            (row) =>
              Number(row["Giá trị"] || 0) === price &&
              (row["Mô tả"] || "").toUpperCase().includes(content.toUpperCase()),
          )

        if (lastPaid) {
          const paymentKey = `${buyingPkg.package_membership_ID}_${accountId}`
          const isAlreadyPaid = completedPayments?.includes(paymentKey)

          if (!isAlreadyPaid) {
            const nowVN = getVietnamNowISO()
            const startDate = new Date(new Date(nowVN).setHours(0, 0, 0, 0)).toISOString()
            const endDate = new Date(new Date(nowVN).getTime() + (buyingPkg.duration || 30) * 24 * 60 * 60 * 1000).toISOString()

            dispatch(createPaymentRequest({
              accountId,
              packageMembershipId: buyingPkg.package_membership_ID,
              totalPrice: buyingPkg.price,
              paymentStatus: "Success",
              duration: buyingPkg.duration,
              transactionCode,
              timeBuy: nowVN,
              startDate,
              endDate
            }))

            dispatch(setCurrentPackage({
              package_membership_ID: buyingPkg.package_membership_ID,
              category: buyingPkg.category,
              description: buyingPkg.description,
              price: buyingPkg.price,
              duration: buyingPkg.duration,
              endDate: endDate,
              startDate: startDate,
              accountId: accountId,
              paymentStatus: "Success",
              transactionCode
            }))
          }

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

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Kiểm tra gói hiện tại
  const isCurrentPackage = (pkg) => {
    if (!currentPackageFromUser) return false

    // So sánh theo category (tên gói)
    const isMatchingCategory = currentPackageFromUser.name?.toLowerCase() === pkg.category?.toLowerCase()

    // Kiểm tra gói có đang hoạt động không
    const isActivePackage = currentPackageFromUser.isActive && !currentPackageFromUser.isExpired

    console.log('🔍 Checking if current package in Payment:', {
      packageCategory: pkg.category,
      currentPackageName: currentPackageFromUser.name,
      isMatchingCategory,
      isActivePackage,
      packageMembershipId: pkg.package_membership_ID
    })

    return isMatchingCategory && isActivePackage
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Kiểm tra có thể đăng ký gói không
  const canRegisterPackage = (pkg) => {
    // Không thể đăng ký nếu chưa đăng nhập
    if (!token) return false

    // Không thể đăng ký nếu không phải Member
    if (userRole !== "Member") return false

    // Không thể đăng ký nếu gói không active
    if (pkg.status !== "Active") return false

    // Nếu đang sử dụng gói này
    if (isCurrentPackage(pkg)) return false

    // Kiểm tra gói hiện tại
    if (currentPackageFromUser && currentPackageFromUser.isActive && !currentPackageFromUser.isExpired) {
      // Tìm package hiện tại từ danh sách để lấy package_membership_ID
      const currentPackageInfo = packages.find(p =>
        p.category?.toLowerCase() === currentPackageFromUser.name?.toLowerCase()
      )

      const currentPackageMembershipId = currentPackageInfo?.package_membership_ID

      console.log('🔍 Payment canRegisterPackage check:', {
        currentPackageName: currentPackageFromUser.name,
        currentPackageMembershipId,
        targetPackageId: pkg.package_membership_ID,
        canUpgrade: currentPackageMembershipId === 1
      })

      // Nếu gói hiện tại không phải ID = 1, không cho phép mua gói khác
      if (currentPackageMembershipId !== 1) {
        console.log('🚫 Cannot register - user has premium package (not ID=1)')
        return false
      }

      // Nếu gói hiện tại là ID = 1 (Free), có thể mua gói khác nhưng không mua lại Free
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        console.log('🚫 Cannot register - already has free package')
        return false
      }
    }

    return true
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Hàm lấy nhãn button phù hợp
  const getButtonLabel = (pkg) => {
    if (!token) return "Cần đăng nhập"
    if (userRole !== "Member") return "Chỉ dành cho Member"
    if (pkg.status !== "Active") return "Không khả dụng"

    if (isCurrentPackage(pkg)) {
      return `Đang sử dụng (${formatTimeLeft(currentPackageFromUser.daysLeft)})`
    }

    if (currentPackageFromUser && currentPackageFromUser.isActive && !currentPackageFromUser.isExpired) {
      const currentPackageInfo = packages.find(p =>
        p.category?.toLowerCase() === currentPackageFromUser.name?.toLowerCase()
      )
      const currentPackageMembershipId = currentPackageInfo?.package_membership_ID

      if (currentPackageMembershipId !== 1) {
        return `Đã có gói ${currentPackageFromUser.name}`
      }

      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        return `Đã có gói ${currentPackageFromUser.name}`
      }

      if (currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1) {
        return "Nâng cấp ngay"
      }
    }

    return "Mua gói ngay"
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Hàm lấy icon button phù hợp
  const getButtonIcon = (pkg) => {
    if (isCurrentPackage(pkg)) return "fas fa-check-circle"
    if (!canRegisterPackage(pkg)) return "fas fa-lock"

    if (currentPackageFromUser && currentPackageFromUser.isActive && !currentPackageFromUser.isExpired) {
      const currentPackageInfo = packages.find(p =>
        p.category?.toLowerCase() === currentPackageFromUser.name?.toLowerCase()
      )
      if (currentPackageInfo?.package_membership_ID === 1 && pkg.package_membership_ID !== 1) {
        return "fas fa-arrow-up"
      }
    }

    return "fas fa-shopping-cart"
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Format thời gian còn lại
  const formatTimeLeft = (daysLeft) => {
    if (daysLeft <= 0) return "Đã hết hạn"
    if (daysLeft === 1) return "Còn 1 ngày"
    return `Còn ${daysLeft} ngày`
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Hàm kiểm tra có phải gói upgrade không
  const isUpgradePackage = (pkg) => {
    if (!currentPackageFromUser || !currentPackageFromUser.isActive || currentPackageFromUser.isExpired) {
      return false
    }

    const currentPackageInfo = packages.find(p =>
      p.category?.toLowerCase() === currentPackageFromUser.name?.toLowerCase()
    )

    return currentPackageInfo?.package_membership_ID === 1 && pkg.package_membership_ID !== 1
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Handle register với validation
  const handleRegister = (pkg) => {
    console.log("🎯 Payment register attempt:", {
      hasToken: !!token,
      userRole,
      packageId: pkg.package_membership_ID,
      currentPackage: currentPackageFromUser
    })

    if (!token) {
      showToast("Vui lòng đăng nhập để mua gói", "warning")
      navigate("/login")
      return
    }

    if (userRole !== "Member") {
      showToast("Chỉ tài khoản thành viên mới được mua gói!", "warning")
      return
    }

    // Kiểm tra gói hiện tại từ user object
    if (currentPackageFromUser && currentPackageFromUser.isActive && !currentPackageFromUser.isExpired) {
      // Tìm package hiện tại từ danh sách packages để lấy package_membership_ID
      const currentPackageInfo = packages.find(p =>
        p.category?.toLowerCase() === currentPackageFromUser.name?.toLowerCase()
      )

      const currentPackageMembershipId = currentPackageInfo?.package_membership_ID

      console.log("🔍 Payment current package check:", {
        currentPackageMembershipId,
        currentPackageName: currentPackageFromUser.name,
        targetPackageId: pkg.package_membership_ID,
        canUpgrade: currentPackageMembershipId === 1
      })

      // Nếu gói hiện tại không phải ID = 1, không cho phép mua gói khác
      if (currentPackageMembershipId !== 1) {
        const daysLeft = currentPackageFromUser.daysLeft || 0
        showToast(`Bạn đang có gói ${currentPackageFromUser.name} còn ${daysLeft} ngày! Chỉ gói Free mới có thể nâng cấp.`, "warning")
        return
      }

      // Nếu là gói Free (ID = 1), kiểm tra không được mua lại chính gói Free
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        const daysLeft = currentPackageFromUser.daysLeft || 0
        showToast(`Bạn đã có gói ${currentPackageFromUser.name} còn ${daysLeft} ngày!`, "warning")
        return
      }

      // Gói Free có thể upgrade lên gói khác
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1) {
        console.log("✅ Upgrading from Free package to:", pkg.category)
        showToast(`Nâng cấp từ gói ${currentPackageFromUser.name} lên ${pkg.category}`, "success")
      }
    }

    console.log("✅ Opening QR for package:", pkg)
    setBuyingPkg(pkg)
    setShowQR(true)
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

  // Authentication check
  if (!token || !user) {
    return (
      <>
        <style jsx>{`
          .auth-required {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${COLORS.background};
          }
          
          .auth-card {
            background: ${COLORS.white};
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 8px 32px rgba(51, 107, 115, 0.1);
            border: 1px solid ${COLORS.color1};
          }
          
          .auth-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }
          
          .auth-title {
            color: ${COLORS.color3};
            font-weight: 700;
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }
          
          .auth-text {
            color: ${COLORS.textLight};
            margin-bottom: 2rem;
          }
          
          .auth-button {
            background: ${COLORS.gradient};
            color: ${COLORS.white};
            border: none;
            border-radius: 12px;
            padding: 1rem 2rem;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .auth-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(106, 183, 197, 0.4);
          }
        `}</style>

        <div className="auth-required">
          <div className="auth-card">
            <div className="auth-icon">🔐</div>
            <h2 className="auth-title">Cần đăng nhập</h2>
            <p className="auth-text">
              Bạn cần đăng nhập để xem và mua các gói thành viên
            </p>
            <button
              className="auth-button"
              onClick={() => navigate("/login")}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Đăng nhập ngay
            </button>
          </div>
        </div>

        <Footer />
      </>
    )
  }

  return (
    <>
      <style jsx>{`
        /* ...existing styles... */

        .payment-section {
          min-height: 80vh;
          background: ${COLORS.background};
          padding: 3rem 0;
          position: relative;
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
          margin: 0 auto;
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
          transform: scale(1.02);
        }

        .package-card.upgrade-available {
          border-color: #F59E0B;
          background: linear-gradient(135deg, ${COLORS.white} 0%, #FEF3C7 100%);
        }

        .package-card.upgrade-available::before {
          background: linear-gradient(90deg, #F59E0B, #FBBF24);
          height: 4px;
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
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-buy {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          box-shadow: 0 4px 16px rgba(106, 183, 197, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-buy::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s;
        }

        .btn-buy:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn-buy:hover:not(:disabled) {
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

        .package-highlighted {
          animation: highlightPulse 3s ease-in-out;
          box-shadow: 0 0 0 4px rgba(106, 183, 197, 0.3) !important;
          position: relative;
          z-index: 10;
        }

        @keyframes highlightPulse {
          0%, 100% { 
            box-shadow: 0 0 0 4px rgba(106, 183, 197, 0.3);
            transform: scale(1);
          }
          25% { 
            box-shadow: 0 0 0 8px rgba(106, 183, 197, 0.4);
            transform: scale(1.02);
          }
          50% { 
            box-shadow: 0 0 0 4px rgba(106, 183, 197, 0.3);
            transform: scale(1);
          }
          75% { 
            box-shadow: 0 0 0 8px rgba(106, 183, 197, 0.4);
            transform: scale(1.02);
          }
        }

        .package-card.selected-from-membership {
          border-color: ${COLORS.color2} !important;
          background: linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.color1} 10%, ${COLORS.white} 100%) !important;
          position: relative;
        }

        .package-card.selected-from-membership::before {
          background: ${COLORS.gradient} !important;
          height: 5px !important;
        }

        .package-card.selected-from-membership::after {
          content: '⭐ Đã chọn';
          position: absolute;
          top: -10px;
          right: -10px;
          background: ${COLORS.color2};
          color: ${COLORS.white};
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 5;
          box-shadow: 0 4px 12px rgba(106, 183, 197, 0.3);
        }

        /* Smooth scroll cho toàn bộ trang */
        html {
          scroll-behavior: smooth;
        }

        /* ...existing media queries... */
      `}</style>

      <section className="payment-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="payment-container">
                <h2 className="payment-title">💳 Thanh toán & Đăng ký</h2>
                <p className="payment-subtitle">
                  {selectedPackageFromNav && fromMembership ? (
                    <>
                      Bạn đã chọn gói <strong style={{ color: COLORS.color2 }}>{selectedPackageFromNav.category}</strong> -
                      Hoàn tất thanh toán để kích hoạt gói
                    </>
                  ) : (
                    "Chọn gói thành viên phù hợp để bắt đầu hành trình của bạn"
                  )}
                </p>

                {/* Hiển thị thông tin gói hiện tại - giống MembershipPackage */}
                {currentPackageFromUser && currentPackageFromUser.isActive && !currentPackageFromUser.isExpired && (
                  <div className="current-package-info">
                    <div className="current-package-title">
                      🎉 Bạn đang sử dụng gói {currentPackageFromUser.name}
                    </div>
                    <div className="current-package-details">
                      {formatTimeLeft(currentPackageFromUser.daysLeft)} •
                      Hết hạn: {new Date(currentPackageFromUser.endDate).toLocaleDateString('vi-VN')}
                      {packages.find(p => p.category?.toLowerCase() === currentPackageFromUser.name?.toLowerCase())?.package_membership_ID === 1 && (
                        <>
                          <br />
                          <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>
                            ⬆️ Có thể nâng cấp lên gói cao hơn
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

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
                      // Logic giống MembershipPackage
                      const isCurrent = isCurrentPackage(pkg)
                      const isActive = pkg.status === "Active"
                      const canRegister = canRegisterPackage(pkg)
                      const isUpgrade = isUpgradePackage(pkg)
                      const isSelectedFromMembership = selectedPackageId === pkg.package_membership_ID

                      return (
                        <div
                          key={pkg.package_membership_ID}
                          id={`package-${pkg.package_membership_ID}`}
                          className={`package-card ${isCurrent ? "current" :
                            isUpgrade ? "upgrade-available" :
                              isSelectedFromMembership ? "selected-from-membership" :
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
                                isSelectedFromMembership ? "status-active" :
                                  isActive ? "status-active" :
                                    "status-inactive"
                                }`}
                            >
                              {isCurrent ? "Đang dùng" :
                                isSelectedFromMembership ? "Đã chọn" :
                                  isUpgrade ? "Có thể nâng cấp" :
                                    isActive ? "Đang mở" : "Đóng"}
                            </div>
                          </div>

                          <h3 className="package-category">
                            {pkg.category}
                          </h3>
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
                              <i className={getButtonIcon(pkg)}></i>
                              {getButtonLabel(pkg)}
                            </button>
                          ) : canRegister ? (
                            <button
                              className={`package-button ${isSelectedFromMembership ? 'btn-upgrade' :
                                isUpgrade ? 'btn-upgrade' : 'btn-buy'
                                }`}
                              disabled={paymentLoading}
                              onClick={() => handleRegister(pkg)}
                            >
                              {paymentLoading ? (
                                <>
                                  <div className="loading-spinner"></div>
                                  Đang xử lý...
                                </>
                              ) : (
                                <>
                                  <i className={getButtonIcon(pkg)}></i>
                                  {isSelectedFromMembership ? "Mua gói này" : getButtonLabel(pkg)}
                                </>
                              )}
                            </button>
                          ) : (
                            <button className="package-button btn-disabled" disabled>
                              <i className={getButtonIcon(pkg)}></i>
                              {getButtonLabel(pkg)}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <div className="empty-state-text">Chưa có gói thành viên nào</div>
                    <p style={{ color: COLORS.textLight, marginTop: "0.5rem" }}>
                      Các gói thành viên sẽ sớm được cập nhật
                    </p>
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
                <span className="qr-info-value">{formatPrice(buyingPkg.price)}</span>
              </div>
              <div className="qr-info-item">
                <span className="qr-info-label">Người thụ hưởng:</span>
                <span className="qr-info-value">{ACCOUNT_NAME}</span>
              </div>
              <div className="qr-info-item">
                <span className="qr-info-label">Tài khoản:</span>
                <span className="qr-info-value">{accountId}</span>
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
    </>
  )
}