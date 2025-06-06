import React from "react";

export default function FeedbackSection() {
  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto 4rem auto",
        background: "#111",
        padding: "3rem 2rem",
        borderRadius: "20px",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
      }}
    >
      <h2
        style={{
          color: "#d4af37",
          fontWeight: 800,
          fontSize: "2rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Phản hồi từ người dùng
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          {
            name: "Nguyễn Văn A",
            text: "Nhờ website này, tôi đã bỏ thuốc thành công sau 10 năm hút thuốc. Cảm ơn đội ngũ rất nhiều!",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Trần Thị B",
            text: "Các tài liệu và cộng đồng hỗ trợ rất hữu ích, tôi cảm thấy không còn đơn độc trên hành trình này.",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            name: "Lê Văn C",
            text: "Gói hỗ trợ chuyên sâu giúp tôi vượt qua những lúc khó khăn nhất. Rất đáng để thử!",
            avatar: "https://randomuser.me/api/portraits/men/65.jpg",
          },
        ].map((fb, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              minWidth: 260,
              background: "#1a1a1a",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>"{fb.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <img
                src={fb.avatar}
                alt={fb.name}
                style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #d4af37" }}
              />
              <strong style={{ fontSize: "1rem", color: "#d4af37" }}>{fb.name}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
