// Redux middleware để tự động lưu authentication và payment state vào localStorage
const persistMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    // Persist authentication state
    if (action.type === 'FETCH_API_SUCCESS' || action.type === 'LOG_OUT' || action.type === 'RESTORE_SESSION') {
        const state = store.getState();
        const { user, token } = state.account || {};

        if (user && token) {
            // Lưu thông tin khi đăng nhập thành công
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            console.log('💾 Authentication state saved to localStorage');
        } else {
            // Xóa thông tin khi logout
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            console.log('🗑️ Authentication state cleared from localStorage');
        }
    }

    // Persist payment state - currentPackage và completedPayments
    if (action.type.includes('payment/') || action.type.includes('Payment')) {
        const state = store.getState();
        const { currentPackage, completedPayments } = state.payment || {};

        // Lưu currentPackage
        if (action.type === 'payment/setCurrentPackage') {
            if (currentPackage) {
                localStorage.setItem('currentPackage', JSON.stringify(currentPackage));
                console.log('💾 Current package saved to localStorage:', currentPackage);
            }
        }

        // Lưu completedPayments
        if (action.type === 'payment/addCompletedPayment' || action.type === 'payment/createPaymentSuccess') {
            if (completedPayments && completedPayments.length > 0) {
                localStorage.setItem('completedPayments', JSON.stringify(completedPayments));
                console.log('💾 Completed payments saved to localStorage:', completedPayments);
            }
        }

        // Clear payment data khi logout
        if (action.type === 'payment/clearAllPaymentData') {
            localStorage.removeItem('currentPackage');
            localStorage.removeItem('completedPayments');
            console.log('🗑️ Payment data cleared from localStorage');
        }
    }

    return result;
};

export default persistMiddleware;
