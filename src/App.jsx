import React from "react";
import { Provider } from "react-redux";               // Redux
import store from "./redux/store";                   // Store

import { AuthProvider } from "./AuthContext/AuthContext";
import AppRoutes from "./routes/AppRoutes";

import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (

    <Provider store={store}> {/* Bọc Redux store ở ngoài cùng */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Provider>

  );
}

export default App;
