import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";               // Redux
import store from "./redux/store";                   // Store

import { AuthProvider } from "./AuthContext/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import './index.css';
import { restoreSession } from "./redux/login/loginSlice";
import { restorePackageSession } from "./redux/components/payment/paymentSlice";

import 'bootstrap/dist/css/bootstrap.min.css';

// Component để khôi phục session ngầm
function SessionRestorer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khôi phục session khi ứng dụng khởi động (chạy ngầm)
    console.log("🔄 Restoring session from localStorage...");
    dispatch(restoreSession());

    // Khôi phục package session
    console.log("🔄 Restoring package session from localStorage...");
    dispatch(restorePackageSession());
  }, [dispatch]);

  return null; // Component này không render gì
}

function App() {
  return (
    <Provider store={store}> {/* Bọc Redux store ở ngoài cùng */}
      <SessionRestorer />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Provider>
  );
}

export default App;
