import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { role } = useAuth(); // Lấy role từ context

    if (!role) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        return <Navigate to="/login" replace />;
    }

    // Nếu có phân quyền, kiểm tra role
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // Nếu hợp lệ, render children
    return children;
}