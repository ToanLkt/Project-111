import { call, put, takeLatest, select } from 'redux-saga/effects'
import {
    fetchPackagesRequest,
    fetchPackagesSuccess,
    fetchPackagesFailure,
    createPaymentRequest,
    createPaymentSuccess,
    createPaymentFailure,
    checkTransactionRequest,
    checkTransactionSuccess,
    checkTransactionFailure,
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
        console.log("🚀 Fetching packages...")

        // Không cần token để fetch packages
        const response = yield call(fetch,
            'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/PackageMembership'
            // Không có headers Authorization
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const data = yield response.json()
        console.log("✅ Packages fetched successfully:", data)

        yield put(fetchPackagesSuccess(data))
    } catch (error) {
        console.error("❌ Fetch packages error:", error)
        yield put(fetchPackagesFailure(error.message || "Failed to fetch packages"))
    }
}

// Create payment record to API
function* createPaymentRecordSaga(paymentData) {
    try {
        console.log("💳 Creating payment record in API:", paymentData)

        const { token } = yield call(getUserInfo)

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
                paymentStatus: "SUCCESS", // ĐẢM BẢO LÀ SUCCESS
                transactionCode: paymentData.transactionCode,
                paymentMethod: "BANK_TRANSFER",
                description: `Thanh toán gói ${paymentData.packageCategory}`,
                transactionReference: paymentData.transactionCode
            }),
        })

        if (!response.ok) {
            const errorText = yield call([response, 'text'])
            console.warn(`❌ Payment API failed: ${response.status} - ${errorText}`)
            return { success: false, error: errorText }
        }

        const result = yield call([response, 'json'])
        console.log("✅ Payment record created successfully:", result)
        return { success: true, data: result }

    } catch (error) {
        console.warn("❌ Error creating payment record:", error)
        return { success: false, error: error.message }
    }
}

// Transaction verification saga từ Google Sheets
function* checkTransactionSaga(action) {
    try {
        console.log("🔍 Checking transaction from Google Sheets:", action.payload)

        const { expectedPrice, expectedContent, transactionCode, packageData } = action.payload

        const TRANSACTION_API = "https://docs.google.com/spreadsheets/d/1Er2mUA9EE7PdsIc9YPzOFlxo_ErhmjRPGaYNYBXS00A/gviz/tq?tqx=out:json"

        console.log("🎯 Looking for transaction with:", {
            expectedPrice,
            expectedContent: expectedContent.toUpperCase(),
            transactionCode
        })

        // Fetch data từ Google Sheets
        const response = yield call(fetch, TRANSACTION_API)
        const text = yield call([response, 'text'])

        // Parse JSON từ Google Sheets response
        const json = JSON.parse(text.substring(47, text.length - 2))
        const rows = json.table.rows.map((row) =>
            Object.fromEntries(row.c.map((cell, i) => [json.table.cols[i].label, cell?.v])),
        )

        if (rows.length === 0) {
            yield put(checkTransactionFailure("No transactions found in Google Sheets"))
            return
        }

        console.log("📊 Google Sheets has", rows.length, "transactions")

        // Tìm giao dịch khớp với nội dung và số tiền
        const expectedContentUpper = expectedContent.toUpperCase().trim()

        const matchingTransaction = rows
            .slice()
            .reverse()
            .find((row) => {
                const amount = Number(row["Giá trị"] || 0)
                const description = (row["Mô tả"] || "").toString().trim().toUpperCase()

                const amountMatches = amount === expectedPrice
                const contentMatches = description.includes(expectedContentUpper)

                if (amountMatches && contentMatches) {
                    console.log("🎉 FOUND MATCHING TRANSACTION!", {
                        amount,
                        description,
                        expectedPrice,
                        expectedContent: expectedContentUpper
                    })
                    return true
                }
                return false
            })

        if (matchingTransaction) {
            console.log("✅ Matching transaction found:", matchingTransaction)

            const { user, accountId } = yield call(getUserInfo)

            // Tính toán ngày bắt đầu và kết thúc
            const now = new Date()
            const startDate = new Date(now.setHours(0, 0, 0, 0))
            const endDate = new Date(startDate.getTime() + (packageData.duration || 30) * 24 * 60 * 60 * 1000)

            // Tạo current package mới
            const newCurrentPackage = {
                name: packageData.category,
                category: packageData.category,
                package_membership_ID: packageData.package_membership_ID,
                duration: packageData.duration,
                price: packageData.price,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                daysLeft: packageData.duration,
                isActive: true,
                isExpired: false,
                paymentDate: now.toISOString(),
                transactionCode: transactionCode,
                paymentStatus: "SUCCESS"
            }

            // 1. Cập nhật current package trong Redux NGAY LẬP TỨC
            console.log("📦 Setting new current package in Redux...")
            yield put(setCurrentPackage(newCurrentPackage))
            yield put(updateUserPackageMembershipId(packageData.package_membership_ID))

            // 2. Lưu transaction đã verify
            yield put(checkTransactionSuccess({
                transaction: matchingTransaction,
                transactionCode,
                packageData,
                currentPackage: newCurrentPackage,
                verifiedAt: new Date().toISOString()
            }))

            // 3. POST payment record vào API (không blocking)
            const paymentPayload = {
                accountId,
                packageMembershipId: packageData.package_membership_ID,
                packageCategory: packageData.category,
                totalPrice: packageData.price,
                transactionCode,
                timeBuy: now.toISOString(),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                memberName: user?.fullName || "Member",
                verified: true,
                googleSheetsTransaction: matchingTransaction
            }

            console.log("🚀 Creating payment record in API (non-blocking)...")
            const paymentResult = yield call(createPaymentRecordSaga, paymentPayload)

            if (paymentResult.success) {
                console.log("✅ Payment record saved to API successfully")
                yield put(createPaymentSuccess({
                    ...paymentResult.data,
                    currentPackage: newCurrentPackage,
                    verified: true
                }))
            } else {
                console.warn("⚠️ Payment record API failed, but package is still activated:", paymentResult.error)
                // Vẫn success vì đã verify qua Google Sheets và đã set current package
                yield put(createPaymentSuccess({
                    purchaseID: Date.now(),
                    accountId,
                    packageMembershipId: packageData.package_membership_ID,
                    packageCategory: packageData.category,
                    totalPrice: packageData.price,
                    paymentStatus: "SUCCESS",
                    transactionCode,
                    timeBuy: now.toISOString(),
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    memberName: user?.fullName || "Member",
                    currentPackage: newCurrentPackage,
                    verified: true,
                    apiError: paymentResult.error,
                    source: "google_sheets_verification"
                }))
            }

        } else {
            console.log("❌ No matching transaction found")
            yield put(checkTransactionFailure("Không tìm thấy giao dịch phù hợp. Vui lòng kiểm tra lại nội dung chuyển khoản."))
        }

    } catch (error) {
        console.error("❌ Check transaction error:", error)
        yield put(checkTransactionFailure(error.message || "Lỗi kiểm tra giao dịch"))
    }
}

// Create payment saga
function* createPaymentSaga(action) {
    try {
        console.log("🚀 Payment saga called:", action.payload)

        // Chuyển sang checkTransactionSaga để xử lý đúng flow
        yield call(checkTransactionSaga, action)

    } catch (error) {
        console.error("❌ Payment saga error:", error)
        yield put(createPaymentFailure(error.message || "Payment failed"))
    }
}

// Root saga
export default function* paymentSaga() {
    yield takeLatest(fetchPackagesRequest.type, fetchPackagesSaga)
    yield takeLatest(createPaymentRequest.type, createPaymentSaga)
    yield takeLatest(checkTransactionRequest.type, checkTransactionSaga)
}