// Utility functions để test và debug payment system
export const PaymentTestUtils = {
    // Test current package state
    logCurrentPackageState: () => {
        const currentPackage = localStorage.getItem('currentPackage')
        const completedPayments = localStorage.getItem('completedPayments')

        console.log('🔍 Payment Test Utils - Current State:')
        console.log('Current Package:', currentPackage ? JSON.parse(currentPackage) : 'None')
        console.log('Completed Payments:', completedPayments ? JSON.parse(completedPayments) : [])
    },

    // Test user package ownership
    testUserPackageOwnership: (userId, packageId) => {
        const completedPayments = JSON.parse(localStorage.getItem('completedPayments') || '[]')
        const paymentKey = `${packageId}_${userId}`

        console.log('🔍 Testing package ownership:')
        console.log('User ID:', userId)
        console.log('Package ID:', packageId)
        console.log('Payment Key:', paymentKey)
        console.log('Owns Package:', completedPayments.includes(paymentKey))

        return completedPayments.includes(paymentKey)
    },

    // Simulate payment completion
    simulatePayment: (userId, packageId, packageData) => {
        console.log('🧪 Simulating payment for testing...')

        // Add to completed payments
        const completedPayments = JSON.parse(localStorage.getItem('completedPayments') || '[]')
        const paymentKey = `${packageId}_${userId}`

        if (!completedPayments.includes(paymentKey)) {
            completedPayments.push(paymentKey)
            localStorage.setItem('completedPayments', JSON.stringify(completedPayments))
        }

        // Set as current package
        const currentPackage = {
            package_membership_ID: packageId,
            accountId: userId,
            paymentStatus: "Success",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            ...packageData
        }

        localStorage.setItem('currentPackage', JSON.stringify(currentPackage))

        console.log('✅ Payment simulation completed')
        PaymentTestUtils.logCurrentPackageState()
    },

    // Clear all payment data
    clearAllPaymentData: () => {
        localStorage.removeItem('currentPackage')
        localStorage.removeItem('completedPayments')
        console.log('🗑️ All payment data cleared')
    },

    // Check if user has active package
    hasActivePackage: (userId) => {
        const currentPackage = JSON.parse(localStorage.getItem('currentPackage') || 'null')

        if (!currentPackage || currentPackage.accountId !== userId) {
            return false
        }

        // Check if not expired
        if (currentPackage.endDate) {
            const endDate = new Date(currentPackage.endDate)
            const now = new Date()
            return endDate > now
        }

        return true
    }
}

// Attach to window for console debugging
if (typeof window !== 'undefined') {
    window.PaymentTestUtils = PaymentTestUtils
}
