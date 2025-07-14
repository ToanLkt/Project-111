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

    // Completed payments
    completedPayments: [],

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
            // Add to completed payments
            if (action.payload.packageMembershipId && action.payload.accountId) {
                const paymentKey = `${action.payload.packageMembershipId}_${action.payload.accountId}`
                if (!state.completedPayments.includes(paymentKey)) {
                    state.completedPayments.push(paymentKey)
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
        },
        clearCurrentPackage: (state) => {
            state.currentPackage = null
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
    clearPaymentState,
    updateTodayCigarettesRequest,
    updateTodayCigarettesSuccess,
    updateTodayCigarettesFailure,
} = paymentSlice.actions

export default paymentSlice.reducer