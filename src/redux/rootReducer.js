// redux/rootReducer.js
import { combineReducers } from 'redux';
import accountReducers from './login/loginSlice';
import historyPaymentReducers from './admin/historyPayment/historyPaymentSlice';
import paymentReducer from './components/payment/paymentSlice';


const rootReducer = combineReducers({
    account: accountReducers,
    historyPayment: historyPaymentReducers,
    payment: paymentReducer // Add this line to include the payment saga reducer
    // thêm reducer khác nếu có
});

export default rootReducer;
