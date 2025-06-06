import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // role: "member" | "admin" | null
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);

    // Hàm login giả lập, thực tế bạn lấy role và email từ API khi đăng nhập
    const login = (userRole, userEmail) => {
        setRole(userRole);
        setEmail(userEmail);
    };
    const logout = () => {
        setRole(null);
        setEmail(null);
    };

    return (
        <AuthContext.Provider value={{ role, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}