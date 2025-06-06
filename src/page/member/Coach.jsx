import React, { useState, useRef, useEffect } from "react";

export default function Coach() {
    const [messages, setMessages] = useState([
        { from: "coach", text: "Chào bạn! Tôi là Coach. Bạn cần hỗ trợ gì hôm nay?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { from: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Gọi API OpenAI
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer sk......" // Thay bằng API key thật
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "Bạn là một coach hỗ trợ bỏ thuốc lá, trả lời ngắn gọn, thân thiện, dễ hiểu." },
                        ...messages.map(m => ({
                            role: m.from === "user" ? "user" : "assistant",
                            content: m.text
                        })),
                        { role: "user", content: input }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });
            const data = await response.json();
            const aiText = data.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa trả lời được.";
            setMessages(prev => [...prev, { from: "coach", text: aiText }]);
        } catch (err) {
            setMessages(prev => [...prev, { from: "coach", text: "Có lỗi xảy ra, vui lòng thử lại sau." }]);
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f7f7fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#222"
        }}>
            <div style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(44,130,201,0.07)",
                width: 400,
                maxWidth: "95vw",
                minHeight: 520,
                display: "flex",
                flexDirection: "column",
                border: "1.5px solid #f3d46e"
            }}>
                <div style={{
                    background: "#fffbe8",
                    color: "#bfa917",
                    borderRadius: "16px 16px 0 0",
                    padding: "1.1rem",
                    fontWeight: 800,
                    fontSize: "1.18rem",
                    textAlign: "center",
                    letterSpacing: 0.5,
                    borderBottom: "1.5px solid #f3d46e"
                }}>
                    Coach hỗ trợ cai thuốc
                </div>
                <div style={{
                    flex: 1,
                    padding: "1.1rem",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    background: "#fff"
                }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                                background: msg.from === "user" ? "#fffbe8" : "#f7f7fa",
                                color: "#222",
                                borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                padding: "0.7rem 1rem",
                                maxWidth: "80%",
                                fontSize: "1rem",
                                boxShadow: "0 1px 4px rgba(243,212,110,0.07)",
                                border: msg.from === "user" ? "1.5px solid #f3d46e" : "1.5px solid #eee"
                            }}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div style={{
                            alignSelf: "flex-start",
                            color: "#bfa917",
                            fontStyle: "italic",
                            fontSize: "1rem"
                        }}>
                            Coach đang trả lời...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <form
                    onSubmit={handleSend}
                    style={{
                        display: "flex",
                        borderTop: "1.5px solid #f3d46e",
                        padding: "0.7rem",
                        gap: 8,
                        background: "#fffbe8",
                        borderRadius: "0 0 16px 16px"
                    }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        style={{
                            flex: 1,
                            border: "1.5px solid #f3d46e",
                            borderRadius: 8,
                            padding: "0.6rem",
                            fontSize: "1rem",
                            background: "#fff",
                            color: "#222",
                            outline: "none",
                            transition: "border-color 0.3s"
                        }}
                        onFocus={e => (e.target.style.borderColor = "#bfa917")}
                        onBlur={e => (e.target.style.borderColor = "#f3d46e")}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        style={{
                            background: "linear-gradient(90deg, #f3d46e 60%, #bfa917 100%)",
                            color: "#222",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.6rem 1.2rem",
                            fontWeight: 700,
                            fontSize: "1rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 8px rgba(191,169,23,0.10)",
                            transition: "background 0.3s"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#bfa917")}
                        onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg, #f3d46e 60%, #bfa917 100%)")}
                        disabled={loading}
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}
