"use client"

import { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"

const COLORS = {
  background: "#FAFAF9",
  color1: "#CFE8EF",
  color2: "#6AB7C5",
  color3: "#336B73",
  white: "#FFFFFF",
  text: "#2D3748",
  textLight: "#718096",
  gradient: "linear-gradient(135deg, #6AB7C5 0%, #336B73 100%)",
  gradientLight: "linear-gradient(135deg, #CFE8EF 0%, #6AB7C5 50%)",
}

const defaultNewsItem = { title: "", summary: "", link: "" };

export default function NewSection() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform",
        )
        const data = await res.json()

        // Xử lý dữ liệu từ API theo đúng format trả về
        const arr = []
        for (let i = 1; i <= 3; i++) {
          if (data[`news${i}Title`]) {
            arr.push({
              title: data[`news${i}Title`],
              summary: data[`news${i}Content`] || "",
              link: data[`news${i}Link`] || "#",
            })
          }
        }
        setNews(arr)
      } catch {
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <>
      <style jsx>{`
        .news-section {
          background: ${COLORS.background};
          padding: 5rem 0;
          position: relative;
        }

        .news-container {
          background: ${COLORS.white};
          border-radius: 24px;
          padding: 4rem 3rem;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
        }

        .news-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .news-icon-wrapper {
          width: 80px;
          height: 80px;
          background: ${COLORS.gradientLight};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          border: 3px solid ${COLORS.color1};
        }

        .news-icon {
          font-size: 2.5rem;
          filter: grayscale(0.2);
        }

        .news-title {
          font-size: 2.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .news-subtitle {
          text-align: center;
          color: ${COLORS.textLight};
          font-size: 1.1rem;
          margin-bottom: 3rem;
          font-weight: 500;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .news-card {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid ${COLORS.color1};
          box-shadow: 0 8px 24px rgba(51, 107, 115, 0.06);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(51, 107, 115, 0.12);
        }

        .news-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${COLORS.gradientLight};
        }

        .news-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .news-card-icon {
          width: 50px;
          height: 50px;
          background: ${COLORS.color1};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .news-card-date {
          background: ${COLORS.color1};
          color: ${COLORS.color3};
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .news-card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: ${COLORS.color3};
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .news-card-summary {
          color: ${COLORS.text};
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .news-card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: ${COLORS.color2};
          font-weight: 600;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .news-card-link:hover {
          color: ${COLORS.color3};
          text-decoration: none;
          transform: translateX(4px);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: ${COLORS.textLight};
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state-text {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .loading-card {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid ${COLORS.color1};
        }

        .loading-skeleton {
          background: linear-gradient(90deg, ${COLORS.color1} 25%, ${COLORS.background} 50%, ${COLORS.color1} 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .skeleton-title {
          height: 1.5rem;
          width: 80%;
        }

        .skeleton-summary {
          height: 1rem;
          width: 100%;
        }

        .skeleton-summary:nth-child(3) { width: 90%; }
        .skeleton-summary:nth-child(4) { width: 70%; }

        .skeleton-link {
          height: 1rem;
          width: 30%;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .news-section {
            padding: 3rem 0;
          }

          .news-container {
            margin: 0 1rem;
            padding: 2.5rem 2rem;
            border-radius: 20px;
          }

          .news-title {
            font-size: 2.2rem;
          }

          .news-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .news-card {
            padding: 2rem;
          }

          .news-icon-wrapper {
            width: 60px;
            height: 60px;
          }

          .news-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .news-title {
            font-size: 1.8rem;
          }

          .news-card {
            padding: 1.5rem;
          }

          .news-card-title {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <section id="tin-tuc" className="news-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="news-container">
                <div className="news-icon-wrapper">
                  <div className="news-icon">📰</div>
                </div>

                <h2 className="news-title">Tin tức mới nhất</h2>
                <p className="news-subtitle">Cập nhật thông tin và kiến thức hữu ích về việc cai thuốc lá</p>

                {loading ? (
                  <div className="news-grid">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="loading-card">
                        <div className="loading-skeleton skeleton-title"></div>
                        <div className="loading-skeleton skeleton-summary"></div>
                        <div className="loading-skeleton skeleton-summary"></div>
                        <div className="loading-skeleton skeleton-summary"></div>
                        <div className="loading-skeleton skeleton-link"></div>
                      </div>
                    ))}
                  </div>
                ) : news.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <div className="empty-state-text">Chưa có tin tức nào</div>
                    <p style={{ color: COLORS.textLight, marginTop: "0.5rem" }}>
                      Hãy quay lại sau để xem những tin tức mới nhất
                    </p>
                  </div>
                ) : (
                  <div className="news-grid">
                    {news.map((article, index) => (
                      <article key={index} className="news-card">
                        <div className="news-card-header">
                          <div className="news-card-icon">{index === 0 ? "🔥" : index === 1 ? "💡" : "📊"}</div>
                          <div className="news-card-date">Mới nhất</div>
                        </div>

                        <h3 className="news-card-title">{article.title}</h3>

                        {article.summary && <p className="news-card-summary">{article.summary}</p>}

                        {article.link && article.link !== "#" && (
                          <a href={article.link} className="news-card-link" target="_blank" rel="noopener noreferrer">
                            Xem chi tiết
                            <i className="fas fa-arrow-right"></i>
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {/* Additional info section */}
                {!loading && news.length > 0 && (
                  <div className="row mt-4">
                    <div className="col-12">
                      <div
                        style={{
                          background: COLORS.color1,
                          borderRadius: "16px",
                          padding: "1.5rem",
                          textAlign: "center",
                          border: `1px solid ${COLORS.color2}`,
                        }}
                      >
                        <p style={{ margin: 0, color: COLORS.color3, fontWeight: "500" }}>
                          <i className="fas fa-bell me-2"></i>
                          Đăng ký nhận thông báo để không bỏ lỡ tin tức mới nhất
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
