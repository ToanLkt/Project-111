export const FETCH_API_LOGIN = "FETCH_API_LOGIN";
export const FETCH_API_SUCCESS = "FETCH_API_SUCCESS";
export const FETCH_API_FAIL = "FETCH_API_FAIL";
export const LOG_OUT = "LOG_OUT";
export const RESTORE_SESSION = "RESTORE_SESSION";

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

export const restoreSession = () => ({
    type: RESTORE_SESSION,
});

// Khôi phục thông tin từ localStorage
const getStoredAuthData = () => {
    try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            return {
                user: JSON.parse(storedUser),
                token: storedToken
            };
        }

        // Fallback: kiểm tra nếu user có chứa token
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.token) {
                return {
                    user: userData,
                    token: userData.token
                };
            }
        }
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
    return { user: null, token: null };
};

const { user: storedUser, token: storedToken } = getStoredAuthData();

const initialState = {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
};

const accountReducers = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_API_LOGIN:
            return { ...state, loading: true, error: null };
        case FETCH_API_SUCCESS:
            // Lưu vào localStorage khi đăng nhập thành công
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);

            return {
                ...state,
                loading: false,
                user: action.payload.user,
                token: action.payload.token,
            };
        case FETCH_API_FAIL:
            return { ...state, loading: false, error: action.payload };
        case LOG_OUT:
            // Xóa khỏi localStorage khi logout
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return { ...initialState, user: null, token: null };
        case RESTORE_SESSION:
            // Khôi phục session từ localStorage
            const { user: restoredUser, token: restoredToken } = getStoredAuthData();
            return {
                ...state,
                user: restoredUser,
                token: restoredToken,
                loading: false,
                error: null
            };
        default:
            return state;
    }
};

export default accountReducers;