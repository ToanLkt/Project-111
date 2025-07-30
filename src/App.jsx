import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import AppRoutes from "./routes/AppRoutes";
import store, { persistor } from "./redux/store";
import { AuthProvider } from "./AuthContext/AuthContext";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
