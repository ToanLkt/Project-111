import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
    createPaymentRequest,
    fetchPackagesRequest,
    fetchCurrentPackageRequest,
    fetchUserTransactionsRequest,
    checkPurchaseEligibilityRequest,
    clearPaymentState,
} from '../redux/components/payment/paymentSlice'
import {
    selectPaymentState,
    selectCurrentPackage,
    selectPackages,
    selectUserTransactions,
    selectCanPurchase,
    selectPurchaseCheckMessage,
    selectHasActivePackage,
    selectActivePackageInfo,
    selectPaymentLoading,
    selectPaymentSuccess,
    selectPaymentError,
} from '../redux/components/payment/paymentSelectors'

// Custom hook để quản lý payment
export const usePayment = () => {
    const dispatch = useDispatch()

    // Selectors
    const paymentState = useSelector(selectPaymentState)
    const currentPackage = useSelector(selectCurrentPackage)
    const packages = useSelector(selectPackages)
    const userTransactions = useSelector(selectUserTransactions)
    const canPurchase = useSelector(selectCanPurchase)
    const purchaseCheckMessage = useSelector(selectPurchaseCheckMessage)
    const hasActivePackage = useSelector(selectHasActivePackage)
    const activePackageInfo = useSelector(selectActivePackageInfo)
    const paymentLoading = useSelector(selectPaymentLoading)
    const paymentSuccess = useSelector(selectPaymentSuccess)
    const paymentError = useSelector(selectPaymentError)

    // Actions
    const createPayment = useCallback((paymentData) => {
        dispatch(createPaymentRequest(paymentData))
    }, [dispatch])

    const fetchPackages = useCallback(() => {
        dispatch(fetchPackagesRequest())
    }, [dispatch])

    const fetchCurrentPackage = useCallback(() => {
        dispatch(fetchCurrentPackageRequest())
    }, [dispatch])

    const fetchUserTransactions = useCallback(() => {
        dispatch(fetchUserTransactionsRequest())
    }, [dispatch])

    const checkPurchaseEligibility = useCallback(() => {
        dispatch(checkPurchaseEligibilityRequest())
    }, [dispatch])

    const clearPayment = useCallback(() => {
        dispatch(clearPaymentState())
    }, [dispatch])

    // Effect để tự động load data khi mount
    useEffect(() => {
        fetchPackages()
        fetchCurrentPackage()
    }, [fetchPackages, fetchCurrentPackage])

    return {
        // State
        paymentState,
        currentPackage,
        packages,
        userTransactions,
        canPurchase,
        purchaseCheckMessage,
        hasActivePackage,
        activePackageInfo,
        paymentLoading,
        paymentSuccess,
        paymentError,

        // Actions
        createPayment,
        fetchPackages,
        fetchCurrentPackage,
        fetchUserTransactions,
        checkPurchaseEligibility,
        clearPayment,
    }
}

// Hook để kiểm tra xem có thể mua gói không
export const usePurchaseEligibility = () => {
    const dispatch = useDispatch()
    const canPurchase = useSelector(selectCanPurchase)
    const purchaseCheckMessage = useSelector(selectPurchaseCheckMessage)
    const checkingEligibility = useSelector(state => state.payment?.checkingPurchaseEligibility)

    const checkEligibility = useCallback(() => {
        dispatch(checkPurchaseEligibilityRequest())
    }, [dispatch])

    useEffect(() => {
        checkEligibility()
    }, [checkEligibility])

    return {
        canPurchase,
        purchaseCheckMessage,
        checkingEligibility,
        checkEligibility,
    }
}

// Hook để lấy thông tin gói đang dùng
export const useCurrentPackage = () => {
    const currentPackage = useSelector(selectCurrentPackage)
    const hasActivePackage = useSelector(selectHasActivePackage)
    const activePackageInfo = useSelector(selectActivePackageInfo)
    const loading = useSelector(state => state.payment?.currentPackageLoading)

    return {
        currentPackage,
        hasActivePackage,
        activePackageInfo,
        loading,
    }
}
