import React from "react";

export default function RoadmapSection() {
  return (
    <section
      id="loi-ich"
      style={{
        maxWidth: "900px",
        margin: "3rem auto",
        background: "rgba(17, 17, 17, 0.85)",
        padding: "2.5rem",
        borderRadius: "16px",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        backdropFilter: "blur(6px)",
        position: "relative",
      }}
    >
      <h2 style={{
        color: "#d4af37",
        fontWeight: 800,
        marginBottom: "2rem",
        fontSize: "2rem",
        textAlign: "center",
      }}>
        Lợi Ích Khi Sử Dụng Website Cai Thuốc Lá
      </h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        justifyContent: "center",
      }}>
        {[
          {
            title: "Hỗ Trợ Cá Nhân Hóa",
            description: "Lộ trình cai thuốc được tùy chỉnh theo tình trạng sức khỏe và thói quen hút thuốc của bạn.",
            icon: "🚀",
          },
          {
            title: "Liệu Pháp Khoa Học",
            description: "Áp dụng các phương pháp cai thuốc đã được chứng minh như CBT và liệu pháp thay thế nicotine.",
            icon: "🔬",
          },
          {
            title: "Cộng Đồng Động Viên",
            description: "Tham gia nhóm hỗ trợ, chia sẻ kinh nghiệm với những người có cùng mục tiêu.",
            icon: "🤝",
          },
          {
            title: "Theo Dõi Tiến Trình",
            description: "Công cụ kiểm soát cơn thèm thuốc, theo dõi sức khỏe và đặt mục tiêu rõ ràng.",
            icon: "📊",
          },
          {
            title: "Chuyên Gia Hướng Dẫn",
            description: "Nhận tư vấn từ các chuyên gia y tế và tâm lý giúp bạn vượt qua thử thách.",
            icon: "👨‍⚕️",
          }
        ].map((benefit, index) => (
          <div key={index} style={{
            flex: "1 1 250px",
            maxWidth: "280px",
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 3px 12px rgba(0,0,0,0.3)",
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#d4af37" }}>
              {benefit.icon} {benefit.title}
            </h3>
            <p style={{ color: "#fff", fontSize: "1rem", marginTop: "0.8rem" }}>
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
