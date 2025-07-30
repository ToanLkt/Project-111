// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import loginReducer from './login/loginSlice';
import paymentReducer from './components/payment/paymentSlice';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: 'account',
    storage,
    whitelist: ['user', 'token']
};

const persistedLoginReducer = persistReducer(persistConfig, loginReducer);

const store = configureStore({
    reducer: {
        account: persistedLoginReducer,
        payment: paymentReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;
