// Utility functions cho payment

// Format tiền tệ VND
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

// Format ngày tháng
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
}

// Kiểm tra gói có còn hoạt động không
export const isPackageActive = (packageData) => {
    if (!packageData) return false

    const now = new Date()
    const endDate = new Date(packageData.endDate)

    return endDate > now && packageData.paymentStatus === 'Success'
}

// Tính số ngày còn lại của gói
export const getDaysRemaining = (endDate) => {
    const now = new Date()
    const end = new Date(endDate)

    if (end <= now) return 0

    return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
}

// Lấy màu sắc theo trạng thái gói
export const getPackageStatusColor = (packageData) => {
    if (!packageData) return 'gray'

    const daysRemaining = getDaysRemaining(packageData.endDate)

    if (daysRemaining <= 0) return 'red' // Hết hạn
    if (daysRemaining <= 7) return 'orange' // Sắp hết hạn
    return 'green' // Còn hoạt động
}

// Lấy text trạng thái gói
export const getPackageStatusText = (packageData) => {
    if (!packageData) return 'Chưa có gói'

    const daysRemaining = getDaysRemaining(packageData.endDate)

    if (daysRemaining <= 0) return 'Đã hết hạn'
    if (daysRemaining <= 7) return `Sắp hết hạn (${daysRemaining} ngày)`
    return `Còn ${daysRemaining} ngày`
}

// Validate dữ liệu payment
export const validatePaymentData = (paymentData) => {
    const errors = []

    if (!paymentData.packageMembershipId) {
        errors.push('Vui lòng chọn gói thành viên')
    }

    if (!paymentData.totalPrice || paymentData.totalPrice <= 0) {
        errors.push('Giá gói không hợp lệ')
    }

    if (!paymentData.startDate) {
        errors.push('Ngày bắt đầu không hợp lệ')
    }

    if (!paymentData.endDate) {
        errors.push('Ngày kết thúc không hợp lệ')
    }

    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    if (paymentData.startDate && paymentData.endDate) {
        const start = new Date(paymentData.startDate)
        const end = new Date(paymentData.endDate)

        if (end <= start) {
            errors.push('Ngày kết thúc phải sau ngày bắt đầu')
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// Tạo transaction code unique
export const generateTransactionCode = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `TXN_${timestamp}_${random}`.toUpperCase()
}

// Tính toán ngày kết thúc dựa trên duration (tháng)
export const calculateEndDate = (startDate, durationMonths) => {
    const start = new Date(startDate)
    const end = new Date(start)
    end.setMonth(end.getMonth() + durationMonths)
    return end.toISOString()
}
