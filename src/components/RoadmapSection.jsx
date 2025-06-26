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

export default function RoadmapSection() {
  const [benefit, setBenefit] = useState("");

  useEffect(() => {
    const fetchBenefit = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform"
        );
        const data = await res.json();
        setBenefit(data.benefit || "");
      } catch {
        setBenefit("Không thể tải nội dung lợi ích.");
      }
    };
    fetchBenefit();
  }, []);

  return (
    <section
      id="loi-ich"
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
          maxWidth: 800,
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
          🎯 Lợi ích khi tham gia
        </h2>
        <div
          style={{
            color: COLORS.text,
            fontSize: "1.13rem",
            fontWeight: 500,
            lineHeight: 1.7,
            textAlign: "center",
            background: COLORS.light,
            borderRadius: 14,
            border: `1.5px solid ${COLORS.primary}`,
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 120,
              height: 120,
              background: `radial-gradient(circle, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: -10,
              left: -10,
              width: 120,
              height: 120,
              background: `radial-gradient(circle, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            {benefit.split("\n").map((line, idx) => (
              <p key={idx} style={{ margin: "0.5rem 0" }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
