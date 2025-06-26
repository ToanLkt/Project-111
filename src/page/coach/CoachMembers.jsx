import React, { useEffect, useState } from 'react';
import { useAuth } from "../../AuthContext/AuthContext";

export default function CoachMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        setLoading(true);
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Member", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => Array.isArray(data) ? setMembers(data) : setMembers([]))
            .catch(() => setMembers([]))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ color: "#006A71", fontWeight: 900, marginBottom: 24 }}>Danh sách học viên</h2>
            {loading ? (
                <div style={{ color: "#888" }}>Đang tải danh sách...</div>
            ) : members.length === 0 ? (
                <div style={{ color: "#888" }}>Không có học viên nào.</div>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                    <thead>
                        <tr style={{ background: "#E6F4F4", color: "#006A71" }}>
                            <th style={{ padding: "10px", border: "1px solid #9ACBD0" }}>STT</th>
                            <th style={{ padding: "10px", border: "1px solid #9ACBD0" }}>Họ tên</th>
                            <th style={{ padding: "10px", border: "1px solid #9ACBD0" }}>Email</th>
                            <th style={{ padding: "10px", border: "1px solid #9ACBD0" }}>Ngày tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((m, idx) => (
                            <tr key={m.id || idx} style={{ borderBottom: "1px solid #9ACBD0" }}>
                                <td style={{ padding: "10px", textAlign: "center" }}>{idx + 1}</td>
                                <td style={{ padding: "10px" }}>{m.fullName}</td>
                                <td style={{ padding: "10px" }}>{m.email}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>
                                    {m.joinDate ? new Date(m.joinDate).toLocaleDateString("vi-VN") : ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
