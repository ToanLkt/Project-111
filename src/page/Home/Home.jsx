import React, { useEffect, useState } from "react";
import IntroSection from "../../components/IntroSection";
import RoadmapSection from "../../components/RoadmapSection";
import ExpertSection from "../../components/NewSection";
import FeedbackSection from "../../components/FeedbackSection";
import Footer from "../../components/Footer";
import MembershipPackage from "../../components/MembershipPackage";

export default function Home() {
  const [message, setMessage] = useState("Từng Khoảnh Khắc, Một Hơi Thở Tự Do");

  useEffect(() => {
    // fetch("https://localhost:7133/api/Platform/info")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data && data.message) setMessage(data.message);
    //   })
    //   .catch(() => setMessage("Từng Khoảnh Khắc, Một Hơi Thở Tự Do"));
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
        minHeight: "100vh",
        background: "#F2EFE7",
        color: "#006A71",
      }}
    >
      {/* Hero Section */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4rem 8%",
          background: "linear-gradient(90deg, #F2EFE7 60%, #9ACBD0 100%)",
          position: "relative",
        }}
      >
        {/* Left Text Section */}
        <div style={{ maxWidth: "50%", zIndex: 2 }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 700, marginBottom: "1rem", color: "#006A71" }}>
            {message}
          </h1>

          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              href="#gioithieu"
              style={{
                padding: "0.8rem 1.5rem",
                border: "2px solid #48A6A7",
                color: "#fff",
                background: "#48A6A7",
                borderRadius: "30px",
                fontWeight: "bold",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#006A71";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#48A6A7";
                e.currentTarget.style.color = "#fff";
              }}
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>

        {/* Right Image Section */}
        <div style={{ width: "45%", zIndex: 2 }}>
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20240720/pngtree-take-deep-breaths-reminder-note-image_15902731.jpg"
            alt="Quit Smoking Support"
            style={{
              width: "100%",
              borderRadius: "20px",
              opacity: 0.95,
              boxShadow: "0 4px 16px rgba(0, 106, 113, 0.13)"
            }}
          />
        </div>

        {/* Background Decor */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('https://wallpaperaccess.com/full/415986.jpg')",
            opacity: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        ></div>
      </header>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          margin: "2rem 0",
          flexWrap: "wrap",
          fontSize: "1.1rem",
          background: "#E6F4F4",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(72,166,167,0.08)",
          padding: "1rem 0",
        }}
      >
        {[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "#gioithieu" },
          { label: "Lộ trình", href: "#lo-trinh" },
          { label: "Tin tức", href: "#tin-tuc" },
          { label: "Liên hệ", href: "#lienhe" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              color: "#006A71",
              textDecoration: "none",
              fontWeight: "bold",
              padding: "0.5rem 1.2rem",
              borderRadius: "8px",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#9ACBD0";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#006A71";
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Content Sections */}
      <>
        <IntroSection />
        <RoadmapSection />
        <ExpertSection />
        <FeedbackSection />
        <MembershipPackage />
        <Footer />
      </>
    </div>
  );
}
