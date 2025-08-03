"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import Footer from "../../components/Footer"

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
  error: "#EF4444",
}

export default function Coach() {
  const navigate = useNavigate()


  // Auth và user data
  // XÓA: const auth = useContext(AuthContext);
  // SỬA: Chỉ lấy từ Redux
  const { user, token } = useSelector((state) => state.account || {});


  // Payment data từ Redux
  const { currentPackage } = useSelector((state) => state.payment || {});

  // Extract accountId từ user object
  const getAccountId = (userObj) => {
    if (!userObj) return null;
    if (userObj.accountId) return userObj.accountId;
    if (userObj.id) return userObj.id;
    if (userObj.userId) return userObj.userId;
    const nameIdentifier = userObj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    if (nameIdentifier) return parseInt(nameIdentifier);
    return null;
  };

  const accountId = getAccountId(user);
  const packageMembershipId = user?.packageMembershipId;
  // Kiểm tra quyền truy cập
  const checkAccess = () => {
    if (!token || !user) {
      return { allowed: false, reason: 'login' };
    }
    // Chỉ cần packageMembershipId === 3 là được nhắn tin
    if (user.packageMembershipId !== 3) {
      return { allowed: false, reason: 'package' };
    }
    return { allowed: true };
  };

  // State variables
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [coaches, setCoaches] = useState([])
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [loadingCoaches, setLoadingCoaches] = useState(true)
  const [accessCheck, setAccessCheck] = useState({ allowed: false, reason: 'checking' })
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true)
  const [isAutoFetching, setIsAutoFetching] = useState(false)
  const chatEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

  // Kiểm tra quyền truy cập khi component mount hoặc khi user/package thay đổi
  useEffect(() => {
    const access = checkAccess();
    setAccessCheck(access);
  }, [token, user, packageMembershipId]); // XÓA currentPackage

  // Fetch coaches và conversation khi có quyền truy cập
  useEffect(() => {
    if (accessCheck.allowed) {
      fetchCoaches()
    }
  }, [accessCheck.allowed])

  // Fetch conversation khi chọn coach
  useEffect(() => {
    if (selectedCoach && accountId && accessCheck.allowed) {
      fetchConversationWithCoach(selectedCoach.accountId)
    }
  }, [selectedCoach, accountId, accessCheck.allowed])



  // Auto refresh messages khi có coach được chọn
  useEffect(() => {
    if (selectedCoach && accountId && accessCheck.allowed && isAutoRefreshEnabled) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      pollIntervalRef.current = setInterval(async () => {
        setIsAutoFetching(true)
        await fetchConversationWithCoach(selectedCoach.accountId, true)
        setIsAutoFetching(false)
      }, 3000)
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [selectedCoach, accountId, accessCheck.allowed, isAutoRefreshEnabled])

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  // Render access denied screens
  if (!accessCheck.allowed) {
    if (accessCheck.reason === 'checking') {
      return (
        <>
          <style jsx>{`
            .access-container {
              min-height: 100vh;
              background: ${COLORS.background};
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            }
            .access-card {
              background: ${COLORS.white};
              border-radius: 24px;
              padding: 3rem;
              text-align: center;
              box-shadow: 0 20px 40px rgba(51, 107, 115, 0.08);
              border: 1px solid ${COLORS.color1};
              max-width: 500px;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid ${COLORS.color1};
              border-top: 4px solid ${COLORS.color2};
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 1.5rem;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div className="access-container">
            <div className="access-card">
              <div className="spinner"></div>
              <h2 style={{ color: COLORS.color3, marginBottom: '1rem' }}>
                Đang kiểm tra quyền truy cập...
              </h2>
            </div>
          </div>
        </>
      );
    }

    if (accessCheck.reason === 'login') {
      return (
        <>
          <style jsx>{`
            .access-container {
              min-height: 100vh;
              background: ${COLORS.background};
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
              padding: 2rem;
            }
            .access-card {
              background: ${COLORS.white};
              border-radius: 24px;
              padding: 3rem;
              text-align: center;
              box-shadow: 0 20px 40px rgba(51, 107, 115, 0.08);
              border: 1px solid ${COLORS.color1};
              max-width: 500px;
            }
            .access-button {
              background: ${COLORS.gradient};
              color: ${COLORS.white};
              border: none;
              border-radius: 12px;
              padding: 1rem 2rem;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.3s ease;
              margin: 0.5rem;
            }
            .access-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(106, 183, 197, 0.4);
            }
            .secondary-button {
              background: transparent;
              color: ${COLORS.color3};
              border: 2px solid ${COLORS.color1};
            }
            .secondary-button:hover {
              background: ${COLORS.color1};
              border-color: ${COLORS.color2};
            }
          `}</style>
          <div className="access-container">
            <div className="access-card">
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔐</div>
              <h2 style={{ color: COLORS.color3, fontWeight: 700, marginBottom: '1rem' }}>
                Cần đăng nhập
              </h2>
              <p style={{ color: COLORS.textLight, marginBottom: '2rem', lineHeight: 1.6 }}>
                Bạn cần đăng nhập để truy cập tính năng chat với Coach
              </p>
              <button
                className="access-button"
                onClick={() => navigate('/login')}
              >
                <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
                Đăng nhập ngay
              </button>
              <button
                className="access-button secondary-button"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home" style={{ marginRight: '0.5rem' }}></i>
                Về trang chủ
              </button>
            </div>
          </div>
        </>
      );
    }

    if (accessCheck.reason === 'package') {
      return (
        <>
          <style jsx>{`
            .access-container {
              min-height: 100vh;
              background: ${COLORS.background};
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
              padding: 2rem;
            }
            .access-card {
              background: ${COLORS.white};
              border-radius: 24px;
              padding: 3rem;
              text-align: center;
              box-shadow: 0 20px 40px rgba(51, 107, 115, 0.08);
              border: 1px solid ${COLORS.color1};
              max-width: 500px;
            }
            .feature-list {
              text-align: left;
              margin: 2rem 0;
              padding: 1.5rem;
              background: ${COLORS.background};
              border-radius: 12px;
              border: 1px solid ${COLORS.color1};
            }
            .feature-item {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
              color: ${COLORS.text};
            }
            .feature-item:last-child {
              margin-bottom: 0;
            }
          `}</style>
          <div className="access-container">
            <div className="access-card">
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>👑</div>
              <h2 style={{ color: COLORS.color3, fontWeight: 700, marginBottom: '1rem' }}>
                Cần gói Plus để truy cập
              </h2>
              <p style={{ color: COLORS.textLight, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Tính năng chat với Coach chỉ dành cho thành viên gói <strong style={{ color: COLORS.color3 }}>Plus</strong>
              </p>

              <div className="feature-list">
                <h4 style={{ color: COLORS.color3, marginBottom: '1rem', textAlign: 'center' }}>
                  🎯 Tính năng gói Plus
                </h4>
                <div className="feature-item">
                  <span style={{ fontSize: '1.2rem' }}>💬</span>
                  <span>Chat trực tiếp với Coach chuyên nghiệp</span>
                </div>
                <div className="feature-item">
                  <span style={{ fontSize: '1.2rem' }}>🧠</span>
                  <span>Tư vấn tâm lý cá nhân hóa</span>
                </div>
                <div className="feature-item">
                  <span style={{ fontSize: '1.2rem' }}>📅</span>
                  <span>Lịch hẹn ưu tiên với chuyên gia</span>
                </div>
                <div className="feature-item">
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <span>Kế hoạch cai nghiện chuyên sâu</span>
                </div>
              </div>

              <p style={{
                color: COLORS.textLight,
                fontSize: '0.85rem',
                marginTop: '1.5rem',
                fontStyle: 'italic'
              }}>
                💡 Nâng cấp ngay để nhận được sự hỗ trợ tốt nhất từ đội ngũ Coach chuyên nghiệp
              </p>
            </div>
          </div>
        </>
      );
    }
  }

  const fetchConversationWithCoach = async (coachId, silent = false) => {
    if (!token || !accountId || !coachId) {
      if (!silent) setLoadingMessages(false)
      return
    }

    try {
      if (!silent) setLoadingMessages(true)
      const apiUrl = `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${coachId}`

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()

        let formattedMessages = []
        if (Array.isArray(data) && data.length > 0) {
          formattedMessages = data.map(msg => ({
            from: msg.senderId === accountId ? "user" : "coach",
            text: msg.message || "Tin nhắn trống",
            timestamp: msg.sentTime || msg.createdAt || new Date().toISOString(),
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            chatId: msg.chatId
          }))

          formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        } else {
          formattedMessages = [
            { from: "coach", text: `Chào bạn! Tôi là ${selectedCoach?.fullName || 'Coach'}. Bạn cần hỗ trợ gì hôm nay?` }
          ]
        }

        setMessages(prevMessages => {
          const hasChanges = JSON.stringify(prevMessages) !== JSON.stringify(formattedMessages)
          return hasChanges ? formattedMessages : prevMessages
        })
      } else {
        if (!silent) {
          setMessages([
            { from: "coach", text: `Chào bạn! Tôi là ${selectedCoach?.fullName || 'Coach'}. Bạn cần hỗ trợ gì hôm nay?` }
          ])
        }
      }
    } catch (error) {
      if (!silent) {
        setMessages([
          { from: "coach", text: `Chào bạn! Tôi là ${selectedCoach?.fullName || 'Coach'}. Bạn cần hỗ trợ gì hôm nay?` }
        ])
      }
    } finally {
      if (!silent) setLoadingMessages(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || !selectedCoach || !accountId || !token) return

    const userMsg = {
      from: "user",
      text: input,
      timestamp: new Date().toISOString(),
      senderId: accountId,
      receiverId: selectedCoach.accountId
    }
    setMessages((prev) => [...prev, userMsg])
    const currentInput = input
    setInput("")
    setLoading(true)

    try {
      const payload = {
        senderId: accountId,
        receiverId: selectedCoach.accountId,
        message: currentInput
      }

      const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        // Tin nhắn đã được gửi thành công
      } else {
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
        setMessages((prev) => prev.slice(0, -1))
        setInput(currentInput)
      }
    } catch (error) {
      alert("Lỗi kết nối - vui lòng kiểm tra internet và thử lại")
      setMessages((prev) => prev.slice(0, -1))
      setInput(currentInput)
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách coaches từ API
  const fetchCoaches = async () => {
    if (!token) {
      setLoadingCoaches(false)
      return
    }
    try {
      setLoadingCoaches(true)
      const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/all-coaches", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCoaches(data || [])
      } else {
        setCoaches([])
      }
    } catch (error) {
      setCoaches([])
    } finally {
      setLoadingCoaches(false)
    }
  }




  // Chọn coach để chat
  const selectCoach = (coach) => {
    setSelectedCoach(coach)
    setMessages([])
  }

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
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👑</div>
              <h3>Tính năng Premium Plus</h3>
              <p>Chọn một coach để bắt đầu nhận tư vấn chuyên nghiệp</p>
              <div style={{
                background: COLORS.color1,
                padding: '1rem',
                borderRadius: '12px',
                marginTop: '1rem'
              }}>
                <span style={{ color: COLORS.color3, fontWeight: 600 }}>
                  🎯 Bạn đang sử dụng gói Plus
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
