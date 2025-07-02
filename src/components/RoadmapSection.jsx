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

export default function RoadmapSection() {
  const [benefit, setBenefit] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBenefit = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform",
        )
        const data = await res.json()
        setBenefit(data.benefit || "")
      } catch {
        setBenefit("Không thể tải nội dung lợi ích.")
      } finally {
        setLoading(false)
      }
    }

    fetchBenefit()
  }, [])

  return (
    <>
      <style jsx>{`
        .roadmap-section {
          background: ${COLORS.background};
          padding: 5rem 0;
          position: relative;
        }

        .roadmap-container {
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

        .roadmap-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .roadmap-icon-wrapper {
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

        .roadmap-icon {
          font-size: 2.5rem;
          filter: grayscale(0.2);
        }

        .roadmap-title {
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

        .roadmap-subtitle {
          text-align: center;
          color: ${COLORS.textLight};
          font-size: 1.1rem;
          margin-bottom: 3rem;
          font-weight: 500;
        }

        .benefit-content {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 3rem;
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
        }

        .benefit-content::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: ${COLORS.gradient};
          border-radius: 2px;
        }

        .benefit-decoration-1 {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 100px;
          height: 100px;
          background: ${COLORS.color1};
          border-radius: 50%;
          opacity: 0.3;
          z-index: 0;
        }

        .benefit-decoration-2 {
          position: absolute;
          bottom: -30px;
          left: -30px;
          width: 80px;
          height: 80px;
          background: ${COLORS.color2};
          border-radius: 50%;
          opacity: 0.2;
          z-index: 0;
        }

        .benefit-text {
          position: relative;
          z-index: 1;
          font-size: 1.2rem;
          line-height: 1.8;
          color: ${COLORS.text};
          text-align: center;
        }

        .benefit-item {
          margin: 1rem 0;
          padding: 0.5rem 0;
          position: relative;
        }

        .benefit-item:not(:last-child)::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 1px;
          background: ${COLORS.color1};
        }

        .loading-skeleton {
          background: linear-gradient(90deg, ${COLORS.color1} 25%, ${COLORS.background} 50%, ${COLORS.color1} 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          height: 1.2rem;
          margin-bottom: 1rem;
        }

        .loading-skeleton:nth-child(2) { width: 90%; }
        .loading-skeleton:nth-child(3) { width: 95%; }
        .loading-skeleton:nth-child(4) { width: 85%; }
        .loading-skeleton:last-child { width: 70%; }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .benefit-card {
          background: ${COLORS.white};
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          border: 1px solid ${COLORS.color1};
          box-shadow: 0 4px 12px rgba(51, 107, 115, 0.05);
          position: relative;
          overflow: hidden;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${COLORS.gradientLight};
        }

        .benefit-card-icon {
          width: 60px;
          height: 60px;
          background: ${COLORS.color1};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 1.8rem;
        }

        .benefit-card-title {
          font-weight: 700;
          color: ${COLORS.color3};
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .benefit-card-desc {
          color: ${COLORS.textLight};
          line-height: 1.6;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .roadmap-section {
            padding: 3rem 0;
          }

          .roadmap-container {
            margin: 0 1rem;
            padding: 2.5rem 2rem;
            border-radius: 20px;
          }

          .roadmap-title {
            font-size: 2.2rem;
          }

          .benefit-content {
            padding: 2rem;
          }

          .benefit-text {
            font-size: 1.1rem;
          }

          .roadmap-icon-wrapper {
            width: 60px;
            height: 60px;
          }

          .roadmap-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .roadmap-title {
            font-size: 1.8rem;
          }

          .benefit-content {
            padding: 1.5rem;
          }

          .benefit-text {
            font-size: 1rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>

      <section id="loi-ich" className="roadmap-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="roadmap-container">
                <div className="roadmap-icon-wrapper">
                  <div className="roadmap-icon">🎯</div>
                </div>

                <h2 className="roadmap-title">Lợi ích khi tham gia</h2>
                <p className="roadmap-subtitle">Những giá trị thiết thực mà bạn sẽ nhận được</p>

                <div className="benefit-content">
                  <div className="benefit-decoration-1"></div>
                  <div className="benefit-decoration-2"></div>

                  <div className="benefit-text">
                    {loading ? (
                      <div>
                        <div className="loading-skeleton"></div>
                        <div className="loading-skeleton"></div>
                        <div className="loading-skeleton"></div>
                        <div className="loading-skeleton"></div>
                        <div className="loading-skeleton"></div>
                      </div>
                    ) : (
                      benefit.split("\n").map((line, idx) => (
                        <div key={idx} className="benefit-item">
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Additional benefit highlights */}
                <div className="benefits-grid">
                  <div className="benefit-card">
                    <div className="benefit-card-icon">💪</div>
                    <div className="benefit-card-title">Sức khỏe cải thiện</div>
                    <div className="benefit-card-desc">
                      Phục hồi chức năng phổi, giảm nguy cơ bệnh tim mạch và ung thư
                    </div>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-card-icon">💰</div>
                    <div className="benefit-card-title">Tiết kiệm chi phí</div>
                    <div className="benefit-card-desc">
                      Không còn chi tiêu cho thuốc lá, tiết kiệm hàng triệu đồng mỗi năm
                    </div>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-card-icon">👨‍👩‍👧‍👦</div>
                    <div className="benefit-card-title">Gia đình hạnh phúc</div>
                    <div className="benefit-card-desc">Bảo vệ sức khỏe người thân, tạo môi trường sống trong lành</div>
                  </div>

                  <div className="benefit-card">
                    <div className="benefit-card-icon">🌟</div>
                    <div className="benefit-card-title">Tự tin hơn</div>
                    <div className="benefit-card-desc">Vượt qua thử thách, xây dựng lối sống tích cực và năng động</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
