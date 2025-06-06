import React from "react";
import IntroSection from "../../components/IntroSection";
import RoadmapSection from "../../components/RoadmapSection";
import ExpertSection from "../../components/NewSection";
import FeedbackSection from "../../components/FeedbackSection";
import MembershipPackage from "../../components/MembershipPackage";
import Footer from "../../components/Footer";

export default function AdminPage() {
    return (
        <div
            style={{
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                minHeight: "100vh",
                background: "#000",
                color: "#fff",
            }}
        >
            {/* Hero Section */}
            <header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4rem 8%",
                    background: "#111",
                    position: "relative",
                }}
            >
                {/* Left Text Section */}
                <div style={{ maxWidth: "50%", zIndex: 2 }}>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: 700, marginBottom: "1rem" }}>
                        Từng Khoảnh Khắc, Một Hơi Thở Tự Do
                    </h1>
                    <p style={{ fontSize: "1.2rem", marginBottom: "2rem", lineHeight: 1.6 }}>
                        Trải nghiệm hành trình bỏ thuốc với chúng tôi - nhẹ nhàng, hiệu quả và đầy cảm hứng.
                    </p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <a
                            href="#gioithieu"
                            style={{
                                padding: "0.8rem 1.5rem",
                                border: "2px solid #fff",
                                color: "#fff",
                                borderRadius: "30px",
                                fontWeight: "bold",
                                textDecoration: "none",
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
                            opacity: 0.9,
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
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
                        backgroundImage:
                            "url('https://www.statnews.com/wp-content/uploads/2023/01/AdobeStock_562452567-768x432.jpeg')",
                        opacity: 0.5,
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
                            color: "#d4af37",
                            textDecoration: "none",
                            fontWeight: "bold",
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