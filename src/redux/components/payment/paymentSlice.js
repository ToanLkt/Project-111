import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // Payment state
    paymentLoading: false,
    paymentSuccess: false,
    paymentError: null,

    // Package state
    packages: [],
    packagesLoading: false,
    packagesError: null,

    // Current active package của user
    currentPackage: null,
    currentPackageLoading: false,

    // Payment success data
    lastSuccessfulPayment: null,

    // User transactions từ API
    userTransactions: [],
    userTransactionsLoading: false,
    userTransactionsError: null,

    // Check purchase eligibility
    canPurchase: true,
    purchaseCheckMessage: '',
    checkingPurchaseEligibility: false,

    // Transaction verification from Google Docs
    transactionCheckLoading: false,
    transactionCheckError: null,
    verifiedTransactions: [],
    isCheckingTransaction: false,
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

            // Set current package từ payment thành công
            const { packageData } = action.payload
            if (packageData) {
                state.currentPackage = packageData
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
        fetchCurrentPackageRequest: (state) => {
            state.currentPackageLoading = true
            state.currentPackageError = null
        },
        fetchCurrentPackageSuccess: (state, action) => {
            state.currentPackageLoading = false
            state.currentPackage = action.payload
            state.currentPackageError = null
        },
        fetchCurrentPackageFailure: (state, action) => {
            state.currentPackageLoading = false
            state.currentPackageError = action.payload
        },
        setCurrentPackage: (state, action) => {
            state.currentPackage = action.payload
        },
        clearCurrentPackage: (state) => {
            state.currentPackage = null
            state.lastSuccessfulPayment = null
        },

        // User transactions actions
        fetchUserTransactionsRequest: (state) => {
            state.userTransactionsLoading = true
            state.userTransactionsError = null
        },
        fetchUserTransactionsSuccess: (state, action) => {
            state.userTransactionsLoading = false
            state.userTransactions = action.payload
            state.userTransactionsError = null
        },
        fetchUserTransactionsFailure: (state, action) => {
            state.userTransactionsLoading = false
            state.userTransactionsError = action.payload
        },

        // Check purchase eligibility actions
        checkPurchaseEligibilityRequest: (state) => {
            state.checkingPurchaseEligibility = true
        },
        checkPurchaseEligibilitySuccess: (state, action) => {
            state.checkingPurchaseEligibility = false
            state.canPurchase = action.payload.canPurchase
            state.purchaseCheckMessage = action.payload.message
        },
        checkPurchaseEligibilityFailure: (state) => {
            state.checkingPurchaseEligibility = false
            state.canPurchase = true // Cho phép mua nếu không check được
            state.purchaseCheckMessage = ''
        },

        // Transaction verification actions
        checkTransactionRequest: (state, action) => {
            state.transactionCheckLoading = true
            state.transactionCheckError = null
            state.isCheckingTransaction = true
        },
        checkTransactionSuccess: (state, action) => {
            state.transactionCheckLoading = false
            state.transactionCheckError = null
            state.verifiedTransactions.push(action.payload)
        },
        checkTransactionFailure: (state, action) => {
            state.transactionCheckLoading = false
            state.transactionCheckError = action.payload
        },
        stopTransactionCheck: (state) => {
            state.isCheckingTransaction = false
            state.transactionCheckLoading = false
        },
        clearTransactionCheck: (state) => {
            state.transactionCheckLoading = false
            state.transactionCheckError = null
            state.isCheckingTransaction = false
        },

        // Clear state
        clearPaymentState: (state) => {
            state.paymentLoading = false
            state.paymentSuccess = false
            state.paymentError = null
        },
        clearAllPaymentData: (state) => {
            return { ...initialState }
        },

        // Update current package after successful payment
        updateCurrentPackage: (state, action) => {
            state.currentPackage = action.payload
            console.log("📦 Current package updated:", action.payload)
        },

        // Set last successful payment
        setLastSuccessfulPayment: (state, action) => {
            state.lastSuccessfulPayment = action.payload
            console.log("💳 Last successful payment set:", action.payload)
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
    fetchCurrentPackageRequest,
    fetchCurrentPackageSuccess,
    fetchCurrentPackageFailure,
    setCurrentPackage,
    clearCurrentPackage,
    fetchUserTransactionsRequest,
    fetchUserTransactionsSuccess,
    fetchUserTransactionsFailure,
    checkPurchaseEligibilityRequest,
    checkPurchaseEligibilitySuccess,
    checkPurchaseEligibilityFailure,
    clearPaymentState,
    clearAllPaymentData,
    checkTransactionRequest,
    checkTransactionSuccess,
    checkTransactionFailure,
    stopTransactionCheck,
    clearTransactionCheck,
    updateCurrentPackage,
    setLastSuccessfulPayment,
} = paymentSlice.actions

export default paymentSlice.reducer