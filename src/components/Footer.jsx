"use client"

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
  accent: "#10B981",
  warning: "#F59E0B",
}

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .footer-section {
          background: ${COLORS.background};
          position: relative;
          overflow: hidden;
          padding: 4rem 0 2rem 0;
          margin-top: 4rem;
        }

        .footer-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, ${COLORS.color1}40 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${COLORS.color2}30 0%, transparent 50%);
          z-index: 1;
        }

        .footer-content {
          position: relative;
          z-index: 2;
        }

        .footer-main-card {
          background: ${COLORS.white};
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 
            0 32px 64px rgba(51, 107, 115, 0.08),
            0 16px 32px rgba(51, 107, 115, 0.04);
          border: 2px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .footer-main-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: ${COLORS.gradient};
          border-radius: 32px 32px 0 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2.5fr 1.5fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .footer-brand-section {
          position: relative;
        }

        .footer-logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .footer-logo {
          width: 60px;
          height: 60px;
          background: ${COLORS.gradient};
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.2);
          border: 3px solid ${COLORS.color1};
          transition: all 0.3s ease;
        }

        .footer-logo:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(106, 183, 197, 0.3);
        }

        .footer-logo img {
          width: 32px;
          height: 32px;
          border-radius: 12px;
          filter: brightness(1.2);
        }

        .footer-brand-name {
          font-size: 1.4rem;
          font-weight: 900;
          background: ${COLORS.gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .footer-description {
          color: ${COLORS.text};
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .footer-hours {
          background: ${COLORS.background};
          border-radius: 16px;
          padding: 1rem 1.5rem;
          border: 1px solid ${COLORS.color1};
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .footer-hours-icon {
          width: 40px;
          height: 40px;
          background: ${COLORS.gradientLight};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .footer-hours-text {
          color: ${COLORS.color3};
          font-weight: 600;
          font-size: 0.95rem;
        }

        .footer-social-links {
          display: flex;
          gap: 1rem;
        }

        .footer-social-link {
          width: 48px;
          height: 48px;
          background: ${COLORS.white};
          border: 2px solid ${COLORS.color1};
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(51, 107, 115, 0.08);
        }

        .footer-social-link:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(51, 107, 115, 0.15);
        }

        .footer-social-link img {
          width: 24px;
          height: 24px;
          transition: all 0.3s ease;
        }

        .footer-section-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: ${COLORS.color3};
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 3px;
          background: ${COLORS.gradient};
          border-radius: 2px;
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          margin-bottom: 1rem;
          padding: 0.8rem;
          background: ${COLORS.background};
          border-radius: 12px;
          border: 1px solid ${COLORS.color1};
          transition: all 0.3s ease;
        }

        .footer-contact-item:hover {
          background: ${COLORS.color1};
          transform: translateX(4px);
        }

        .footer-contact-icon {
          width: 32px;
          height: 32px;
          background: ${COLORS.gradientLight};
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .footer-contact-text {
          color: ${COLORS.text};
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .footer-contact-label {
          font-weight: 700;
          color: ${COLORS.color3};
          display: block;
          margin-bottom: 0.2rem;
        }

        .footer-contact-link {
          color: ${COLORS.color2};
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .footer-contact-link:hover {
          color: ${COLORS.color3};
          text-decoration: underline;
        }

        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-nav-item {
          margin-bottom: 0.8rem;
        }

        .footer-nav-link {
          color: ${COLORS.text};
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.8rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .footer-nav-link:hover {
          background: ${COLORS.color1};
          color: ${COLORS.color3};
          transform: translateX(4px);
          text-decoration: none;
          border-color: ${COLORS.color2};
        }

        .footer-nav-icon {
          font-size: 0.9rem;
          color: ${COLORS.color2};
        }

        .footer-newsletter {
          background: ${COLORS.background};
          border-radius: 20px;
          padding: 1.5rem;
          border: 2px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
        }

        .footer-newsletter::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradientLight};
        }

        .footer-newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .footer-newsletter-input {
          padding: 1rem 1.2rem;
          border: 2px solid ${COLORS.color1};
          border-radius: 16px;
          outline: none;
          font-size: 1rem;
          color: ${COLORS.text};
          background: ${COLORS.white};
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .footer-newsletter-input:focus {
          border-color: ${COLORS.color2};
          box-shadow: 0 0 0 3px rgba(106, 183, 197, 0.1);
          background: ${COLORS.white};
        }

        .footer-newsletter-input::placeholder {
          color: ${COLORS.textLight};
          font-weight: 400;
        }

        .footer-newsletter-btn {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border: none;
          border-radius: 16px;
          padding: 1rem 1.5rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .footer-newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(106, 183, 197, 0.3);
        }

        .footer-newsletter-desc {
          color: ${COLORS.textLight};
          font-size: 0.9rem;
          line-height: 1.4;
          font-weight: 500;
        }

        .footer-bottom {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          text-align: center;
          padding: 1.5rem 2rem;
          border-radius: 24px;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.2);
        }

        .footer-floating-decoration {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: ${COLORS.color1};
          opacity: 0.3;
          z-index: 0;
        }

        .decoration-1 {
          top: 20%;
          right: 10%;
        }

        .decoration-2 {
          bottom: 30%;
          left: 5%;
          background: ${COLORS.color2};
          opacity: 0.2;
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .footer-brand-section {
            grid-column: 1 / 3;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-brand-section {
            grid-column: 1;
          }

          .footer-main-card {
            padding: 2rem;
            border-radius: 24px;
          }

          .footer-section {
            padding: 3rem 0 2rem 0;
          }

          .footer-logo-container {
            justify-content: center;
            text-align: center;
          }

          .footer-social-links {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .footer-main-card {
            margin: 0 1rem;
            padding: 1.5rem;
          }

          .footer-logo {
            width: 50px;
            height: 50px;
          }

          .footer-logo img {
            width: 28px;
            height: 28px;
          }

          .footer-brand-name {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <footer id="lienhe" className="footer-section">
        <div className="footer-bg-pattern"></div>
        <div className="footer-floating-decoration decoration-1"></div>
        <div className="footer-floating-decoration decoration-2"></div>

        <div className="container footer-content">
          <div className="footer-main-card">
            <div className="footer-grid">
              {/* Brand Section */}
              <div className="footer-brand-section">
                <div className="footer-logo-container">
                  <div className="footer-logo">
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo" />
                  </div>
                  <div className="footer-brand-name">Cai Nghiện Thuốc Lá</div>
                </div>

                <p className="footer-description">
                  Nền tảng hỗ trợ cộng đồng bỏ thuốc lá hàng đầu Việt Nam. Cung cấp phương pháp khoa học, chuyên gia tận
                  tâm và công cụ theo dõi tiến trình hiệu quả.
                </p>

                <div className="footer-hours">
                  <div className="footer-hours-icon">🕒</div>
                  <div>
                    <div className="footer-hours-text">Giờ làm việc</div>
                    <div style={{ color: COLORS.textLight, fontSize: "0.9rem" }}>
                      7:00 - 11:00 / 13:00 - 17:00
                      <br />
                      (Thứ 2 - Thứ 7)</div>
                  </div>
                </div>


              </div>

              {/* Contact Section */}
              <div>
                <h5 className="footer-section-title">Liên hệ</h5>

                <div className="footer-contact-item">
                  <div className="footer-contact-icon">📧</div>
                  <div className="footer-contact-text">
                    <span className="footer-contact-label">Email</span>
                    <a href="mailto:smokingcessation0206@gmail.com" className="footer-contact-link">
                      smokingcessation0206@gmail.com
                    </a>
                  </div>
                </div>

                <div className="footer-contact-item">
                  <div className="footer-contact-icon">📞</div>
                  <div className="footer-contact-text">
                    <span className="footer-contact-label">Điện thoại</span>
                    <a href="tel:0345511085" className="footer-contact-link">
                      0345511085
                    </a>
                  </div>
                </div>

                <div className="footer-contact-item">
                  <div className="footer-contact-icon">📍</div>
                  <div className="footer-contact-text">
                    <span className="footer-contact-label">Địa chỉ</span>
                    S803. Vinhome Grand Park
                    <br />
                    Quận 9, TP.HCM
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h5 className="footer-section-title">Liên kết nhanh</h5>
                <ul className="footer-nav-list">
                  <li className="footer-nav-item">
                    <a href="/" className="footer-nav-link">
                      <i className="footer-nav-icon">🏠</i>
                      Trang chủ
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#gioithieu" className="footer-nav-link">
                      <i className="footer-nav-icon">📖</i>
                      Giới thiệu
                    </a>
                  </li>



                </ul>
              </div>


            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Cai Nghiện Thuốc Lá. All rights reserved. Made with ❤️ for a healthier
            Vietnam.
          </div>
        </div>
      </footer>
    </>
  )
}
