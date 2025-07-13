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
        const response = yield call(fetch, url, options)

        console.log('📡 API Response status:', response.status);

        if (!response.ok) {
            const errorText = yield call([response, 'text'])
            console.error('❌ API Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const data = yield call([response, 'json'])
        console.log('✅ API Response data:', data);
        return data
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

        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.')
        }

        // Extract user ID
        const getUserId = (user) => {
            if (!user) return null
            return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
                user.userId ||
                user.id ||
                null
        }

        const accountId = getUserId(user)

        const paymentData = {
            ...action.payload,
            accountId
        }

        console.log('🚀 Creating payment:', paymentData)

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
            accountId
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