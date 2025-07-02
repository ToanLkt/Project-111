import React, { useEffect, useState } from "react";
import IntroSection from "../../components/IntroSection";
import RoadmapSection from "../../components/RoadmapSection";
import ExpertSection from "../../components/NewSection";
import FeedbackSection from "../../components/FeedbackSection";
import MembershipPackage from "../../components/MembershipPackage";
import Footer from "../../components/Footer";
import { Outlet } from "react-router";

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
    gradientRadial: "radial-gradient(circle at center, #6AB7C5 0%, #336B73 100%)",
    accent: "#10B981",
    warning: "#F59E0B",
    purple: "#8B5CF6",
    pink: "#EC4899",
}

export default function Home() {
    const [message, setMessage] = useState("Từng Khoảnh Khắc, Một Hơi Thở Tự Do")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.message) setMessage(data.message)
            })
            .catch(() => setMessage("Từng Khoảnh Khắc, Một Hơi Thở Tự Do"))
            .finally(() => setLoading(false))
    }, [])

    return (
        <>
            <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #FAFAF9 0%, #F0F8F9 25%, #E8F4F5 50%, #F0F8F9 75%, #FAFAF9 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          padding: 4rem 0;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: 2rem;
          height: 100%;
          align-items: center;
        }

        .hero-main-content {
          grid-column: 1;
          grid-row: 1 / 3;
          background: ${COLORS.white};
          border-radius: 32px;
          padding: 4rem 3rem;
          box-shadow: 
            0 32px 64px rgba(51, 107, 115, 0.08),
            0 16px 32px rgba(51, 107, 115, 0.04);
          border: 2px solid ${COLORS.color1};
          position: relative;
          z-index: 2;
        }

        .hero-main-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: ${COLORS.gradient};
          border-radius: 32px 32px 0 0;
        }

        .hero-image-card {
          grid-column: 2;
          grid-row: 1;
          background: ${COLORS.white};
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 20px 40px rgba(51, 107, 115, 0.1);
          border: 2px solid ${COLORS.color1};
          transform: rotate(-2deg);
          position: relative;
          z-index: 1;
        }

        .hero-stats-grid {
          grid-column: 2;
          grid-row: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          transform: rotate(1deg);
        }

        .hero-cta-card {
          grid-column: 1 / 3;
          grid-row: 3;
          background: ${COLORS.gradient};
          border-radius: 24px;
          padding: 2.5rem;
          text-align: center;
          color: ${COLORS.white};
          box-shadow: 0 24px 48px rgba(106, 183, 197, 0.2);
          margin-top: 2rem;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: ${COLORS.color1};
          opacity: 0.4;
        }

        .circle-1 {
          width: 120px;
          height: 120px;
          top: 10%;
          right: 15%;
          background: ${COLORS.color2};
          opacity: 0.3;
        }

        .circle-2 {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 10%;
          background: ${COLORS.accent};
          opacity: 0.25;
        }

        .circle-3 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 5%;
          background: ${COLORS.warning};
          opacity: 0.3;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: ${COLORS.text};
          line-height: 1.6;
          margin-bottom: 2.5rem;
          font-weight: 500;
        }

        .hero-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          background: ${COLORS.background};
          border-radius: 16px;
          border: 1px solid ${COLORS.color1};
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: ${COLORS.gradientLight};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .feature-text {
          font-weight: 600;
          color: ${COLORS.color3};
          font-size: 0.9rem;
        }

        .btn-primary-modern {
          background: ${COLORS.gradient};
          border: none;
          border-radius: 50px;
          padding: 1.2rem 2.5rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: ${COLORS.white};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 12px 32px rgba(106, 183, 197, 0.3);
          margin-right: 1rem;
        }

        .btn-primary-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(106, 183, 197, 0.4);
          color: ${COLORS.white};
          text-decoration: none;
        }

        .btn-outline-modern {
          border: 2px solid ${COLORS.color2};
          color: ${COLORS.color3};
          background: transparent;
          border-radius: 50px;
          padding: 1.2rem 2.5rem;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-outline-modern:hover {
          background: ${COLORS.color2};
          color: ${COLORS.white};
          transform: translateY(-2px);
          text-decoration: none;
        }

        .hero-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 16px;
        }

        .stats-card-mini {
          background: ${COLORS.white};
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 8px 24px rgba(51, 107, 115, 0.08);
          border: 2px solid ${COLORS.color1};
          transition: all 0.3s ease;
        }

        .stats-card-mini:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(51, 107, 115, 0.12);
        }

        .stats-number-mini {
          font-size: 2rem;
          font-weight: 900;
          color: ${COLORS.color3};
          margin-bottom: 0.5rem;
          display: block;
        }

        .stats-label-mini {
          color: ${COLORS.textLight};
          font-weight: 600;
          font-size: 0.85rem;
        }

        .cta-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta-white {
          background: ${COLORS.white};
          color: ${COLORS.color3};
          border: none;
          border-radius: 50px;
          padding: 1rem 2rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
        }

        .btn-cta-white:hover {
          transform: translateY(-2px);
          color: ${COLORS.color3};
          text-decoration: none;
          box-shadow: 0 12px 32px rgba(255, 255, 255, 0.3);
        }

        .btn-cta-outline {
          background: transparent;
          color: ${COLORS.white};
          border: 2px solid ${COLORS.white};
          border-radius: 50px;
          padding: 1rem 2rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-cta-outline:hover {
          background: ${COLORS.white};
          color: ${COLORS.color3};
          transform: translateY(-2px);
          text-decoration: none;
        }

        .loading-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: ${COLORS.background};
          border-radius: 16px;
          border: 1px solid ${COLORS.color1};
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid ${COLORS.color1};
          border-radius: 50%;
          border-top-color: ${COLORS.color2};
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .trust-badges {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
          padding: 1.5rem;
          background: ${COLORS.background};
          border-radius: 20px;
          border: 1px solid ${COLORS.color1};
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: ${COLORS.color3};
        }

        .trust-icon {
          font-size: 1.1rem;
          color: ${COLORS.color2};
        }

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, ${COLORS.color2}, ${COLORS.color1}, ${COLORS.color2}, transparent);
          margin: 4rem 0;
          border-radius: 1px;
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto;
            gap: 2rem;
          }

          .hero-main-content {
            grid-column: 1;
            grid-row: 1;
            padding: 3rem 2rem;
          }

          .hero-image-card {
            grid-column: 1;
            grid-row: 2;
            transform: none;
          }

          .hero-stats-grid {
            grid-column: 1;
            grid-row: 3;
            transform: none;
          }

          .hero-cta-card {
            grid-column: 1;
            grid-row: 4;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .hero-features {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-main-content {
            padding: 2rem 1.5rem;
          }

          .cta-title {
            font-size: 1.6rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .trust-badges {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .hero-section {
            padding: 2rem 0;
          }

          .btn-primary-modern,
          .btn-outline-modern {
            width: 100%;
            justify-content: center;
            margin-right: 0;
            margin-bottom: 1rem;
          }

          .hero-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div
                style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    background: COLORS.background,
                    color: COLORS.text,
                    minHeight: "100vh",
                }}
            >
                {/* Hero Section với bố cục mới */}
                <section className="hero-section">
                    <div className="floating-elements">
                        <div className="floating-circle circle-1"></div>
                        <div className="floating-circle circle-2"></div>
                        <div className="floating-circle circle-3"></div>
                    </div>

                    <div className="container-fluid px-4">
                        <div className="row justify-content-center">
                            <div className="col-12 col-xl-11">
                                <div className="hero-grid">
                                    {/* Main Content Card */}
                                    <div className="hero-main-content">
                                        {loading && (
                                            <div className="loading-container">
                                                <div className="loading-spinner"></div>
                                                <span style={{ color: COLORS.textLight, fontWeight: "600" }}>Đang tải nội dung...</span>
                                            </div>
                                        )}

                                        <h1 className="hero-title">{message}</h1>

                                        <p className="hero-subtitle">
                                            Phương pháp cai thuốc lá hiệu quả nhất Việt Nam. Được hơn 2,500 người tin tưởng và thành công.
                                        </p>

                                        {/* Feature Grid */}
                                        <div className="hero-features">
                                            <div className="feature-item">
                                                <div className="feature-icon">🎯</div>
                                                <div className="feature-text">Phương pháp khoa học</div>
                                            </div>
                                            <div className="feature-item">
                                                <div className="feature-icon">🏆</div>
                                                <div className="feature-text">Tỷ lệ thành công 95%</div>
                                            </div>
                                            <div className="feature-item">
                                                <div className="feature-icon">🤝</div>
                                                <div className="feature-text">Hỗ trợ 24/7</div>
                                            </div>
                                            <div className="feature-item">
                                                <div className="feature-icon">💚</div>
                                                <div className="feature-text">An toàn tuyệt đối</div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
                                            <a href="#gioithieu" className="btn-primary-modern">
                                                <i className="fas fa-rocket"></i>
                                                Bắt đầu ngay
                                            </a>
                                            <a href="#lienhe" className="btn-outline-modern">
                                                <i className="fas fa-phone"></i>
                                                Tư vấn miễn phí
                                            </a>
                                        </div>

                                        {/* Trust Badges */}
                                        <div className="trust-badges">
                                            <div className="trust-badge">
                                                <i className="fas fa-star trust-icon"></i>
                                                4.9/5 đánh giá
                                            </div>
                                            <div className="trust-badge">
                                                <i className="fas fa-shield-alt trust-icon"></i>
                                                Chứng nhận Y tế
                                            </div>
                                            <div className="trust-badge">
                                                <i className="fas fa-award trust-icon"></i>
                                                Top 1 Việt Nam
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Card */}
                                    <div className="hero-image-card">
                                        <img
                                            src="https://png.pngtree.com/thumb_back/fh260/background/20240720/pngtree-take-deep-breaths-reminder-note-image_15902731.jpg"
                                            alt="Quit Smoking Support"
                                            className="hero-image"
                                        />
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="hero-stats-grid">
                                        <div className="stats-card-mini">
                                            <span className="stats-number-mini">2,500+</span>
                                            <div className="stats-label-mini">Thành công</div>
                                        </div>
                                        <div className="stats-card-mini">
                                            <span className="stats-number-mini">95%</span>
                                            <div className="stats-label-mini">Hiệu quả</div>
                                        </div>
                                        <div className="stats-card-mini">
                                            <span className="stats-number-mini">24/7</span>
                                            <div className="stats-label-mini">Hỗ trợ</div>
                                        </div>
                                        <div className="stats-card-mini">
                                            <span className="stats-number-mini">5+</span>
                                            <div className="stats-label-mini">Năm KN</div>
                                        </div>
                                    </div>

                                    {/* CTA Card */}
                                    <div className="hero-cta-card">
                                        <h2 className="cta-title">Sẵn sàng thay đổi cuộc sống?</h2>
                                        <p className="cta-subtitle">
                                            Tham gia cùng hàng nghìn người đã thành công cai thuốc lá với phương pháp của chúng tôi
                                        </p>
                                        <div className="cta-buttons">
                                            <a href="#membership" className="btn-cta-white">
                                                <i className="fas fa-crown me-2"></i>
                                                Xem gói thành viên
                                            </a>
                                            <a href="#coach" className="btn-cta-outline">
                                                <i className="fas fa-comments me-2"></i>
                                                Tư vấn ngay
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Divider */}
                <div className="container">
                    <div className="section-divider"></div>
                </div>

                {/* Main Content Sections */}
                <div style={{ background: COLORS.background }}>
                    <IntroSection />
                    <RoadmapSection />
                    <ExpertSection />
                    <FeedbackSection />
                    <MembershipPackage />
                </div>

                <Footer />
            </div>
        </>
    )
}
