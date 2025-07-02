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

export default function IntroSection() {
  const [about, setAbout] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform",
        )
        const data = await res.json()
        setAbout(data.about || "")
      } catch {
        setAbout("Không thể tải thông tin giới thiệu.")
      } finally {
        setLoading(false)
      }
    }

    fetchAbout()
  }, [])

  return (
    <>
      <style
        jsx>{`
        .intro-section {
          background: ${COLORS.background};
          padding: 5rem 0;
          position: relative;
        }

        .intro-container {
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

        .intro-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .intro-icon-wrapper {
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

        .intro-icon {
          font-size: 2.5rem;
          filter: grayscale(0.2);
        }

        .intro-title {
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

        .intro-subtitle {
          text-align: center;
          color: ${COLORS.textLight};
          font-size: 1.1rem;
          margin-bottom: 3rem;
          font-weight: 500;
        }

        .intro-content {
          font-size: 1.2rem;
          line-height: 1.8;
          color: ${COLORS.text};
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          background: ${COLORS.background};
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid ${COLORS.color1};
          position: relative;
        }

        .intro-content::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: ${COLORS.gradient};
          border-radius: 2px;
        }

        .loading-skeleton {
          background: linear-gradient(90deg, ${COLORS.color1} 25%, ${COLORS.background} 50%, ${COLORS.color1} 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          height: 1.2rem;
          margin-bottom: 0.8rem;
        }

        .loading-skeleton:last-child {
          width: 70%;
          margin: 0 auto;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature-item {
          text-align: center;
          padding: 1.5rem;
          background: ${COLORS.white};
          border-radius: 16px;
          border: 1px solid ${COLORS.color1};
          box-shadow: 0 4px 12px rgba(51, 107, 115, 0.05);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: ${COLORS.color1};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
        }

        .feature-title {
          font-weight: 600;
          color: ${COLORS.color3};
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .feature-desc {
          color: ${COLORS.textLight};
          font-size: 0.95rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .intro-section {
            padding: 3rem 0;
          }

          .intro-container {
            margin: 0 1rem;
            padding: 2.5rem 2rem;
            border-radius: 20px;
          }

          .intro-title {
            font-size: 2.2rem;
          }

          .intro-content {
            font-size: 1.1rem;
            padding: 2rem;
          }

          .intro-icon-wrapper {
            width: 60px;
            height: 60px;
          }

          .intro-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .intro-title {
            font-size: 1.8rem;
          }

          .intro-content {
            font-size: 1rem;
            padding: 1.5rem;
          }

          .feature-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>

      <section id="gioithieu" className="intro-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="intro-container">
                <div className="intro-icon-wrapper">
                  <div className="intro-icon">📖</div>
                </div>

                <h2 className="intro-title">Giới thiệu</h2>
                <p className="intro-subtitle">Tìm hiểu về chúng tôi và sứ mệnh đồng hành cùng bạn</p>

                <div className="intro-content">
                  {loading ? (
                    <div>
                      <div className="loading-skeleton"></div>
                      <div className="loading-skeleton"></div>
                      <div className="loading-skeleton"></div>
                      <div className="loading-skeleton"></div>
                    </div>
                  ) : (
                    about || "Đang tải thông tin..."
                  )}
                </div>

                {/* Feature highlights */}
                <div className="feature-grid">
                  <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <div className="feature-title">Phương pháp khoa học</div>
                    <div className="feature-desc">Áp dụng các phương pháp được chứng minh hiệu quả</div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">🤝</div>
                    <div className="feature-title">Hỗ trợ tận tâm</div>
                    <div className="feature-desc">Đội ngũ chuyên gia luôn sẵn sàng đồng hành</div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">🏆</div>
                    <div className="feature-title">Kết quả bền vững</div>
                    <div className="feature-desc">Cam kết mang lại kết quả lâu dài và ổn định</div>
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
