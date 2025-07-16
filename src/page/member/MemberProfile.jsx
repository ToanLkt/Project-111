"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import HistoryPayment from "./HistoryPayment"
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
  danger: "#EF4444",
}

export default function MemberProfile() {
  // Sử dụng Redux thay vì AuthContext
  const { user: reduxUser, token, loading: authLoading } = useSelector((state) => state.account || {})

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  const [saving, setSaving] = useState(false)

  // THÊM STATE CHO MEMBER FORM
  const [memberForm, setMemberForm] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  // Debug logs
  console.log("MemberProfile Debug:", {
    reduxUser,
    token: !!token,
    authLoading,
    loading
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!token) {
          console.log("No token found")
          throw new Error("Không tìm thấy token")
        }

        console.log("Fetching profile with token:", token.substring(0, 20) + "...")

        const url = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile"
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("Profile API response status:", res.status)

        if (!res.ok) {
          const errorText = await res.text()
          console.error("Profile API error:", errorText)
          throw new Error(res.status === 403 ? "Forbidden" : "Unauthorized")
        }

        const profile = await res.json()
        console.log("Profile data received:", profile)

        const userData = {
          email: profile.email || "",
          fullName: profile.fullName || "",
          phoneNumber: profile.phoneNumber || "",
          birthday: profile.birthday || "",
          sex: profile.sex === true ? "Nam" : profile.sex === false ? "Nữ" : "",
          status: profile.status === true ? "Hoạt động" : profile.status === false ? "Khóa" : "",
        }

        setUser(userData)
        setFormData(userData)
      } catch (e) {
        console.error("Profile fetch error:", e)
        setUser(null)
        alert(e.message)
      } finally {
        setLoading(false)
      }
    }

    // Chỉ fetch khi có token và không đang loading auth
    if (token && !authLoading) {
      fetchProfile()
    } else if (!authLoading && !token) {
      // Nếu không đang loading auth nhưng không có token
      setLoading(false)
      setUser(null)
    }
  }, [token, authLoading])

  // THÊM USEEFFECT ĐỂ FETCH MEMBER FORM
  useEffect(() => {
    async function fetchMemberForm() {
      if (!token) return

      try {
        setFormLoading(true)
        setFormError(null)

        console.log("Fetching member form...")

        const response = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/myForm",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        console.log("Member form API response status:", response.status)

        if (response.ok) {
          const formData = await response.json()
          console.log("Member form data received:", formData)
          setMemberForm(formData)
        } else if (response.status === 404) {
          console.log("Member form not found (404)")
          setMemberForm(null)
          setFormError("Bạn chưa điền form đăng ký")
        } else {
          const errorText = await response.text()
          console.error("Member form API error:", errorText)
          setFormError("Không thể tải thông tin form")
        }
      } catch (error) {
        console.error("Error fetching member form:", error)
        setFormError("Lỗi kết nối khi tải form")
      } finally {
        setFormLoading(false)
      }
    }

    if (token && !authLoading) {
      fetchMemberForm()
    }
  }, [token, authLoading])

  // Helper function để format tiền
  const formatMoney = (amount) => {
    if (!amount) return "0 ₫"
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = () => setIsEditing(true)

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const sexBool = formData.sex === "Nam" ? true : formData.sex === "Nữ" ? false : null
      const body = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        birthday: formData.birthday ? formData.birthday.slice(0, 10) : "",
        sex: sexBool,
      }

      const res = await fetch(
        "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      )

      if (!res.ok) throw new Error("Cập nhật thất bại")

      setUser({ ...user, ...formData, sex: formData.sex })
      setIsEditing(false)
      alert("Cập nhật thành công!")
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  // COMPONENT HIỂN THỊ MEMBER FORM
  const MemberFormSection = () => {
    if (formLoading) {
      return (
        <div className="profile-card" style={{ marginTop: '2rem' }}>
          <div className="profile-header">
            <div className="profile-icon">📋</div>
            <h3 className="profile-title" style={{ fontSize: '1.8rem' }}>
              Form đăng ký cai nghiện
            </h3>
            <p className="profile-subtitle">Thông tin form bạn đã đăng ký</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem', color: COLORS.textLight }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Đang tải thông tin form...</p>
          </div>
        </div>
      )
    }

    if (formError) {
      return (
        <div className="profile-card" style={{ marginTop: '2rem' }}>
          <div className="profile-header">
            <div className="profile-icon">📋</div>
            <h3 className="profile-title" style={{ fontSize: '1.8rem' }}>
              Form đăng ký cai nghiện
            </h3>
            <p className="profile-subtitle">Thông tin form bạn đã đăng ký</p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#FEF2F2',
            borderRadius: '12px',
            border: '1px solid #FECACA'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h4 style={{ color: COLORS.danger, marginBottom: '0.5rem' }}>
              {formError}
            </h4>
            <p style={{ color: COLORS.textLight, margin: 0 }}>
              Vui lòng liên hệ bộ phận hỗ trợ nếu bạn đã điền form
            </p>
          </div>
        </div>
      )
    }

    if (!memberForm) {
      return (
        <div className="profile-card" style={{ marginTop: '2rem' }}>
          <div className="profile-header">
            <div className="profile-icon">📋</div>
            <h3 className="profile-title" style={{ fontSize: '1.8rem' }}>
              Form đăng ký cai nghiện
            </h3>
            <p className="profile-subtitle">Thông tin form bạn đã đăng ký</p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#FFFBEB',
            borderRadius: '12px',
            border: '1px solid #FDE68A'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h4 style={{ color: COLORS.warning, marginBottom: '0.5rem' }}>
              Chưa có form đăng ký
            </h4>
            <p style={{ color: COLORS.textLight, margin: 0 }}>
              Bạn chưa điền form đăng ký cai nghiện
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="profile-card" style={{ marginTop: '2rem' }}>
        <div className="profile-header">
          <div className="profile-icon">📋</div>
          <h3 className="profile-title" style={{ fontSize: '1.8rem' }}>
            Form đăng ký cai nghiện
          </h3>
          <p className="profile-subtitle">Thông tin form bạn đã đăng ký</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Statistics Cards */}
          <div style={{
            background: 'linear-gradient(135deg, #FEF3E2 0%, #FDE68A 100%)',
            padding: '1.5rem',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #F59E0B'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#D97706',
              marginBottom: '0.5rem'
            }}>
              {memberForm.cigarettesPerDay || 0}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#92400E',
              fontWeight: '600'
            }}>
              Điếu thuốc/ngày
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            padding: '1.5rem',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #10B981'
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#059669',
              marginBottom: '0.5rem'
            }}>
              {memberForm.goalTime || 0}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#047857',
              fontWeight: '600'
            }}>
              Ngày mục tiêu
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #DBEAFE 100%)',
            padding: '1.5rem',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #3B82F6'
          }}>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#1D4ED8',
              marginBottom: '0.5rem'
            }}>
              {formatMoney(memberForm.costPerCigarette)}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#1E40AF',
              fontWeight: '600'
            }}>
              Giá/điếu thuốc
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: '1rem',
          fontSize: '0.95rem'
        }}>
          {memberForm.smokingTime && (
            <>
              <div style={{ fontWeight: '600', color: COLORS.color3 }}>
                <i className="fas fa-clock me-2"></i>
                Thời gian hút thuốc:
              </div>
              <div style={{ color: COLORS.text }}>
                {memberForm.smokingTime}
              </div>
            </>
          )}

          {memberForm.reason && (
            <>
              <div style={{ fontWeight: '600', color: COLORS.color3 }}>
                <i className="fas fa-heart me-2"></i>
                Lý do cai thuốc:
              </div>
              <div style={{
                color: COLORS.text,
                fontStyle: 'italic',
                background: '#FFF9E6',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #FFE082'
              }}>
                "{memberForm.reason}"
              </div>
            </>
          )}

          {memberForm.medicalHistory && (
            <>
              <div style={{ fontWeight: '600', color: COLORS.color3 }}>
                <i className="fas fa-stethoscope me-2"></i>
                Tiền sử bệnh:
              </div>
              <div style={{
                color: COLORS.danger,
                fontWeight: '600',
                background: '#FFEBEE',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #FFCDD2'
              }}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {memberForm.medicalHistory}
              </div>
            </>
          )}

          {memberForm.mostSmokingTime && (
            <>
              <div style={{ fontWeight: '600', color: COLORS.color3 }}>
                <i className="fas fa-clock me-2"></i>
                Thời gian hút nhiều:
              </div>
              <div style={{ color: COLORS.text }}>
                {memberForm.mostSmokingTime}
              </div>
            </>
          )}
        </div>

        {/* Summary Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
          borderRadius: '12px',
          border: '1px solid #CBD5E1'
        }}>
          <h5 style={{
            color: COLORS.color3,
            marginBottom: '1rem',
            fontSize: '1.1rem',
            fontWeight: '700'
          }}>
            <i className="fas fa-chart-line me-2"></i>
            Tóm tắt thông tin
          </h5>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: COLORS.warning
              }}>
                {memberForm.cigarettesPerDay * 30 || 0}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: COLORS.textLight,
                fontWeight: '600'
              }}>
                Điếu/tháng hiện tại
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: COLORS.success
              }}>
                {formatMoney((memberForm.costPerCigarette || 0) * (memberForm.cigarettesPerDay || 0) * 30)}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: COLORS.textLight,
                fontWeight: '600'
              }}>
                Chi phí/tháng hiện tại
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: COLORS.color2
              }}>
                {formatMoney((memberForm.costPerCigarette || 0) * (memberForm.cigarettesPerDay || 0) * (memberForm.goalTime || 0))}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: COLORS.textLight,
                fontWeight: '600'
              }}>
                Tiết kiệm sau {memberForm.goalTime} ngày
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Hiển thị loading khi đang auth loading hoặc profile loading
  if (authLoading || loading) {
    return (
      <>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            background: ${COLORS.background};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid ${COLORS.color1};
            border-radius: 50%;
            border-top-color: ${COLORS.color2};
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .loading-text {
            margin-top: 1rem;
            color: ${COLORS.textLight};
            font-size: 1.1rem;
            font-weight: 500;
          }

          .debug-info {
            position: fixed;
            top: 100px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
          }
        `}</style>
        <div className="loading-container">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {authLoading ? "Đang xác thực..." : "Đang tải thông tin..."}
            </div>
          </div>
        </div>

        {/* Debug info trong development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <div><strong>MemberProfile Debug:</strong></div>
            <div>Auth Loading: {authLoading.toString()}</div>
            <div>Profile Loading: {loading.toString()}</div>
            <div>Has Token: {!!token ? 'Yes' : 'No'}</div>
            <div>Has Redux User: {!!reduxUser ? 'Yes' : 'No'}</div>
          </div>
        )}
      </>
    )
  }

  if (!token) {
    return (
      <div style={{
        textAlign: "center",
        marginTop: 40,
        color: COLORS.textLight,
        padding: "2rem"
      }}>
        <h3>Không tìm thấy thông tin xác thực</h3>
        <p>Vui lòng đăng nhập lại</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{
        textAlign: "center",
        marginTop: 40,
        color: COLORS.textLight,
        padding: "2rem"
      }}>
        <h3>Không thể tải thông tin người dùng</h3>
        <p>Vui lòng thử lại sau</p>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        /* ...existing styles remain the same... */
        .profile-container {
          min-height: 100vh;
          background: ${COLORS.background};
          font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          color: ${COLORS.text};
          padding: 3rem 0;
        }

        .profile-card {
          background: ${COLORS.white};
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          padding: 3rem;
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
          max-width: 600px;
          margin: 0 auto 3rem auto;
        }

        .profile-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .profile-icon {
          width: 80px;
          height: 80px;
          background: ${COLORS.gradientLight};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          border: 3px solid ${COLORS.color1};
          font-size: 2.5rem;
        }

        .profile-title {
          font-size: 2.2rem;
          font-weight: 800;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .profile-subtitle {
          color: ${COLORS.textLight};
          font-size: 1rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: ${COLORS.color3};
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid ${COLORS.color1};
          border-radius: 12px;
          background: ${COLORS.background};
          color: ${COLORS.text};
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: ${COLORS.color2};
          box-shadow: 0 0 0 3px rgba(106, 183, 197, 0.1);
          background: ${COLORS.white};
        }

        .form-input:disabled {
          background: ${COLORS.white};
          border-color: ${COLORS.color1};
          color: ${COLORS.text};
          cursor: default;
        }

        .form-select {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid ${COLORS.color1};
          border-radius: 12px;
          background: ${COLORS.background};
          color: ${COLORS.text};
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
          cursor: pointer;
        }

        .form-select:focus {
          border-color: ${COLORS.color2};
          box-shadow: 0 0 0 3px rgba(106, 183, 197, 0.1);
          background: ${COLORS.white};
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          background: ${COLORS.success};
          color: ${COLORS.white};
        }

        .status-badge.inactive {
          background: ${COLORS.danger};
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .btn-primary {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border: none;
          border-radius: 12px;
          padding: 0.8rem 2rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 16px rgba(106, 183, 197, 0.2);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(106, 183, 197, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-success {
          background: ${COLORS.success};
          color: ${COLORS.white};
          border: none;
          border-radius: 12px;
          padding: 0.8rem 2rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-success:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
        }

        .btn-danger {
          background: ${COLORS.danger};
          color: ${COLORS.white};
          border: none;
          border-radius: 12px;
          padding: 0.8rem 2rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-danger:hover {
          background: #DC2626;
          transform: translateY(-1px);
        }

        .loading-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-radius: 50%;
          border-top-color: currentColor;
          animation: spin 1s linear infinite;
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

        @media (max-width: 768px) {
          .profile-container {
            padding: 2rem 1rem;
          }

          .profile-card {
            padding: 2rem;
            border-radius: 20px;
            max-width: none;
            margin: 0 auto 2rem auto;
          }

          .profile-title {
            font-size: 1.8rem;
          }

          .button-group {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary,
          .btn-success,
          .btn-danger {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .profile-card {
            padding: 1.5rem;
          }

          .profile-title {
            font-size: 1.6rem;
          }

          .profile-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="profile-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              {/* PROFILE CARD - EXISTING */}
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-icon">👤</div>
                  <h2 className="profile-title">Thông tin cá nhân</h2>
                  <p className="profile-subtitle">Quản lý thông tin tài khoản của bạn</p>
                </div>

                <form>
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={isEditing ? formData.email : user.email}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={isEditing ? formData.fullName : user.fullName}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={isEditing ? formData.phoneNumber : user.phoneNumber}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-calendar me-2"></i>
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={
                        isEditing
                          ? formData.birthday
                            ? formData.birthday.slice(0, 10)
                            : ""
                          : user.birthday
                            ? user.birthday.slice(0, 10)
                            : ""
                      }
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-venus-mars me-2"></i>
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select name="sex" value={formData.sex} onChange={handleChange} className="form-select">
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    ) : (
                      <input type="text" value={user.sex || "Chưa cập nhật"} className="form-input" disabled readOnly />
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-info-circle me-2"></i>
                      Trạng thái tài khoản
                    </label>
                    <div>
                      <span className={`status-badge ${user.status === "Khóa" ? "inactive" : ""}`}>
                        <i className={`fas ${user.status === "Hoạt động" ? "fa-check-circle" : "fa-lock"}`}></i>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </form>

                <div className="button-group">
                  {!isEditing ? (
                    <button onClick={handleEdit} className="btn-primary">
                      <i className="fas fa-edit"></i>
                      Chỉnh sửa thông tin
                    </button>
                  ) : (
                    <>
                      <button onClick={handleSave} className="btn-success" disabled={saving}>
                        {saving ? (
                          <>
                            <div className="loading-btn-spinner"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                      <button onClick={handleCancel} className="btn-danger" disabled={saving}>
                        <i className="fas fa-times"></i>
                        Hủy bỏ
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* MEMBER FORM SECTION - NEW */}
              <MemberFormSection />
            </div>
          </div>
        </div>

        <HistoryPayment />
      </div>
    </>
  )
}
