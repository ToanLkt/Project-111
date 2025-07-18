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
            `${API_BASE_URL}/User/profile`,
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
        const { email, password } = action.payload;

        const loginData = yield call(apiCall, `${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const token = loginData.token || loginData.accessToken;

        if (token) {
            const jwtUser = jwtDecode(token);
            const profileData = yield call(fetchUserProfile, token);

            // Lấy role từ JWT hoặc profile
            const role = jwtUser["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || jwtUser.role || profileData?.role;

            let user = {
                ...jwtUser,
                ...profileData,
                role,
            };

            // Chỉ fetch transactions và package nếu là Member
            if (role === "Member") {
                const transactionsData = yield call(fetchUserTransactions, token);
                const packageInfo = yield call(processUserPackage, transactionsData);
                user = {
                    ...user,
                    ...packageInfo
                };
            }

            yield put(fetchSuccess({ user, token }));
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
        yield put(fetchFail(message));
        toast.error(message);
    }
}

// Watcher saga
export default function* watchFetchLogin() {
    yield takeEvery(FETCH_API_LOGIN, fetchLoginSaga);
}
