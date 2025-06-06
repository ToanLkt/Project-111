import React, { useState } from "react";

const initialTransactions = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    email: "member1@gmail.com",
    amount: 199000,
    package: "Gói Pro",
    date: "2024-05-01",
    note: "Thanh toán thành công",
  },
  {
    id: 2,
    user: "Trần Thị B",
    email: "member2@gmail.com",
    amount: 399000,
    package: "Gói Plus",
    date: "2024-05-10",
    note: "Chờ xác nhận",
  },
  {
    id: 3,
    user: "Lê Văn C",
    email: "member3@gmail.com",
    amount: 0,
    package: "Gói Basic",
    date: "2024-05-15",
    note: "Miễn phí",
  },
  {
    id: 4,
    user: "Phạm Thị D",
    email: "member4@gmail.com",
    amount: 199000,
    package: "Gói Pro",
    date: "2024-06-01",
    note: "Thanh toán thành công",
  },
  {
    id: 5,
    user: "Ngô Minh E",
    email: "member5@gmail.com",
    amount: 399000,
    package: "Gói Plus",
    date: "2024-06-02",
    note: "Chờ xác nhận",
  },
  {
    id: 6,
    user: "Đặng Thị F",
    email: "member6@gmail.com",
    amount: 0,
    package: "Gói Basic",
    date: "2024-06-03",
    note: "Miễn phí",
  },
  {
    id: 7,
    user: "Vũ Văn G",
    email: "member7@gmail.com",
    amount: 199000,
    package: "Gói Pro",
    date: "2024-06-04",
    note: "Thanh toán thành công",
  },
  {
    id: 8,
    user: "Nguyễn Thị H",
    email: "member8@gmail.com",
    amount: 399000,
    package: "Gói Plus",
    date: "2024-06-05",
    note: "Chờ xác nhận",
  },
  {
    id: 9,
    user: "Phan Văn I",
    email: "member9@gmail.com",
    amount: 0,
    package: "Gói Basic",
    date: "2024-06-06",
    note: "Miễn phí",
  },
  {
    id: 10,
    user: "Trịnh Thị K",
    email: "member10@gmail.com",
    amount: 199000,
    package: "Gói Pro",
    date: "2024-06-07",
    note: "Thanh toán thành công",
  },
];

const initialPackages = [
  {
    id: 1,
    name: "Gói Basic",
    price: "Miễn phí 1 tháng",
    features: ["✔️ Documentation", "✔️ Community Access"],
  },
  {
    id: 2,
    name: "Gói Pro",
    price: "199.000đ/tháng",
    features: [
      "✔️ All basic features",
      "✔️ Expert consultation",
      "✔️ Personalized roadmap",
    ],
  },
  {
    id: 3,
    name: "Gói Plus",
    price: "299.000đ/tháng",
    features: [
      "✔️ All advanced features",
      "✔️ 24/7 Support",
      "✔️ Personal progress tracking",
    ],
  },
];

export default function AdminPayment() {
  const [transactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");

  // State quản lý gói
  const [packages, setPackages] = useState(initialPackages);
  const [showEdit, setShowEdit] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", features: "" });

  // Lọc giao dịch theo gói
  const filtered = transactions.filter((t) =>
    t.package.toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý form gói
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Thêm gói mới
  const handleAddPackage = (e) => {
    e.preventDefault();
    setPackages([
      ...packages,
      {
        id: Date.now(),
        name: form.name,
        price: form.price,
        features: form.features.split("\n").filter(Boolean),
      },
    ]);
    setForm({ name: "", price: "", features: "" });
  };

  // Xóa gói
  const handleDeletePackage = (id) => {
    setPackages(packages.filter((p) => p.id !== id));
  };

  // Sửa gói
  const handleEditPackage = (pkg) => {
    setEditPkg(pkg);
    setForm({
      name: pkg.name,
      price: pkg.price,
      features: pkg.features.join("\n"),
    });
    setShowEdit(true);
  };

  // Lưu chỉnh sửa gói
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPackages((prev) =>
      prev.map((p) =>
        p.id === editPkg.id
          ? {
            ...p,
            name: form.name,
            price: form.price,
            features: form.features.split("\n").filter(Boolean),
          }
          : p
      )
    );
    setShowEdit(false);
    setEditPkg(null);
    setForm({ name: "", price: "", features: "" });
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        background: "#fafdff",
        borderRadius: 18,
        padding: 40,
        boxShadow: "0 6px 32px #2d98da22",
        minHeight: 500,
      }}
    >
      <h2
        style={{
          color: "#2d98da",
          marginBottom: 32,
          fontWeight: 800,
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        Quản lý giao dịch thanh toán
      </h2>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo gói..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "9px 16px",
            borderRadius: 8,
            border: "1.5px solid #2d98da55",
            fontSize: 15,
            minWidth: 220,
            outline: "none",
            marginRight: 0,
            background: "#fff",
          }}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 12px #2d98da11",
          }}
        >
          <thead>
            <tr style={{ background: "#eaf6ff" }}>
              <th style={{ padding: 16, borderBottom: "2px solid #2d98da22", fontWeight: 700 }}>STT</th>
              <th style={{ padding: 16, borderBottom: "2px solid #2d98da22", fontWeight: 700 }}>Tên người dùng</th>
              <th style={{ padding: 16, borderBottom: "2px solid #2d98da22", fontWeight: 700 }}>Email</th>
              <th style={{ padding: 16, borderBottom: "2px solid #2d98da22", fontWeight: 700 }}>Gói</th>
              <th style={{ padding: 16, borderBottom: "2px solid #2d98da22", fontWeight: 700 }}>Số tiền</th>
              <th style={{ padding: 16, borderBottom: "2px solid #2d98da22", fontWeight: 700 }}>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr
                key={t.id}
                style={{
                  background: idx % 2 === 0 ? "#f8fbff" : "#fff",
                }}
              >
                <td style={{ padding: 14, borderBottom: "1px solid #e3eaf3", textAlign: "center" }}>{idx + 1}</td>
                <td style={{ padding: 14, borderBottom: "1px solid #e3eaf3" }}>{t.user}</td>
                <td style={{ padding: 14, borderBottom: "1px solid #e3eaf3" }}>{t.email}</td>
                <td style={{ padding: 14, borderBottom: "1px solid #e3eaf3" }}>
                  <span
                    style={{
                      background:
                        t.package === "Gói Plus"
                          ? "#2d98da"
                          : t.package === "Gói Pro"
                            ? "#7c4dff"
                            : "#aaa",
                      color: "#fff",
                      padding: "4px 14px",
                      borderRadius: 16,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {t.package}
                  </span>
                </td>
                <td style={{ padding: 14, borderBottom: "1px solid #e3eaf3", color: "#27ae60", fontWeight: 700 }}>
                  {t.amount.toLocaleString()}₫
                </td>
                <td style={{ padding: 14, borderBottom: "1px solid #e3eaf3" }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quản lý gói */}
      <h2
        style={{
          color: "#2d98da",
          margin: "48px 0 24px 0",
          fontWeight: 800,
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      >
        Quản lý gói thành viên
      </h2>
      <div style={{
        marginBottom: 32,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 12px #2d98da11",
        padding: 28,
      }}>
        <form
          onSubmit={showEdit ? handleSaveEdit : handleAddPackage}
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-end",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div style={{ minWidth: 220 }}>
            <label style={{ fontWeight: 700, color: "#2d98da" }}>Tên gói</label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                border: "1.5px solid #2d98da55",
                fontSize: 15,
                width: "100%",
                marginTop: 6,
                background: "#fafdff",
              }}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <label style={{ fontWeight: 700, color: "#2d98da" }}>Giá</label>
            <input
              name="price"
              value={form.price}
              onChange={handleFormChange}
              required
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                border: "1.5px solid #2d98da55",
                fontSize: 15,
                width: "100%",
                marginTop: 6,
                background: "#fafdff",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <label style={{ fontWeight: 700, color: "#2d98da" }}>Tính năng (mỗi dòng 1 tính năng)</label>
            <textarea
              name="features"
              value={form.features}
              onChange={handleFormChange}
              required
              rows={3}
              style={{
                width: "100%",
                padding: "9px 14px",
                borderRadius: 8,
                border: "1.5px solid #2d98da55",
                fontSize: 15,
                marginTop: 6,
                background: "#fafdff",
                resize: "vertical",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button
              type="submit"
              style={{
                background: "#2d98da",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                minWidth: 90,
                boxShadow: "0 2px 8px #2d98da22"
              }}
            >
              {showEdit ? "Lưu" : "Thêm"}
            </button>
            {showEdit && (
              <button
                type="button"
                onClick={() => {
                  setShowEdit(false);
                  setEditPkg(null);
                  setForm({ name: "", price: "", features: "" });
                }}
                style={{
                  background: "#aaa",
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
            )}
          </div>
        </form>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "#fafdff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px #2d98da11",
            }}
          >
            <thead>
              <tr style={{ background: "#eaf6ff" }}>
                <th style={{ padding: 14, fontWeight: 700, color: "#2d98da" }}>STT</th>
                <th style={{ padding: 14, fontWeight: 700, color: "#2d98da" }}>Tên gói</th>
                <th style={{ padding: 14, fontWeight: 700, color: "#2d98da" }}>Giá</th>
                <th style={{ padding: 14, fontWeight: 700, color: "#2d98da" }}>Tính năng</th>
                <th style={{ padding: 14, fontWeight: 700, color: "#2d98da" }}>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => (
                <tr key={pkg.id} style={{ background: idx % 2 === 0 ? "#f8fbff" : "#fff" }}>
                  <td style={{ padding: 12 }}>{idx + 1}</td>
                  <td style={{ padding: 12 }}>{pkg.name}</td>
                  <td style={{ padding: 12 }}>{pkg.price}</td>
                  <td style={{ padding: 12 }}>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {pkg.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      style={{
                        background: "#7c4dff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "7px 18px",
                        fontWeight: 600,
                        marginRight: 8,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #7c4dff22"
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      style={{
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        padding: "7px 18px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #e74c3c22"
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 18, color: "#888" }}>
                    Không có gói nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
