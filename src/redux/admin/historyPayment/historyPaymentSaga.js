import axios from "axios";
import { FETCH__HISTORY, fetchHistoryFailure, fetchHistorySucess } from "./historyPaymentSlice";
import { call, put, select, takeLatest } from "redux-saga/effects";



function* fetchHistorySaga(action) {
    try {

        const token = yield select((state) => state.account.token);
        const response = yield call(axios.get, "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/purchase-history", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });


        if (response.status === 200 || response.status === 201) {
            yield put(fetchHistorySucess(response.data));
            console.log("TOANN", response.data)
        }
        else {
            yield put(fetchHistoryFailure(response.status));
        }
    } catch (error) {
        yield put(fetchHistoryFailure(error.message));
    }
}


function* watchFetchHistory() {
    yield takeLatest(FETCH__HISTORY, fetchHistorySaga);
}

export default watchFetchHistory;