import { createSlice } from '@reduxjs/toolkit'

// Helper functions để lưu/lấy currentPackage từ localStorage
const getCurrentPackageFromStorage = () => {
    try {
        const storedPackage = localStorage.getItem('currentPackage')
        return storedPackage ? JSON.parse(storedPackage) : null
    } catch (error) {
        console.error('Error reading currentPackage from localStorage:', error)
        return null
    }
}

const saveCurrentPackageToStorage = (currentPackage) => {
    try {
        if (currentPackage) {
            localStorage.setItem('currentPackage', JSON.stringify(currentPackage))
        } else {
            localStorage.removeItem('currentPackage')
        }
    } catch (error) {
        console.error('Error saving currentPackage to localStorage:', error)
    }
}

const getCompletedPaymentsFromStorage = () => {
    try {
        const stored = localStorage.getItem('completedPayments')
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Error reading completedPayments from localStorage:', error)
        return []
    }
}

const saveCompletedPaymentsToStorage = (completedPayments) => {
    try {
        localStorage.setItem('completedPayments', JSON.stringify(completedPayments))
    } catch (error) {
        console.error('Error saving completedPayments to localStorage:', error)
    }
}

const initialState = {
    // Payment state
    paymentLoading: false,
    paymentSuccess: false,
    paymentError: null,

    // Package state
    packages: [],
    packagesLoading: false,
    packagesError: null,

    // Current package - khôi phục từ localStorage
    currentPackage: getCurrentPackageFromStorage(),
    currentPackageLoading: false,

    // Completed payments - khôi phục từ localStorage
    completedPayments: getCompletedPaymentsFromStorage(),

    // Today cigarettes
    todayCigarettesLoading: false,
    todayCigarettesSuccess: false,
    todayCigarettesError: null,
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // Payment actions
        createPaymentRequest: (state) => {
            state.paymentLoading = true
            state.paymentSuccess = false
            state.paymentError = null
        },
        createPaymentSuccess: (state, action) => {
            state.paymentLoading = false
            state.paymentSuccess = true
            state.paymentError = null

            // Add to completed payments và lưu vào localStorage
            if (action.payload.packageMembershipId && action.payload.accountId) {
                const paymentKey = `${action.payload.packageMembershipId}_${action.payload.accountId}`
                if (!state.completedPayments.includes(paymentKey)) {
                    state.completedPayments.push(paymentKey)
                    saveCompletedPaymentsToStorage(state.completedPayments)
                }
            }
        },
        createPaymentFailure: (state, action) => {
            state.paymentLoading = false
            state.paymentSuccess = false
            state.paymentError = action.payload
        },

        // Package actions
        fetchPackagesRequest: (state) => {
            state.packagesLoading = true
            state.packagesError = null
        },
        fetchPackagesSuccess: (state, action) => {
            state.packagesLoading = false
            state.packages = action.payload
            state.packagesError = null
        },
        fetchPackagesFailure: (state, action) => {
            state.packagesLoading = false
            state.packagesError = action.payload
        },

        // Current package actions
        setCurrentPackage: (state, action) => {
            state.currentPackage = action.payload
            // Lưu vào localStorage khi set currentPackage
            saveCurrentPackageToStorage(action.payload)
            console.log('✅ Current package saved to Redux and localStorage:', action.payload)
        },
        clearCurrentPackage: (state) => {
            state.currentPackage = null
            // Xóa khỏi localStorage
            saveCurrentPackageToStorage(null)
            console.log('🗑️ Current package cleared from Redux and localStorage')
        },

        // THÊM: Action để fetch current package từ API
        fetchCurrentPackageRequest: (state) => {
            state.currentPackageLoading = true
        },
        fetchCurrentPackageSuccess: (state, action) => {
            state.currentPackageLoading = false
            state.currentPackage = action.payload
            // Lưu vào localStorage
            saveCurrentPackageToStorage(action.payload)
            console.log('✅ Current package fetched and saved:', action.payload)
        },
        fetchCurrentPackageFailure: (state, action) => {
            state.currentPackageLoading = false
            console.error('❌ Failed to fetch current package:', action.payload)
        },

        // THÊM: Action để khôi phục session package
        restorePackageSession: (state) => {
            const storedPackage = getCurrentPackageFromStorage()
            const storedPayments = getCompletedPaymentsFromStorage()

            if (storedPackage) {
                state.currentPackage = storedPackage
                console.log('🔄 Package session restored:', storedPackage)
            }

            if (storedPayments.length > 0) {
                state.completedPayments = storedPayments
                console.log('🔄 Completed payments restored:', storedPayments)
            }
        },

        // Clear state
        clearPaymentState: (state) => {
            state.paymentLoading = false
            state.paymentSuccess = false
            state.paymentError = null
        },

        // Today cigarettes actions
        updateTodayCigarettesRequest: (state) => {
            state.todayCigarettesLoading = true
            state.todayCigarettesSuccess = false
            state.todayCigarettesError = null
        },
        updateTodayCigarettesSuccess: (state, action) => {
            state.todayCigarettesLoading = false
            state.todayCigarettesSuccess = true
            state.todayCigarettesError = null
        },
        updateTodayCigarettesFailure: (state, action) => {
            state.todayCigarettesLoading = false
            state.todayCigarettesSuccess = false
            state.todayCigarettesError = action.payload
        },

        // Completed payments actions
        addCompletedPayment: (state, action) => {
            const { paymentKey } = action.payload
            if (!state.completedPayments.includes(paymentKey)) {
                state.completedPayments.push(paymentKey)
                saveCompletedPaymentsToStorage(state.completedPayments)
                console.log('✅ Payment key added:', paymentKey)
            }
        },

        // THÊM: Action để clear toàn bộ khi logout
        clearAllPaymentData: (state) => {
            state.currentPackage = null
            state.completedPayments = []
            state.paymentSuccess = false
            state.paymentError = null

            // Clear localStorage
            localStorage.removeItem('currentPackage')
            localStorage.removeItem('completedPayments')
            console.log('🗑️ All payment data cleared')
        },
    }
})

export const {
    createPaymentRequest,
    createPaymentSuccess,
    createPaymentFailure,
    fetchPackagesRequest,
    fetchPackagesSuccess,
    fetchPackagesFailure,
    setCurrentPackage,
    clearCurrentPackage,
    fetchCurrentPackageRequest,
    fetchCurrentPackageSuccess,
    fetchCurrentPackageFailure,
    restorePackageSession,
    clearPaymentState,
    updateTodayCigarettesRequest,
    updateTodayCigarettesSuccess,
    updateTodayCigarettesFailure,
    addCompletedPayment,
    clearAllPaymentData,
} = paymentSlice.actions

export default paymentSlice.reducer