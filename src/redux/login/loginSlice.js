import { createAsyncThunk } from '@reduxjs/toolkit';

export const FETCH_API_LOGIN = "FETCH_API_LOGIN";
export const FETCH_API_SUCCESS = "FETCH_API_SUCCESS";
export const FETCH_API_FAIL = "FETCH_API_FAIL";
export const LOG_OUT = "LOG_OUT";

export const fetchLogin = (data) => ({
    type: FETCH_API_LOGIN,
    payload: data,
});

export const fetchSuccess = (data) => ({
    type: FETCH_API_SUCCESS,
    payload: data,
});

export const fetchFail = (error) => ({
    type: FETCH_API_FAIL,
    payload: error,
});

export const logout = createAsyncThunk('login/logout', async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

});

// Thêm action
export const updateUserPackageMembershipId = (packageMembershipId) => ({
    type: "UPDATE_USER_PACKAGE_MEMBERSHIP_ID",
    payload: packageMembershipId,
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

const accountReducers = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_API_LOGIN:
            return { ...state, loading: true, error: null };
        case FETCH_API_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                token: action.payload.token,
            };
        case FETCH_API_FAIL:
            return { ...state, loading: false, error: action.payload };
        case LOG_OUT:
            return { ...initialState };
        case "UPDATE_USER_PACKAGE_MEMBERSHIP_ID":
            if (state.user) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        packageMembershipId: action.payload,
                    },
                };
            }
            return state;
        default:
            return state;
    }
};

export default accountReducers;