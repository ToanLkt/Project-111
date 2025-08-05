"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Footer from "./Footer"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios";
import { jwtDecode } from "jwt-decode";


// Import actions từ paymentSlice
import {
  createPaymentRequest,
  setCurrentPackage,
  clearPaymentState,
  fetchPackagesRequest,
  fetchUserTransactionsRequest,
  checkTransactionRequest,
  stopTransactionCheck,
  clearTransactionCheck,
  updateCurrentPackage,
  setLastSuccessfulPayment,
  clearCurrentPackage,
  createPaymentSuccess,
} from "../redux/components/payment/paymentSlice"
import { updateUserPackageMembershipId, updateUserProfile } from "../redux/login/loginSlice";

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

const API_BASE_URL = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net";

function showToast(message, type = "Success") {
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

    // Transaction verification
    transactionCheckLoading,
    transactionCheckError,
    verifiedTransactions,
    isCheckingTransaction,

    // Completed payments
    completedPayments,
    lastSuccessfulPayment,
  } = useSelector((state) => {
    return state.payment || {}
  })

  // Lấy current package từ user object (từ login saga) 
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

  // Thêm state cho popup xác nhận Free
  const [showFreeConfirm, setShowFreeConfirm] = useState(false)
  const [freePkg, setFreePkg] = useState(null)

  // Debug log để theo dõi payment state
  useEffect(() => {
    if (showQR && buyingPkg && transactionCode) {
      console.log("🔧 Payment Debug Info:", {
        showQR,
        buyingPkg,
        transactionCode,
        accountId,
        expectedContent: `THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}${transactionCode}`,
        expectedPrice: buyingPkg.price,
        isCheckingTransaction,
        paymentLoading,
        paymentSuccess,
        verifiedTransactionsCount: verifiedTransactions?.length || 0
      })
    }
  }, [showQR, buyingPkg, transactionCode, accountId, isCheckingTransaction, paymentLoading, paymentSuccess, verifiedTransactions])

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
      // Luôn tạo mã mới khi mở QR, bất kể đã có mã hay chưa
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      console.log("🔑 Generated new transaction code:", code)
      setTransactionCode(code)
    } else if (!showQR) {
      // Clear mã khi đóng QR
      setTransactionCode("")
    }
  }, [showQR, buyingPkg])

  // Handle payment success với logic cập nhật current package
  useEffect(() => {
    if (paymentSuccess && buyingPkg) {
      console.log("🎉 Payment success detected:", paymentSuccess)

      // Tính toán current package mới
      const now = new Date()
      const startDate = now
      const endDate = new Date(now.getTime() + (buyingPkg.duration * 24 * 60 * 60 * 1000))

      const newCurrentPackage = {
        name: buyingPkg.category,
        category: buyingPkg.category,
        package_membership_ID: buyingPkg.package_membership_ID,
        duration: buyingPkg.duration,
        price: buyingPkg.price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        daysLeft: buyingPkg.duration,
        isActive: true,
        isExpired: false,
        paymentDate: now.toISOString(),
        transactionCode: transactionCode
      }

      console.log("📦 Updating current package to:", newCurrentPackage)

      // Cập nhật current package trong Redux
      dispatch(updateCurrentPackage(newCurrentPackage))
      dispatch(setLastSuccessfulPayment({
        ...paymentSuccess,
        packageInfo: newCurrentPackage
      }))
      // Package membership ID sẽ được cập nhật từ API profile fetch ở dưới

      showToast(`✅ Thanh toán thành công! Gói ${buyingPkg.category} đã được kích hoạt.`, "success")

      // Fetch lại profile từ backend để cập nhật user mới nhất vào Redux và localStorage
      const fetchProfile = async () => {
        try {
          const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            console.log("✅ Updated profile from API:", userData);

            // Sử dụng action updateUserProfile để cập nhật an toàn hơn
            dispatch(updateUserProfile({
              packageMembershipId: userData.packageMembershipId
            }));
            console.log("✅ Updated packageMembershipId in Redux:", userData.packageMembershipId);

            // Cập nhật user mới vào localStorage, giữ nguyên token
            const updatedUser = {
              ...user,
              packageMembershipId: userData.packageMembershipId
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log("✅ Updated user in localStorage:", updatedUser);
          }
        } catch (e) {
          console.log("⚠️ Failed to fetch updated profile, but payment was successful");
        }
      };
      fetchProfile();

      // Stop checking và đóng QR
      setShowQR(false)
      setBuyingPkg(null)
      dispatch(stopTransactionCheck())

      // Refresh user transactions để đồng bộ với server
      dispatch(fetchUserTransactionsRequest())

      // ✅ LOẠI BỎ RELOAD - chỉ dùng Redux state update
      // Không cần reload trang nữa, Redux sẽ tự động cập nhật UI

      // Clear payment state sau 5 giây (nhưng giữ current package)
      const clearTimer = setTimeout(() => {
        dispatch(clearPaymentState())
        dispatch(clearTransactionCheck())
      }, 5000)

      return () => {
        clearTimeout(clearTimer)
      }
    }
  }, [paymentSuccess, buyingPkg, token, dispatch])

  // Handle verified transaction từ saga
  useEffect(() => {
    if (verifiedTransactions.length > 0) {
      const latestTransaction = verifiedTransactions[verifiedTransactions.length - 1]
      console.log("🎯 Verified transaction detected:", latestTransaction)

      // Lưu giao dịch vào database
      if (buyingPkg && transactionCode) {
        console.log("💾 Saving transaction to database...")
        savePaymentTransaction(buyingPkg, { transactionCode })
      }

      // Đóng QR modal và hiển thị thông báo
      setShowQR(false)
      setBuyingPkg(null)
      showToast("✅ Giao dịch đã được xác thực! Đang lưu vào hệ thống...", "success")
    }
  }, [verifiedTransactions, buyingPkg, transactionCode, navigate])

  // Handle transaction check error
  useEffect(() => {
    if (transactionCheckError) {
      console.log("❌ Transaction check error:", transactionCheckError)
      // Không hiển thị lỗi cho user vì có thể là do chưa có giao dịch
    }
  }, [transactionCheckError])

  // Handle payment error - cho phép thử lại khi thanh toán thất bại
  useEffect(() => {
    if (paymentError) {
      console.log("❌ Payment error detected:", paymentError)

      // Hiển thị thông báo lỗi cho user
      showToast(`❌ Thanh toán thất bại: ${paymentError}. Vui lòng thử lại.`, "error")

      // Reset trạng thái thanh toán để cho phép thử lại
      setShowQR(false)
      setBuyingPkg(null)
      setTransactionCode("")

      // Dừng việc check transaction
      dispatch(stopTransactionCheck())

      // Clear payment error sau 3 giây để user có thể thử lại
      setTimeout(() => {
        dispatch(clearPaymentState())
      }, 3000)
    }
  }, [paymentError, dispatch])

  // Thêm useEffect xử lý timeout thanh toán
  useEffect(() => {
    if (showQR && buyingPkg && transactionCode) {
      // Timeout sau 15 phút thay vì 10 phút để user có nhiều thời gian hơn 
      const paymentTimeoutId = setTimeout(() => {
        console.log("⏰ Payment timeout - allowing retry")

        // Hiển thị thông báo timeout
        showToast("⏰ Hết thời gian thanh toán. Bạn có thể thử lại.", "warning")

        // Reset trạng thái để cho phép thử lại
        setShowQR(false)
        setBuyingPkg(null)
        setTransactionCode("")

        // Dừng check transaction
        dispatch(stopTransactionCheck())
      }, 15 * 60 * 1000) // 15 phút

      return () => {
        clearTimeout(paymentTimeoutId)
      }
    }
  }, [showQR, buyingPkg, transactionCode, dispatch])

  // Lấy packageMembershipId từ Redux user
  const getCurrentPackageMembershipId = () => {
    return user?.packageMembershipId || null
  }

  // Hàm kiểm tra gói hiện tại
  const isCurrentPackage = (pkg) => {
    return getCurrentPackageMembershipId() === pkg.package_membership_ID
  }

  // Lọc packages theo quyền nâng cấp
  const getFilteredPackages = () => {
    const currentId = getCurrentPackageMembershipId()
    if (currentId === 2) {
      return packages.filter(pkg => pkg.package_membership_ID === 3)
    }
    if (currentId === 1) {
      return packages.filter(pkg => pkg.package_membership_ID === 2 || pkg.package_membership_ID === 3)
    }
    if (currentId === 3) {
      return []
    }
    return packages
  }

  // Cập nhật logic lấy current package - ưu tiên từ Redux state
  const getCurrentPackage = () => {
    // Ưu tiên current package từ payment state (vừa mua)
    if (currentPackage) {
      console.log('🔍 getCurrentPackage from Redux payment state:', currentPackage)
      return currentPackage
    }

    // Fallback về current package từ user object
    console.log('🔍 getCurrentPackage from user object:', currentPackageFromUser)
    return currentPackageFromUser
  }

  // Cập nhật logic lấy button label
  const getButtonLabel = (pkg) => {
    if (!token) return "Cần đăng nhập"
    if (userRole !== "Member") return "Chỉ dành cho Member"
    if (pkg.status !== "Active") return "Không khả dụng"

    const activePackage = getCurrentPackage()

    if (isCurrentPackage(pkg)) {
      return `Đang sử dụng (${formatTimeLeft(activePackage.daysLeft)})`
    }

    if (activePackage && activePackage.isActive && !activePackage.isExpired) {
      const currentPackageMembershipId = activePackage.package_membership_ID
      const targetPackageId = pkg.package_membership_ID

      // 🐛 DEBUG: Log để kiểm tra vấn đề
      console.log('🔍 getButtonLabel debug:', {
        activePackageName: activePackage.name,
        currentPackageMembershipId,
        targetPackageId,
        targetCategory: pkg.category,
        isCurrentPackage: isCurrentPackage(pkg),
        canRegister: canRegisterPackage(pkg)
      })

      // Gói 1 (FREE): Có thể mua gói 2 và 3
      if (currentPackageMembershipId === 1) {
        if (targetPackageId === 1) {
          console.log('✅ Same FREE package detected')
          return `Đã có gói ${activePackage.name}`
        }
        if (targetPackageId === 2 || targetPackageId === 3) {
          console.log('✅ Can upgrade from FREE to BASIC/PLUS')
          return "Nâng cấp ngay"
        }
      }

      // Gói 2 (BASIC): Chỉ có thể mua gói 3
      if (currentPackageMembershipId === 2) {
        if (targetPackageId === 1) {
          return "Không thể hạ cấp"
        }
        if (targetPackageId === 2) {
          return `Đã có gói ${activePackage.name}`
        }
        if (targetPackageId === 3) {
          return "Nâng cấp ngay"
        }
      }

      // Gói 3 (PLUS): Không thể mua gói khác khi chưa hết hạn
      if (currentPackageMembershipId === 3) {
        console.log('🚫 Cannot upgrade from PLUS - highest package')
        return false
      }

      // Nếu có package ID khác không nằm trong quy tắc
      console.log('🚫 Unknown package upgrade rule')
      return false
    }

    return "Mua gói ngay"
  }

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Hàm lấy icon button phù hợp
  const getButtonIcon = (pkg) => {
    if (isCurrentPackage(pkg)) return "fas fa-check-circle"
    if (!canRegisterPackage(pkg)) return "fas fa-lock"

    // Kiểm tra nếu là upgrade package
    if (isUpgradePackage(pkg)) {
      return "fas fa-arrow-up"
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

    if (!currentPackageInfo) return false

    const currentPackageId = currentPackageInfo.package_membership_ID
    const targetPackageId = pkg.package_membership_ID

    // ✅ QUYỀN NÂNG CẤP:
    // Gói 1 -> Gói 2, 3
    if (currentPackageId === 1 && (targetPackageId === 2 || targetPackageId === 3)) {
      return true
    }

    // Gói 2 -> Gói 3
    if (currentPackageId === 2 && targetPackageId === 3) {
      return true
    }

    // Gói 3 -> Không thể nâng cấp
    return false
  }

  // Hàm lưu giao dịch thành công vào database
  const savePaymentTransaction = async (packageData, transactionData) => {
    try {
      console.log("💾 Saving successful payment transaction to database...");

      const paymentPayload = {
        packageMembershipId: packageData.package_membership_ID,
        timeBuy: new Date().toISOString(),
        totalPrice: packageData.price,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (packageData.duration * 24 * 60 * 60 * 1000)).toISOString(),
        paymentStatus: "Success",
        transactionCode: transactionData.transactionCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      };

      console.log("📤 Payment payload:", paymentPayload);

      const response = await fetch(
        "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Payment/create",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(paymentPayload)
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Payment transaction saved successfully:", result);
        showToast("💾 Giao dịch đã được lưu vào hệ thống!", "success");
        return result;
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to save payment transaction:", response.status, errorText);
        showToast("⚠️ Lưu giao dịch thất bại, nhưng thanh toán đã thành công!", "warning");
        return null;
      }
    } catch (error) {
      console.error("❌ Error saving payment transaction:", error);
      showToast("⚠️ Lỗi lưu giao dịch, nhưng thanh toán đã thành công!", "warning");
      return null;
    }
  };

  // LOGIC GIỐNG MEMBERSHIPPACKAGE: Handle register với validation
  const handleRegister = async (pkg) => {
    const activePackage = getCurrentPackage()
    const currentPackageMembershipId = activePackage?.package_membership_ID

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
      if (currentPackageMembershipId === 1 && pkg.package_membership_ID === 1) {
        showToast("Bạn đã có gói Free!", "warning")
        return
      }
      if (currentPackageMembershipId === 2) {
        showToast("Chỉ có thể nâng cấp lên gói Plus!", "warning")
        return
      }
      if (currentPackageMembershipId === 3) {
        showToast("Bạn đang sử dụng gói cao nhất!", "warning")
        return
      }
      showToast("Không thể đăng ký gói này!", "warning")
      return
    }

    // Nếu là gói Free thì hiện popup xác nhận
    if (pkg.price === 0) {
      setFreePkg(pkg)
      setShowFreeConfirm(true)
      return
    }

    // Các gói khác (trả phí) phải mở QR để thanh toán
    setBuyingPkg(pkg)
    setShowQR(true)
  }

  // Hàm xác nhận dùng gói Free
  const handleConfirmFree = async () => {
    if (!freePkg) return
    try {
      // Tạo payload giống như thanh toán thành công
      const now = new Date()
      const endDate = new Date(now.getTime() + (freePkg.duration * 24 * 60 * 60 * 1000))
      const newCurrentPackage = {
        name: freePkg.category,
        category: freePkg.category,
        package_membership_ID: freePkg.package_membership_ID,
        duration: freePkg.duration,
        price: freePkg.price,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        daysLeft: freePkg.duration,
        isActive: true,
        isExpired: false,
        paymentDate: now.toISOString(),
        transactionCode: "FREE"
      }

      // Gọi API cập nhật gói (giống như savePaymentTransaction)
      const paymentPayload = {
        packageMembershipId: freePkg.package_membership_ID,
        timeBuy: now.toISOString(),
        totalPrice: 0,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        paymentStatus: "Success",
        transactionCode: "FREE"
      }

      const response = await fetch(
        "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Payment/create",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(paymentPayload)
        }
      )

      if (response.ok) {
        dispatch(updateCurrentPackage(newCurrentPackage))
        dispatch(createPaymentSuccess(await response.json()))
        // Package membership ID sẽ được cập nhật từ API profile fetch ở dưới

        // Fetch lại profile từ backend để cập nhật user mới nhất vào Redux và localStorage
        const fetchProfile = async () => {
          try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const userData = await res.json();
              console.log("✅ Updated profile from API after free package:", userData);

              // Sử dụng action updateUserProfile để cập nhật an toàn hơn
              dispatch(updateUserProfile({
                packageMembershipId: userData.packageMembershipId
              }));
              console.log("✅ Updated packageMembershipId in Redux:", userData.packageMembershipId);

              // Cập nhật user mới vào localStorage, giữ nguyên token
              const updatedUser = {
                ...user,
                packageMembershipId: userData.packageMembershipId
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              console.log("✅ Updated user in localStorage:", updatedUser);
            }
          } catch (e) {
            console.log("⚠️ Failed to fetch updated profile, but free package registration was successful");
          }
        };
        fetchProfile();

        showToast("✅ Đã đăng ký gói Free thành công!", "success")
        setShowFreeConfirm(false)
        setFreePkg(null)

        // ✅ LOẠI BỎ NAVIGATE - để user ở lại trang Payment để thấy được gói đã kích hoạt
        // Redux sẽ tự động cập nhật UI
      } else {
        showToast("❌ Đăng ký gói Free thất bại!", "error")
      }
    } catch (error) {
      showToast("❌ Đăng ký gói Free thất bại!", "error")
    }
  }

  // Hàm xử lý xác nhận thanh toán thủ công
  const handleManualConfirmation = async () => {
    if (!buyingPkg || !transactionCode) {
      showToast("❌ Thông tin giao dịch không hợp lệ!", "error")
      return
    }

    try {
      // Gọi API Google Sheet để lấy danh sách giao dịch
      const res = await fetch(TRANSACTION_API)
      const text = await res.text()
      // Xử lý dữ liệu JSONP trả về từ Google Sheets
      const json = JSON.parse(text.substring(47, text.length - 2))
      const rows = json.table.rows

      // Tìm giao dịch phù hợp: đúng số tiền và đúng nội dung chuyển khoản
      const expectedContent = `THANHTOAN${buyingPkg.category.toUpperCase()}${buyingPkg.package_membership_ID}${transactionCode}`
      const expectedAmount = buyingPkg.price

      const found = rows.find(row => {
        // Ghép nội dung các cột lại để kiểm tra
        const content =
          (row.c[1]?.v?.toString().toUpperCase() || "") +
          (row.c[2]?.v?.toString().toUpperCase() || "") +
          (row.c[3]?.v?.toString().toUpperCase() || "");
        const amount = parseInt(row.c[2]?.v || row.c[3]?.v || "0", 10);
        return content.includes(expectedContent) && amount === expectedAmount;
      })

      if (found) {
        await savePaymentTransaction(buyingPkg, { transactionCode });

        // Tính toán current package mới giống như trong useEffect paymentSuccess
        const now = new Date()
        const endDate = new Date(now.getTime() + (buyingPkg.duration * 24 * 60 * 60 * 1000))
        const newCurrentPackage = {
          name: buyingPkg.category,
          category: buyingPkg.category,
          package_membership_ID: buyingPkg.package_membership_ID,
          duration: buyingPkg.duration,
          price: buyingPkg.price,
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
          daysLeft: buyingPkg.duration,
          isActive: true,
          isExpired: false,
          paymentDate: now.toISOString(),
          transactionCode: transactionCode
        }

        dispatch(updateCurrentPackage(newCurrentPackage));
        // Package membership ID sẽ được cập nhật từ API profile fetch ở dưới

        // Fetch lại profile từ backend để cập nhật user mới nhất vào Redux và localStorage
        const fetchProfile = async () => {
          try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const userData = await res.json();
              console.log("✅ Updated profile from API after manual confirmation:", userData);

              // Sử dụng action updateUserProfile để cập nhật an toàn hơn
              dispatch(updateUserProfile({
                packageMembershipId: userData.packageMembershipId
              }));
              console.log("✅ Updated packageMembershipId in Redux:", userData.packageMembershipId);

              // Cập nhật user mới vào localStorage, giữ nguyên token
              const updatedUser = {
                ...user,
                packageMembershipId: userData.packageMembershipId
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              console.log("✅ Updated user in localStorage:", updatedUser);
            }
          } catch (e) {
            console.log("⚠️ Failed to fetch updated profile, but payment was successful");
          }
        };
        fetchProfile();

        showToast("✅ Đã xác nhận thanh toán thành công!", "success")
        setShowQR(false)
        setBuyingPkg(null)

        // ✅ LOẠI BỎ RELOAD - chỉ dùng Redux state update, không cần navigate
        // Redux sẽ tự động cập nhật UI trên tất cả các trang
      } else {
        // Nếu chưa có giao dịch
        showToast("❌ Chưa có giao dịch phù hợp!", "warning")
        // KHÔNG đóng QR, giữ nguyên modal
      }
    } catch (error) {
      showToast("❌ Lỗi kiểm tra giao dịch!", "error")
    }
  }

  // Hàm xử lý hủy thanh toán
  const handleCancelPayment = () => {
    console.log("❌ Payment cancelled by user")

    // Dừng check transaction
    dispatch(stopTransactionCheck())

    // Clear payment state để reset error nếu có
    dispatch(clearPaymentState())

    // Đóng QR modal
    setShowQR(false)
    setBuyingPkg(null)
    setTransactionCode("")

    showToast("❌ Đã hủy thanh toán", "info")
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

  // Hàm kiểm tra có thể đăng ký/mua gói này không (đồng bộ với MembershipPackage)
  const canRegisterPackage = (pkg) => {
    if (!token) return false
    if (userRole !== "Member") return false
    if (pkg.status !== "Active") return false

    // Lấy packageMembershipId hiện tại từ Redux user
    const currentPackageMembershipId = getCurrentPackageMembershipId()

    // Nếu chưa có gói nào hoặc gói đã hết hạn thì được mua tất cả các gói
    // (Bạn có thể bổ sung điều kiện hết hạn nếu có biến isExpired)
    if (!currentPackageMembershipId || currentPackageMembershipId === 0) return true

    // FREE: cho phép mua BASIC hoặc PLUS
    if (currentPackageMembershipId === 1) return pkg.package_membership_ID !== 1
    // BASIC: chỉ cho phép mua PLUS
    if (currentPackageMembershipId === 2) return pkg.package_membership_ID === 3
    // PLUS: không cho phép mua gì nữa
    if (currentPackageMembershipId === 3) return false
    return false
  }

  return (
    <>
      <style jsx>{`
        /* ...existing styles... */

        .payment-section {
          background: ${COLORS.background};
          padding: 5rem 0;
          position: relative;
        }

        .payment-container {
          background: ${COLORS.white};
          border-radius: 24px;
          padding: 4rem 3rem;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
          max-width: 1200px;
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

        .payment-subtitle {
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

        .btn-retry {
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          color: ${COLORS.white};
          border: 2px solid #EF4444;
          animation: pulseRetry 2s infinite;
        }

        .btn-retry:hover {
          background: linear-gradient(135deg, #B91C1C 0%, #991B1B 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
        }

        @keyframes pulseRetry {
          0%, 100% { 
            border-color: #EF4444;
            box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
          }
          50% { 
            border-color: #DC2626;
            box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
          }
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
          .payment-section { padding: 3rem 0; }
          .payment-container { margin: 0 1rem; padding: 2.5rem 2rem; border-radius: 20px; }
          .payment-title { font-size: 2.2rem; }
          .packages-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .package-card { padding: 2rem; }

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
          .payment-title { font-size: 1.8rem; }
          .package-card { padding: 1.5rem; }
          .package-price { font-size: 1.6rem; }

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
            <div className="col-12 col-xl-10">
              <div className="payment-container">
                <h2 className="payment-title"> Thanh toán & Đăng ký</h2>
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

                {/* Hiển thị thông tin gói hiện tại - cập nhật logic */}
                {(() => {
                  const activePackage = getCurrentPackage()
                  return activePackage && activePackage.isActive && !activePackage.isExpired && (
                    <div className="current-package-info">
                      <div className="current-package-title">
                        🎉 Bạn đang sử dụng gói {activePackage.name}
                        {lastSuccessfulPayment && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.9rem',
                            color: '#10B981'
                          }}>
                            ✨ Vừa kích hoạt
                          </span>
                        )}
                      </div>
                      <div className="current-package-details">
                        {formatTimeLeft(activePackage.daysLeft)} •
                        Hết hạn: {new Date(activePackage.endDate).toLocaleDateString('vi-VN')}
                        {activePackage.package_membership_ID === 1 && (
                          <>
                            <br />
                            <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>
                              ⬆️ Có thể nâng cấp lên gói cao hơn
                            </span>
                          </>
                        )}
                        {lastSuccessfulPayment && (
                          <>
                            <br />
                            <span style={{ color: '#10B981', fontSize: '0.85rem' }}>
                              💳 Mã GD: {lastSuccessfulPayment.transactionCode || transactionCode}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })()}

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
                ) : getFilteredPackages().length > 0 ? (
                  <div className="packages-grid">
                    {getFilteredPackages().map((pkg, index) => {
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
                            ) : canRegister ? (
                              <button
                                className={`package-button ${isSelectedFromMembership ? 'btn-upgrade' :
                                  isUpgrade ? 'btn-upgrade' : 'btn-buy'
                                  } ${paymentError ? 'btn-retry' : ''}`}
                                disabled={paymentLoading}
                                onClick={() => handleRegister(pkg)}
                              >
                                {paymentLoading ? (
                                  <>
                                    <div className="loading-spinner"></div>
                                    Đang xử lý...
                                  </>
                                ) : paymentError ? (
                                  <>
                                    <i className="fas fa-redo"></i>
                                    Thử lại thanh toán
                                  </>
                                ) : (
                                  <>
                                    <i className={getButtonIcon(pkg)}></i>
                                    {getButtonLabel(pkg)}
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
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <div className="empty-state-text">Không có gói nào để nâng cấp</div>
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
      {showQR && buyingPkg && transactionCode && (
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
              {paymentError ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: '#DC2626',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Thanh toán thất bại: {paymentError}</span>
                </div>
              ) : (
                <>
                  <div className="loading-spinner"></div>
                  <span>
                    {paymentLoading
                      ? "Đang xử lý thanh toán..."
                      : transactionCheckLoading
                        ? "Đang kiểm tra giao dịch..."
                        : isCheckingTransaction
                          ? "Đang chờ thanh toán..."
                          : "Quét mã QR để thanh toán..."
                    }
                  </span>
                </>
              )}
            </div>

            {/* THÊM NÚT MANUAL CONFIRMATION */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: paymentError ? '#FEE2E2' : '#FEF3C7',
              borderRadius: '12px',
              border: `1px solid ${paymentError ? '#DC2626' : '#F59E0B'}`
            }}>
              <p style={{
                margin: '0 0 1rem 0',
                fontSize: '0.9rem',
                color: paymentError ? '#7F1D1D' : '#92400E',
                textAlign: 'center'
              }}>
                <i className={`fas ${paymentError ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                {' '}{paymentError
                  ? 'Thanh toán gặp vấn đề? Bạn có thể thử lại hoặc xác nhận thủ công.'
                  : 'Đã thanh toán nhưng chưa được xác nhận?'
                }
              </p>
              <button
                onClick={handleManualConfirmation}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.8rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#D97706';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#F59E0B';
                }}
              >
                <i className="fas fa-check-circle me-2"></i>
                Xác nhận đã thanh toán
              </button>

              <button
                onClick={handleCancelPayment}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#DC2626';
                }}
              >
                <i className="fas fa-times me-2"></i>
                Thoát thanh toán
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Popup xác nhận gói Free */}
      {
        showFreeConfirm && freePkg && (
          <div className="qr-overlay">
            <div className="qr-modal">
              <h3 className="qr-title">
                <i className="fas fa-gift me-2"></i>
                Xác nhận đăng ký gói Free
              </h3>
              <div style={{ margin: "1rem 0", fontSize: "1.1rem" }}>
                Bạn có chắc chắn muốn sử dụng <b>gói {freePkg.category}</b> miễn phí không?
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '0.8rem'
                }}
                onClick={handleConfirmFree}
              >
                <i className="fas fa-check-circle me-2"></i>
                Xác nhận sử dụng gói Free
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={() => { setShowFreeConfirm(false); setFreePkg(null); }}
              >
                <i className="fas fa-times me-2"></i>
                Hủy
              </button>
            </div>
          </div>
        )
      }

      <Footer />
    </>
  )
}