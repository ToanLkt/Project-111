import React, { useState, useEffect, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import AuthContext from '../../AuthContext/AuthContext'

const COLORS = {
  background: "#FAFAF9",
  color1: "#CFE8EF",
  color2: "#6AB7C5",
  color3: "#336B73",
  white: "#FFFFFF",
  textLight: "#64748B",
  success: "#10B981",
  gradient: "linear-gradient(135deg, #6AB7C5 0%, #336B73 100%)",
  gradientLight: "linear-gradient(135deg, #CFE8EF 0%, #6AB7C5 50%)"
}

export default function CoachChat() {
  // Auth và user data
  const auth = useContext(AuthContext);
  const { user: reduxUser, token: reduxToken } = useSelector((state) => state.account || {});
  const token = reduxToken || auth?.token;
  const user = reduxUser || auth?.user;

  // Extract accountId từ user object (tương tự Coach.jsx)
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

  console.log("🔍 CoachChat User Debug Info:")
  console.log("Raw user object:", user)
  console.log("Extracted accountId:", accountId)
  console.log("Token available:", !!token)

  // Early return if no user data or accountId
  if (!user || !accountId) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FAFAF9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(51, 107, 115, 0.08)',
          border: '1px solid #CFE8EF'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #CFE8EF',
            borderTop: '3px solid #6AB7C5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <h3 style={{ color: '#336B73', marginBottom: '0.5rem' }}>Đang tải thông tin...</h3>
          <p style={{ color: '#64748B', margin: 0 }}>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  // States
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(null)
  const messagesEndRef = useRef(null)

  // Fetch members khi component mount
  useEffect(() => {
    fetchMembers()
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

  // Auto refresh conversation mỗi 3 giây khi đang chat với member
  useEffect(() => {
    if (selectedMember && accountId) {
      const interval = setInterval(() => {
        fetchConversation(selectedMember.accountId)
      }, 3000) // Refresh mỗi 3 giây

      setRefreshInterval(interval)

      return () => {
        if (interval) clearInterval(interval)
      }
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
    }
  }, [selectedMember, accountId])

  // Cleanup interval khi component unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [])
  // Lấy danh sách members có conversation với coach
  const fetchMembers = async () => {
    if (!token || !accountId) {
      console.log("Missing token or accountId for fetchMembers")
      setLoadingMembers(false)
      return
    }

    try {
      setLoadingMembers(true)

      console.log("🔍 CoachChat fetchMembers Debug:")
      console.log("Coach accountId:", accountId)
      console.log("Token available:", !!token)

      // Fetch conversations để lấy danh sách members đã chat với coach
      // Thử nhiều cách để lấy conversations:
      // 1. Lấy conversations mà coach là receiver (tin nhắn gửi CHO coach)
      // 2. Lấy conversations mà coach là sender (tin nhắn coach GỬI ĐI)

      console.log("🔍 Fetching conversations where coach is RECEIVER...")
      const receiverUrl = `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${accountId}`
      console.log("📡 URL 1 (Coach as receiver):", receiverUrl)

      const receiverResponse = await fetch(receiverUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log("📡 Receiver API Response status:", receiverResponse.status)
      console.log("📡 Receiver API Response ok:", receiverResponse.ok)

      let allConversations = []

      if (receiverResponse.ok) {
        const receiverData = await receiverResponse.json()
        console.log("✅ Conversations where coach is receiver:", receiverData)
        if (Array.isArray(receiverData)) {
          allConversations = [...allConversations, ...receiverData]
        }
      } else {
        console.log("❌ No conversations found where coach is receiver")
      }

      // Bây giờ thử lấy conversations mà coach là sender
      console.log("🔍 Trying to fetch conversations by iterating through potential member IDs...")

      // Thử với một số member IDs phổ biến để test
      const testMemberIds = [2, 3, 4, 5, 10, 11, 12, 15, 20, 21]

      for (const memberId of testMemberIds) {
        if (memberId === accountId) continue // Skip chính coach

        try {
          console.log(`🔍 Testing conversations with member ID: ${memberId}`)
          const memberUrl = `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${memberId}`

          const memberResponse = await fetch(memberUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (memberResponse.ok) {
            const memberData = await memberResponse.json()
            console.log(`✅ Found conversations with member ${memberId}:`, memberData)

            if (Array.isArray(memberData) && memberData.length > 0) {
              // Chỉ lấy conversations có coach tham gia
              const coachConversations = memberData.filter(conv =>
                conv.senderId === accountId || conv.receiverId === accountId
              )
              if (coachConversations.length > 0) {
                console.log(`✅ Coach participated in ${coachConversations.length} conversations with member ${memberId}`)
                allConversations = [...allConversations, ...coachConversations]
              }
            }
          }
        } catch (error) {
          console.log(`❌ Error fetching conversations with member ${memberId}:`, error.message)
        }
      }

      console.log("🔍 Total conversations found:", allConversations.length)
      console.log("📊 All conversations data:", allConversations)

      if (allConversations.length > 0) {
        // Extract unique members từ conversations
        const uniqueMembers = extractMembersFromConversations(allConversations, accountId)
        console.log("✅ CoachChat: Extracted unique members:", uniqueMembers)

        setMembers(uniqueMembers)

        if (uniqueMembers.length === 0) {
          console.log("⚠️ CoachChat: No unique members found in conversations")
        }
      } else {
        console.log("⚠️ CoachChat: No conversations found for coach")
        setMembers([])
      }

    } catch (error) {
      console.error("❌ CoachChat fetchMembers: Network/Parse Error:", error)
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)

      // Show specific network error
      alert(`Lỗi kết nối khi tải danh sách members:\n${error.message}`)
      setMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  // Lấy cuộc hội thoại với member cụ thể
  const fetchConversation = async (memberAccountId) => {
    if (!token || !accountId || !memberAccountId) {
      console.log("Missing required data for conversation")
      console.log("Token:", !!token, "Coach accountId:", accountId, "Member accountId:", memberAccountId)
      setLoadingMessages(false)
      return
    }

    try {
      setLoadingMessages(true)
      // Fetch conversation từ perspective của coach 
      console.log("🔍 CoachChat fetchConversation Debug:")
      console.log("Coach accountId:", accountId)
      console.log("Member accountId:", memberAccountId)
      console.log("API URL:", `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${memberAccountId}`)

      const response = await fetch(`https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/conversation?receiverId=${memberAccountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log("📡 CoachChat API Response status:", response.status)
      console.log("📡 CoachChat API Response ok:", response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ CoachChat conversation data received:", data)

        // Parse messages from API response
        let formattedMessages = []
        if (Array.isArray(data) && data.length > 0) {
          formattedMessages = data.map(msg => ({
            // Logic: Kiểm tra senderId để xác định ai gửi tin nhắn
            // - Nếu senderId = accountId (coach) → tin nhắn từ coach
            // - Nếu senderId = memberAccountId → tin nhắn từ member
            from: msg.senderId === accountId ? "coach" : "member",
            text: msg.message || "Tin nhắn trống",
            timestamp: msg.sentTime || msg.createdAt || new Date().toISOString(),
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            chatId: msg.chatId
          }))

          // Sắp xếp tin nhắn theo thời gian (cũ đến mới)
          formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          console.log("✅ CoachChat formatted messages:", formattedMessages)
        }

        setMessages(formattedMessages)
      } else {
        console.log("❌ CoachChat: No conversation found or API error")
        setMessages([])
      }
    } catch (error) {
      console.error("❌ CoachChat: Error fetching conversation:", error)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  // Gửi tin nhắn từ coach tới member
  const handleSend = async (e) => {
    e.preventDefault()

    // Debug: Log tất cả conditions
    console.log("=== CoachChat handleSend Debug ===")
    console.log("Input value:", inputValue)
    console.log("Input trimmed:", inputValue.trim())
    console.log("Selected member:", selectedMember)
    console.log("Extracted account ID:", accountId)
    console.log("Token available:", !!token)

    // Kiểm tra từng điều kiện
    if (!inputValue.trim()) {
      console.error("❌ CoachChat: Không thể gửi: Input rỗng")
      return
    }

    if (!selectedMember) {
      console.error("❌ CoachChat: Không thể gửi: Chưa chọn member")
      return
    }

    if (!accountId) {
      console.error("❌ CoachChat: Không thể gửi: Không có account ID")
      console.log("User object:", user)
      console.log("All user properties:", Object.keys(user || {}))
      return
    }

    if (!token) {
      console.error("❌ CoachChat: Không thể gửi: Không có token")
      return
    }

    console.log("✅ CoachChat: Tất cả điều kiện OK, bắt đầu gửi tin nhắn...")

    // Tạo tin nhắn optimistic cho UI
    const coachMsg = {
      from: "coach",
      text: inputValue,
      timestamp: new Date().toISOString(),
      senderId: accountId, // Coach ID
      receiverId: selectedMember.accountId // Member ID
    }
    setMessages((prev) => [...prev, coachMsg])
    const currentInput = inputValue
    setInputValue("")
    setLoading(true)

    try {
      // Gửi tin nhắn reply từ coach tới member đã chọn
      const payload = {
        senderId: accountId,
        receiverId: selectedMember.accountId,
        message: currentInput
      }

      console.log("📤 CoachChat: Đang gửi message payload:", payload)
      console.log("🚀 CoachChat: Sending message to API...")
      console.log("API URL:", "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/send")

      const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("📡 CoachChat: API Response status:", response.status)
      console.log("📡 CoachChat: API Response ok:", response.ok)

      if (response.ok) {
        const responseData = await response.json()
        console.log("✅ CoachChat: Message sent successfully:", responseData)
        // Có thể refresh conversation để đảm bảo đồng bộ
        setTimeout(() => fetchConversation(selectedMember.accountId), 1000)
      } else {
        console.error("❌ CoachChat: Failed to send message")
        const errorData = await response.text()
        console.error("Error details:", errorData)
        // Remove optimistic message on failure
        setMessages((prev) => prev.slice(0, -1))
        setInputValue(currentInput) // Restore input
      }
    } catch (error) {
      console.error("❌ CoachChat: Error sending message:", error)
      setMessages((prev) => prev.slice(0, -1))
      setInputValue(currentInput) // Restore input
    } finally {
      setLoading(false)
    }
  }

  // Select member to chat
  const selectMember = (member) => {
    setSelectedMember(member)
    setMessages([])
  }

  // Refresh conversation
  const refreshConversation = () => {
    if (selectedMember && accountId) {
      fetchConversation(selectedMember.accountId)
    }
  }

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

  // Helper function để extract members từ conversations (sử dụng khi có API)
  const extractMembersFromConversations = (conversations, coachId) => {
    console.log("🔍 extractMembersFromConversations Debug:")
    console.log("Input conversations:", conversations)
    console.log("Coach ID:", coachId)

    const memberMap = new Map()

    conversations.forEach((conv, index) => {
      console.log(`Processing conversation ${index}:`, conv)

      // Tìm member ID (người không phải coach)
      // Kiểm tra ai là sender và ai là receiver
      let memberAccountId, memberName, lastMessage, timestamp

      if (conv.senderId === coachId) {
        // Coach gửi tin nhắn → Member là receiver
        memberAccountId = conv.receiverId
        memberName = conv.receiverName || `Member ${conv.receiverId}`
        lastMessage = conv.message || conv.content || "Tin nhắn"
        timestamp = conv.sentTime || conv.createdAt || new Date().toISOString()
      } else if (conv.receiverId === coachId) {
        // Member gửi tin nhắn → Coach là receiver, Member là sender
        memberAccountId = conv.senderId
        memberName = conv.senderName || `Member ${conv.senderId}`
        lastMessage = conv.message || conv.content || "Tin nhắn"
        timestamp = conv.sentTime || conv.createdAt || new Date().toISOString()
      } else {
        // Conversation không liên quan đến coach này
        console.log(`Conversation ${index} không liên quan đến coach ${coachId}`)
        return
      }

      console.log(`Extracted member: ID=${memberAccountId}, Name=${memberName}`)

      // Chỉ thêm member nếu không phải chính coach
      if (memberAccountId && memberAccountId !== coachId) {
        // Nếu member đã tồn tại, cập nhật với tin nhắn mới nhất
        if (memberMap.has(memberAccountId)) {
          const existingMember = memberMap.get(memberAccountId)
          const existingTime = new Date(existingMember.timestamp || 0)
          const currentTime = new Date(timestamp || 0)

          // Cập nhật với tin nhắn mới nhất
          if (currentTime > existingTime) {
            memberMap.set(memberAccountId, {
              accountId: memberAccountId,
              name: memberName,
              lastMessage: lastMessage,
              timestamp: timestamp,
              isOnline: Math.random() > 0.5 // Random online status
            })
          }
        } else {
          // Thêm member mới
          memberMap.set(memberAccountId, {
            accountId: memberAccountId,
            name: memberName,
            lastMessage: lastMessage,
            timestamp: timestamp,
            isOnline: Math.random() > 0.5 // Random online status
          })
        }
      }
    })

    const membersArray = Array.from(memberMap.values())

    // Sắp xếp theo thời gian tin nhắn mới nhất
    membersArray.sort((a, b) =>
      new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    )

    console.log("Final extracted members:", membersArray)
    return membersArray
  }

  // Debug function để log thông tin chat
  const logChatInfo = () => {
    console.log("🔍 CoachChat Debug Info:")
    console.log("- Coach ID (accountId):", accountId)
    console.log("- Selected Member:", selectedMember)
    console.log("- Messages count:", messages.length)
    console.log("- Members list:", members)
    console.log("- API Flow:")
    console.log("  • Member gửi tin nhắn với receiverId = coach.accountId")
    console.log("  • Coach fetch conversation với member.accountId")
    console.log("  • Coach reply với receiverId = member.accountId")
    console.log("- API Base:", "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net")
  }

  // Expose debug function to window for testing
  useEffect(() => {
    window.coachChatDebug = logChatInfo
  }, [accountId, selectedMember, messages, members])

  return (
    <>
      <style>
        {`
        .coach-chat-container {
          min-height: 100vh;
          background: ${COLORS.background};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

        .members-list {
          background: ${COLORS.white};
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(51, 107, 115, 0.08),
            0 8px 16px rgba(51, 107, 115, 0.04);
          width: 600px;
          max-width: 95vw;
          min-height: 600px;
          border: 1px solid ${COLORS.color1};
          position: relative;
          overflow: hidden;
        }

        .members-header {
          background: ${COLORS.gradientLight};
          color: ${COLORS.color3};
          border-radius: 24px 24px 0 0;
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid ${COLORS.color1};
        }

        .members-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .members-header p {
          margin: 0;
          opacity: 0.8;
          font-size: 1rem;
        }

        .members-header div {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .members-header div .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          animation: pulse 2s infinite;
        }

        .members-header div + div {
          font-size: 0.75rem;
          margin-top: 0.5rem;
          opacity: 0.7;
          text-align: center;
        }

        .members-grid {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 450px;
          overflow-y: auto;
        }

        .member-card {
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

        .member-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(106, 183, 197, 0.15);
          border-color: ${COLORS.color2};
        }

        .member-avatar {
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

        .member-info {
          flex: 1;
        }

        .member-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${COLORS.color3};
        }

        .member-info p {
          margin: 0 0 0.5rem 0;
          color: ${COLORS.textLight};
          font-size: 0.9rem;
        }

        .member-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: ${COLORS.success};
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${COLORS.success};
        }

        .status-dot.offline {
          background: #94A3B8;
        }

        .chat-header {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          padding: 1.5rem;
          border-radius: 24px 24px 0 0;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid ${COLORS.color1};
        }

        .back-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 12px;
          color: ${COLORS.white};
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .header-member-info {
          flex: 1;
        }

        .header-member-info h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .chat-messages {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          max-height: 400px;
          background: linear-gradient(135deg, ${COLORS.background} 0%, #F8FAFC 100%);
        }

        .message {
          margin-bottom: 1rem;
          max-width: 80%;
          padding: 1rem 1.25rem;
          border-radius: 20px;
          line-height: 1.5;
          position: relative;
          word-wrap: break-word;
        }

        .message-coach {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          margin-left: auto;
          border-bottom-right-radius: 8px;
        }

        .message-member {
          background: ${COLORS.white};
          color: ${COLORS.color3};
          border: 1px solid ${COLORS.color1};
          margin-right: auto;
          border-bottom-left-radius: 8px;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.25rem;
          text-align: right;
        }

        .message-member .message-time {
          text-align: left;
          color: ${COLORS.textLight};
        }

        .chat-input-form {
          padding: 1.5rem;
          border-top: 1px solid ${COLORS.color1};
          display: flex;
          gap: 1rem;
          align-items: center;
          background: ${COLORS.white};
          border-radius: 0 0 24px 24px;
        }

        .chat-input {
          flex: 1;
          padding: 1rem 1.25rem;
          border: 1px solid ${COLORS.color1};
          border-radius: 24px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          background: ${COLORS.background};
        }

        .chat-input:focus {
          border-color: ${COLORS.color2};
          box-shadow: 0 0 0 3px rgba(106, 183, 197, 0.1);
        }

        .send-button {
          background: ${COLORS.gradient};
          color: ${COLORS.white};
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .send-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(106, 183, 197, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .loading-members, .loading-messages {
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

        .no-members {
          text-align: center;
          padding: 3rem;
          color: ${COLORS.textLight};
        }

        .welcome-message {
          text-align: center;
          padding: 2rem;
          color: ${COLORS.textLight};
          background: ${COLORS.background};
          border-radius: 12px;
          margin: 1rem;
        }

        @media (max-width: 768px) {
          .coach-chat-container {
            padding: 1rem;
          }
          
          .chat-window, .members-list {
            width: 100%;
            min-height: 80vh;
            border-radius: 20px;
          }
        }
        `}
      </style>

      <div className="coach-chat-container">
        {!selectedMember ? (
          // Members List View
          <div className="members-list">
            <div className="members-header">
              <h2>💬 Tin nhắn từ Members</h2>
              <p>Members đã gửi tin nhắn cho bạn</p>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#10B981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                Đang online - Sẵn sàng hỗ trợ
              </div>
              <div style={{
                fontSize: '0.75rem',
                marginTop: '0.5rem',
                opacity: 0.7,
                textAlign: 'center'
              }}>
                API: GET /api/Chat/conversation?receiverId={accountId}
                <br />
                Coach ID: {accountId} | Lấy tin nhắn gửi cho Coach
              </div>
            </div>

            {loadingMembers ? (
              <div className="loading-members">
                <div className="spinner"></div>
                <span>Đang tải danh sách members...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="no-members">
                <h3>🔇 Chưa có tin nhắn nào</h3>
                <p>Các members sẽ xuất hiện ở đây khi họ gửi tin nhắn cho bạn</p>
              </div>
            ) : (
              <div className="members-grid">
                {members.map((member) => (
                  <div key={member.accountId} className="member-card" onClick={() => selectMember(member)}>
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.lastMessage}</p>
                      <div className="member-status">
                        <div className={`status-dot ${member.isOnline ? '' : 'offline'}`}></div>
                        <span>{member.isOnline ? 'Đang online' : 'Offline'}</span>
                      </div>
                    </div>
                    <div className="chat-arrow">→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Chat Window
          <div className="chat-window">
            <div className="chat-header">
              <button className="back-button" onClick={() => setSelectedMember(null)}>
                ←
              </button>
              <div className="header-member-info">
                <h3>{selectedMember.name}</h3>
              </div>
            </div>

            <div className="chat-messages">
              {loadingMessages ? (
                <div className="loading-messages">
                  <div className="spinner"></div>
                  <span>Đang tải tin nhắn...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="welcome-message">
                  <p>👋 Bắt đầu cuộc trò chuyện với {selectedMember.name}</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.from === "coach" ? "message-coach" : "message-member"}`}>
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
                      <div className="message message-coach">
                        <span>Đang gửi...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                className="chat-input"
                disabled={loading}
              />
              <button type="submit" className="send-button" disabled={loading || !inputValue.trim()}>
                {loading ? '⏳' : '📤'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
