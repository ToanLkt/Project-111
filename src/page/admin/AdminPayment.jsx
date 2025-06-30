import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext/AuthContext";

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
  const [packages, setPackages] = useState([]);
  const [history, setHistory] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [form, setForm] = useState({
    packageMembershipId: "",
    category: "",
    price: "",
    description: "",
    duration: "",
  });
  const { token } = useAuth();

  // Lấy danh sách gói từ API (GET all)
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setPackages(Array.isArray(data) ? data : []);
      } catch {
        setPackages([]);
      }
    }
    if (token) fetchPackages();
  }, [token]);

  // Lấy lịch sử giao dịch
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/purchase-history");
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch {
        setHistory([]);
      }
    }
    fetchHistory();
  }, []);

  // Sửa gói
  const handleEditPackage = (pkg) => {
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
    if (!editPkg) return;
    try {
      const res = await fetch(
        `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership/${form.packageMembershipId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            packageMembershipId: Number(form.packageMembershipId),
            category: form.category,
            price: Number(form.price),
            description: form.description,
            duration: Number(form.duration),
          }),
        }
      );
      if (!res.ok) throw new Error("Cập nhật gói thất bại");
      const updated = await res.json();
      setPackages((prev) =>
        prev.map((p) =>
          p.package_membership_ID === updated.package_membership_ID ? updated : p
        )
      );
      setShowEdit(false);
      setEditPkg(null);
      setForm({
        packageMembershipId: "",
        category: "",
        price: "",
        description: "",
        duration: "",
      });
    } catch (err) {
      alert("Cập nhật gói thất bại!");
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
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
        Quản lý gói thành viên
      </h2>
      <div style={{
        marginBottom: 32,
        background: COLORS.card,
        borderRadius: 14,
        boxShadow: "0 2px 12px #9ACBD011",
        padding: 28,
      }}>
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
            }}
          >
            <div style={{ minWidth: 120 }}>
              <label style={{ fontWeight: 700, color: COLORS.accent }}>Tên gói</label>
              <input
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
                style={{
                  padding: "9px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  fontSize: 15,
                  width: "100%",
                  marginTop: 6,
                  background: COLORS.tableBg,
                  color: COLORS.accent,
                  fontWeight: 600,
                }}
              />
            </div>
            <div style={{ minWidth: 100 }}>
              <label style={{ fontWeight: 700, color: COLORS.accent }}>Giá</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleFormChange}
                required
                style={{
                  padding: "9px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  fontSize: 15,
                  width: "100%",
                  marginTop: 6,
                  background: COLORS.tableBg,
                  color: COLORS.accent,
                  fontWeight: 600,
                }}
              />
            </div>
            <div style={{ minWidth: 100 }}>
              <label style={{ fontWeight: 700, color: COLORS.accent }}>Thời hạn (ngày)</label>
              <input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleFormChange}
                required
                style={{
                  padding: "9px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  fontSize: 15,
                  width: "100%",
                  marginTop: 6,
                  background: COLORS.tableBg,
                  color: COLORS.accent,
                  fontWeight: 600,
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={{ fontWeight: 700, color: COLORS.accent }}>Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                required
                rows={2}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${COLORS.primary}`,
                  fontSize: 15,
                  marginTop: 6,
                  background: COLORS.tableBg,
                  color: COLORS.accent,
                  fontWeight: 600,
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button
                type="submit"
                style={{
                  background: COLORS.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  minWidth: 90,
                  boxShadow: "0 2px 8px #9ACBD022"
                }}
                onMouseOver={e => e.currentTarget.style.background = COLORS.accent}
                onMouseOut={e => e.currentTarget.style.background = COLORS.primary}
              >
                Lưu
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
                  padding: "10px 18px",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  minWidth: 70,
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
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
                <th style={{ padding: 14, fontWeight: 700, color: COLORS.thText }}>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => (
                <tr key={pkg.package_membership_ID || idx} style={{ background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt }}>
                  <td style={{ padding: 12, color: COLORS.tdText }}>{idx + 1}</td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>{pkg.category}</td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>{pkg.price}</td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>{pkg.duration}</td>
                  <td style={{ padding: 12, color: COLORS.tdText }}>{pkg.description}</td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      style={{
                        background: COLORS.gold,
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "7px 18px",
                        fontWeight: 600,
                        marginRight: 8,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #bfa91722"
                      }}
                      onMouseOver={e => e.currentTarget.style.background = COLORS.accent}
                      onMouseOut={e => e.currentTarget.style.background = COLORS.gold}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 18, color: "#888" }}>
                    Không có gói nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <h2
        style={{
          color: COLORS.accent,
          margin: "40px 0 18px 0",
          fontWeight: 800,
          fontSize: "1.5rem",
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        Lịch sử giao dịch thành viên
      </h2>
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
            {history.map((item, idx) => (
              <tr key={item.purchaseID || idx} style={{ background: idx % 2 === 0 ? COLORS.tableRow : COLORS.tableRowAlt }}>
                <td style={{ padding: 12, color: COLORS.tdText }}>{idx + 1}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.memberName}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.packageCategory}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.transactionCode}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.totalPrice?.toLocaleString("vi-VN")}đ</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.timeBuy?.slice(0, 19).replace("T", " ")}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.startDate?.slice(0, 19).replace("T", " ")}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.endDate?.slice(0, 19).replace("T", " ")}</td>
                <td style={{ padding: 12, color: COLORS.tdText }}>{item.paymentStatus}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 18, color: "#888" }}>
                  Không có giao dịch nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
