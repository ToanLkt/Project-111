import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, token, loading } = useSelector((state) => state.account || {});

    const getUserRole = () => {
        if (!user) return null;
        return user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            user.role ||
            null;
    };

    const userRole = getUserRole();
    const isAuthenticated = !!(token && user);

    console.log("🛡️ ProtectedRoute Debug:", {
        path: window.location.pathname,
        hasToken: !!token,
        hasUser: !!user,
        userRole: userRole,
        isAuthenticated: isAuthenticated,
        allowedRoles: allowedRoles,
        loading: loading
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log("🚨 ProtectedRoute: Not authenticated, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log(`🚨 ProtectedRoute: Access denied. Role '${userRole}' not in ${allowedRoles}`);
        return <Navigate to="/" replace />;
    }

    console.log("✅ ProtectedRoute: Access granted");
    return children;
}