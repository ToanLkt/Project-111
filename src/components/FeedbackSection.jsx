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

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Feedback",
        )
        const data = await res.json()
        setFeedbacks(Array.isArray(data) ? data : [])
      } catch {
        setFeedbacks([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={index < rating ? "fas fa-star" : "far fa-star"}
        style={{
          color: index < rating ? "#F59E0B" : "#D1D5DB",
          fontSize: "0.9rem",
          marginRight: "2px",
        }}
      ></i>
    ))
  }

  const getAvatarColor = (index) => {
    const colors = [COLORS.color1, COLORS.color2, "#E0F2FE", "#FEF3C7"]
    return colors[index % colors.length]
  }

  return (
    <>
      <style jsx>{`
        .feedback-section {
          background: ${COLORS.background};
          padding: 5rem 0;
          position: relative;
        }

        .feedback-container {
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

        .feedback-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .feedback-icon-wrapper {
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

        .feedback-icon {
          font-size: 2.5rem;
          filter: grayscale(0.2);
        }

        .feedback-title {
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

        .feedback-subtitle {
          text-align: center;
          color: ${COLORS.textLight};
          font-size: 1.1rem;
          margin-bottom: 3rem;
          font-weight: 500;
        }

        .feedback-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feedback-card {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid ${COLORS.color1};
          box-shadow: 0 8px 24px rgba(51, 107, 115, 0.06);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .feedback-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(51, 107, 115, 0.12);
        }

        .feedback-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${COLORS.gradientLight};
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .feedback-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          color: ${COLORS.color3};
          flex-shrink: 0;
        }

        .feedback-user-info {
          flex: 1;
        }

        .feedback-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: ${COLORS.color3};
          margin-bottom: 0.3rem;
        }

        .feedback-date {
          font-size: 0.9rem;
          color: ${COLORS.textLight};
        }

        .feedback-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .feedback-content {
          color: ${COLORS.text};
          font-size: 1.05rem;
          line-height: 1.6;
          font-style: italic;
          position: relative;
        }

        .feedback-content::before {
          content: '"';
          font-size: 3rem;
          color: ${COLORS.color1};
          position: absolute;
          top: -10px;
          left: -10px;
          font-family: serif;
        }

        .feedback-content::after {
          content: '"';
          font-size: 3rem;
          color: ${COLORS.color1};
          position: absolute;
          bottom: -30px;
          right: -5px;
          font-family: serif;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
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
          margin-bottom: 0.5rem;
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

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .skeleton-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .skeleton-name {
          height: 1.2rem;
          width: 120px;
        }

        .skeleton-rating {
          height: 1rem;
          width: 100px;
        }

        .skeleton-content {
          height: 1rem;
          width: 100%;
        }

        .skeleton-content:nth-child(2) { width: 90%; }
        .skeleton-content:nth-child(3) { width: 80%; }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .stats-summary {
          background: ${COLORS.color1};
          border-radius: 16px;
          padding: 2rem;
          margin-top: 3rem;
          text-align: center;
          border: 1px solid ${COLORS.color2};
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: ${COLORS.color3};
          display: block;
        }

        .stat-label {
          color: ${COLORS.textLight};
          font-size: 0.9rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .feedback-section {
            padding: 3rem 0;
          }

          .feedback-container {
            margin: 0 1rem;
            padding: 2.5rem 2rem;
            border-radius: 20px;
          }

          .feedback-title {
            font-size: 2.2rem;
          }

          .feedback-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .feedback-card {
            padding: 2rem;
          }

          .feedback-icon-wrapper {
            width: 60px;
            height: 60px;
          }

          .feedback-icon {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .feedback-title {
            font-size: 1.8rem;
          }

          .feedback-card {
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <section id="feedback" className="feedback-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="feedback-container">
                <div className="feedback-icon-wrapper">
                  <div className="feedback-icon">💬</div>
                </div>

                <h2 className="feedback-title">Phản hồi từ người dùng</h2>
                <p className="feedback-subtitle">Những chia sẻ chân thật từ những người đã thành công</p>

                {loading ? (
                  <div className="feedback-grid">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="loading-card">
                        <div className="skeleton-header">
                          <div className="loading-skeleton skeleton-avatar"></div>
                          <div>
                            <div className="loading-skeleton skeleton-name"></div>
                            <div className="loading-skeleton skeleton-rating"></div>
                          </div>
                        </div>
                        <div className="loading-skeleton skeleton-content"></div>
                        <div className="loading-skeleton skeleton-content"></div>
                        <div className="loading-skeleton skeleton-content"></div>
                      </div>
                    ))}
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">💭</div>
                    <div className="empty-state-text">Chưa có phản hồi nào</div>
                    <p style={{ color: COLORS.textLight }}>Hãy là người đầu tiên chia sẻ trải nghiệm của bạn</p>
                  </div>
                ) : (
                  <>
                    <div className="feedback-grid">
                      {feedbacks.map((fb, idx) => (
                        <div key={idx} className="feedback-card">
                          <div className="feedback-header">
                            <div className="feedback-avatar" style={{ background: getAvatarColor(idx) }}>
                              {fb.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="feedback-user-info">
                              <div className="feedback-name">{fb.fullName}</div>
                              <div className="feedback-date">
                                {new Date(fb.feedback_date).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                          </div>

                          <div className="feedback-rating">
                            {renderStars(fb.feedback_rating)}
                            <span style={{ color: COLORS.textLight, fontSize: "0.9rem", marginLeft: "0.5rem" }}>
                              ({fb.feedback_rating}/5)
                            </span>
                          </div>

                          <div className="feedback-content">{fb.feedback_content}</div>
                        </div>
                      ))}
                    </div>

                    {/* Stats Summary */}
                    <div className="stats-summary">
                      <h4 style={{ color: COLORS.color3, marginBottom: "1rem", fontWeight: "700" }}>
                        Thống kê đánh giá
                      </h4>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-number">{feedbacks.length}</span>
                          <div className="stat-label">Phản hồi</div>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">
                            {feedbacks.length > 0
                              ? (feedbacks.reduce((sum, fb) => sum + fb.feedback_rating, 0) / feedbacks.length).toFixed(
                                1,
                              )
                              : "0"}
                          </span>
                          <div className="stat-label">Điểm trung bình</div>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">
                            {feedbacks.filter((fb) => fb.feedback_rating >= 4).length}
                          </span>
                          <div className="stat-label">Đánh giá tích cực</div>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">
                            {feedbacks.length > 0
                              ? Math.round(
                                (feedbacks.filter((fb) => fb.feedback_rating >= 4).length / feedbacks.length) * 100,
                              )
                              : 0}
                            %
                          </span>
                          <div className="stat-label">Tỷ lệ hài lòng</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
