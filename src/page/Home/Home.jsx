import { useEffect, useState } from "react"
import IntroSection from "../../components/IntroSection"
import RoadmapSection from "../../components/RoadmapSection"
import ExpertSection from "../../components/NewSection"
import FeedbackSection from "../../components/FeedbackSection"
import Footer from "../../components/Footer"
import MembershipPackage from "../../components/MembershipPackage"

const COLORS = {
  background: "#F2EFE7",
  primary: "#9ACBD0",
  secondary: "#48A6A7",
  accent: "#006A71",
  text: "#006A71",
  white: "#fff",
  light: "#E6F4F4",
}

export default function Home() {
  const [message, setMessage] = useState("Từng Khoảnh Khắc, Một Hơi Thở Tự Do")

  useEffect(() => {
    fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Platform")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.message) setMessage(data.message)
      })
      .catch(() => setMessage("Từng Khoảnh Khắc, Một Hơi Thở Tự Do"))
  }, [])

  // const navigationItems = [
  //   { label: "Trang chủ", href: "/" },
  //   { label: "Giới thiệu", href: "#gioithieu" },
  //   { label: "Lộ trình", href: "#lo-trinh" },
  //   { label: "Tin tức", href: "#tin-tuc" },
  //   { label: "Liên hệ", href: "#lienhe" },
  // ]

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, Helvetica Neue, Roboto, Tahoma, sans-serif', minHeight: '100vh', background: COLORS.background, color: COLORS.text }}>
      {/* Hero Section */}
      <section style={{ width: '100%', minHeight: '70vh', background: COLORS.background, padding: '3rem 0', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${COLORS.primary}40, ${COLORS.secondary}20)`,
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${COLORS.secondary}30, ${COLORS.accent}10)`,
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          width: '100%',
          background: COLORS.white,
          borderRadius: '20px',
          boxShadow: '0 6px 32px rgba(72, 166, 167, 0.13)',
          border: `2px solid ${COLORS.primary}`,
          padding: '3rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '3rem',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left Content */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              marginBottom: '2rem',
              color: COLORS.accent,
              lineHeight: 1.2,
              letterSpacing: '1px',
              textShadow: '0 2px 8px rgba(154, 203, 208, 0.2)'
            }}>{message}</h1>
            <a href="#gioithieu" style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: `linear-gradient(90deg, ${COLORS.secondary} 60%, ${COLORS.accent} 100%)`,
              color: COLORS.white,
              border: 'none',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '1.1rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(72, 166, 167, 0.3)',
              letterSpacing: '0.5px'
            }}>Tìm hiểu thêm</a>
          </div>

          {/* Right Image */}
          <div style={{ flex: 1 }}>
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20240720/pngtree-take-deep-breaths-reminder-note-image_15902731.jpg"
              alt="Quit Smoking Support"
              style={{
                width: '100%',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(72, 166, 167, 0.2)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      {/* <section style={{ width: '100%', background: COLORS.background, padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          background: COLORS.white,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(72, 166, 167, 0.1)',
          border: `2px solid ${COLORS.primary}`,
          padding: '1.5rem 2rem',
        }}>
          <nav style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}>
            {/* {navigationItems.map((item) => (
              <a key={item.href} href={item.href} style={{
                color: COLORS.accent,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.background = `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`
                  e.currentTarget.style.color = COLORS.white
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = COLORS.accent
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                {item.label}
              </a>
            ))} */}
      {/* </nav> */}
      {/* </div> */}
      {/* </section> */}

      {/* Full-width Components */}
      {/* <IntroSection /> */}
      <div style={{ width: '100%', background: COLORS.background, padding: '0.5rem 0' }}>
        <RoadmapSection />
        <ExpertSection />
        <FeedbackSection />
        <MembershipPackage />
      </div>

      <Footer />
    </div>
  )
}
