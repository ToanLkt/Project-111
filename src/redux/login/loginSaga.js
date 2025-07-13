import { FETCH_API_LOGIN, fetchFail, fetchSuccess } from "./loginSlice";
import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// API Base URL
const API_BASE_URL = 'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api';

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

            // Kết hợp thông tin từ JWT và profile
            const user = {
                ...jwtUser,
                ...profileData, // Profile data sẽ override JWT data
                // Đảm bảo role từ JWT được giữ lại
                role: jwtUser["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || jwtUser.role
            };

            console.log("🔥 Final user object:", user);
            console.log("🔥 User Role:", user.role);
            console.log("🔥 User FullName:", user.fullName);

            // Dispatch success với user data đầy đủ
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

        console.error("❌ Login error:", error);
        yield put(fetchFail(message));
        toast.error(message);
    }
}

// Watcher saga
export default function* watchFetchLogin() {
    yield takeEvery(FETCH_API_LOGIN, fetchLoginSaga);
}
