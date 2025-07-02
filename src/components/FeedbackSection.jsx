import React, { useEffect, useState } from "react";

// Bảng màu chủ đề
const COLORS = {
  background: "#F2EFE7",
  primary: "#9ACBD0",
  secondary: "#48A6A7",
  accent: "#006A71",
  text: "#006A71",
  white: "#fff",
  light: "#E6F4F4",
};

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback"
        );
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch {
        setFeedbacks([]);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <section
      id="feedback"
      style={{
        width: "100%",
        minHeight: "40vh",
        background: COLORS.background,
        padding: "2.5rem 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1920,
          width: "100%",
          background: COLORS.white,
          borderRadius: 20,
          boxShadow: "0 6px 32px rgba(72,166,167,0.13)",
          border: `2px solid ${COLORS.primary}`,
          padding: "2.2rem 2rem",
        }}
      >
        <h2
          style={{
            color: COLORS.accent,
            fontWeight: 900,
            fontSize: "2rem",
            marginBottom: 24,
            letterSpacing: 1,
            textAlign: "center",
            textShadow: "0 2px 8px #9ACBD033",
            userSelect: "none",
          }}
        >
          💬 Phản hồi từ người dùng
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {feedbacks.length === 0 && (
            <div style={{ color: COLORS.secondary, textAlign: "center", fontWeight: 600 }}>
              Chưa có phản hồi nào.
            </div>
          )}
          {feedbacks.map((fb, idx) => (
            <div
              key={idx}
              style={{
                background: COLORS.light,
                borderRadius: 14,
                border: `1.5px solid ${COLORS.primary}`,
                boxShadow: "0 2px 8px #9ACBD022",
                padding: "1.3rem 1.1rem",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 700, color: COLORS.accent, fontSize: "1.13rem" }}>
                {fb.fullName}
              </div>
              <div style={{ color: COLORS.text, fontSize: "1.07rem" }}>
                {fb.feedback_content}
              </div>
              <div style={{ color: COLORS.secondary, fontSize: "0.98rem" }}>
                {new Date(fb.feedback_date).toLocaleDateString()}
                {"  "}
                <span style={{ marginLeft: 12 }}>
                  Đánh giá: {"⭐".repeat(fb.feedback_rating)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
