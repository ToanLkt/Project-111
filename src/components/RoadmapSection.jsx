import React from "react";

const benefits = [
  "✔️ Cung cấp tài liệu, bài viết và hướng dẫn từ chuyên gia giúp bạn hiểu rõ về quá trình cai thuốc và các phương pháp hiệu quả.",
  "✔️ Tham gia cộng đồng, chia sẻ kinh nghiệm, nhận động viên và hỗ trợ từ những người cùng mục tiêu bỏ thuốc lá.",
  "✔️ Công cụ cá nhân hóa giúp bạn theo dõi quá trình cai thuốc, đặt mục tiêu và nhận phần thưởng khi đạt được cột mốc mới.",
];

const COLORS = {
  background: "#F2EFE7",
  card: "#fff",
  cardAlt: "#E6F4F4",
  accent: "#006A71",
  border: "#9ACBD0",
  gold: "#bfa917",
  goldBg: "#fffbe8",
};

export default function RoadmapSection() {
  return (
    <section
      id="loi-ich"
      style={{
        maxWidth: "900px",
        margin: "3rem auto",
        background: COLORS.cardAlt,
        padding: "2.5rem",
        borderRadius: "16px",
        border: `2px solid ${COLORS.border}`,
        position: "relative",
        boxShadow: "0 4px 16px #9ACBD022",
      }}
    >
      <h2 style={{
        color: COLORS.accent,
        fontWeight: 800,
        marginBottom: "2rem",
        fontSize: "2rem",
        textAlign: "center",
        letterSpacing: 0.5,
      }}>
        Lợi Ích Khi Sử Dụng Website Cai Thuốc Lá
      </h2>

      <ul style={{
        color: COLORS.accent,
        fontSize: "1.15rem",
        textAlign: "left",
        margin: "0 auto",
        maxWidth: 700,
        paddingLeft: 0,
        listStyle: "none",
        fontWeight: 500,
      }}>
        {benefits.map((b, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: 18,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{
              color: "#8e44ad",
              fontSize: 22,
              lineHeight: 1,
              marginTop: 4,
            }}>
              ✔️
            </span>
            <span style={{ lineHeight: 1.6 }}>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
