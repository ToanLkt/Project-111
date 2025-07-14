// Chat API Test Utilities
const API_BASE_URL = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net"

export const testChatAPI = async (token, testData = {}) => {
    console.log("🧪 Testing Chat API...")

    const {
        receiverId = 11,
        message = "Test message from chat utility"
    } = testData

    // Test 1: Send Message
    console.log("📤 Testing send message...")
    try {
        const sendResponse = await fetch(`${API_BASE_URL}/api/Chat/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                receiverId,
                message
            }),
        })

        console.log("Send Response Status:", sendResponse.status)
        if (sendResponse.ok) {
            console.log("✅ Message sent successfully")
        } else {
            console.log("❌ Failed to send message:", await sendResponse.text())
        }
    } catch (error) {
        console.error("❌ Send message error:", error)
    }

    // Test 2: Get Conversation
    console.log("📥 Testing get conversation...")
    try {
        const conversationResponse = await fetch(`${API_BASE_URL}/api/Chat/conversation?receiverId=${receiverId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("Conversation Response Status:", conversationResponse.status)
        if (conversationResponse.ok) {
            const data = await conversationResponse.json()
            console.log("✅ Conversation data:", data)
            return data
        } else {
            console.log("❌ Failed to get conversation:", await conversationResponse.text())
        }
    } catch (error) {
        console.error("❌ Get conversation error:", error)
    }

    return null
}

export const formatChatMessage = (apiMessage, currentUserId) => {
    return {
        from: apiMessage.senderId === currentUserId ? "user" : "coach",
        text: apiMessage.message || apiMessage.content || "Tin nhắn trống",
        timestamp: apiMessage.createdAt || apiMessage.timestamp || new Date().toISOString(),
        senderId: apiMessage.senderId,
        receiverId: apiMessage.receiverId
    }
}

export const getMockMembers = () => [
    { accountId: 10, name: "Nguyễn Văn A", lastMessage: "Cảm ơn coach!", isOnline: true },
    { accountId: 11, name: "Trần Thị B", lastMessage: "Tôi cần hỗ trợ", isOnline: false },
    { accountId: 12, name: "Lê Văn C", lastMessage: "Làm sao để bỏ thuốc?", isOnline: true },
    { accountId: 13, name: "Phạm Thị D", lastMessage: "Coach ơi!", isOnline: true }
]

// Test function để gọi từ browser console
window.testChatAPI = testChatAPI

// Test coaches API
export const testCoachesAPI = async (token) => {
    console.log("🧪 Testing Coaches API...")

    try {
        const response = await fetch(`${API_BASE_URL}/api/Member/all-coaches`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("Coaches Response Status:", response.status)
        if (response.ok) {
            const data = await response.json()
            console.log("✅ Coaches data:", data)
            return data
        } else {
            console.log("❌ Failed to get coaches:", await response.text())
        }
    } catch (error) {
        console.error("❌ Get coaches error:", error)
    }

    return null
}

// Test function để gọi từ browser console
window.testCoachesAPI = testCoachesAPI

// Test coach receiving messages scenario
export const testCoachReceiveMessages = async (token, coachTestData = {}) => {
    console.log("🧪 Testing Coach Receive Messages...")

    const {
        mockMemberIds = [10, 12, 13],
        testMessage = "Hello coach, I need help!"
    } = coachTestData

    // Simulate members sending messages to coach
    for (const memberId of mockMemberIds) {
        console.log(`📤 Simulating member ${memberId} sending message to coach...`)

        // Note: Trong thực tế, member sẽ gửi tin nhắn tới coach
        // Ở đây chúng ta test bằng cách gọi API từ perspective của member
        try {
            const response = await fetch(`${API_BASE_URL}/api/Chat/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Giả sử dùng token của member
                },
                body: JSON.stringify({
                    receiverId: 11, // Giả sử coach có ID = 11
                    message: `${testMessage} - From Member ${memberId}`
                }),
            })

            if (response.ok) {
                console.log(`✅ Member ${memberId} sent message successfully`)
            } else {
                console.log(`❌ Member ${memberId} failed to send message`)
            }
        } catch (error) {
            console.error(`❌ Error from member ${memberId}:`, error)
        }
    }

    // Test coach getting conversation with each member
    console.log("📥 Testing coach getting conversations...")
    for (const memberId of mockMemberIds) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Chat/conversation?receiverId=${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Coach token
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log(`✅ Coach conversation with member ${memberId}:`, data)
            } else {
                console.log(`❌ Failed to get conversation with member ${memberId}`)
            }
        } catch (error) {
            console.error(`❌ Conversation error with member ${memberId}:`, error)
        }
    }
}

// Test function để gọi từ browser console
window.testCoachReceiveMessages = testCoachReceiveMessages
