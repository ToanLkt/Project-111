import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as reduxLogout } from "../redux/login/loginSlice";
import { clearAllPaymentData } from "../redux/components/payment/paymentSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Lấy thông tin từ Redux store
    const { user: reduxUser, token: reduxToken } = useSelector((state) => state.account || {});
    const dispatch = useDispatch();

    const [user, setUser] = useState(() => {
        // Ưu tiên Redux state, fallback về localStorage
        if (reduxUser && reduxToken) {
            return reduxUser;
        }

        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    // Đồng bộ user state với Redux store
    useEffect(() => {
        if (reduxUser && reduxToken) {
            setUser(reduxUser);
            // Đảm bảo localStorage cũng được cập nhật
            localStorage.setItem("user", JSON.stringify(reduxUser));
            localStorage.setItem("token", reduxToken);
        } else if (!reduxUser && !reduxToken) {
            setUser(null);
        }
    }, [reduxUser, reduxToken]);

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

        // Lấy token và accountId từ login
        const token = data.token;
        const accountId = data.accountId || data.AccountId || data.id || null;

        // Gọi tiếp API lấy profile để lấy các thông tin khác (email, fullName, role)
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
            // Nếu lỗi thì fallback về data từ login
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
        localStorage.setItem("user", JSON.stringify(userData));
        return userData.role;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Dispatch logout action để cập nhật Redux store
        dispatch(reduxLogout());

        // Clear toàn bộ payment data
        dispatch(clearAllPaymentData());

        console.log("🚪 User logged out and all data cleared");
    };

    return (
        <AuthContext.Provider value={{
            role: (reduxUser || user)?.role || null,
            email: (reduxUser || user)?.email || null,
            token: reduxToken || (user?.token) || null,
            accountId: (reduxUser || user)?.accountId || null,
            fullName: (reduxUser || user)?.fullName || "",
            login, // Giữ nguyên login function (vẫn cần cho một số trường hợp)
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