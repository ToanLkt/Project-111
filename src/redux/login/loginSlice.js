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

export const logout = () => ({
    type: LOG_OUT,
});

const initialState = {
    user: null,
    token: null,
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
        default:
            return state;
    }
};

export default accountReducers;