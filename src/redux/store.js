// redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'

// Import reducers
import loginReducer from './login/loginSlice' // Make sure this path is correct
import paymentReducer from './components/payment/paymentSlice'

// khởi tạo middleware saga
const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: {
        account: loginReducer, // Map login reducer to account state
        payment: paymentReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }).concat(sagaMiddleware),
})

// chạy saga
sagaMiddleware.run(rootSaga)

export default store
