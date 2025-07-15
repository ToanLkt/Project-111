import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects'
import {
    createPaymentRequest,
    createPaymentSuccess,
    createPaymentFailure,
    fetchPackagesRequest,
    fetchPackagesSuccess,
    fetchPackagesFailure,
    fetchCurrentPackageRequest,
    fetchCurrentPackageSuccess,
    fetchCurrentPackageFailure,
    fetchUserTransactionsRequest,
    fetchUserTransactionsSuccess,
    fetchUserTransactionsFailure,
    checkPurchaseEligibilityRequest,
    checkPurchaseEligibilitySuccess,
    checkPurchaseEligibilityFailure,
} from './paymentSlice'

// API Base URL
const API_BASE_URL = 'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api'

// Selector to get token from account state
const getToken = (state) => state.account?.token
const getUser = (state) => state.account?.user

// Helper function to get user ID
function* getUserId() {
    const user = yield select(getUser)
    if (!user) return null

    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        user.userId ||
        user.id ||
        null
}

// API call functions
function* apiCall(url, options = {}) {
    try {
        const token = yield select(getToken)

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            ...options,
        }

        console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`)

        const response = yield call(fetch, url, defaultOptions)

        if (!response.ok) {
            let errorText;
            try {
                const responseClone = response.clone();
                const errorJson = yield call([responseClone, 'json'])
                errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson)
            } catch {
                try {
                    const errorText2 = yield call([response, 'text'])
                    errorText = errorText2;
                } catch (textError) {
                    errorText = `HTTP ${response.status} - Cannot read response body`;
                }
            }
            throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = yield call([response, 'json'])
            console.log(`✅ API Success: ${url}`, data)
            return data
        } else {
            const text = yield call([response, 'text'])
            console.log(`✅ API Success (text): ${url}`, text)
            return text
        }
    } catch (error) {
        console.error(`❌ API Error: ${url}`, error)
        throw error
    }
}

// API Functions
function* fetchPackagesApi() {
    return yield call(apiCall, `${API_BASE_URL}/PackageMembership`)
}

function* fetchUserTransactionsApi() {
    return yield call(apiCall, `${API_BASE_URL}/Member/my-transactions`)
}

function* createPaymentApi(paymentData) {
    return yield call(apiCall, `${API_BASE_URL}/Payment`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
    })
}

// Saga functions
function* fetchPackagesSaga() {
    try {
        console.log('📦 Fetching packages...')
        const packages = yield call(fetchPackagesApi)
        yield put(fetchPackagesSuccess(packages))
    } catch (error) {
        console.error('❌ Fetch packages error:', error)
        yield put(fetchPackagesFailure(error.message))
    }
}

function* fetchUserTransactionsSaga() {
    try {
        console.log('💳 Fetching user transactions...')
        const transactions = yield call(fetchUserTransactionsApi)
        yield put(fetchUserTransactionsSuccess(transactions))

        // Lấy giao dịch gần nhất (newest) và kiểm tra xem có còn hạn không
        if (transactions && transactions.length > 0) {
            // Sắp xếp theo thời gian tạo để lấy giao dịch gần nhất
            const sortedTransactions = [...transactions].sort((a, b) => {
                return new Date(b.timeBuy || b.createdDate || b.startDate) - new Date(a.timeBuy || a.createdDate || a.startDate)
            })

            const latestTransaction = sortedTransactions[0]
            console.log('📅 Latest transaction:', latestTransaction)

            // Kiểm tra xem giao dịch gần nhất có còn hạn không
            const now = new Date()
            const endDate = new Date(latestTransaction.endDate)
            const isActive = endDate > now && latestTransaction.paymentStatus === 'Success'

            if (isActive) {
                console.log('✅ Latest transaction is still active:', latestTransaction)
                yield put(fetchCurrentPackageSuccess(latestTransaction))
            } else {
                console.log('ℹ️ Latest transaction has expired or failed')
                yield put(fetchCurrentPackageSuccess(null))
            }
        } else {
            console.log('ℹ️ No transactions found')
            yield put(fetchCurrentPackageSuccess(null))
        }
    } catch (error) {
        console.error('❌ Fetch user transactions error:', error)
        yield put(fetchUserTransactionsFailure(error.message))
        yield put(fetchCurrentPackageFailure(error.message))
    }
}

function* fetchCurrentPackageSaga() {
    try {
        console.log('🔍 Fetching current package...')
        // Fetch user transactions để tìm gói đang hoạt động
        yield call(fetchUserTransactionsSaga)
    } catch (error) {
        console.error('❌ Fetch current package error:', error)
        yield put(fetchCurrentPackageFailure(error.message))
    }
}

function* createPaymentSaga(action) {
    try {
        console.log('💰 Creating payment...', action.payload)

        const userId = yield call(getUserId)
        if (!userId) {
            throw new Error('User ID not found')
        }        // Kiểm tra xem user có đang dùng gói nào chưa hết hạn không
        console.log('🔍 Checking for active package before creating payment...')
        const transactions = yield call(fetchUserTransactionsApi)

        if (transactions && transactions.length > 0) {
            // Lấy giao dịch gần nhất
            const sortedTransactions = [...transactions].sort((a, b) => {
                return new Date(b.timeBuy || b.createdDate || b.startDate) - new Date(a.timeBuy || a.createdDate || a.startDate)
            })

            const latestTransaction = sortedTransactions[0]
            const now = new Date()
            const endDate = new Date(latestTransaction.endDate)

            // Kiểm tra giao dịch gần nhất có còn hạn không
            if (endDate > now && latestTransaction.paymentStatus === 'Success') {
                throw new Error(`Bạn đang sử dụng một gói chưa hết hạn (hết hạn: ${endDate.toLocaleDateString('vi-VN')}). Vui lòng chờ đến khi hết hạn để mua gói mới.`)
            }
        }

        const paymentData = {
            accountId: userId,
            packageMembershipId: action.payload.packageMembershipId,
            totalPrice: action.payload.totalPrice,
            paymentStatus: action.payload.paymentStatus || 'Success',
            duration: action.payload.duration,
            transactionCode: action.payload.transactionCode,
            timeBuy: action.payload.timeBuy,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
        }

        const response = yield call(createPaymentApi, paymentData)

        // Tạo package data để lưu vào Redux (gói đang dùng)
        const packageData = {
            package_membership_ID: action.payload.packageMembershipId,
            accountId: userId,
            totalPrice: action.payload.totalPrice,
            paymentStatus: action.payload.paymentStatus || 'Success',
            duration: action.payload.duration,
            transactionCode: action.payload.transactionCode,
            timeBuy: action.payload.timeBuy,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
            category: action.payload.category,
            description: action.payload.description,
            price: action.payload.totalPrice,
        }

        console.log('✅ Payment created successfully:', response)
        yield put(createPaymentSuccess({ response, packageData }))

        // Lưu gói vừa mua làm gói đang dùng hiện tại
        yield put(fetchCurrentPackageSuccess(packageData))

        // Refresh user transactions sau khi payment thành công
        yield call(fetchUserTransactionsSaga)

    } catch (error) {
        console.error('❌ Create payment error:', error)
        yield put(createPaymentFailure(error.message))
    }
}

// Function để tự động tải gói đang dùng sau khi login thành công
// Gọi function này từ login saga
function* loadCurrentPackageAfterLogin() {
    try {
        console.log('🏠 Loading current package after login...')
        yield call(fetchUserTransactionsSaga)
    } catch (error) {
        console.error('❌ Load current package after login error:', error)
    }
}

// Helper function để kiểm tra xem có thể mua gói mới không
// Export để sử dụng từ component
function* canPurchaseNewPackage() {
    try {
        console.log('🔍 Checking if can purchase new package...')
        const transactions = yield call(fetchUserTransactionsApi)

        if (transactions && transactions.length > 0) {
            // Lấy giao dịch gần nhất
            const sortedTransactions = [...transactions].sort((a, b) => {
                return new Date(b.timeBuy || b.createdDate || b.startDate) - new Date(a.timeBuy || a.createdDate || a.startDate)
            })

            const latestTransaction = sortedTransactions[0]
            const now = new Date()
            const endDate = new Date(latestTransaction.endDate)

            // Kiểm tra giao dịch gần nhất có còn hạn không
            if (endDate > now && latestTransaction.paymentStatus === 'Success') {
                return {
                    canPurchase: false,
                    message: `Bạn đang sử dụng một gói chưa hết hạn (hết hạn: ${endDate.toLocaleDateString('vi-VN')}). Vui lòng chờ đến khi hết hạn để mua gói mới.`,
                    activePackage: latestTransaction
                }
            }
        }

        return {
            canPurchase: true,
            message: 'Có thể mua gói mới',
            activePackage: null
        }
    } catch (error) {
        console.error('❌ Error checking purchase eligibility:', error)
        return {
            canPurchase: true, // Cho phép mua nếu không check được
            message: 'Có thể mua gói mới',
            activePackage: null
        }
    }
}

// Export function để sử dụng từ component
export { canPurchaseNewPackage, loadCurrentPackageAfterLogin, checkPurchaseEligibilitySaga }

// Saga để kiểm tra khả năng mua gói mới
function* checkPurchaseEligibilitySaga() {
    try {
        yield put(checkPurchaseEligibilityRequest())
        const result = yield call(canPurchaseNewPackage)
        yield put(checkPurchaseEligibilitySuccess(result))
        return result
    } catch (error) {
        console.error('❌ Check purchase eligibility error:', error)
        yield put(checkPurchaseEligibilityFailure())
        return { canPurchase: true, message: '', activePackage: null }
    }
}

// Watcher sagas
function* watchPaymentSagas() {
    yield takeLatest(fetchPackagesRequest.type, fetchPackagesSaga)
    yield takeLatest(fetchUserTransactionsRequest.type, fetchUserTransactionsSaga)
    yield takeLatest(fetchCurrentPackageRequest.type, fetchCurrentPackageSaga)
    yield takeEvery(createPaymentRequest.type, createPaymentSaga)
    yield takeLatest(checkPurchaseEligibilityRequest.type, checkPurchaseEligibilitySaga)
}

export default watchPaymentSagas