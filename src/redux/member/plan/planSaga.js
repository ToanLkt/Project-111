import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects'
import {
    fetchUserPlanRequest,
    fetchUserPlanSuccess,
    fetchUserPlanFailure,
    updateTodayCigarettesRequest,
    updateTodayCigarettesSuccess,
    updateTodayCigarettesFailure,
    fetchDailyDataRequest,
    fetchDailyDataSuccess,
    fetchDailyDataFailure,
    fetchMilestonesRequest,
    fetchMilestonesSuccess,
    fetchMilestonesFailure,
} from './planSlice'

// API Base URL
const API_BASE_URL = 'https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api'

// Selector to get token from account state
const getToken = (state) => state.account?.token
const getUser = (state) => state.account?.user

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

// Extract user ID helper
function* getUserId() {
    const user = yield select(getUser);
    if (!user) return null;
    return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        user.userId ||
        user.id ||
        null;
}

// Fetch user plan saga
function* fetchUserPlanSaga() {
    try {
        const token = yield select(getToken);
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        console.log('🚀 Fetching user plan...');

        const planData = yield call(apiCall, `${API_BASE_URL}/Member/plan`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('✅ User plan fetched successfully:', planData);
        yield put(fetchUserPlanSuccess(planData));

    } catch (error) {
        console.error('❌ Fetch user plan failed:', error);
        yield put(fetchUserPlanFailure(error.message));
    }
}

// Update today cigarettes saga
function* updateTodayCigarettesSaga(action) {
    try {
        const token = yield select(getToken);
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        console.log('🚀 Updating today cigarettes:', action.payload);

        const response = yield call(apiCall, `${API_BASE_URL}/Member/today-cigarettes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                todayCigarettes: action.payload.todayCigarettes
            }),
        });

        console.log('✅ Today cigarettes updated successfully:', response);
        yield put(updateTodayCigarettesSuccess(response));

    } catch (error) {
        console.error('❌ Update today cigarettes failed:', error);
        yield put(updateTodayCigarettesFailure(error.message));
    }
}

// Fetch daily data saga
function* fetchDailyDataSaga() {
    try {
        const token = yield select(getToken);
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        console.log('🚀 Fetching daily data...');

        const dailyData = yield call(apiCall, `${API_BASE_URL}/Member/daily-data`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('✅ Daily data fetched successfully:', dailyData);
        yield put(fetchDailyDataSuccess(Array.isArray(dailyData) ? dailyData : []));

    } catch (error) {
        console.error('❌ Fetch daily data failed:', error);
        yield put(fetchDailyDataFailure(error.message));
    }
}

// Fetch milestones saga
function* fetchMilestonesSaga() {
    try {
        const token = yield select(getToken);
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        console.log('🚀 Fetching milestones...');

        const milestones = yield call(apiCall, `${API_BASE_URL}/Member/milestones`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('✅ Milestones fetched successfully:', milestones);
        yield put(fetchMilestonesSuccess(Array.isArray(milestones) ? milestones : []));

    } catch (error) {
        console.error('❌ Fetch milestones failed:', error);
        yield put(fetchMilestonesFailure(error.message));
    }
}

// Root plan saga
export default function* planSaga() {
    yield takeLatest(fetchUserPlanRequest.type, fetchUserPlanSaga);
    yield takeEvery(updateTodayCigarettesRequest.type, updateTodayCigarettesSaga);
    yield takeLatest(fetchDailyDataRequest.type, fetchDailyDataSaga);
    yield takeLatest(fetchMilestonesRequest.type, fetchMilestonesSaga);
}