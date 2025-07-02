import { useEffect, useState } from "react"

export default function IntroSection() {
  const [about, setAbout] = useState("")

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
      }
    }
    fetchAbout()
  }, [])

  return (
    <>
      <style jsx>{`
        .intro-section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .intro-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
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
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .intro-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .intro-content {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #444;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 20%);
          padding: 2rem;
          border-radius: 15px;
          border-left: 4px solid #667eea;
        }

        .intro-icon {
          font-size: 4rem;
          text-align: center;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
          .intro-section {
            padding: 2rem 1rem;
          }

          .intro-container {
            padding: 2rem;
          }

          .intro-title {
            font-size: 2rem;
          }

          .intro-content {
            font-size: 1.1rem;
            padding: 1.5rem;
          }
        }
      `}</style>

      <section id="gioithieu" className="intro-section">
        <div className="intro-container">
          <div className="intro-icon">📖</div>
          <h2 className="intro-title">Giới thiệu</h2>
          <div className="intro-content">{about || "Đang tải thông tin..."}</div>
        </div>
      </section>
    </>
  )
}
