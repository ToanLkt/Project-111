import React from "react";

export default function IntroSection() {
  return (
    <section
      id="gioithieu"
      style={{
        maxWidth: "1100px",
        margin: "3rem auto",
        background: "rgba(17, 17, 17, 0.8)",
        padding: "3rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        display: "flex",
        gap: "3rem",
        alignItems: "center",
        flexWrap: "wrap",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        backdropFilter: "blur(8px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: "absolute",
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)",
        zIndex: 0
      }}></div>

      <div style={{
        flex: 1,
        minWidth: 300,
        position: "relative",
        zIndex: 1
      }}>
        <h2 style={{
          color: "#d4af37",
          fontWeight: 800,
          marginBottom: "1.5rem",
          fontSize: "2.2rem",
          letterSpacing: "0.5px",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>
          Hành Trình Bỏ Thuốc Của Bạn Bắt Đầu Tại Đây
        </h2>

        <p style={{
          fontSize: "1.1rem",
          lineHeight: "1.7",
          marginBottom: "1.5rem",
          color: "rgba(255,255,255,0.9)"
        }}>
          Chúng tôi không chỉ giúp bạn từ bỏ thuốc lá, mà còn đồng hành cùng bạn xây dựng
          một lối sống lành mạnh. Với hệ thống hỗ trợ toàn diện từ chuyên gia, cộng đồng
          và các công cụ theo dõi khoa học, hành trình bỏ thuốc của bạn sẽ nhẹ nhàng
          và hiệu quả hơn bao giờ hết.
        </p>

        <ul style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: "1.05rem",
          marginLeft: "1rem",
          lineHeight: "1.8",
          paddingLeft: "1rem"
        }}>
          <li style={{
            position: "relative",
            paddingLeft: "1.5rem",
            marginBottom: "0.8rem"
          }}>
            <span style={{
              position: "absolute",
              left: 0,
              color: "#d4af37",
              fontWeight: "bold"
            }}></span>
            Hệ thống theo dõi tiến trình thông minh
          </li>
          <li style={{
            position: "relative",
            paddingLeft: "1.5rem",
            marginBottom: "0.8rem"
          }}>
            <span style={{
              position: "absolute",
              left: 0,
              color: "#d4af37",
              fontWeight: "bold"
            }}></span>
            Đội ngũ chuyên gia tận tâm 24/7
          </li>
          <li style={{
            position: "relative",
            paddingLeft: "1.5rem",
            marginBottom: "0.8rem"
          }}>
            <span style={{
              position: "absolute",
              left: 0,
              color: "#d4af37",
              fontWeight: "bold"
            }}></span>
            Cộng đồng hỗ trợ đông đảo, thấu hiểu
          </li>
          <li style={{
            position: "relative",
            paddingLeft: "1.5rem",
            marginBottom: "0.8rem"
          }}>
            <span style={{
              position: "absolute",
              left: 0,
              color: "#d4af37",
              fontWeight: "bold"
            }}></span>
            Tài liệu và phương pháp khoa học được kiểm chứng
          </li>
        </ul>
      </div>

      <div style={{
        flex: 1,
        minWidth: 300,
        textAlign: "center",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
          border: "1px solid rgba(212, 175, 55, 0.2)"
        }}>
          <img
            src="https://vsh.org.vn/pic/News/images/d11re.jpg"
            alt="No Smoking"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              transition: "transform 0.3s ease"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>
        <p style={{
          marginTop: "1.5rem",
          color: "rgba(255,255,255,0.7)",
          fontStyle: "italic",
          fontSize: "0.95rem"
        }}>
          "Mỗi điếu thuốc bạn không hút là một món quà cho sức khỏe của chính mình"
        </p>
      </div>
    </section>
  );
}