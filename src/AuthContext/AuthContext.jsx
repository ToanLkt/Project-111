import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

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

        const token = data.token;
        const accountId = data.accountId || data.AccountId || data.id || null;

        let profileInfo = {};
        try {
            const profileRes = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/User/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (profileRes.ok) {
                const profile = await profileRes.json();
                profileInfo = {
                    email: profile.email || profile.Email || email,
                    fullName: profile.fullName || profile.FullName || profile.name || "",
                    role: profile.role?.toLowerCase() || data.role?.toLowerCase() || null
                };
            }
        } catch (e) {
            profileInfo = {
                email: data.email || data.Email || email,
                fullName: data.fullName || data.FullName || data.name || "",
                role: data.role?.toLowerCase() || null
            };
        }

        const userData = {
            token,
            accountId,
            ...profileInfo
        };
        setUser(userData);
        // Không lưu vào localStorage ở đây
        return userData.role;
    };

    const logout = () => {
        setUser(null);
        // Không xóa localStorage ở đây
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