import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PLATFORM_API = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform";

// Colors theme
const COLORS = {
    primary: "#006A71",
    secondary: "#48A6A7",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#f44336",
    info: "#2196F3",
    background: "#FAFAF9",
    color1: "#CFE8EF",
    color2: "#6AB7C5",
    color3: "#336B73",
    white: "#FFFFFF",
    text: "#2D3748",
    textLight: "#718096",
    gradient: "linear-gradient(135deg, #6AB7C5 0%, #336B73 100%)",
    gradientAdmin: "linear-gradient(135deg, #336B73 0%, #1A4B52 100%)",
    admin: "#1A4B52",
};

export default function AdminSettings() {
    // State cho platform data
    const [platformData, setPlatformData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // State cho form - chỉ các trường có trong API
    const [formData, setFormData] = useState({
        news1Title: "",
        news1Content: "",
        news1Link: "",
        news2Title: "",
        news2Content: "",
        news2Link: "",
        news3Title: "",
        news3Content: "",
        news3Link: "",
        message: "",
        about: "",
        benefit: ""
    });

    // Redux state
    const { user, token } = useSelector((state) => state.account || {});
    const navigate = useNavigate();

    // Extract user info từ Redux user object
    const getUserRole = () => {
        if (!user) return null;
        const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            user.role ||
            null;
        return role ? role.toString().trim() : null;
    };

    const userRole = getUserRole();
    const adminToken = token;

    // Check admin authorization
    useEffect(() => {
        if (!token) {
            console.log('❌ No token found, redirecting to login...');
            navigate("/login");
            return;
        }

        if (userRole && userRole !== "Admin") {
            console.log('❌ User is not admin, role:', userRole);
            setError("Bạn không có quyền truy cập trang này!");
            return;
        }
    }, [token, userRole, navigate]);

    // Fetch platform data
    useEffect(() => {
        const fetchPlatformData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!adminToken) {
                    throw new Error("Token không tồn tại");
                }

                const headers = {
                    "Authorization": `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                };

                console.log('🚀 Fetching platform data...');

                const response = await fetch(PLATFORM_API, {
                    method: 'GET',
                    headers
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Kiểm tra content type
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Response không phải JSON format");
                }

                const responseText = await response.text();
                console.log('📝 Raw response:', responseText);

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ JSON parse error:', parseError);
                    throw new Error("Dữ liệu trả về không đúng định dạng JSON");
                }

                console.log('✅ Platform data loaded:', data);
                setPlatformData(data);

                // Set form data từ API response với safe access
                setFormData({
                    news1Title: (data?.news1Title || "").toString(),
                    news1Content: (data?.news1Content || "").toString(),
                    news1Link: (data?.news1Link || "").toString(),
                    news2Title: (data?.news2Title || "").toString(),
                    news2Content: (data?.news2Content || "").toString(),
                    news2Link: (data?.news2Link || "").toString(),
                    news3Title: (data?.news3Title || "").toString(),
                    news3Content: (data?.news3Content || "").toString(),
                    news3Link: (data?.news3Link || "").toString(),
                    message: (data?.message || "").toString(),
                    about: (data?.about || "").toString(),
                    benefit: (data?.benefit || "").toString()
                });

            } catch (error) {
                console.error("❌ Error fetching platform data:", error);
                setError(`Lỗi khi tải dữ liệu: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (adminToken && userRole === "Admin") {
            fetchPlatformData();
        }
    }, [adminToken, userRole]);

    // Handle input change
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle form submit - cải thiện error handling
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setSuccessMessage("");

            const headers = {
                "Authorization": `Bearer ${adminToken}`,
                "Content-Type": "application/json"
            };

            // Validate form data trước khi gửi
            const cleanedFormData = {
                news1Title: formData.news1Title.trim(),
                news1Content: formData.news1Content.trim(),
                news1Link: formData.news1Link.trim(),
                news2Title: formData.news2Title.trim(),
                news2Content: formData.news2Content.trim(),
                news2Link: formData.news2Link.trim(),
                news3Title: formData.news3Title.trim(),
                news3Content: formData.news3Content.trim(),
                news3Link: formData.news3Link.trim(),
                message: formData.message.trim(),
                about: formData.about.trim(),
                benefit: formData.benefit.trim()
            };

            console.log('💾 Saving platform data:', cleanedFormData);

            const response = await fetch(PLATFORM_API, {
                method: 'PUT',
                headers,
                body: JSON.stringify(cleanedFormData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText || 'Server error'}`);
            }

            // Kiểm tra response format
            const contentType = response.headers.get("content-type");
            let updatedData;

            if (contentType && contentType.includes("application/json")) {
                const responseText = await response.text();
                try {
                    updatedData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('❌ Response parse error:', parseError);
                    // Nếu không parse được response, dùng data đã gửi
                    updatedData = cleanedFormData;
                }
            } else {
                // Nếu response không phải JSON, dùng data đã gửi
                updatedData = cleanedFormData;
            }

            console.log('✅ Platform data saved:', updatedData);

            setPlatformData(updatedData);
            setSuccessMessage("Cập nhật thông tin platform thành công!");

            // Clear success message sau 3 giây
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (error) {
            console.error("❌ Error saving platform data:", error);
            setError(`Lỗi khi lưu dữ liệu: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    // Reset form - cải thiện safe access
    const handleReset = () => {
        if (platformData) {
            setFormData({
                news1Title: (platformData?.news1Title || "").toString(),
                news1Content: (platformData?.news1Content || "").toString(),
                news1Link: (platformData?.news1Link || "").toString(),
                news2Title: (platformData?.news2Title || "").toString(),
                news2Content: (platformData?.news2Content || "").toString(),
                news2Link: (platformData?.news2Link || "").toString(),
                news3Title: (platformData?.news3Title || "").toString(),
                news3Content: (platformData?.news3Content || "").toString(),
                news3Link: (platformData?.news3Link || "").toString(),
                message: (platformData?.message || "").toString(),
                about: (platformData?.about || "").toString(),
                benefit: (platformData?.benefit || "").toString()
            });
            setError(null);
            setSuccessMessage("");
        }
    };

    // Error state
    if (error && userRole !== "Admin") {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                fontSize: "1.2rem",
                color: COLORS.error,
                textAlign: "center",
                padding: "2rem"
            }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❌</div>
                <div style={{ fontWeight: 600, marginBottom: "1rem" }}>{error}</div>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "12px 24px",
                        background: COLORS.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600
                    }}
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                fontSize: "1.2rem",
                color: COLORS.primary
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
                    <div>Đang tải dữ liệu platform...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: 1000,
            margin: "40px auto",
            padding: "0 20px"
        }}>
            <style jsx>{`
        .form-section {
          background: ${COLORS.white};
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,106,113,0.1);
          border: 1px solid ${COLORS.color1};
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: ${COLORS.admin};
          font-size: 1rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid ${COLORS.color1};
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: ${COLORS.white};
        }

        .form-input:focus {
          outline: none;
          border-color: ${COLORS.admin};
          box-shadow: 0 0 0 3px rgba(26, 75, 82, 0.1);
        }

        .form-textarea {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid ${COLORS.color1};
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: ${COLORS.white};
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
        }

        .form-textarea:focus {
          outline: none;
          border-color: ${COLORS.admin};
          box-shadow: 0 0 0 3px rgba(26, 75, 82, 0.1);
        }

        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .btn-primary {
          background: ${COLORS.gradientAdmin};
          color: ${COLORS.white};
          box-shadow: 0 8px 24px rgba(26, 75, 82, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(26, 75, 82, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: ${COLORS.color1};
          color: ${COLORS.admin};
          border: 2px solid ${COLORS.color2};
        }

        .btn-secondary:hover {
          background: ${COLORS.color2};
          color: ${COLORS.white};
          transform: translateY(-2px);
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .news-card {
          background: linear-gradient(135deg, ${COLORS.color1} 0%, ${COLORS.white} 100%);
          padding: 1.5rem;
          border-radius: 16px;
          border: 2px solid ${COLORS.color2};
        }

        .alert {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid ${COLORS.success};
          color: ${COLORS.success};
        }

        .alert-error {
          background: rgba(244, 67, 54, 0.1);
          border: 2px solid ${COLORS.error};
          color: ${COLORS.error};
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${COLORS.admin} 0%, ${COLORS.color3} 100%)`,
                color: "white",
                padding: "2.5rem",
                borderRadius: "24px 24px 0 0",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,106,113,0.2)"
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    margin: 0,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}>
                    ⚙️ Cài Đặt Quản Trị
                </h1>
                <p style={{
                    fontSize: "1.2rem",
                    margin: "15px 0 0 0",
                    opacity: 0.9
                }}>
                    Quản lý nội dung trang chủ hệ thống
                </p>
            </div>

            {/* Main Content */}
            <div style={{
                background: COLORS.background,
                padding: "2.5rem",
                borderRadius: "0 0 24px 24px",
                boxShadow: "0 8px 32px rgba(0,106,113,0.1)"
            }}>

                {/* Success Message */}
                {successMessage && (
                    <div className="alert alert-success">
                        <i className="fas fa-check-circle" style={{ marginRight: "0.5rem" }}></i>
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        <i className="fas fa-exclamation-circle" style={{ marginRight: "0.5rem" }}></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* News Section */}
                    <div className="form-section">
                        <h2 style={{
                            color: COLORS.admin,
                            marginBottom: "2rem",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span>📰</span> Quản Lý Tin Tức
                        </h2>

                        <div className="news-grid">
                            {/* News 1 */}
                            <div className="news-card">
                                <h3 style={{ color: COLORS.admin, marginBottom: "1rem", fontSize: "1.2rem" }}>
                                    📄 Tin Tức 1
                                </h3>
                                <div className="form-group">
                                    <label className="form-label">Tiêu đề</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.news1Title}
                                        onChange={(e) => handleInputChange('news1Title', e.target.value)}
                                        placeholder="Nhập tiêu đề tin tức 1..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nội dung</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.news1Content}
                                        onChange={(e) => handleInputChange('news1Content', e.target.value)}
                                        placeholder="Nhập nội dung tin tức 1..."
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.news1Link}
                                        onChange={(e) => handleInputChange('news1Link', e.target.value)}
                                        placeholder="https://example.com/news1"
                                    />
                                </div>
                            </div>

                            {/* News 2 */}
                            <div className="news-card">
                                <h3 style={{ color: COLORS.admin, marginBottom: "1rem", fontSize: "1.2rem" }}>
                                    📄 Tin Tức 2
                                </h3>
                                <div className="form-group">
                                    <label className="form-label">Tiêu đề</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.news2Title}
                                        onChange={(e) => handleInputChange('news2Title', e.target.value)}
                                        placeholder="Nhập tiêu đề tin tức 2..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nội dung</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.news2Content}
                                        onChange={(e) => handleInputChange('news2Content', e.target.value)}
                                        placeholder="Nhập nội dung tin tức 2..."
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.news2Link}
                                        onChange={(e) => handleInputChange('news2Link', e.target.value)}
                                        placeholder="https://example.com/news2"
                                    />
                                </div>
                            </div>

                            {/* News 3 */}
                            <div className="news-card">
                                <h3 style={{ color: COLORS.admin, marginBottom: "1rem", fontSize: "1.2rem" }}>
                                    📄 Tin Tức 3
                                </h3>
                                <div className="form-group">
                                    <label className="form-label">Tiêu đề</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.news3Title}
                                        onChange={(e) => handleInputChange('news3Title', e.target.value)}
                                        placeholder="Nhập tiêu đề tin tức 3..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nội dung</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.news3Content}
                                        onChange={(e) => handleInputChange('news3Content', e.target.value)}
                                        placeholder="Nhập nội dung tin tức 3..."
                                        rows="4"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.news3Link}
                                        onChange={(e) => handleInputChange('news3Link', e.target.value)}
                                        placeholder="https://example.com/news3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Content */}
                    <div className="form-section">
                        <h2 style={{
                            color: COLORS.admin,
                            marginBottom: "1.5rem",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span>📝</span> Nội Dung Trang Chủ
                        </h2>

                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-envelope" style={{ marginRight: "0.5rem", color: COLORS.color2 }}></i>
                                Thông Điệp Chính
                            </label>
                            <textarea
                                className="form-textarea"
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder="Nhập thông điệp chính của platform..."
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-info-circle" style={{ marginRight: "0.5rem", color: COLORS.color2 }}></i>
                                Giới Thiệu
                            </label>
                            <textarea
                                className="form-textarea"
                                value={formData.about}
                                onChange={(e) => handleInputChange('about', e.target.value)}
                                placeholder="Nhập phần giới thiệu về platform..."
                                rows="6"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <i className="fas fa-star" style={{ marginRight: "0.5rem", color: COLORS.color2 }}></i>
                                Lợi Ích
                            </label>
                            <textarea
                                className="form-textarea"
                                value={formData.benefit}
                                onChange={(e) => handleInputChange('benefit', e.target.value)}
                                placeholder="Nhập các lợi ích của platform..."
                                rows="6"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginTop: "2rem"
                    }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Lưu Thay Đổi
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={saving}
                        >
                            <i className="fas fa-undo"></i>
                            Khôi Phục
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/admin")}
                            disabled={saving}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Quay Lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
