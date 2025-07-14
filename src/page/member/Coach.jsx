"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { useSelector } from 'react-redux'
import AuthContext from '../../AuthContext/AuthContext'
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
  // Auth và user data
  const auth = useContext(AuthContext);
  const { user: reduxUser, token: reduxToken } = useSelector((state) => state.account || {});
  const token = reduxToken || auth?.token;
  const user = reduxUser || auth?.user;

  // Extract accountId từ user object
  const getAccountId = (userObj) => {
    if (!userObj) return null;

    // Try different possible properties
    if (userObj.accountId) return userObj.accountId;
    if (userObj.id) return userObj.id;
    if (userObj.userId) return userObj.userId;

    // Extract from JWT claims
    const nameIdentifier = userObj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    if (nameIdentifier) return parseInt(nameIdentifier);

    return null;
  };

  const accountId = getAccountId(user);

  console.log("🔍 User Debug Info:")
  console.log("Raw user object:", user)
  console.log("Extracted accountId:", accountId)
  console.log("Token available:", !!token)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(null)
  const [coaches, setCoaches] = useState([])
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [loadingCoaches, setLoadingCoaches] = useState(true)
  const chatEndRef = useRef(null)

  // Fetch coaches và conversation khi component mount
  useEffect(() => {
    fetchCoaches()
  }, [])

  // Fetch conversation khi chọn coach
  useEffect(() => {
    if (selectedCoach && accountId) {
      fetchConversationWithCoach(selectedCoach.accountId)
    }
  }, [selectedCoach, accountId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])  // Lấy cuộc hội thoại với coach
  const fetchConversationWithCoach = async (coachId) => {
    console.log("=== fetchConversationWithCoach Debug ===")
    console.log("Coach ID:", coachId)
    console.log("Token available:", !!token)
    console.log("User:", user)
    console.log("Extracted account ID:", accountId)

    if (!token || !accountId || !coachId) {
      console.error("❌ Missing required data for conversation:")
      console.error("- Token:", !!token)
      console.error("- Account ID:", accountId)
      console.error("- Coach ID:", coachId)
      setLoadingMessages(false)
      return
    }

    try {
      setLoadingMessages(true)
      const apiUrl = `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${coachId}`

      console.log("🔍 Fetching conversation...")
      console.log("API URL:", apiUrl)
      console.log("Request headers:", {
        "Authorization": `Bearer ${token ? token.substring(0, 20) + '...' : 'MISSING'}`,
        "Content-Type": "application/json"
      })

      // Fetch conversation với coach - API sẽ trả về tất cả tin nhắn giữa member và coach
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log("📡 Conversation API Response status:", response.status)
      console.log("📡 Conversation API Response ok:", response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Conversation data received:", data)
        console.log("Data type:", typeof data, "Is array:", Array.isArray(data))
        console.log("Data length:", Array.isArray(data) ? data.length : 'Not array')

        // Parse messages from API response
        let formattedMessages = []
        if (Array.isArray(data) && data.length > 0) {
          console.log("Processing", data.length, "messages")
          formattedMessages = data.map(msg => ({
            // Logic: Kiểm tra senderId để xác định ai gửi tin nhắn
            // - Nếu senderId = accountId (member) → tin nhắn từ member (user)
            // - Nếu senderId = coachId → tin nhắn từ coach
            from: msg.senderId === accountId ? "user" : "coach",
            text: msg.message || "Tin nhắn trống",
            timestamp: msg.sentTime || msg.createdAt || new Date().toISOString(),
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            chatId: msg.chatId
          }))

          // Sắp xếp tin nhắn theo thời gian (cũ đến mới)
          formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          console.log("Formatted messages:", formattedMessages)
        } else {
          console.log("No messages found, showing welcome message")
          // Tin nhắn chào hỏi ban đầu nếu chưa có conversation
          formattedMessages = [
            { from: "coach", text: `Chào bạn! Tôi là ${selectedCoach?.fullName || 'Coach'}. Bạn cần hỗ trợ gì hôm nay?` }
          ]
        }

        setMessages(formattedMessages)
      } else {
        const errorText = await response.text()
        console.error("❌ Conversation API error:")
        console.error("Status:", response.status)
        console.error("Status text:", response.statusText)
        console.error("Response body:", errorText)

        setMessages([
          { from: "coach", text: `Chào bạn! Tôi là ${selectedCoach?.fullName || 'Coach'}. Bạn cần hỗ trợ gì hôm nay?` }
        ])
      }
    } catch (error) {
      console.error("💥 Conversation fetch error:")
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Full error:", error)

      setMessages([
        { from: "coach", text: `Chào bạn! Tôi là ${selectedCoach?.fullName || 'Coach'}. Bạn cần hỗ trợ gì hôm nay?` }
      ])
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()    // Debug: Log tất cả conditions
    console.log("=== handleSend Debug ===")
    console.log("Input value:", input)
    console.log("Input trimmed:", input.trim())
    console.log("Selected coach:", selectedCoach)
    console.log("Extracted account ID:", accountId)
    console.log("Token available:", !!token)

    // Kiểm tra từng điều kiện
    if (!input.trim()) {
      console.error("❌ Không thể gửi: Input rỗng")
      return
    }

    if (!selectedCoach) {
      console.error("❌ Không thể gửi: Chưa chọn coach")
      return
    }

    if (!accountId) {
      console.error("❌ Không thể gửi: Không có account ID")
      console.log("User object:", user)
      console.log("All user properties:", Object.keys(user || {}))
      return
    }

    if (!token) {
      console.error("❌ Không thể gửi: Không có token")
      return
    }

    console.log("✅ Tất cả điều kiện OK, bắt đầu gửi tin nhắn...")

    const userMsg = {
      from: "user",
      text: input,
      timestamp: new Date().toISOString(),
      senderId: accountId,
      receiverId: selectedCoach.accountId // Coach accountId as receiverId
    }
    setMessages((prev) => [...prev, userMsg])
    const currentInput = input
    setInput("")
    setLoading(true)

    try {
      // Gửi tin nhắn tới coach với receiverId = coach.accountId
      const payload = {
        senderId: accountId,
        receiverId: selectedCoach.accountId,
        message: currentInput
      }

      console.log("🚀 Sending message to API...")
      console.log("API URL:", "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/send")
      console.log("Request headers:", {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token ? token.substring(0, 20) + '...' : 'MISSING'}`
      })
      console.log("Request payload:", payload)

      const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("📡 API Response status:", response.status)
      console.log("📡 API Response ok:", response.ok)

      if (response.ok) {
        const responseData = await response.json()
        console.log("✅ Message sent successfully:", responseData)
        // Refresh conversation sau khi gửi tin nhắn thành công
        setTimeout(() => {
          fetchConversationWithCoach(selectedCoach.accountId)
        }, 1000)
      } else {
        const errorData = await response.text()
        console.error("❌ Failed to send message")
        console.error("Response status:", response.status)
        console.error("Response statusText:", response.statusText)
        console.error("Response body:", errorData)

        // Show user-friendly error
        let errorMessage = "Lỗi khi gửi tin nhắn"
        if (response.status === 401) {
          errorMessage = "Lỗi xác thực - vui lòng đăng nhập lại"
        } else if (response.status === 403) {
          errorMessage = "Không có quyền gửi tin nhắn"
        } else if (response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ"
        } else if (response.status >= 500) {
          errorMessage = "Lỗi server - vui lòng thử lại sau"
        }

        alert(errorMessage)

        // Remove optimistic message on failure
        setMessages((prev) => prev.slice(0, -1))
        setInput(currentInput) // Restore input
      }
    } catch (error) {
      console.error("💥 Network/JavaScript error:")
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Full error:", error)

      alert("Lỗi kết nối - vui lòng kiểm tra internet và thử lại")

      setMessages((prev) => prev.slice(0, -1))
      setInput(currentInput) // Restore input
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách coaches từ API
  const fetchCoaches = async () => {
    if (!token) {
      console.log("No token available")
      setLoadingCoaches(false)
      return
    }

    try {
      setLoadingCoaches(true)
      // Gọi API để lấy danh sách tất cả coaches với accountId
      // Member sẽ dùng coach.accountId làm receiverId khi gửi tin nhắn
      const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/all-coaches", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Coaches data:", data)
        setCoaches(data || [])
      } else {
        console.error("Failed to fetch coaches:", response.status)
        setCoaches([])
      }
    } catch (error) {
      console.error("Error fetching coaches:", error)
      setCoaches([])
    } finally {
      setLoadingCoaches(false)
    }
  }

  // Format time helper function
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Auto refresh conversation mỗi 5 giây khi có tin nhắn và đã chọn coach
  useEffect(() => {
    if (messages.length > 0 && selectedCoach) {
      const interval = setInterval(() => {
        fetchConversationWithCoach(selectedCoach.accountId)
      }, 5000) // Refresh mỗi 5 giây

      setRefreshInterval(interval)

      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [messages.length, selectedCoach])

  // Cleanup interval khi component unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [])

  // Chọn coach để chat
  const selectCoach = (coach) => {
    setSelectedCoach(coach)
    setMessages([])
  }

  // Debug function để test API
  const testAPI = async () => {
    if (!selectedCoach || !token || !user?.accountId) {
      console.log("Missing data for API test")
      return
    }

    console.log("=== Member API Test ===")
    console.log("Member Account ID:", user?.accountId)
    console.log("Selected Coach Account ID:", selectedCoach?.accountId)
    console.log("Token:", token ? "Available" : "Missing")

    // Test conversation API
    try {
      const convResponse = await fetch(`https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${selectedCoach.accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log("Conversation API status:", convResponse.status)
      const convData = await convResponse.json()
      console.log("Conversation API response:", convData)

      // Analyze the conversation data
      if (Array.isArray(convData)) {
        console.log("Messages analysis:")
        convData.forEach((msg, index) => {
          console.log(`Message ${index + 1}:`, {
            fromMe: msg.senderId === user?.accountId,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            message: msg.message,
            time: msg.sentTime
          })
        })
      }
    } catch (error) {
      console.error("Conversation API error:", error)
    }
  }

  // Expose test function to window
  useEffect(() => {
    window.testMemberAPI = testAPI
  }, [selectedCoach, token, user])

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
          gap: 2rem;
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
          content: '💬';
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
          content: '👨‍🏫';
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

        .loading-messages {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: ${COLORS.textLight};
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid ${COLORS.color1};
          border-top: 3px solid ${COLORS.color2};
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.25rem;
          text-align: right;
        }

        .message-coach .message-time {
          text-align: left;
          color: ${COLORS.textLight};
        }

        .coaches-list {
          background: ${COLORS.white};
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          width: 350px;
          max-width: 45vw;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
        }

        .coaches-header {
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
        }

        .coaches-header::before {
          content: '👨‍🏫';
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
        }

        .coaches-grid {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .coach-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          border: 1px solid ${COLORS.color1};
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: ${COLORS.white};
        }

        .coach-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.15);
          border-color: ${COLORS.color2};
        }

        .coach-card.selected {
          border-color: ${COLORS.color2};
          background: ${COLORS.color1};
          box-shadow: 0 4px 16px rgba(106, 183, 197, 0.2);
        }

        .coach-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .coach-info {
          flex: 1;
        }

        .coach-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${COLORS.color3};
        }

        .coach-info p {
          margin: 0;
          color: ${COLORS.textLight};
          font-size: 0.9rem;
        }

        .coach-speciality {
          background: rgba(106, 183, 197, 0.1);
          color: ${COLORS.color3};
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.75rem;
          margin-top: 0.5rem;
          display: inline-block;
        }

        .loading-coaches {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: ${COLORS.textLight};
        }

        @media (max-width: 768px) {
          .coach-container {
            padding: 1rem 0.5rem;
            flex-direction: column;
            gap: 1rem;
          }

          .coaches-list {
            width: 100%;
            max-width: 100%;
            min-height: 300px;
            border-radius: 16px;
          }

          .chat-window {
            width: 100%;
            min-height: 500px;
            border-radius: 16px;
          }

          .chat-header {
            padding: 1.2rem;
            font-size: 1.1rem;
            border-radius: 16px 16px 0 0;
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
        {/* Danh sách coaches */}
        <div className="coaches-list">
          <div className="coaches-header">
            Chọn Coach
          </div>

          <div className="coaches-grid">
            {loadingCoaches ? (
              <div className="loading-coaches">
                <div className="spinner"></div>
                <span>Đang tải danh sách coaches...</span>
              </div>
            ) : coaches.length === 0 ? (
              <div className="loading-coaches">
                <span>Không có coach nào</span>
              </div>
            ) : (
              coaches.map((coach) => (
                <div
                  key={coach.accountId}
                  className={`coach-card ${selectedCoach?.accountId === coach.accountId ? 'selected' : ''}`}
                  onClick={() => selectCoach(coach)}
                >
                  <div className="coach-avatar">
                    {coach.fullName ? coach.fullName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="coach-info">
                    <h3>{coach.fullName || 'Coach'}</h3>
                    <p>{coach.email || 'coach@example.com'}</p>
                    {(coach.speciality || coach.expertise) && (
                      <div className="coach-speciality">
                        {coach.speciality || coach.expertise || 'Chuyên gia tâm lý'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        {selectedCoach ? (
          <div className="chat-window">
            <div className="chat-header">
              💬 Chat với {selectedCoach.fullName || 'Coach'}
              <div style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => fetchConversationWithCoach(selectedCoach.accountId)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: COLORS.color3,
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  🔄 Refresh
                </button>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#10B981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  Online
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {loadingMessages ? (
                <div className="loading-messages">
                  <div className="spinner"></div>
                  <span>Đang tải tin nhắn...</span>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.from === "user" ? "message-user" : "message-coach"}`}>
                      {msg.text}
                      {msg.timestamp && (
                        <div className="message-time">
                          {formatTime(msg.timestamp)}
                        </div>
                      )}
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
                </>
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
              <button className="quick-action-btn" onClick={testAPI}>
                🔍 Test API
              </button>
              <button className="quick-action-btn" onClick={() => {
                console.log("=== Current State Debug ===")
                console.log("User:", user)
                console.log("Token available:", !!token)
                console.log("Selected coach:", selectedCoach)
                console.log("Messages:", messages)
                console.log("Input:", input)
                console.log("Loading:", loading)
              }}>
                🐛 Debug State
              </button>
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Nhập tin nhắn với ${selectedCoach.fullName || 'Coach'}...`}
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
        ) : (
          <div className="chat-window">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: COLORS.textLight,
              padding: '3rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
              <h3>Chọn một coach để bắt đầu trò chuyện</h3>
              <p>Hãy chọn coach từ danh sách bên trái để nhận được hỗ trợ</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
