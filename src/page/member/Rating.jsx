import React from "react";


export default function Rating({ value, onChange, readOnly = false, size = 26 }) {
    return (
        <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{
                        fontSize: size,
                        color: star <= value ? "#ffd700" : "#ccc",
                        cursor: readOnly ? "default" : "pointer",
                        transition: "color 0.15s"
                    }}
                    onClick={() => !readOnly && onChange(star)}
                    role="button"
                >
                    ★
                </span>
            ))}

        </div>
    );
}