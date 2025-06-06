import React from 'react';

export default function MembershipPackage() {
    const packages = [
        {
            name: "Basic",
            price: "Free 1 month",
            features: ["✔️ Documentation", "✔️ Community Access"],
        },
        {
            name: "Pro",
            price: "199.000đ/month",
            features: [
                "✔️ All basic features",
                "✔️ Expert consultation",
                "✔️ Personalized roadmap"
            ],
        },
        {
            name: "Plus",
            price: "299.000đ/month",
            features: [
                "✔️ All advanced features",
                "✔️ 24/7 Support",
                "✔️ Personal progress tracking"
            ],
        }
    ];

    return (
        <section style={{
            maxWidth: "1100px",
            margin: "3rem auto",
            padding: "2.5rem",
            background: "rgba(17,17,17,0.9)",
            borderRadius: "20px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            backdropFilter: "blur(6px)",
            position: "relative"
        }}>
            <h2 style={{
                textAlign: "center",
                color: "#d4af37",
                fontWeight: 800,
                fontSize: "2.2rem",
                marginBottom: "2.5rem"
            }}>
                Các Gói Đăng Ký
            </h2>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap"
            }}>
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#1a1a1a",
                            padding: "2rem 1.5rem",
                            borderRadius: "16px",
                            border: "1px solid rgba(212,175,55,0.2)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                            width: "320px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            transition: "transform 0.4s ease, box-shadow 0.4s ease",
                        }}
                        className="package-card"
                    >
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                color: "#d4af37",
                                marginBottom: 10
                            }}>
                                {pkg.name}
                            </h3>
                            <p style={{ fontSize: "1.1rem", color: "#fff", marginBottom: 18 }}>
                                {pkg.price}
                            </p>
                            <ul style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                color: "rgba(255,255,255,0.85)",
                                fontSize: "1.05rem",
                                textAlign: "left",
                                display: "inline-block",
                                lineHeight: 1.6
                            }}>
                                {pkg.features.map((feature, i) => (
                                    <li key={i} style={{ marginBottom: 8 }}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <button style={{
                            marginTop: "1.5rem",
                            background: "linear-gradient(135deg, #f8d777, #d4af37)",
                            color: "#111",
                            border: "none",
                            padding: "0.75rem 2.2rem",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "1.05rem",
                            fontWeight: 600,
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            boxShadow: "0 4px 12px rgba(212,175,55,0.3)"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 16px rgba(212,175,55,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,175,55,0.3)";
                            }}
                        >
                            Đăng ký
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
