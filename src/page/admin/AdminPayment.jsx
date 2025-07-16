import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHistory } from "../../redux/admin/historyPayment/historyPaymentSlice";

const COLORS = {
  background: "#F2EFE7",
  card: "#fff",
  tableBg: "#E6F4F4",
  tableRow: "#fff",
  tableRowAlt: "#E6F4F4",
  thBg: "#9ACBD0",
  thText: "#006A71",
  tdText: "#006A71",
  border: "#9ACBD0",
  accent: "#006A71",
  primary: "#48A6A7",
  gold: "#bfa917",
  goldBg: "#fffbe8",
  goldBorder: "#f3d46e",
  btn: "#48A6A7",
  btnHover: "#006A71",
  danger: "#e74c3c",
  dangerHover: "#c0392b",
  success: "#27ae60",
  warning: "#e67e22",
};

export default function AdminPayment() {
  // Redux state thay vì useAuth
  const { user, token } = useSelector((state) => state.account || {});
  const dispatch = useDispatch();

  // Extract user role từ Redux user object
  const getUserRole = () => {
    if (!user) return null;
    const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null;
    return role ? role.toString().trim() : null;
  };

  const userRole = getUserRole();
  const isAdmin = userRole === "Admin";

  const [packages, setPackages] = useState([]);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  // States cho filter
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    packageCategory: "",
    showFilters: false
  });

  const [form, setForm] = useState({
    packageMembershipId: "",
    category: "",
    price: "",
    description: "",
    duration: "",
  });

  // Get unique package categories cho filter dropdown
  const getUniquePackageCategories = () => {
    const categories = [...new Set(history.map(item => item.packageCategory).filter(Boolean))];
    return categories.sort();
  };

  // Filter history based on date and package
  const applyFilters = () => {
    let filtered = [...history];

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(item => {
        if (!item.timeBuy) return false;
        const buyDate = new Date(item.timeBuy);
        const startDate = new Date(filters.startDate);
        return buyDate >= startDate;
      });
    }

    if (filters.endDate) {
      filtered = filtered.filter(item => {
        if (!item.timeBuy) return false;
        const buyDate = new Date(item.timeBuy);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Include full end date
        return buyDate <= endDate;
      });
    }

    // Filter by package category
    if (filters.packageCategory) {
      filtered = filtered.filter(item =>
        item.packageCategory && item.packageCategory.toLowerCase().includes(filters.packageCategory.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  };

  // Apply filters whenever filters or history change
  useEffect(() => {
    applyFilters();
  }, [filters, history]);

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      packageCategory: "",
      showFilters: filters.showFilters
    });
  };

  // Set quick date filters
  const setQuickDateFilter = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const fetchDataHistoryPayment = () => {
    dispatch(fetchHistory());
  };

  useEffect(() => {
    fetchDataHistoryPayment();
  }, [dispatch]);

  // Lấy danh sách gói từ API (GET all)
  useEffect(() => {
    if (!token || !isAdmin) {
      console.log("❌ No token or not admin:", { token: !!token, isAdmin });
      setLoading(false);
      return;
    }

    async function fetchPackages() {
      try {
        setLoading(true);
        console.log("🚀 Fetching packages for admin...");

        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("📡 Packages API response status:", res.status);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("✅ Packages data received:", data);
        setPackages(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        console.error("❌ Error fetching packages:", err);
        setPackages([]);
        setError("Không thể tải danh sách gói thành viên: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [token, isAdmin]);

  // Lấy lịch sử giao dịch
  useEffect(() => {
    if (!token || !isAdmin) {
      setHistoryLoading(false);
      return;
    }

    async function fetchPaymentHistory() {
      try {
        setHistoryLoading(true);
        console.log("🚀 Fetching payment history...");

        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/purchase-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("📡 History API response status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("✅ History data received:", data);
          const historyData = Array.isArray(data) ? data : [];
          setHistory(historyData);
          setFilteredHistory(historyData); // Initialize filtered history
        } else {
          console.warn("⚠️ History API failed, using empty array");
          setHistory([]);
          setFilteredHistory([]);
        }
      } catch (err) {
        console.error("❌ Error fetching history:", err);
        setHistory([]);
        setFilteredHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    }

    fetchPaymentHistory();
  }, [token, isAdmin]);

  // Sửa gói
  const handleEditPackage = (pkg) => {
    console.log("✏️ Editing package:", pkg);
    setEditPkg(pkg);
    setForm({
      packageMembershipId: pkg.package_membership_ID,
      category: pkg.category || "",
      price: pkg.price || "",
      description: pkg.description || "",
      duration: pkg.duration || "",
    });
    setShowEdit(true);
  };

  // Xử lý form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu chỉnh sửa gói
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editPkg || !isAdmin) return;

    try {
      console.log("💾 Saving package edit:", form);

      // Kiểm tra dữ liệu trước khi gửi
      const updateData = {
        package_membership_ID: Number(form.packageMembershipId),
        category: form.category.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        duration: Number(form.duration),
        status: "Active"
      };

      console.log("🚀 Update data:", updateData);

      const res = await fetch(
        `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership/${form.packageMembershipId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("📡 Update response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`Cập nhật gói thất bại: ${res.status} - ${errorText}`);
      }

      // Kiểm tra content type
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const updated = await res.json();
        console.log("✅ Package updated successfully:", updated);
        setPackages((prev) =>
          prev.map((p) =>
            p.package_membership_ID === Number(form.packageMembershipId) ? { ...p, ...updateData } : p
          )
        );
      } else {
        console.log("✅ Package updated (no JSON response)");
        setPackages((prev) =>
          prev.map((p) =>
            p.package_membership_ID === Number(form.packageMembershipId) ? { ...p, ...updateData } : p
          )
        );
      }

      // Reset form và đóng modal
      setShowEdit(false);
      setEditPkg(null);
      setForm({
        packageMembershipId: "",
        category: "",
        price: "",
        description: "",
        duration: "",
      });

      alert("✅ Cập nhật gói thành công!");
      window.location.reload();

    } catch (err) {
      console.error("❌ Update error:", err);
      alert("❌ Lỗi cập nhật: " + err.message);
    }
  };

  // Kiểm tra quyền Admin
  if (!token) {
    return (
      <div style={{
        maxWidth: 900,
        margin: "40px auto",
        background: COLORS.card,
        borderRadius: 18,
        padding: 40,
        textAlign: "center",
        color: COLORS.danger
      }}>
        <h3>⚠️ Cần đăng nhập để truy cập trang này</h3>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{
        maxWidth: 900,
        margin: "40px auto",
        background: COLORS.card,
        borderRadius: 18,
        padding: 40,
        textAlign: "center",
        color: COLORS.danger
      }}>
        <h3>🚫 Chỉ Admin mới có thể truy cập trang này</h3>
        <p>Role hiện tại: {userRole || "Unknown"}</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid ${COLORS.border};
          border-radius: 50%;
          border-top-color: ${COLORS.primary};
          animation: spin 1s ease-in-out infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(72, 166, 167, 0.3);
        }
        
        .input-focus:focus {
          outline: none;
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px rgba(72, 166, 167, 0.1);
        }

        .filter-panel {
          background: ${COLORS.tableBg};
          border: 2px solid ${COLORS.primary};
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          animation: fadeIn 0.3s ease;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          align-items: end;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .quick-filter-btn {
          padding: 6px 12px;
          border: 2px solid ${COLORS.primary};
          background: ${COLORS.card};
          color: ${COLORS.primary};
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .quick-filter-btn:hover {
          background: ${COLORS.primary};
          color: ${COLORS.card};
        }

        @media (max-width: 768px) {
          .filter-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-buttons {
            justify-content: center;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto",
          background: COLORS.card,
          borderRadius: 18,
          padding: 40,
          boxShadow: "0 6px 32px #9ACBD022",
          minHeight: 500,
        }}
      >
        <h2
          style={{
            color: COLORS.accent,
            marginBottom: 32,
            fontWeight: 800,
            fontSize: "2rem",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          💳 Quản lý gói thành viên
        </h2>

        {error && (
          <div style={{
            background: COLORS.danger + "20",
            color: COLORS.danger,
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: `1px solid ${COLORS.danger}`,
            textAlign: "center",
            fontWeight: "600"
          }}>
            ❌ {error}
          </div>
        )}

        {/* Package Management Section */}
        <div style={{
          marginBottom: 32,
          background: COLORS.card,
          borderRadius: 14,
          boxShadow: "0 2px 12px #9ACBD011",
          padding: 28,
        }}>
          {/* Edit Package Form - existing code... */}
          {showEdit && (
            <form
              onSubmit={handleSaveEdit}
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-end",
                flexWrap: "wrap",
                marginBottom: 24,
                marginTop: 24,
                padding: "24px",
                background: COLORS.tableBg,
                borderRadius: "12px",
                border: `2px solid ${COLORS.primary}`
              }}
            >
              <h4 style={{
                color: COLORS.accent,
                width: "100%",
                marginBottom: "16px",
                fontSize: "1.2rem",
                fontWeight: "700"
              }}>
                ✏️ Chỉnh sửa gói: {editPkg?.category}
              </h4>

              <div style={{ minWidth: 120 }}>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  Tên gói
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                  className="input-focus"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 15,
                    width: "100%",
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                />
              </div>

              <div style={{ minWidth: 100 }}>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  Giá (VND)
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                  className="input-focus"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 15,
                    width: "100%",
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                />
              </div>

              <div style={{ minWidth: 100 }}>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  Thời hạn (ngày)
                </label>
                <input
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleFormChange}
                  required
                  className="input-focus"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 15,
                    width: "100%",
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="input-focus"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 15,
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    resize: "vertical",
                    transition: "all 0.3s ease"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                <button
                  type="submit"
                  className="button-hover"
                  style={{
                    background: COLORS.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 28px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    minWidth: 90,
                    boxShadow: "0 2px 8px rgba(72, 166, 167, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                >
                  💾 Lưu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEdit(false);
                    setEditPkg(null);
                    setForm({
                      packageMembershipId: "",
                      category: "",
                      price: "",
                      description: "",
                      duration: "",
                    });
                  }}
                  style={{
                    background: "#bbb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 18px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    minWidth: 70,
                    transition: "all 0.3s ease"
                  }}
                >
                  ❌ Hủy
                </button>
              </div>
            </form>
          )}

          {/* Package Table - existing code... */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                background: COLORS.tableBg,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 12px #9ACBD011",
              }}
            >
              <thead>
                <tr style={{ background: COLORS.thBg }}>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>STT</th>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Tên gói</th>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Giá</th>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Thời hạn</th>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Mô tả</th>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Trạng thái</th>
                  <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{
                      textAlign: "center",
                      color: COLORS.primary,
                      padding: "30px",
                      fontSize: "1.1rem"
                    }}>
                      <div className="loading-spinner"></div>
                      Đang tải danh sách gói...
                    </td>
                  </tr>
                ) : packages.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{
                      textAlign: "center",
                      padding: 30,
                      color: "#888",
                      fontSize: "1.1rem"
                    }}>
                      📭 Không có gói nào.
                    </td>
                  </tr>
                ) : packages.map((pkg, idx) => (
                  <tr
                    key={pkg.package_membership_ID || idx}
                    style={{
                      background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt,
                      transition: "background 0.3s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.primary + "20"}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt}
                  >
                    <td style={{ padding: 12, color: COLORS.tdText, fontWeight: "600" }}>{idx + 1}</td>
                    <td style={{ padding: 12, color: COLORS.tdText, fontWeight: "700" }}>{pkg.category}</td>
                    <td style={{ padding: 12, color: COLORS.tdText, fontWeight: "600" }}>
                      {pkg.price === 0 ? "Miễn phí" : pkg.price?.toLocaleString("vi-VN") + "đ"}
                    </td>
                    <td style={{ padding: 12, color: COLORS.tdText }}>{pkg.duration} ngày</td>
                    <td style={{ padding: 12, color: COLORS.tdText, maxWidth: "200px" }}>{pkg.description}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: "700",
                        background: pkg.status === "Active" ? COLORS.success + "20" : COLORS.danger + "20",
                        color: pkg.status === "Active" ? COLORS.success : COLORS.danger
                      }}>
                        {pkg.status === "Active" ? "✅ Hoạt động" : "🔒 Tạm khóa"}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="button-hover"
                        style={{
                          background: COLORS.gold,
                          color: "#fff",
                          border: "none",
                          borderRadius: 7,
                          padding: "8px 18px",
                          fontWeight: 600,
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(191, 169, 23, 0.3)",
                          transition: "all 0.3s ease"
                        }}
                      >
                        ✏️ Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History Section with Filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2
            style={{
              color: COLORS.accent,
              margin: 0,
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: 0.5,
            }}
          >
            📊 Lịch sử giao dịch thành viên ({filteredHistory.length})
          </h2>

          <button
            onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
            className="button-hover"
            style={{
              background: filters.showFilters ? COLORS.danger : COLORS.primary,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              boxShadow: "0 2px 8px rgba(72, 166, 167, 0.3)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {filters.showFilters ? "❌ Ẩn bộ lọc" : "🔍 Hiện bộ lọc"}
          </button>
        </div>

        {/* Filter Panel */}
        {filters.showFilters && (
          <div className="filter-panel">
            <h4 style={{
              color: COLORS.accent,
              marginBottom: "16px",
              fontSize: "1.1rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              🔍 Bộ lọc lịch sử giao dịch
            </h4>

            <div className="filter-grid">
              <div>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  📅 Từ ngày
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="input-focus"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 14,
                    width: "100%",
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  📅 Đến ngày
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="input-focus"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 14,
                    width: "100%",
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontWeight: 700,
                  color: COLORS.accent,
                  display: "block",
                  marginBottom: "6px"
                }}>
                  📦 Gói thành viên
                </label>
                <select
                  value={filters.packageCategory}
                  onChange={(e) => handleFilterChange('packageCategory', e.target.value)}
                  className="input-focus"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `2px solid ${COLORS.primary}`,
                    fontSize: 14,
                    width: "100%",
                    background: COLORS.card,
                    color: COLORS.accent,
                    fontWeight: 600,
                    transition: "all 0.3s ease"
                  }}
                >
                  <option value="">-- Tất cả gói --</option>
                  {getUniquePackageCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "end" }}>
                <button
                  onClick={resetFilters}
                  style={{
                    background: COLORS.warning,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "all 0.3s ease"
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="filter-buttons">
              <span style={{
                color: COLORS.accent,
                fontWeight: 700,
                fontSize: 14,
                marginRight: "8px",
                alignSelf: "center"
              }}>
                ⚡ Nhanh:
              </span>
              <button className="quick-filter-btn" onClick={() => setQuickDateFilter(7)}>
                7 ngày
              </button>
              <button className="quick-filter-btn" onClick={() => setQuickDateFilter(30)}>
                30 ngày
              </button>
              <button className="quick-filter-btn" onClick={() => setQuickDateFilter(90)}>
                3 tháng
              </button>
              <button className="quick-filter-btn" onClick={() => setQuickDateFilter(365)}>
                1 năm
              </button>
            </div>

            {/* Filter Summary */}
            {(filters.startDate || filters.endDate || filters.packageCategory) && (
              <div style={{
                marginTop: "16px",
                padding: "12px",
                background: COLORS.primary + "10",
                borderRadius: "8px",
                border: `1px solid ${COLORS.primary}`,
                fontSize: "14px",
                color: COLORS.accent,
                fontWeight: 600
              }}>
                <span style={{ fontWeight: 700 }}>📊 Đang lọc:</span>
                {filters.startDate && <span> Từ {new Date(filters.startDate).toLocaleDateString("vi-VN")}</span>}
                {filters.endDate && <span> đến {new Date(filters.endDate).toLocaleDateString("vi-VN")}</span>}
                {filters.packageCategory && <span> • Gói: {filters.packageCategory}</span>}
                <span style={{ marginLeft: "8px", color: COLORS.primary }}>
                  (Tìm thấy {filteredHistory.length} giao dịch)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Payment History Table */}
        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: COLORS.tableBg,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px #9ACBD011",
            }}
          >
            <thead>
              <tr style={{ background: COLORS.thBg }}>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>STT</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Tên thành viên</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Gói</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Mã giao dịch</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Số tiền</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Ngày mua</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Ngày bắt đầu</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Ngày kết thúc</th>
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan={9} style={{
                    textAlign: "center",
                    color: COLORS.primary,
                    padding: "30px",
                    fontSize: "1.1rem"
                  }}>
                    <div className="loading-spinner"></div>
                    Đang tải lịch sử giao dịch...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{
                    textAlign: "center",
                    padding: 30,
                    color: "#888",
                    fontSize: "1.1rem"
                  }}>
                    {history.length === 0 ?
                      "📭 Không có giao dịch nào." :
                      "🔍 Không tìm thấy giao dịch phù hợp với bộ lọc."
                    }
                  </td>
                </tr>
              ) : filteredHistory.map((item, idx) => (
                <tr
                  key={item.purchaseID || idx}
                  style={{
                    background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt,
                    transition: "background 0.3s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.primary + "20"}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt}
                >
                  <td style={{ padding: 12, color: COLORS.tdText }}>{idx + 1}</td>
                  <td style={{ padding: 12, color: COLORS.tdText, fontWeight: "600" }}>{item.memberName}</td>
                  <td style={{ padding: 12, color: COLORS.tdText, fontWeight: "700" }}>{item.packageCategory}</td>
                  <td style={{ padding: 12, color: COLORS.tdText, fontFamily: "monospace" }}>{item.transactionCode}</td>
                  <td style={{ padding: 12, color: COLORS.tdText, fontWeight: "600" }}>
                    {item.totalPrice?.toLocaleString("vi-VN")}đ
                  </td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>
                    {item.timeBuy ? new Date(item.timeBuy).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>
                    {item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>
                    {item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "700",
                      background: item.paymentStatus === "Success" ? COLORS.success + "20" : COLORS.warning + "20",
                      color: item.paymentStatus === "Success" ? COLORS.success : COLORS.warning
                    }}>
                      {item.paymentStatus === "Success" ? "✅ Thành công" : "⏳ " + item.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Debug Panel - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: 15,
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "monospace",
            zIndex: 9998,
            maxWidth: 300
          }}>
            <div><strong>🔍 AdminPayment Debug:</strong></div>
            <div>Token: {token ? "✅" : "❌"}</div>
            <div>User: {user ? "✅" : "❌"}</div>
            <div>Role: {userRole || "null"}</div>
            <div>Is Admin: {isAdmin ? "✅" : "❌"}</div>
            <div>Packages: {packages.length}</div>
            <div>History Total: {history.length}</div>
            <div>History Filtered: {filteredHistory.length}</div>
            <div>Loading: {loading ? "⏳" : "✅"}</div>
            <div>History Loading: {historyLoading ? "⏳" : "✅"}</div>
            <div>Filters Active: {filters.startDate || filters.endDate || filters.packageCategory ? "🔍" : "❌"}</div>
          </div>
        )}
      </div>
    </>
  );
}
