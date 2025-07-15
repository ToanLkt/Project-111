import { FETCH_API_LOGIN, fetchFail, fetchSuccess } from "./loginSlice";
import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// API Base URL
const API_BASE_URL = 'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api';

// Helper function để fetch user transactions
function* fetchUserTransactions(token) {
    try {
        console.log("🚀 Fetching user transactions...");

        const transactionsResponse = yield call(
            axios.get,
            `${API_BASE_URL}/Member/my-transactions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("✅ Transactions data received:", transactionsResponse.data);
        return transactionsResponse.data;

    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        return null;
    }
}

// Helper function để fetch user profile
function* fetchUserProfile(token) {
    try {
        console.log("🚀 Fetching user profile...");

        const profileResponse = yield call(
            axios.get,
            `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("✅ Profile data received:", profileResponse.data);
        return profileResponse.data;

    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        return null;
    }
}

// Helper function để xử lý và tìm gói đang sử dụng
function* processUserPackage(transactionsData) {
    try {
        if (!transactionsData || !Array.isArray(transactionsData)) {
            console.log("🔍 No transactions data available");
            return {
                currentPackage: null,
                latestTransaction: null,
                packageStatus: 'no_package'
            };
        }

        // Sắp xếp transactions theo purchaseID (mới nhất trước - ID cao hơn)
        const sortedTransactions = transactionsData.sort((a, b) => b.purchaseID - a.purchaseID);

        const latestTransaction = sortedTransactions[0];
        console.log("🔍 Latest transaction:", latestTransaction);

        if (!latestTransaction) {
            return {
                currentPackage: null,
                latestTransaction: null,
                packageStatus: 'no_package'
            };
        }

        // Lấy thông tin từ transaction response
        const startDate = new Date(latestTransaction.startDate);
        const endDate = new Date(latestTransaction.endDate);
        const now = new Date();

        // Kiểm tra trạng thái gói
        const isExpired = endDate < now;
        const isActive = latestTransaction.paymentStatus === "Success" && !isExpired;

        // Tính số ngày còn lại
        const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

        // Tính duration (số ngày của gói)
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        const packageInfo = {
            currentPackage: {
                id: latestTransaction.purchaseID,
                name: latestTransaction.packageCategory, // "Free" hoặc "Plus"
                type: latestTransaction.packageCategory,
                price: latestTransaction.totalPrice,
                duration: duration, // Số ngày của gói
                startDate: latestTransaction.startDate, // "2025-07-14T00:00:00"
                endDate: latestTransaction.endDate, // "2025-08-14T00:00:00" 
                expiryDate: latestTransaction.endDate, // Alias cho endDate
                isExpired: isExpired,
                isActive: isActive,
                daysLeft: daysLeft,
                transactionCode: latestTransaction.transactionCode,
                memberName: latestTransaction.memberName,
                paymentStatus: latestTransaction.paymentStatus,
                timeBuy: latestTransaction.timeBuy
            },
            latestTransaction: latestTransaction,
            packageStatus: isActive ? 'active' : (isExpired ? 'expired' : 'inactive')
        };

        console.log("✅ Processed package info:", packageInfo);
        console.log("📦 Package Details:", {
            name: packageInfo.currentPackage.name,
            startDate: packageInfo.currentPackage.startDate,
            endDate: packageInfo.currentPackage.endDate,
            daysLeft: packageInfo.currentPackage.daysLeft,
            isActive: packageInfo.currentPackage.isActive,
            status: packageInfo.packageStatus
        });

        return packageInfo;

    } catch (error) {
        console.error("❌ Error processing user package:", error);
        return {
            currentPackage: null,
            latestTransaction: null,
            packageStatus: 'error'
        };
    }
}

// API call function
function* apiCall(url, options = {}) {
    try {
        console.log('🚀 Making API call to:', url);
        const response = yield call(fetch, url, options);

        console.log('📡 API Response status:', response.status);

        if (!response.ok) {
            const errorText = yield call([response, 'text']);
            console.error('❌ API Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = yield call([response, 'json']);
        console.log('✅ API Response data:', data);
        return data;
    } catch (error) {
        console.error('❌ API Call failed:', error);
        throw error;
    }
}

// Login saga
export function* fetchLoginSaga(action) {
    try {
        console.log('🔐 Login saga started with:', action.payload);

        const { email, password } = action.payload;

        const loginData = yield call(apiCall, `${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const token = loginData.token || loginData.accessToken;

        if (token) {
            // Decode JWT để lấy thông tin cơ bản
            const jwtUser = jwtDecode(token);
            console.log("🔍 JWT User:", jwtUser);

            // Fetch profile để lấy fullName và thông tin chi tiết
            const profileData = yield call(fetchUserProfile, token);

            // Fetch transactions để lấy thông tin gói đã mua
            const transactionsData = yield call(fetchUserTransactions, token);

            // Xử lý thông tin gói đang sử dụng
            const packageInfo = yield call(processUserPackage, transactionsData);

            // Kết hợp thông tin từ JWT, profile và package
            const user = {
                ...jwtUser,
                ...profileData, // Profile data sẽ override JWT data
                // Đảm bảo role từ JWT được giữ lại
                role: jwtUser["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || jwtUser.role,
                // Thêm thông tin gói đang sử dụng
                ...packageInfo
            };

            console.log("🔥 Final user object:", user);
            console.log("🔥 User Role:", user.role);
            console.log("🔥 User FullName:", user.fullName);
            console.log("🔥 User Current Package:", user.currentPackage);
            console.log("🔥 Package Status:", user.packageStatus);
            console.log("🔥 User Transactions:", transactionsData);

            // Dispatch success với user data và transactions data đầy đủ
            yield put(fetchSuccess({ user, token, transactions: transactionsData }));
            toast.success("Login successful!");

        } else {
            throw new Error("Invalid login credentials");
        }
    } catch (error) {
        let message = "Login failed!";
        if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }

        console.error("❌ Login error:", error);
        yield put(fetchFail(message));
        toast.error(message);
    }
}

// Watcher saga
export default function* watchFetchLogin() {
    yield takeEvery(FETCH_API_LOGIN, fetchLoginSaga);
}
