import { call, put, takeLatest, select } from 'redux-saga/effects'
import {
    fetchPackagesRequest,
    fetchPackagesSuccess,
    fetchPackagesFailure,
    createPaymentRequest,
    createPaymentSuccess,
    createPaymentFailure,
    setCurrentPackage
} from './paymentSlice'
import { updateUserPackageMembershipId } from '../../login/loginSlice'

const BASE_URL = "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net"

// Helper function to get user info from state
function* getUserInfo() {
    const state = yield select()
    const token = state.account?.token
    const user = state.account?.user

    if (!token || !user) {
        throw new Error("No token or user found")
    }

    const accountId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        user.userId ||
        user.id ||
        user.accountId

    if (!accountId) {
        throw new Error("No account ID found")
    }

    return { token, user, accountId }
}

// Fetch packages saga
function* fetchPackagesSaga() {
    try {
        const response = yield call(fetch, `${BASE_URL}/api/PackageMembership`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = yield response.json()
        console.log("📦 Saga data from API:", data) // Thêm dòng này
        yield put(fetchPackagesSuccess(data))
    } catch (error) {
        yield put(fetchPackagesFailure(error.message || "Failed to fetch packages"))
    }
}

// Create payment record to API and update user profile
function* createPaymentSaga(action) {
    try {
        // action.payload phải chứa: packageMembershipId, totalPrice, transactionCode, packageCategory, v.v.
        const { token, user, accountId } = yield call(getUserInfo)
        const paymentData = action.payload

        // 1. Gửi giao dịch vào API Payment/create
        const response = yield call(fetch, `${BASE_URL}/api/Payment/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                packageMembershipId: parseInt(paymentData.packageMembershipId),
                amount: parseFloat(paymentData.totalPrice),
                paymentDate: new Date().toISOString(),
                paymentStatus: "SUCCESS",
                transactionCode: paymentData.transactionCode,
                paymentMethod: "BANK_TRANSFER",
                description: `Thanh toán gói ${paymentData.packageCategory}`,
                transactionReference: paymentData.transactionCode
            }),
        })

        if (!response.ok) {
            const errorText = yield call([response, 'text'])
            yield put(createPaymentFailure(errorText || "Payment API error"))
            return
        }

        const paymentResult = yield call([response, 'json'])

        // 2. Gọi API lấy profile mới nhất để lấy packageMembershipId mới
        const profileRes = yield call(fetch, `${BASE_URL}/api/User/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!profileRes.ok) {
            yield put(createPaymentFailure("Lấy thông tin user thất bại sau khi thanh toán"))
            return
        }
        const profile = yield call([profileRes, 'json'])

        console.log("🔄 Profile sau thanh toán:", profile)
        console.log("🆔 PackageMembershipId mới:", profile.packageMembershipId)

        // 3. Cập nhật packageMembershipId vào Redux
        yield put(updateUserPackageMembershipId(profile.packageMembershipId))

        // 4. Cập nhật toàn bộ user profile vào localStorage để đồng bộ
        const updatedUser = {
            ...user,
            packageMembershipId: profile.packageMembershipId
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        console.log("✅ Đã cập nhật packageMembershipId vào Redux và localStorage:", profile.packageMembershipId)

        // 5. Cập nhật currentPackage vào Redux với packageMembershipId mới
        const newCurrentPackage = {
            name: paymentData.packageCategory,
            category: paymentData.packageCategory,
            package_membership_ID: profile.packageMembershipId, // Sử dụng ID từ profile API
            duration: paymentData.duration,
            price: paymentData.totalPrice,
            startDate: paymentData.startDate,
            endDate: paymentData.endDate,
            daysLeft: paymentData.duration,
            isActive: true,
            isExpired: false,
            paymentDate: paymentData.paymentDate || new Date().toISOString(),
            transactionCode: paymentData.transactionCode,
            paymentStatus: "SUCCESS"
        }
        yield put(setCurrentPackage(newCurrentPackage))

        console.log("📦 Đã cập nhật currentPackage:", newCurrentPackage)

        // 6. Thông báo thành công
        yield put(createPaymentSuccess({
            ...paymentResult,
            currentPackage: newCurrentPackage,
            verified: true,
            updatedPackageMembershipId: profile.packageMembershipId
        }))
    } catch (error) {
        yield put(createPaymentFailure(error.message || "Payment failed"))
    }
}

// Root saga
export default function* paymentSaga() {
    yield takeLatest(fetchPackagesRequest.type, fetchPackagesSaga)
    yield takeLatest(createPaymentRequest.type, createPaymentSaga)
}