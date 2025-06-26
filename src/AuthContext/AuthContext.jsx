import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password) => {
        const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error("Sai tài khoản hoặc mật khẩu: " + err);
        }
        const data = await res.json();

        // Lấy token từ login
        const token = data.token;

        // Gọi tiếp API lấy profile để xác định accountId và fullName
        let accountId = null;
        let fullName = "";
        try {
            const profileRes = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (profileRes.ok) {
                const profile = await profileRes.json();
                accountId = profile.accountId || profile.AccountId || profile.id || null;
                fullName = profile.fullName || profile.FullName || profile.name || "";
            }
        } catch (e) {
            accountId = data.accountId || data.AccountId || data.id || null;
            fullName = data.fullName || data.FullName || data.name || "";
        }

        const userData = {
            ...data,
            role: data.role?.toLowerCase(),
            email: data.email || data.Email || email,
            accountId,
            token,
            fullName
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData.role;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{
            role: user?.role || null,
            email: user?.email || null,
            token: user?.token || null,
            accountId: user?.accountId || null,
            fullName: user?.fullName || "",
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;