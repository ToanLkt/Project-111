import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects'
import {
    createPaymentRequest,
    createPaymentSuccess,
    createPaymentFailure,
    fetchPackagesRequest,
    fetchPackagesSuccess,
    fetchPackagesFailure,
    updateTodayCigarettesRequest,
    updateTodayCigarettesSuccess,
    updateTodayCigarettesFailure,
} from './paymentSlice'

// API Base URL
const API_BASE_URL = 'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api'

// Selector to get token from account state
const getToken = (state) => state.account?.token
const getUser = (state) => state.account?.user

// API call functions
function* apiCall(url, options = {}) {
    try {
        console.log('🚀 Making API call to:', url);
        console.log('📤 Request body:', options.body);

        const response = yield call(fetch, url, options)

        console.log('📡 API Response status:', response.status);

        if (!response.ok) {
            // Lấy thông tin lỗi chi tiết từ server
            let errorText;
            try {
                const errorJson = yield call([response, 'json'])
                errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson)
                console.error('❌ API Error JSON:', errorJson);
            } catch {
                errorText = yield call([response, 'text'])
                console.error('❌ API Error Text:', errorText);
            }
            throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        // Xử lý response tùy theo content-type
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = yield call([response, 'json'])
            console.log('✅ API Response data:', data);
            return data
        } else {
            const text = yield call([response, 'text'])
            console.log('✅ API Response text:', text);
            return text
        }
    } catch (error) {
        console.error('❌ API Call failed:', error);
        throw error
    }
}

// Create payment saga
function* createPaymentSaga(action) {
    try {
        const token = yield select(getToken)
        const user = yield select(getUser)

        console.log('🔐 Token:', token ? 'Có token' : 'Không có token')
        console.log('👤 User:', user)

        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.')
        }

        // Extract user ID
        const getUserId = (user) => {
            if (!user) return null
            return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
                user["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] ||
                user.userId ||
                user.id ||
                user.accountId ||
                null
        }

        const accountId = getUserId(user)
        console.log('🆔 Account ID:', accountId)

        // Chuẩn hóa dữ liệu payment theo đúng format API mong đợi
        const paymentData = {
            packageMembershipId: Number(action.payload.packageMembershipId),
            timeBuy: action.payload.timeBuy || new Date().toISOString(),
            totalPrice: Number(action.payload.totalPrice),
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
            paymentStatus: action.payload.paymentStatus || "Success",
            transactionCode: action.payload.transactionCode || ""
        }

        console.log('💳 Payment data sending to API:', paymentData)

        // Kiểm tra tất cả field bắt buộc
        const requiredFields = ['packageMembershipId', 'totalPrice', 'startDate', 'endDate'];
        for (const field of requiredFields) {
            if (!paymentData[field] && paymentData[field] !== 0) {
                throw new Error(`Field ${field} là bắt buộc!`);
            }
        }

        const response = yield call(apiCall, `${API_BASE_URL}/Payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(paymentData),
        })

        console.log('✅ Payment created successfully:', response)

        yield put(createPaymentSuccess({
            ...paymentData,
            response,
            accountId // Thêm accountId để tracking
        }))

    } catch (error) {
        console.error('❌ Payment creation failed:', error)
        yield put(createPaymentFailure(error.message))
    }
}

// Fetch packages saga
function* fetchPackagesSaga() {
    try {
        console.log('🚀 Fetching packages...')

        const packages = yield call(apiCall, `${API_BASE_URL}/PackageMembership`)

        console.log('✅ Packages fetched successfully:', packages)

        yield put(fetchPackagesSuccess(Array.isArray(packages) ? packages : []))

    } catch (error) {
        console.error('❌ Fetch packages failed:', error)
        yield put(fetchPackagesFailure(error.message))
    }
}

// Update today cigarettes saga
function* updateTodayCigarettesSaga(action) {
    try {
        const token = yield select(getToken)

        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.')
        }

        console.log('🚀 Updating today cigarettes:', action.payload)

        const response = yield call(apiCall, `${API_BASE_URL}/Member/today-cigarettes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                todayCigarettes: action.payload.todayCigarettes
            }),
        })

        console.log('✅ Today cigarettes updated successfully:', response)

        yield put(updateTodayCigarettesSuccess(response))

    } catch (error) {
        console.error('❌ Update today cigarettes failed:', error)
        yield put(updateTodayCigarettesFailure(error.message))
    }
}

// Root payment saga
export default function* paymentSaga() {
    yield takeEvery(createPaymentRequest.type, createPaymentSaga)
    yield takeLatest(fetchPackagesRequest.type, fetchPackagesSaga)
    yield takeEvery(updateTodayCigarettesRequest.type, updateTodayCigarettesSaga)
}