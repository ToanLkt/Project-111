export const FETCH__HISTORY = "FETCH__HISTORY";
export const FETCH__HISTORY_SUCCESS = "FETCH__HISTORY_SUCCESS";
export const FETCH__HISTORY_FAILURE = "FETCH__HISTORY_FAILURE";

export const fetchHistory = (data) => ({
    type: FETCH__HISTORY,
    payload: data,
});

export const fetchHistorySucess = (data) => ({
    type: FETCH__HISTORY_SUCCESS,
    payload: data,
});

export const fetchHistoryFailure = (error) => ({
    type: FETCH__HISTORY_FAILURE,
    payload: error,
});

const initialState = {
    history: [],
    loading: false,
    error: null,
};
const historyPaymentReducers = (state = initialState, action) => {
    switch (action.type) {
        case FETCH__HISTORY:
            return { ...state, loading: true, error: null };
        case FETCH__HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                history: action.payload,
            };
        case FETCH__HISTORY_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default historyPaymentReducers;