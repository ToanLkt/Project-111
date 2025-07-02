"use client"

import { useState, useRef, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"

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
    success: "#10B981",
    warning: "#F59E0B",
}

export default function Coach() {
    const [messages, setMessages] = useState([
        { from: "coach", text: "Chào bạn! Tôi là Coach. Bạn cần hỗ trợ gì hôm nay?" },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg = { from: "user", text: input }
        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setLoading(true)

        // Gọi API OpenAI
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer sk......", // Thay bằng API key thật
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "Bạn là một coach hỗ trợ bỏ thuốc lá, trả lời ngắn gọn, thân thiện, dễ hiểu." },
                        ...messages.map((m) => ({
                            role: m.from === "user" ? "user" : "assistant",
                            content: m.text,
                        })),
                        { role: "user", content: input },
                    ],
                    max_tokens: 200,
                    temperature: 0.7,
                }),
            })

            const data = await response.json()
            const aiText = data.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa trả lời được."
            setMessages((prev) => [...prev, { from: "coach", text: aiText }])
        } catch (err) {
            setMessages((prev) => [...prev, { from: "coach", text: "Có lỗi xảy ra, vui lòng thử lại sau." }])
        }

        setLoading(false)
    }

    useEffect(() => {
        // Chỉ nhúng 1 lần
        if (document.getElementById("tawkto-script")) return

        const s1 = document.createElement("script")
        s1.id = "tawkto-script"
        s1.async = true
        s1.src = "https://embed.tawk.to/6851314053810b190ffa3974/1ituigpc0"
        s1.charset = "UTF-8"
        s1.setAttribute("crossorigin", "*")
        document.body.appendChild(s1)
    }, [])

    return (
        <>
            <style jsx>{`
        .coach-container {
          min-height: 100vh;
          background: ${COLORS.background};
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          color: ${COLORS.text};
          padding: 2rem 1rem;
        }

        .chat-window {
          background: ${COLORS.white};
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          width: 420px;
          max-width: 95vw;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
        }

        .chat-window::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${COLORS.gradient};
          z-index: 1;
        }

        .chat-header {
          background: ${COLORS.gradientLight};
          color: ${COLORS.color3};
          border-radius: 24px 24px 0 0;
          padding: 1.5rem;
          font-weight: 700;
          font-size: 1.2rem;
          text-align: center;
          letter-spacing: 0.5px;
          border-bottom: 1px solid ${COLORS.color1};
          position: relative;
          z-index: 2;
        }

        .chat-header::before {
          content: '🤖';
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
        }

        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: ${COLORS.white};
          max-height: 400px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: ${COLORS.background};
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: ${COLORS.color1};
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.color2};
        }

        .message {
          max-width: 85%;
          padding: 1rem 1.2rem;
          border-radius: 20px;
          font-size: 1rem;
          line-height: 1.5;
          position: relative;
          word-wrap: break-word;
        }

        .message-user {
          align-self: flex-end;
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border-bottom-right-radius: 6px;
          box-shadow: 0 4px 12px rgba(106, 183, 197, 0.2);
        }

        .message-coach {
          align-self: flex-start;
          background: ${COLORS.background};
          color: ${COLORS.text};
          border: 1px solid ${COLORS.color1};
          border-bottom-left-radius: 6px;
          box-shadow: 0 2px 8px rgba(51, 107, 115, 0.05);
        }

        .message-coach::before {
          content: '🤖';
          position: absolute;
          left: -8px;
          top: -8px;
          background: ${COLORS.color1};
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          border: 2px solid ${COLORS.white};
        }

        .typing-indicator {
          align-self: flex-start;
          color: ${COLORS.color2};
          font-style: italic;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .typing-dots {
          display: flex;
          gap: 3px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: ${COLORS.color2};
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-input-form {
          display: flex;
          border-top: 1px solid ${COLORS.color1};
          padding: 1rem;
          gap: 0.75rem;
          background: ${COLORS.background};
          border-radius: 0 0 24px 24px;
        }

        .chat-input {
          flex: 1;
          border: 1px solid ${COLORS.color1};
          border-radius: 12px;
          padding: 0.8rem 1rem;
          font-size: 1rem;
          background: ${COLORS.white};
          color: ${COLORS.text};
          outline: none;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          border-color: ${COLORS.color2};
          box-shadow: 0 0 0 3px rgba(106, 183, 197, 0.1);
        }

        .chat-input:disabled {
          background: #F9FAFB;
          color: ${COLORS.textLight};
          cursor: not-allowed;
        }

        .send-button {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border: none;
          border-radius: 12px;
          padding: 0.8rem 1.5rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(106, 183, 197, 0.2);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(106, 183, 197, 0.3);
        }

        .send-button:disabled {
          background: #E5E7EB;
          color: #9CA3AF;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .quick-actions {
          padding: 1rem;
          border-top: 1px solid ${COLORS.color1};
          background: ${COLORS.background};
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .quick-action-btn {
          background: ${COLORS.white};
          border: 1px solid ${COLORS.color1};
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          color: ${COLORS.color3};
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
          background: ${COLORS.color1};
          border-color: ${COLORS.color2};
        }

        @media (max-width: 768px) {
          .coach-container {
            padding: 1rem 0.5rem;
          }

          .chat-window {
            width: 100%;
            min-height: 80vh;
            border-radius: 20px;
          }

          .chat-header {
            padding: 1.2rem;
            font-size: 1.1rem;
            border-radius: 20px 20px 0 0;
          }

          .chat-messages {
            padding: 1rem;
          }

          .message {
            max-width: 90%;
            padding: 0.8rem 1rem;
          }

          .chat-input-form {
            padding: 0.8rem;
          }

          .quick-actions {
            padding: 0.8rem;
          }
        }

        @media (max-width: 576px) {
          .chat-window {
            border-radius: 16px;
          }

          .chat-header {
            border-radius: 16px 16px 0 0;
          }

          .message {
            font-size: 0.95rem;
          }

          .send-button {
            padding: 0.8rem 1.2rem;
          }
        }
      `}</style>

            <div className="coach-container">
                <div className="chat-window">
                    <div className="chat-header">Coach hỗ trợ cai thuốc</div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.from === "user" ? "message-user" : "message-coach"}`}>
                                {msg.text}
                            </div>
                        ))}

                        {loading && (
                            <div className="typing-indicator">
                                <span>Coach đang trả lời</span>
                                <div className="typing-dots">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button className="quick-action-btn" onClick={() => setInput("Tôi muốn bỏ thuốc lá")}>
                            💪 Bỏ thuốc lá
                        </button>
                        <button className="quick-action-btn" onClick={() => setInput("Làm sao để vượt qua cơn thèm?")}>
                            🧠 Vượt qua cơn thèm
                        </button>
                        <button className="quick-action-btn" onClick={() => setInput("Tôi cần động lực")}>
                            ⚡ Động lực
                        </button>
                    </div>

                    <form onSubmit={handleSend} className="chat-input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn của bạn..."
                            className="chat-input"
                            disabled={loading}
                        />
                        <button type="submit" className="send-button" disabled={loading || !input.trim()}>
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang gửi
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    Gửi
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
