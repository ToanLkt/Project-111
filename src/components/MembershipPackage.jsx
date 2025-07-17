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

  // State for current package from my-transactions API
  const [currentPackageFromAPI, setCurrentPackageFromAPI] = useState(null)
  const [apiPackageLoading, setApiPackageLoading] = useState(false)

  // Lấy current package từ user object (từ login saga) - DEPRECATED sẽ thay bằng API
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

  const userId = getUserId()
  const userRole = getUserRole()

  // Fetch current package from my-transactions API
  useEffect(() => {
    const fetchCurrentPackageFromAPI = async () => {
      if (!token || !userId) {
        console.log("⏸️ Skipping API package fetch - missing token or userId");
        return;
      }

      try {
        setApiPackageLoading(true);
        console.log("🔍 Fetching current package from my-transactions API for userId:", userId);

        const response = await fetch(
          `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/my-transactions?accountId=${userId}`,
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/my-transactions",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.ok) {
          const transactions = await response.json();
          console.log("✅ My-transactions API data:", transactions);

          // Tìm giao dịch thành công có timeBuy gần nhất với hiện tại
          if (transactions && Array.isArray(transactions) && transactions.length > 0) {
            console.log("📊 Processing transactions data:", transactions.map(t => ({
              purchaseID: t.purchaseID,
              packageCategory: t.packageCategory,
              packageMembershipId: t.packageMembershipId || t.package_membership_ID,
              timeBuy: t.timeBuy,
              paymentStatus: t.paymentStatus,
              endDate: t.endDate,
              startDate: t.startDate
            })));

            // Lọc giao dịch thành công trước
            const successfulTransactions = transactions.filter(t =>
              t.paymentStatus === "Successful" || t.status === "Successful" || t.paymentStatus === "Success"
            );

            console.log("✅ Successful transactions:", successfulTransactions.length);

            if (successfulTransactions.length > 0) {
              // Sắp xếp theo timeBuy gần nhất (mới nhất)
              const sortedByTimeBuy = successfulTransactions.sort((a, b) => {
                const timeA = new Date(a.timeBuy || a.transactionDate || a.paymentDate || a.createdDate);
                const timeB = new Date(b.timeBuy || b.transactionDate || b.paymentDate || b.createdDate);
                return timeB - timeA; // Mới nhất trước
              });

              const latestTransaction = sortedByTimeBuy[0];
              console.log("🎯 Latest transaction by timeBuy:", {
                purchaseID: latestTransaction.purchaseID,
                packageCategory: latestTransaction.packageCategory,
                packageMembershipId: latestTransaction.packageMembershipId,
                timeBuy: latestTransaction.timeBuy,
                endDate: latestTransaction.endDate,
                paymentStatus: latestTransaction.paymentStatus
              });

              console.log("🎯 Latest transaction by timeBuy:", {
                purchaseID: latestTransaction.purchaseID,
                packageCategory: latestTransaction.packageCategory,
                packageMembershipId: latestTransaction.packageMembershipId,
                timeBuy: latestTransaction.timeBuy,
                endDate: latestTransaction.endDate,
                paymentStatus: latestTransaction.paymentStatus
              });

              // Kiểm tra còn hạn sử dụng không
              const endDate = latestTransaction.endDate || latestTransaction.expiryDate || latestTransaction.packageEndDate;

              if (endDate) {
                const now = new Date();
                const expiry = new Date(endDate);
                const isValid = expiry > now;
                const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

                console.log("📅 Package validity check:", {
                  endDate: endDate,
                  now: now.toISOString(),
                  expiry: expiry.toISOString(),
                  isValid: isValid,
                  daysLeft: daysLeft
                });

                if (isValid && daysLeft > 0) {
                  // Tìm package info từ packageMembershipId
                  const packageMembershipId = latestTransaction.packageMembershipId || latestTransaction.package_membership_ID;
                  const packageInfo = packages.find(p => p.package_membership_ID === packageMembershipId);

                  const currentPackageData = {
                    packageMembershipId: packageMembershipId,
                    category: latestTransaction.packageCategory || packageInfo?.category || 'Unknown',
                    name: latestTransaction.packageCategory || packageInfo?.category || 'Unknown',
                    endDate: endDate,
                    startDate: latestTransaction.startDate,
                    timeBuy: latestTransaction.timeBuy,
                    daysLeft: daysLeft,
                    isActive: true,
                    isExpired: false,
                    transaction: latestTransaction
                  };

                  setCurrentPackageFromAPI(currentPackageData);

                  console.log("✅ Current package set from API:", currentPackageData);
                } else {
                  console.log("❌ Latest transaction package has expired or invalid");
                  setCurrentPackageFromAPI(null);
                }
              } else {
                console.log("❌ No end date found in latest transaction");
                setCurrentPackageFromAPI(null);
              }
            } else {
              console.log("❌ No successful transactions found");
              setCurrentPackageFromAPI(null);
            }
          } else {
            console.log("❌ No transactions found");
            setCurrentPackageFromAPI(null);
          }
        } else {
          console.error("❌ Failed to fetch my-transactions:", response.status);
          setCurrentPackageFromAPI(null);
        }
      } catch (error) {
        console.error("❌ Error fetching current package from API:", error);
        setCurrentPackageFromAPI(null);
      } finally {
        setApiPackageLoading(false);
      }
    };

    // Chỉ fetch sau khi có packages data để có thể map packageMembershipId -> category
    if (packages.length > 0) {
      fetchCurrentPackageFromAPI();
    }
  }, [token, userId, packages])

  // Fetch packages khi component mount - KHÔNG CẦN TOKEN
  useEffect(() => {
    console.log("🚀 Dispatching fetchPackagesRequest from MembershipPackage...")
    dispatch(fetchPackagesRequest())
  }, [dispatch])

  // Debug Redux state changes
  useEffect(() => {
    console.log('🔍 MembershipPackage state updated:', {
      packagesLoading,
      packagesError,
      packagesCount: packages?.length || 0,
      currentPackageFromUser: currentPackageFromUser ? {
        name: currentPackageFromUser.name,
        isActive: currentPackageFromUser.isActive,
        isExpired: currentPackageFromUser.isExpired,
        daysLeft: currentPackageFromUser.daysLeft,
        endDate: currentPackageFromUser.endDate
      } : null,
      currentPackageFromAPI: currentPackageFromAPI ? {
        packageMembershipId: currentPackageFromAPI.packageMembershipId,
        name: currentPackageFromAPI.name,
        isActive: currentPackageFromAPI.isActive,
        isExpired: currentPackageFromAPI.isExpired,
        daysLeft: currentPackageFromAPI.daysLeft,
        endDate: currentPackageFromAPI.endDate,
        timeBuy: currentPackageFromAPI.timeBuy
      } : null,
      priorityPackage: currentPackageFromAPI || currentPackageFromUser,
      apiPackageLoading,
      userId,
      userRole,
      hasToken: !!token
    })
  }, [packagesLoading, packagesError, packages, currentPackageFromUser, currentPackageFromAPI, apiPackageLoading, userId, userRole, token])

  const handleRegister = (pkg) => {
    // Ưu tiên sử dụng currentPackageFromAPI, fallback về currentPackageFromUser
    const currentPackage = currentPackageFromAPI || currentPackageFromUser

    console.log("🎯 Register attempt:", {
      hasToken: !!token,
      userRole,
      packageId: pkg.package_membership_ID,
      currentPackageFromAPI: !!currentPackageFromAPI,
      currentPackageFromUser: !!currentPackageFromUser,
      currentPackage: currentPackage
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

    // Kiểm tra gói hiện tại từ API hoặc user object
    if (currentPackage && currentPackage.isActive && !currentPackage.isExpired) {
      let currentPackageMembershipId;

      // Nếu từ API, đã có packageMembershipId
      if (currentPackageFromAPI) {
        currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
      } else {
        // Nếu từ user object, tìm package từ danh sách
        const currentPackageInfo = packages.find(p =>
          p.category?.toLowerCase() === currentPackage.name?.toLowerCase()
        )
        currentPackageMembershipId = currentPackageInfo?.package_membership_ID;
      }

      console.log("🔍 Current package check:", {
        currentPackageMembershipId,
        currentPackageName: currentPackage.name,
        targetPackageId: pkg.package_membership_ID,
        canUpgrade: currentPackageMembershipId === 1,
        sourceAPI: !!currentPackageFromAPI
      })

      // Nếu gói hiện tại không phải ID = 1, không cho phép mua gói khác
      if (currentPackageMembershipId !== 1) {
        const daysLeft = currentPackage.daysLeft || 0
        showToast(`Bạn đang có gói ${currentPackage.name} còn ${daysLeft} ngày! Chỉ gói Free mới có thể nâng cấp.`)
        return
      }

      // Nếu là gói Free (ID = 1), kiểm tra không được mua lại chính gói Free
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        const daysLeft = currentPackage.daysLeft || 0
        showToast(`Bạn đã có gói ${currentPackage.name} còn ${daysLeft} ngày!`)
        return
      }

      // Gói Free có thể upgrade lên gói khác
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1) {
        console.log("✅ Upgrading from Free package to:", pkg.category)
        showToast(`Nâng cấp từ gói ${currentPackage.name} lên ${pkg.category}`, "success")
      }
    }

    console.log("✅ Navigating to payment with selected package:", pkg)
    // Truyền package được chọn qua state để Payment có thể focus vào gói đó
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

  // Kiểm tra gói hiện tại dựa vào thông tin từ API hoặc login
  const isCurrentPackage = (pkg) => {
    // Ưu tiên sử dụng currentPackageFromAPI
    const currentPackage = currentPackageFromAPI || currentPackageFromUser

    if (!currentPackage) return false

    let isMatchingCategory = false;
    let currentPackageMembershipId = null;

    // Nếu từ API
    if (currentPackageFromAPI) {
      isMatchingCategory = currentPackageFromAPI.packageMembershipId === pkg.package_membership_ID;
      currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
    } else {
      // Nếu từ user object, so sánh theo category
      isMatchingCategory = currentPackage.name?.toLowerCase() === pkg.category?.toLowerCase();
      // Tìm packageMembershipId từ danh sách packages
      const packageInfo = packages.find(p => p.category?.toLowerCase() === currentPackage.name?.toLowerCase());
      currentPackageMembershipId = packageInfo?.package_membership_ID;
    }

    // Kiểm tra gói có đang hoạt động không
    const isActivePackage = currentPackage.isActive && !currentPackage.isExpired

    console.log('🔍 Checking if current package:', {
      packageCategory: pkg.category,
      packageMembershipId: pkg.package_membership_ID,
      currentPackageName: currentPackage.name || currentPackage.category,
      currentPackageMembershipId,
      isMatchingCategory,
      isActivePackage,
      sourceAPI: !!currentPackageFromAPI,
      currentPackageDetails: {
        isActive: currentPackage.isActive,
        isExpired: currentPackage.isExpired,
        daysLeft: currentPackage.daysLeft,
        endDate: currentPackage.endDate
      }
    })

    return isMatchingCategory && isActivePackage
  }

  // CẬP NHẬT: Kiểm tra có thể đăng ký gói không
  const canRegisterPackage = (pkg) => {
    // Cho phép hiển thị packages nhưng disable button nếu chưa đăng nhập
    if (!token) return false

    // Không thể đăng ký nếu không phải Member
    if (userRole !== "Member") return false

    // Không thể đăng ký nếu gói không active
    if (pkg.status !== "Active") return false

    // Nếu đang sử dụng gói này
    if (isCurrentPackage(pkg)) return false

    // Ưu tiên sử dụng currentPackageFromAPI
    const currentPackage = currentPackageFromAPI || currentPackageFromUser

    // Kiểm tra gói hiện tại
    if (currentPackage && currentPackage.isActive && !currentPackage.isExpired) {
      let currentPackageMembershipId;

      // Nếu từ API
      if (currentPackageFromAPI) {
        currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
      } else {
        // Nếu từ user object, tìm package từ danh sách
        const currentPackageInfo = packages.find(p =>
          p.category?.toLowerCase() === currentPackage.name?.toLowerCase()
        )
        currentPackageMembershipId = currentPackageInfo?.package_membership_ID;
      }

      // Nếu gói hiện tại không phải ID = 1, không cho phép mua gói khác
      if (currentPackageMembershipId !== 1) {
        console.log('🚫 Cannot register - user has premium package (not ID=1):', {
          currentPackageName: currentPackage.name || currentPackage.category,
          currentPackageMembershipId,
          endDate: currentPackage.endDate,
          daysLeft: currentPackage.daysLeft,
          sourceAPI: !!currentPackageFromAPI
        })
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

  // CẬP NHẬT: Hàm lấy nhãn button phù hợp
  const getButtonLabel = (pkg) => {
    if (!token) return "Đăng nhập để mua"
    if (userRole !== "Member") return "Chỉ dành cho Member"
    if (pkg.status !== "Active") return "Không khả dụng"

    if (isCurrentPackage(pkg)) {
      // Ưu tiên sử dụng currentPackageFromAPI
      const currentPackage = currentPackageFromAPI || currentPackageFromUser
      return `Đang sử dụng (${formatTimeLeft(currentPackage?.daysLeft)})`
    }

    // Ưu tiên sử dụng currentPackageFromAPI
    const currentPackage = currentPackageFromAPI || currentPackageFromUser

    if (currentPackage && currentPackage.isActive && !currentPackage.isExpired) {
      let currentPackageMembershipId;

      // Nếu từ API
      if (currentPackageFromAPI) {
        currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
      } else {
        // Nếu từ user object, tìm package từ danh sách
        const currentPackageInfo = packages.find(p =>
          p.category?.toLowerCase() === currentPackage.name?.toLowerCase()
        )
        currentPackageMembershipId = currentPackageInfo?.package_membership_ID;
      }

      if (currentPackageMembershipId !== 1) {
        return `Đã có gói ${currentPackage.name || currentPackage.category}`
      }

      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        return `Đã có gói ${currentPackage.name || currentPackage.category}`
      }

      if (currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1) {
        return "Nâng cấp ngay"
      }
    }

    return "Đăng ký ngay"
  }

  // CẬP NHẬT: Hàm lấy icon button phù hợp
  const getButtonIcon = (pkg) => {
    if (!token) return "fas fa-sign-in-alt"
    if (isCurrentPackage(pkg)) return "fas fa-check-circle"
    if (!canRegisterPackage(pkg)) return "fas fa-lock"

    // Ưu tiên sử dụng currentPackageFromAPI
    const currentPackage = currentPackageFromAPI || currentPackageFromUser

    if (currentPackage && currentPackage.isActive && !currentPackage.isExpired) {
      let currentPackageMembershipId;

      // Nếu từ API
      if (currentPackageFromAPI) {
        currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
      } else {
        // Nếu từ user object, tìm package từ danh sách
        const currentPackageInfo = packages.find(p =>
          p.category?.toLowerCase() === currentPackage.name?.toLowerCase()
        )
        currentPackageMembershipId = currentPackageInfo?.package_membership_ID;
      }

      if (currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1) {
        return "fas fa-arrow-up"
      }
    }

    return "fas fa-shopping-cart"
  }

  // Format thời gian còn lại
  const formatTimeLeft = (daysLeft) => {
    if (daysLeft <= 0) return "Đã hết hạn"
    if (daysLeft === 1) return "Còn 1 ngày"
    return `Còn ${daysLeft} ngày`
  }

  // Hàm kiểm tra có phải gói upgrade không
  const isUpgradePackage = (pkg) => {
    // Ưu tiên sử dụng currentPackageFromAPI
    const currentPackage = currentPackageFromAPI || currentPackageFromUser

    if (!currentPackage || !currentPackage.isActive || currentPackage.isExpired) {
      return false
    }

    let currentPackageMembershipId;

    // Nếu từ API
    if (currentPackageFromAPI) {
      currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
    } else {
      // Nếu từ user object, tìm package từ danh sách
      const currentPackageInfo = packages.find(p =>
        p.category?.toLowerCase() === currentPackage.name?.toLowerCase()
      )
      currentPackageMembershipId = currentPackageInfo?.package_membership_ID;
    }

    return currentPackageMembershipId === 1 && pkg.package_membership_ID !== 1
  }

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

                {/* Hiển thị thông tin gói hiện tại - ưu tiên từ API */}
                {(() => {
                  // Ưu tiên sử dụng currentPackageFromAPI
                  const currentPackage = currentPackageFromAPI || currentPackageFromUser

                  if (!currentPackage || !currentPackage.isActive || currentPackage.isExpired) {
                    return null
                  }

                  return (
                    <div className="current-package-info">
                      <div className="current-package-title">
                        🎉 Bạn đang sử dụng gói {currentPackage.name || currentPackage.category}
                        {currentPackageFromAPI && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.8rem',
                            color: '#10B981',
                            fontWeight: 'normal'
                          }}>
                            📡 API
                          </span>
                        )}
                      </div>
                      <div className="current-package-details">
                        {formatTimeLeft(currentPackage.daysLeft)} •
                        Hết hạn: {new Date(currentPackage.endDate).toLocaleDateString('vi-VN')}
                        {currentPackageFromAPI && currentPackage.timeBuy && (
                          <>
                            <br />
                            <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                              📅 Mua ngày: {new Date(currentPackage.timeBuy).toLocaleDateString('vi-VN')}
                            </span>
                          </>
                        )}
                        {(() => {
                          // Kiểm tra có thể nâng cấp không
                          let currentPackageMembershipId;
                          if (currentPackageFromAPI) {
                            currentPackageMembershipId = currentPackageFromAPI.packageMembershipId;
                          } else {
                            const packageInfo = packages.find(p => p.category?.toLowerCase() === currentPackage.name?.toLowerCase());
                            currentPackageMembershipId = packageInfo?.package_membership_ID;
                          }

                          if (currentPackageMembershipId === 1) {
                            return (
                              <>
                                <br />
                                <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>
                                  ⬆️ Có thể nâng cấp lên gói cao hơn
                                </span>
                              </>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  );
                })()}

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

                      // Debug log cho mỗi package
                      console.log(`📦 Package ${pkg.category} (ID: ${pkg.package_membership_ID}):`, {
                        isCurrent,
                        isActive,
                        canRegister,
                        isUpgrade,
                        hasToken: !!token,
                        currentPackageFromUser: currentPackageFromUser?.name
                      })

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