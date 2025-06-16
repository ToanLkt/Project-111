import React from "react";

export default function Footer() {
    return (
        <footer
            id="lienhe"
            style={{
                marginTop: "2rem",
                color: "#006A71",
                padding: "2.5rem 0 1rem 0",
                background: "#F2EFE7",
                borderTop: "1px solid #9ACBD0",
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "2.5rem",
                    padding: "0 2rem",
                }}
            >
                {/* Logo & Slogan */}
                <div style={{ flex: "1 1 260px", minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="Logo"
                            style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "2px solid #48A6A7" }}
                        />
                        <span
                            style={{
                                color: "#006A71",
                                fontWeight: "bold",
                                fontSize: "1.3rem",
                                letterSpacing: 1,
                            }}
                        >
                            Cai Nghiện Thuốc Lá
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#48A6A7" }}>
                        Nền tảng hỗ trợ cộng đồng bỏ thuốc lá, cung cấp tài liệu, chuyên gia và các công cụ theo dõi tiến trình.
                    </p>
                    <div style={{ marginTop: 12, fontSize: "0.97rem", color: "#48A6A7" }}>
                        <span style={{ fontWeight: 500 }}>Giờ làm việc:</span> 8:00 - 21:00 (T2 - CN)
                    </div>
                </div>

                {/* Contact */}
                <div style={{ flex: "1 1 180px", minWidth: 180 }}>
                    <h5 style={{ color: "#006A71", marginBottom: 10, fontWeight: 700 }}>Liên hệ</h5>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#48A6A7" }}>
                        <span style={{ fontWeight: 500 }}>Email:</span>{" "}
                        <a
                            href="mailto:hotro@cainghienthuocla.vn"
                            style={{ color: "#48A6A7", textDecoration: "none", fontWeight: 600 }}
                        >
                            hotro@cainghienthuocla.vn
                        </a>
                        <br />
                        <span style={{ fontWeight: 500 }}>Điện thoại:</span> 0123 456 789
                        <br />
                        <span style={{ fontWeight: 500 }}>Địa chỉ:</span> 123 Đường Sức Khỏe, Quận 1, TP.HCM
                    </p>
                    <div style={{ marginTop: 10 }}>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: 12 }}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                                alt="fb"
                                width={22}
                                style={{ filter: "none" }}
                            />
                        </a>
                        <a
                            href="https://zalo.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: 12 }}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/5968/5968841.png"
                                alt="zalo"
                                width={22}
                                style={{ filter: "none" }}
                            />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                                alt="yt"
                                width={22}
                                style={{ filter: "none" }}
                            />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div style={{ flex: "1 1 140px", minWidth: 140 }}>
                    <h5 style={{ color: "#006A71", marginBottom: 10, fontWeight: 700 }}>Liên kết nhanh</h5>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "1rem" }}>
                        <li style={{ marginBottom: 8 }}>
                            <a href="/" style={linkStyle}>
                                Trang chủ
                            </a>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <a href="#gioithieu" style={linkStyle}>
                                Giới thiệu
                            </a>
                        </li>
                        <li style={{ marginBottom: 8 }}>
                            <a href="#lienhe" style={linkStyle}>
                                Liên hệ
                            </a>
                        </li>
                        <li>
                            <a href="#chuyen-gia" style={linkStyle}>
                                Hỗ trợ
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div style={{ flex: "1 1 220px", minWidth: 200 }}>
                    <h5 style={{ color: "#006A71", marginBottom: 10, fontWeight: 700 }}>Nhận tin mới</h5>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            style={{
                                padding: "0.5rem",
                                borderRadius: 6,
                                border: "1px solid #9ACBD0",
                                outline: "none",
                                fontSize: "1rem",
                                color: "#006A71",
                                background: "#fff",
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "0.5rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "#006A71"}
                            onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)"}
                        >
                            Đăng ký nhận tin
                        </button>
                    </form>
                    <div style={{ fontSize: "0.95rem", color: "#48A6A7", marginTop: 8 }}>
                        Nhận thông tin, tài liệu và ưu đãi mới nhất từ chúng tôi.
                    </div>
                </div>
            </div>
            <div style={{ marginTop: "2.5rem", fontSize: "0.97rem", color: "#48A6A7", textAlign: "center" }}>
                &copy; {new Date().getFullYear()} Cai Nghiện Thuốc Lá. All rights reserved.
            </div>
        </footer>
    );
}

const linkStyle = {
    color: "#48A6A7",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "color 0.2s",
};

