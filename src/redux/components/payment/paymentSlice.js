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

    // Current package
    currentPackage: null,

    // Completed payments tracking
    completedPayments: [],

    // Payment history
    paymentHistory: [],

    // Cigarettes state
    cigarettesLoading: false,
    cigarettesSuccess: false,
    cigarettesError: null,
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // Payment actions
        createPaymentRequest: (state, action) => {
            console.log('🔄 createPaymentRequest triggered');
            state.paymentLoading = true
            state.paymentError = null
            state.paymentSuccess = false
        },
        createPaymentSuccess: (state, action) => {
            console.log('✅ createPaymentSuccess triggered:', action.payload);
            state.paymentLoading = false
            state.paymentSuccess = true
            state.paymentError = null

            // Add to payment history
            state.paymentHistory.push(action.payload)

            // Add to completed payments tracking
            const paymentKey = `${action.payload.packageMembershipId}_${action.payload.accountId}`
            if (!state.completedPayments.includes(paymentKey)) {
                state.completedPayments.push(paymentKey)
            }
        },
        createPaymentFailure: (state, action) => {
            console.log('❌ createPaymentFailure triggered:', action.payload);
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
        },
        clearCurrentPackage: (state) => {
            state.currentPackage = null
        },

        // Cigarettes actions
        updateTodayCigarettesRequest: (state, action) => {
            state.cigarettesLoading = true
            state.cigarettesError = null
            state.cigarettesSuccess = false
        },
        updateTodayCigarettesSuccess: (state, action) => {
            state.cigarettesLoading = false
            state.cigarettesSuccess = true
            state.cigarettesError = null
        },
        updateTodayCigarettesFailure: (state, action) => {
            state.cigarettesLoading = false
            state.cigarettesSuccess = false
            state.cigarettesError = action.payload
        },

        // Clear state actions
        clearPaymentState: (state) => {
            console.log('🧹 clearPaymentState triggered');
            state.paymentLoading = false
            state.paymentSuccess = false
            state.paymentError = null
        },
        clearAllPaymentData: (state) => {
            return initialState
        },
    },
})

export const {
    // Payment actions
    createPaymentRequest,
    createPaymentSuccess,
    createPaymentFailure,

    // Package actions
    fetchPackagesRequest,
    fetchPackagesSuccess,
    fetchPackagesFailure,

    // Current package actions
    setCurrentPackage,
    clearCurrentPackage,

    // Cigarettes actions
    updateTodayCigarettesRequest,
    updateTodayCigarettesSuccess,
    updateTodayCigarettesFailure,

    // Clear state actions
    clearPaymentState,
    clearAllPaymentData,
} = paymentSlice.actions

export default paymentSlice.reducer