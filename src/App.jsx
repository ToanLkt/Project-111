import React from "react";
import { AuthProvider } from "./AuthContext/AuthContext";
import AppRoutes from "./routes/AppRoutes";


import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (

    <AuthProvider>
      <AppRoutes />
    </AuthProvider>

  );
}

export default App;