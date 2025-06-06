import React from "react";

export default function NewSection() {
  const articles = [
    {
      title: "Những lợi ích sức khỏe sau khi bỏ thuốc lá",
      summary: "Sau khi bỏ thuốc, cơ thể bắt đầu phục hồi ngay từ ngày đầu tiên. Hãy khám phá những thay đổi tích cực mà bạn sẽ trải qua.",
      img: "https://th.bing.com/th/id/R.28c2b879dd3e42c6bf23d1b4d9863926?rik=r6uIPabG%2b5tZeg&pid=ImgRaw&r=0",
      link: "#"
    },
    {
      title: "Phương pháp cai thuốc hiệu quả nhất",
      summary: "Từ liệu pháp thay thế nicotine đến phương pháp tâm lý – đâu là lựa chọn tốt nhất để giúp bạn từ bỏ thói quen hút thuốc?",
      img: "https://th.bing.com/th/id/OIP.SSkTmX-oq3PPeDcMhmYy2wHaDj?rs=1&pid=ImgDetMain",
      link: "#"
    },
    {
      title: "Câu chuyện thành công: 100 ngày không thuốc lá",
      summary: "Những người đã cai thuốc chia sẻ trải nghiệm của họ, từ những thử thách ban đầu cho đến cảm giác nhẹ nhõm khi bỏ thuốc.",
      img: "https://th.bing.com/th/id/OIP.8o8ur3HxBMFomcS_fhOhJwHaHn?w=736&h=757&rs=1&pid=ImgDetMain",
      link: "#"
    }
  ];

  return (
    <section
      id="tin-tuc"
      style={{
        fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
        maxWidth: "900px",
        margin: "3rem auto",
        background: "#111",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
      }}
    >
      <h2 style={{
        color: "#d4af37",
        fontWeight: 800,
        fontSize: "2rem",
        textAlign: "center",
        marginBottom: "2rem",
      }}>
        Tin Tức Về Cai Thuốc Lá
      </h2>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        {articles.map((article, index) => (
          <div
            key={index}
            style={{
              flex: "1 1 280px",
              maxWidth: "300px",
              background: "#1a1a1a",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={article.img}
              alt={article.title}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
            />
            <h3 style={{ color: "#d4af37", fontSize: "1.1rem", fontWeight: 700 }}>{article.title}</h3>
            <p style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "1rem", lineHeight: "1.5" }}>{article.summary}</p>
            <a href={article.link} style={{ color: "#d4af37", fontWeight: "bold", textDecoration: "none" }}>Xem chi tiết</a>
          </div>
        ))}
      </div>
    </section>
  );
}
