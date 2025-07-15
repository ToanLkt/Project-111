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
        const response = yield call(fetch, url, options)

        if (!response.ok) {
            // Lấy thông tin lỗi chi tiết từ server
            let errorText;
            try {
                // Clone response để tránh lỗi body stream already read
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

        // Xử lý response tùy theo content-type
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = yield call([response, 'json'])
            return data
        } else {
            const text = yield call([response, 'text'])
            return text
        }
    } catch (error) {
        throw error
    }
}

// Create payment saga
function* createPaymentSaga(action) {
    try {
        const token = yield select(getToken)
        const user = yield select(getUser)

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

        yield put(createPaymentSuccess({
            ...paymentData,
            response,
            accountId // Thêm accountId để tracking
        }))

    } catch (error) {
        yield put(createPaymentFailure(error.message))
    }
}

// Fetch packages saga
function* fetchPackagesSaga() {
    try {
        const packages = yield call(apiCall, `${API_BASE_URL}/PackageMembership`)

        yield put(fetchPackagesSuccess(Array.isArray(packages) ? packages : []))

    } catch (error) {
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

        yield put(updateTodayCigarettesSuccess(response))

    } catch (error) {
        yield put(updateTodayCigarettesFailure(error.message))
    }
}

// Root payment saga
export default function* paymentSaga() {
    yield takeEvery(createPaymentRequest.type, createPaymentSaga)
    yield takeLatest(fetchPackagesRequest.type, fetchPackagesSaga)
    yield takeEvery(updateTodayCigarettesRequest.type, updateTodayCigarettesSaga)
}