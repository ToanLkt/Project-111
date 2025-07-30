import { FETCH_API_LOGIN, fetchFail, fetchSuccess } from "./loginSlice";
import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// API Base URL
const API_BASE_URL = 'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api';

// Fetch user profile
function* fetchUserProfile(token) {
    try {
        const profileResponse = yield call(
            axios.get,
            `${API_BASE_URL}/User/profile`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return profileResponse.data;
    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        return null;
    }
}

// Fetch user transactions
function* fetchUserTransactions(token) {
    try {
        const transactionsResponse = yield call(
            axios.get,
            `${API_BASE_URL}/User/profile`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return transactionsResponse.data;
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        return null;
    }
}

// Dummy process package function
function* processUserPackage(transactionsData) {
    try {
        if (!transactionsData || !Array.isArray(transactionsData)) {
            return {
                currentPackage: null,
                latestTransaction: null,
                packageStatus: 'no_package'
            };
        }
        // Xử lý ở đây nếu có logic
        return {
            currentPackage: null,
            latestTransaction: null,
            packageStatus: 'available'
        };
    } catch (error) {
        return {
            currentPackage: null,
            latestTransaction: null,
            packageStatus: 'error'
        };
    }
}

// Generic API call
function* apiCall(url, options = {}) {
    try {
        const response = yield call(fetch, url, options);
        if (!response.ok) {
            const errorText = yield call([response, 'text']);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = yield call([response, 'json']);
        return data;
    } catch (error) {
        throw error;
    }
}

// Login saga
export function* fetchLoginSaga(action) {
    try {
        const { email, password } = action.payload;

        // Call login API
        const loginData = yield call(apiCall, `${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const token = loginData.token || loginData.accessToken;

        if (!token) {
            throw new Error("Token not received from login response.");
        }

        const jwtUser = jwtDecode(token); // ✅ Decode trước khi dùng
        const role = loginData.role || jwtUser.role;

        // Fetch profile
        const profileData = yield call(fetchUserProfile, token);

        const fullName = profileData?.fullName || jwtUser?.fullName;
        const packageMembershipId = profileData?.packageMembershipId;

        let user = {
            ...jwtUser,
            ...profileData,
            role,
            fullName,
            packageMembershipId,
            accountId: profileData?.accountId || jwtUser?.accountId || jwtUser?.id || null,
        };

        // Nếu role là Member thì fetch thêm dữ liệu gói
        if (role === "Member") {
            const transactionsData = yield call(fetchUserTransactions, token);
            const packageInfo = yield call(processUserPackage, transactionsData);
            user = {
                ...user,
                ...packageInfo
            };
        }

        // Cập nhật Redux
        yield put(fetchSuccess({ user, token }));
        toast.success("Login successful!");
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

// Watcher
export default function* watchFetchLogin() {
    yield takeEvery(FETCH_API_LOGIN, fetchLoginSaga);
}
