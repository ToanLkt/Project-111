import React from "react";

const feedbacks = [
  {
    fullName: "Nguyễn Văn A",
    feedback_content: "Trang web rất hữu ích, mình đã cai thuốc thành công nhờ các tài liệu và sự hỗ trợ từ cộng đồng!",
    feedback_date: "2025-06-16",
    feedback_rating: 5,
  },
  {
    fullName: "Trần Thị B",
    feedback_content: "Giao diện thân thiện, dễ sử dụng. Mình rất thích tính năng theo dõi tiến trình.",
    feedback_date: "2025-06-15",
    feedback_rating: 4,
  },
  {
    fullName: "Lê Văn C",
    feedback_content: "Cảm ơn đội ngũ phát triển đã tạo ra một nền tảng ý nghĩa cho cộng đồng.",
    feedback_date: "2025-06-14",
    feedback_rating: 5,
  },
];

const COLORS = {
  background: "#F2EFE7",
  card: "#fff",
  cardAlt: "#E6F4F4",
  accent: "#006A71",
  border: "#9ACBD0",
  gold: "#bfa917",
  goldBg: "#fffbe8",
  goldText: "#bfa917",
  icon: "#8e44ad",
};

export default function FeedbackSection() {
  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto 4rem auto",
        background: COLORS.background,
        padding: "3rem 2rem",
        borderRadius: "20px",
        boxShadow: "0 0 20px #9ACBD022",
      }}
    >
      <h2
        style={{
          color: COLORS.accent,
          fontWeight: 800,
          fontSize: "2rem",
          marginBottom: "2rem",
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        Phản hồi từ người dùng
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {feedbacks.length === 0 && (
          <div style={{ color: COLORS.accent, textAlign: "center" }}>
            Chưa có phản hồi nào.
          </div>
        )}
        {feedbacks.map((fb, index) => (
          <div
            key={index}
            style={{
              width: 320,
              background: COLORS.cardAlt,
              borderRadius: "16px",
              padding: "2rem 1.5rem",
              boxShadow: "0 4px 16px #9ACBD022",
              color: COLORS.accent,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 240,
              border: `2px solid ${COLORS.border}`,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1.2rem",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: COLORS.accent,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 26,
                  border: `2px solid ${COLORS.border}`,
                  marginBottom: 10,
                }}
              >
                {fb.fullName ? fb.fullName[0].toUpperCase() : "?"}
              </div>
              <strong
                style={{
                  fontSize: "1.08rem",
                  color: COLORS.accent,
                  marginBottom: 2,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                }}
              >
                {fb.fullName}
              </strong>
              <span
                style={{
                  fontSize: "0.97rem",
                  color: "#48A6A7",
                  marginBottom: 2,
                }}
              >
                {fb.feedback_date
                  ? new Date(fb.feedback_date).toLocaleDateString("vi-VN")
                  : ""}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  color: COLORS.goldText,
                  marginBottom: 2,
                  fontWeight: 600,
                  background: COLORS.goldBg,
                  borderRadius: 8,
                  padding: "2px 12px",
                  letterSpacing: 0.2,
                  marginTop: 2,
                }}
              >
                Đánh giá: <b>{fb.feedback_rating} ★</b>
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontStyle: "italic",
                color: COLORS.accent,
                fontSize: "1.08rem",
                textAlign: "center",
                lineHeight: 1.6,
                flex: 1,
                fontWeight: 500,
              }}
            >
              "{fb.feedback_content}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
