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

export default function IntroSection() {
  const [about, setAbout] = useState("");

  useEffect(() => {
    fetch("https://localhost:7133/api/Platform/info")
      .then(res => res.json())
      .then(data => {
        if (data && data.about) setAbout(data.about);
        else setAbout("Chưa có thông tin giới thiệu.");
      })
      .catch(() => setAbout("Chưa có thông tin giới thiệu."));
  }, []);

  return (
    <section
      id="gioithieu"
      style={{
        width: "100%",
        minHeight: "60vh",
        background: COLORS.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 0",
      }}
    >
      <div
        style={{
          background: COLORS.white,
          borderRadius: 20,
          boxShadow: "0 6px 32px rgba(72,166,167,0.13)",
          border: `2px solid ${COLORS.primary}`,
          maxWidth: 700,
          margin: "0 auto",
          padding: "2.5rem 2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: COLORS.accent,
            fontWeight: 900,
            fontSize: "2.3rem",
            marginBottom: 18,
            letterSpacing: 1,
            textShadow: "0 2px 8px #9ACBD033",
            userSelect: "none",
          }}
        >
          Chào mừng bạn đến với Cộng đồng Cai Thuốc Lá!
        </h1>
        <p
          style={{
            color: COLORS.secondary,
            fontSize: "1.18rem",
            marginBottom: 24,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          Đây là nơi bạn có thể chia sẻ kinh nghiệm, nhận sự hỗ trợ và cùng nhau vượt qua thử thách cai thuốc lá. Hãy bắt đầu hành trình sống khỏe mạnh hơn cùng chúng tôi!
        </p>
        <a
          href="/community"
          style={{
            display: "inline-block",
            background: `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`,
            color: COLORS.white,
            fontWeight: 700,
            fontSize: "1.13rem",
            border: "none",
            borderRadius: 10,
            padding: "0.9rem 2.2rem",
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(72,166,167,0.13)",
            transition: "background 0.3s",
            letterSpacing: 0.5,
          }}
          onMouseOver={e => (e.currentTarget.style.background = COLORS.accent)}
          onMouseOut={e => (e.currentTarget.style.background = `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`)}
        >
          Tham gia cộng đồng
        </a>
      </div>
    </section>
  );
}