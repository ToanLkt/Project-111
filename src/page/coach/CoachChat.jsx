import React, { useState, useEffect, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import AuthContext from '../../AuthContext/AuthContext'

const COLORS = {
  background: "#F8FAFC",
  cardBg: "#FFFFFF",
  primary: "#0F172A",
  secondary: "#334155",
  accent: "#3B82F6",
  accentHover: "#2563EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  border: "#E2E8F0",
  borderHover: "#CBD5E1",
  text: "#1E293B",
  textLight: "#64748B",
  textMuted: "#94A3B8",
  gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  gradientLight: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
  shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  shadowMd: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  shadowXl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
}

export default function CoachChat() {
  // Auth và user data
  const auth = useContext(AuthContext);
  const { user: reduxUser, token: reduxToken } = useSelector((state) => state.account || {});
  const token = reduxToken || auth?.token;
  const user = reduxUser || auth?.user;

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

  // States
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [lastActivity, setLastActivity] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const messagesEndRef = useRef(null)
  const refreshIntervalRef = useRef(null)
  const timeUpdateIntervalRef = useRef(null)

  // Early return if no user data
  if (!user || !accountId) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: COLORS.cardBg,
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: COLORS.shadowLg,
          border: `1px solid ${COLORS.border}`,
          maxWidth: '400px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${COLORS.border}`,
            borderTop: `3px solid ${COLORS.accent}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <h3 style={{ color: COLORS.primary, marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
            Đang tải thông tin...
          </h3>
          <p style={{ color: COLORS.textLight, margin: 0 }}>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  // Auto refresh và update time
  useEffect(() => {
    // Update time every second for realtime display
    timeUpdateIntervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Auto refresh conversations every 3 seconds
    if (selectedMember) {
      refreshIntervalRef.current = setInterval(() => {
        fetchConversation(selectedMember.accountId, true); // silent refresh
      }, 3000);
    } else {
      refreshIntervalRef.current = setInterval(() => {
        fetchMembersWithPackage3(true); // silent refresh
      }, 5000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [selectedMember, accountId]);

  // Fetch members with package 3
  useEffect(() => {
    fetchMembersWithPackage3()
  }, [])

  // Fetch conversation khi chọn member
  useEffect(() => {
    if (selectedMember && accountId) {
      fetchConversation(selectedMember.accountId)
    }
  }, [selectedMember, accountId])

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Realtime format time function
  const formatTimeRealtime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = currentTime; // Use current state time for realtime updates
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Realtime updates
    if (diffSeconds < 10) return 'Vừa xong';
    if (diffSeconds < 60) return `${diffSeconds} giây trước`;
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    // Fallback to formatted date
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // **SỬA LẠI: Fetch members with package 3 từ API**
  const fetchMembersWithPackage3 = async (silent = false) => {
    if (!token || !accountId) {
      if (!silent) setLoadingMembers(false)
      return
    }

    try {
      if (!silent) setLoadingMembers(true)

      console.log("🚀 Fetching members with package 3...")

      // Fetch members using package 3 from API
      const response = await fetch(
        'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/members-with-package3',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const membersData = await response.json()
      console.log("✅ Members with package 3 fetched:", membersData)

      if (Array.isArray(membersData) && membersData.length > 0) {
        // Format members data for display
        const formattedMembers = await Promise.all(
          membersData.map(async (member) => {
            // Fetch latest conversation với member này để lấy last message
            let lastMessage = "Bắt đầu cuộc trò chuyện";
            let lastMessageTime = new Date().toISOString();

            try {
              const conversationResponse = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${member.accountId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              )

              if (conversationResponse.ok) {
                const conversationData = await conversationResponse.json()
                if (Array.isArray(conversationData) && conversationData.length > 0) {
                  // Lấy tin nhắn cuối cùng
                  const latestMessage = conversationData
                    .sort((a, b) => new Date(b.sentTime || b.createdAt) - new Date(a.sentTime || a.createdAt))[0]

                  if (latestMessage) {
                    lastMessage = latestMessage.message || "Tin nhắn"
                    lastMessageTime = latestMessage.sentTime || latestMessage.createdAt || new Date().toISOString()
                  }
                }
              }
            } catch (error) {
              console.warn(`Failed to fetch conversation for member ${member.accountId}:`, error)
            }

            return {
              accountId: member.accountId,
              name: member.fullName || member.name || `Member ${member.accountId}`,
              email: member.email,
              packageInfo: {
                packageName: member.packageName || "Package 3",
                startDate: member.startDate,
                endDate: member.endDate,
                daysLeft: member.daysLeft || 0
              },
              lastMessage: lastMessage,
              timestamp: lastMessageTime,
              isOnline: Math.random() > 0.4, // Random online status, có thể cải thiện bằng realtime status
              hasActivePackage: true,
              packageStatus: member.daysLeft > 0 ? "Đang hoạt động" : "Hết hạn"
            }
          })
        )

        // Sắp xếp theo thời gian tin nhắn gần nhất
        formattedMembers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        setMembers(formattedMembers)
        console.log("📋 Formatted members:", formattedMembers.length)
      } else {
        setMembers([])
        console.log("📭 No members with package 3 found")
      }

      setLastActivity(new Date())

    } catch (error) {
      console.error("❌ Error fetching members with package 3:", error)
      setMembers([])
    } finally {
      if (!silent) setLoadingMembers(false)
    }
  }

  // Lấy cuộc hội thoại (với silent option cho auto-refresh)
  const fetchConversation = async (memberAccountId, silent = false) => {
    if (!token || !accountId || !memberAccountId) {
      if (!silent) setLoadingMessages(false)
      return
    }

    try {
      if (!silent) setLoadingMessages(true)

      const response = await fetch(`https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${memberAccountId}`, {
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
            from: msg.senderId === accountId ? "coach" : "member",
            text: msg.message || "Tin nhắn trống",
            timestamp: msg.sentTime || msg.createdAt || new Date().toISOString(),
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            chatId: msg.chatId
          }))

          formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        }

        // Only update if messages changed (avoid unnecessary re-renders)
        if (JSON.stringify(formattedMessages) !== JSON.stringify(messages)) {
          setMessages(formattedMessages)
        }
      } else {
        if (!silent) setMessages([])
      }

      setLastActivity(new Date())
    } catch (error) {
      if (!silent) setMessages([])
    } finally {
      if (!silent) setLoadingMessages(false)
    }
  }

  // Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() || !selectedMember || !accountId || !token) return

    const coachMsg = {
      from: "coach",
      text: inputValue,
      timestamp: new Date().toISOString(),
      senderId: accountId,
      receiverId: selectedMember.accountId
    }

    setMessages((prev) => [...prev, coachMsg])
    const currentInput = inputValue
    setInputValue("")
    setLoading(true)

    try {
      const payload = {
        senderId: accountId,
        receiverId: selectedMember.accountId,
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

      if (!response.ok) {
        setMessages((prev) => prev.slice(0, -1))
        setInputValue(currentInput)
      } else {
        setLastActivity(new Date())
      }
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1))
      setInputValue(currentInput)
    } finally {
      setLoading(false)
    }
  }

  // Select member
  const selectMember = (member) => {
    setSelectedMember(member)
    setMessages([])

    // Clear old interval and start new one
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }
  }

  return (
    <>
      <style>
        {`
        * {
          box-sizing: border-box;
        }

        .coach-chat-container {
          min-height: 100vh;
          background: ${COLORS.background};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chat-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 1200px;
          height: 80vh;
          min-height: 600px;
        }

        .members-panel {
          background: ${COLORS.cardBg};
          border-radius: 16px;
          box-shadow: ${COLORS.shadowLg};
          border: 1px solid ${COLORS.border};
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-panel {
          background: ${COLORS.cardBg};
          border-radius: 16px;
          box-shadow: ${COLORS.shadowLg};
          border: 1px solid ${COLORS.border};
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-header {
          padding: 1.5rem;
          border-bottom: 1px solid ${COLORS.border};
          background: ${COLORS.gradientLight};
        }

        .panel-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: ${COLORS.primary};
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .panel-header p {
          margin: 0;
          font-size: 0.875rem;
          color: ${COLORS.textLight};
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          color: ${COLORS.success};
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.75rem;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .package-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(59, 130, 246, 0.1);
          color: ${COLORS.accent};
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid rgba(59, 130, 246, 0.2);
          margin-top: 0.5rem;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${COLORS.success};
          animation: pulse 2s infinite;
        }

        .members-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .member-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.5rem;
          border: 1px solid transparent;
          position: relative;
        }

        .member-item:hover {
          background: ${COLORS.gradientLight};
          border-color: ${COLORS.border};
          transform: translateY(-1px);
        }

        .member-item.selected {
          background: ${COLORS.gradient};
          color: white;
        }

        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${COLORS.gradient};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
          position: relative;
        }

        .premium-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: ${COLORS.warning};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          border: 2px solid ${COLORS.cardBg};
        }

        .member-info {
          flex: 1;
          min-width: 0;
        }

        .member-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: ${COLORS.primary};
          margin: 0 0 0.25rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-item.selected .member-name {
          color: white;
        }

        .member-last-message {
          font-size: 0.75rem;
          color: ${COLORS.textMuted};
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-item.selected .member-last-message {
          color: rgba(255, 255, 255, 0.8);
        }

        .member-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .member-time {
          font-size: 0.75rem;
          color: ${COLORS.textMuted};
          font-weight: 500;
        }

        .member-item.selected .member-time {
          color: rgba(255, 255, 255, 0.8);
        }

        .member-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.625rem;
          color: ${COLORS.success};
          font-weight: 600;
        }

        .member-item.selected .member-status {
          color: rgba(255, 255, 255, 0.9);
        }

        .member-status.offline {
          color: ${COLORS.textMuted};
        }

        .chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid ${COLORS.border};
          display: flex;
          align-items: center;
          gap: 1rem;
          background: ${COLORS.cardBg};
        }

        .back-button {
          display: none;
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 10px;
          color: ${COLORS.primary};
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
        }

        .back-button:hover {
          background: ${COLORS.border};
        }

        .chat-member-info {
          flex: 1;
        }

        .chat-member-name {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: ${COLORS.primary};
        }

        .chat-member-status {
          margin: 0;
          font-size: 0.875rem;
          color: ${COLORS.textLight};
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          background: ${COLORS.background};
          border: 1px solid ${COLORS.border};
          border-radius: 10px;
          color: ${COLORS.primary};
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .action-button:hover {
          background: ${COLORS.accent};
          color: white;
          border-color: ${COLORS.accent};
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, ${COLORS.background} 0%, #F1F5F9 100%);
        }

        .message {
          margin-bottom: 1rem;
          display: flex;
          width: 100%;
        }

        /* Tin nhắn của coach (admin) - nằm bên phải */
        .message-coach {
          justify-content: flex-end;
        }

        /* Tin nhắn của member - nằm bên trái */
        .message-member {
          justify-content: flex-start;
        }

        .message-bubble {
          background: ${COLORS.cardBg};
          border: 1px solid ${COLORS.border};
          border-radius: 18px;
          padding: 0.875rem 1.125rem;
          word-wrap: break-word;
          word-break: break-word;
          position: relative;
          max-width: 75%;
          min-width: 80px;
          box-shadow: ${COLORS.shadow};
        }

        /* Tin nhắn coach - bubble xanh dương, nằm bên phải */
        .message-coach .message-bubble {
          background: ${COLORS.gradient};
          color: white;
          border: none;
          border-bottom-right-radius: 6px;
          margin-left: auto;
        }

        /* Tin nhắn member - bubble trắng, nằm bên trái */
        .message-member .message-bubble {
          background: ${COLORS.cardBg};
          border: 1px solid ${COLORS.border};
          border-bottom-left-radius: 6px;
          margin-right: auto;
        }

        .message-text {
          margin: 0;
          line-height: 1.5;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .message-time {
          font-size: 0.75rem;
          margin-top: 0.5rem;
          opacity: 0.75;
          font-weight: 500;
        }

        /* Thời gian tin nhắn coach */
        .message-coach .message-time {
          text-align: right;
          color: rgba(255, 255, 255, 0.85);
        }

        /* Thời gian tin nhắn member */
        .message-member .message-time {
          color: ${COLORS.textMuted};
          text-align: left;
        }

        .chat-input-container {
          padding: 1rem 1.5rem;
          border-top: 1px solid ${COLORS.border};
          background: ${COLORS.cardBg};
        }

        .chat-input-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
        }

        .chat-input {
          width: 100%;
          min-height: 44px;
          max-height: 120px;
          padding: 0.75rem 1rem;
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
          background: ${COLORS.background};
          resize: none;
        }

        .chat-input:focus {
          border-color: ${COLORS.accent};
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: ${COLORS.cardBg};
        }

        .send-button {
          background: ${COLORS.gradient};
          color: white;
          border: none;
          border-radius: 12px;
          width: 44px;
          height: 44px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: ${COLORS.shadowMd};
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          color: ${COLORS.textLight};
          text-align: center;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid ${COLORS.border};
          border-top: 2px solid ${COLORS.accent};
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          color: ${COLORS.textLight};
          text-align: center;
        }

        .empty-state h3 {
          color: ${COLORS.primary};
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        .welcome-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          height: 100%;
          background: linear-gradient(135deg, ${COLORS.background} 0%, #F1F5F9 100%);
        }

        .welcome-chat h3 {
          color: ${COLORS.primary};
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .welcome-chat p {
          color: ${COLORS.textLight};
          margin: 0;
          font-size: 0.875rem;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          opacity: 0.7;
          justify-content: flex-end;
        }

        .typing-dots {
          display: flex;
          gap: 0.25rem;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${COLORS.textMuted};
          animation: typing 1.5s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.5s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 1s;
        }

        .realtime-indicator {
          position: fixed;
          top: 1rem;
          right: 1rem;
          background: rgba(16, 185, 129, 0.1);
          color: ${COLORS.success};
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(16, 185, 129, 0.2);
          backdrop-filter: blur(10px);
          z-index: 1000;
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

        @keyframes typing {
          0%, 20% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          80%, 100% { transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .coach-chat-container {
            padding: 1rem;
          }
          
          .chat-layout {
            grid-template-columns: 1fr;
            height: 90vh;
          }
          
          .members-panel {
            display: ${!selectedMember ? 'flex' : 'none'};
          }
          
          .chat-panel {
            display: ${selectedMember ? 'flex' : 'none'};
          }
          
          .back-button {
            display: flex;
          }

          .message-bubble {
            max-width: 85%;
          }

          .messages-container {
            padding: 1rem;
          }
        }

        /* Cải thiện scroll bar */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: ${COLORS.border};
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.borderHover};
        }
        `}
      </style>

      <div className="coach-chat-container">
        {/* Realtime Indicator */}
        <div className="realtime-indicator">
          <div className="status-dot"></div>
          Package 3 Members • Cập nhật {formatTimeRealtime(lastActivity.toISOString())}
        </div>

        <div className="chat-layout">
          {/* Members Panel */}
          <div className="members-panel">
            <div className="panel-header">
              <h2>
                👑 Package 3 Members
              </h2>
              <p>Quản lý cuộc trò chuyện với members gói VIP</p>
              <div className="status-badge">
                <div className="status-dot"></div>
                Coach Support • Package 3 Only
              </div>
              <div className="package-badge">
                💎 {members.length} members với Package 3
              </div>
            </div>

            <div className="members-list">
              {loadingMembers ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <span>Đang tải members với Package 3...</span>
                </div>
              ) : members.length === 0 ? (
                <div className="empty-state">
                  <h3>👑 Chưa có Package 3 Members</h3>
                  <p>Các members sử dụng Package 3 sẽ xuất hiện ở đây để bạn có thể hỗ trợ</p>
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.accountId}
                    className={`member-item ${selectedMember?.accountId === member.accountId ? 'selected' : ''}`}
                    onClick={() => selectMember(member)}
                  >
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                      <div className="premium-badge">👑</div>
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-last-message">{member.lastMessage}</p>
                    </div>
                    <div className="member-meta">
                      <span className="member-time">
                        {formatTimeRealtime(member.timestamp)}
                      </span>
                      <div className={`member-status ${member.isOnline ? '' : 'offline'}`}>
                        <div className="status-dot"></div>
                        {member.isOnline ? 'Online' : 'Offline'}
                      </div>
                      <div style={{
                        fontSize: '0.6rem',
                        color: member.packageInfo.daysLeft > 0 ? COLORS.success : COLORS.danger,
                        fontWeight: '600'
                      }}>
                        {member.packageInfo.daysLeft > 0 ? `${member.packageInfo.daysLeft} ngày` : 'Hết hạn'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="chat-panel">
            {selectedMember ? (
              <>
                <div className="chat-header">
                  <button className="back-button" onClick={() => setSelectedMember(null)}>
                    ←
                  </button>
                  <div className="chat-member-info">
                    <h3 className="chat-member-name">
                      👑 {selectedMember.name}
                    </h3>
                    <p className="chat-member-status">
                      <div className={`status-dot ${selectedMember.isOnline ? '' : 'offline'}`}></div>
                      {selectedMember.isOnline ? 'Đang online' : 'Offline'} •
                      Package 3 • {selectedMember.packageInfo.daysLeft > 0 ?
                        `${selectedMember.packageInfo.daysLeft} ngày còn lại` :
                        'Hết hạn'
                      }
                    </p>
                  </div>
                  <div className="chat-actions">
                    <button
                      className="action-button"
                      onClick={() => fetchConversation(selectedMember.accountId)}
                      title="Làm mới"
                    >
                      🔄
                    </button>
                  </div>
                </div>

                <div className="messages-container">
                  {loadingMessages ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <span>Đang tải tin nhắn...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="welcome-chat">
                      <h3>👑 VIP Support Chat</h3>
                      <p>Bắt đầu cuộc trò chuyện với {selectedMember.name} - Package 3 Member</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`message message-${msg.from}`}>
                          <div className="message-bubble">
                            <p className="message-text">{msg.text}</p>
                            {msg.timestamp && (
                              <div className="message-time">
                                {formatTimeRealtime(msg.timestamp)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="typing-indicator">
                          <span style={{ fontSize: '0.75rem', color: COLORS.textMuted }}>
                            Đang gửi
                          </span>
                          <div className="typing-dots">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                  <form onSubmit={handleSend} className="chat-input-form">
                    <div className="input-wrapper">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nhập tin nhắn hỗ trợ VIP..."
                        className="chat-input"
                        disabled={loading}
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="send-button"
                      disabled={loading || !inputValue.trim()}
                    >
                      {loading ? '⏳' : '➤'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="welcome-chat">
                <h3>👑 Package 3 VIP Support</h3>
                <p>Chọn một VIP member từ danh sách để bắt đầu chat hỗ trợ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
