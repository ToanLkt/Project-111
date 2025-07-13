import React, { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "../AuthContext/AuthContext";

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
    const [userInfo, setUserInfo] = useState({
        infoSubmitted: false,
        quitStartDate: null,
        todayCigarettes: 0
    });
    
    const auth = useContext(AuthContext);
    const token = auth?.token;

    // Lấy thông tin user từ API khi đăng nhập
    useEffect(() => {
        if (!token) {
            console.log("No token available");
            return;
        }

        console.log("Fetching user data with token:", token);

        // Lấy thông tin từ API Member với token
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member", {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                console.log("API Response status:", res.status);
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("User data received:", data);
                if (data && Array.isArray(data) && data.length > 0) {
                    const currentUser = data[0];
                    setUserInfo({
                        infoSubmitted: currentUser.infoSubmitted || false,
                        quitStartDate: currentUser.quitStartDate,
                        todayCigarettes: currentUser.todayCigarettes || 0
                    });
                } else if (data && !Array.isArray(data)) {
                    // Nếu API trả về object thay vì array
                    setUserInfo({
                        infoSubmitted: data.infoSubmitted || false,
                        quitStartDate: data.quitStartDate,
                        todayCigarettes: data.todayCigarettes || 0
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                setUserInfo({
                    infoSubmitted: false,
                    quitStartDate: null,
                    todayCigarettes: 0
                });
            });
    }, [token]);

    const updateTodayCigarettes = async (count) => {
        if (!token) return;
        
        try {
            const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/today-cigarettes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    todayCigarettes: count
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            setUserInfo(prev => ({
                ...prev,
                todayCigarettes: count
            }));
        } catch (e) {
            console.error("Lỗi cập nhật cigarettes:", e);
        }
    };

    const updateSubmitInfo = async (formData) => {
        if (!token) return;
        
        try {
            const response = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member/submit-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            setUserInfo(prev => ({
                ...prev,
                infoSubmitted: true,
                quitStartDate: formData.quitStartDate
            }));
        } catch (e) {
            console.error("Lỗi submit form:", e);
        }
    };

    return (
        <UserDataContext.Provider value={{
            userInfo,
            updateTodayCigarettes,
            updateSubmitInfo
        }}>
            {children}
        </UserDataContext.Provider>
    );
}

export const useUserData = () => useContext(UserDataContext);