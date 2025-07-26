import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSuccess } from "./redux/login/loginSlice";

import { AuthProvider } from "./AuthContext/AuthContext";
import AppRoutes from "./routes/AppRoutes";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      dispatch(fetchSuccess({ user, token }));
    }
  }, [dispatch]);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
