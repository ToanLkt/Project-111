import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ConfirmRegister() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Đang xác nhận...");
    const token = searchParams.get("token");



    useEffect(() => {
        if (!token) {
            setMessage("Không tìm thấy mã xác nhận.");
            return;
        }
        fetch(`https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Auth/confirm-register?token=${token}`)
            .then(res => res.ok ? res.text() : Promise.reject(res.text()))
            .then(msg => setMessage(msg || "Xác nhận thành công!"))
            .catch(() => setMessage("Xác nhận thất bại hoặc mã không hợp lệ."));
    }, [token]);

    return (
        <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2>{message}</h2>
        </div>
    );
}