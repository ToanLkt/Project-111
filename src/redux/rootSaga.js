// redux/rootSaga.js
import { all } from 'redux-saga/effects';

import watchFetchLogin from './login/loginSaga';
import watchFetchHistory from './admin/historyPayment/historyPaymentSaga';
import paymentSaga from './components/payment/paymentSaga'; // Fix: Sửa đường dẫn từ './sagas/paymentSaga' thành './slices/paymentSaga'

export default function* rootSaga() {
    yield all([
        watchFetchLogin(),
        watchFetchHistory(),
        paymentSaga(), // Add this line
        // thêm saga khác nếu có
    ]);
}
