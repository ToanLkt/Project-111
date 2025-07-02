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

export default function NewSection() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform"
        );
        const data = await res.json();
        // Xử lý dữ liệu từ API theo đúng format trả về
        const arr = [];
        for (let i = 1; i <= 3; i++) {
          if (data[`news${i}Title`]) {
            arr.push({
              title: data[`news${i}Title`],
              summary: data[`news${i}Content`] || "",
              link: data[`news${i}Link`] || "#",
            });
          }
        }
        setNews(arr);
      } catch {
        setNews([]);
      }
    };
    fetchNews();
  }, []);

  return (
    <section
      id="tin-tuc"
      style={{
        width: "100%",
        minHeight: "50vh",
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
          📰 Tin tức mới nhất
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {news.length === 0 && (
            <div style={{ color: COLORS.secondary, textAlign: "center", fontWeight: 600 }}>
              Chưa có tin tức nào.
            </div>
          )}
          {news.map((article, index) => (
            <div
              key={index}
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
                {article.title}
              </div>
              <div style={{ color: COLORS.text, fontSize: "1.07rem" }}>
                {article.summary}
              </div>
              {article.link && (
                <a href={article.link} style={{ color: COLORS.accent, fontWeight: "bold", textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                  Xem chi tiết
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
