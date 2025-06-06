import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Background image overlay */}
      <div
        style={{
          backgroundImage:
            "url('https://www.statnews.com/wp-content/uploads/2023/01/AdobeStock_562452567-768x432.jpeg')",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.3,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ zIndex: 1, maxWidth: "600px" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "1rem" }}>404</h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Không tìm thấy trang</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          Có vẻ như bạn đã lạc đường trên hành trình bỏ thuốc. Hãy quay về trang chủ và tiếp tục nhé!
        </p>
        <Link
          to="/"
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: "#d4af37",
            color: "#000",
            borderRadius: "30px",
            fontWeight: "bold",
            textDecoration: "none",
            transition: "background 0.3s ease",
          }}
        >
          Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
}
