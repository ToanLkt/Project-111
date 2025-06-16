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

// Dữ liệu 3 tin tức mẫu cho NewSection.jsx
const news = [
  {
    id: 1,
    title: "Bộ Y tế phát động chiến dịch quốc gia cai thuốc lá",
    summary: "Chiến dịch mới nhằm nâng cao nhận thức cộng đồng về tác hại của thuốc lá và hỗ trợ người dân bỏ thuốc.",
    date: "16/06/2025"
  },
  {
    id: 2,
    title: "Nghiên cứu: Cai thuốc lá giúp cải thiện sức khỏe tim mạch",
    summary: "Các chuyên gia khuyến nghị bỏ thuốc lá càng sớm càng tốt để giảm nguy cơ mắc bệnh tim mạch và đột quỵ.",
    date: "15/06/2025"
  },
  {
    id: 3,
    title: "Câu chuyện thành công: 100 ngày không thuốc lá",
    summary: "Anh Nguyễn Văn A chia sẻ hành trình vượt qua cơn nghiện thuốc lá và truyền cảm hứng cho cộng đồng.",
    date: "14/06/2025"
  }
];

export default function NewSection() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // fetch("https://localhost:7133/api/Platform/info")
    //   .then(res => res.json())
    //   .then(data => {
    //     // Lấy các trường news từ API và chuyển thành mảng bài viết
    //     const news = [];
    //     for (let i = 1; i <= 3; i++) {
    //       if (data[`news${i}_Title`]) {
    //         news.push({
    //           title: data[`news${i}_Title`],
    //           summary: data[`news${i}_Content`] || "",
    //           link: data[`news${i}_Link`] || "#"
    //         });
    //       }
    //     }
    //     setArticles(news);
    //   })
    //   .catch(() => setArticles([]));
    setArticles(news);
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
          📰 Tin tức mới nhất
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {articles.length === 0 && (
            <div style={{ color: COLORS.secondary, textAlign: "center", fontWeight: 600 }}>
              Chưa có tin tức nào.
            </div>
          )}
          {articles.map((article, index) => (
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
              <a href={article.link} style={{ color: COLORS.accent, fontWeight: "bold", textDecoration: "none" }}>Xem chi tiết</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
