import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuccess } from "./redux/login/loginSlice";

import { AuthProvider } from "./AuthContext/AuthContext";
import AppRoutes from "./routes/AppRoutes";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.account);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedToken && storedUser) {
      dispatch(fetchSuccess({ user: storedUser, token: storedToken }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
