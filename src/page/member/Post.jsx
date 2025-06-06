import React, { useState } from "react";

export default function Post({ post, onReport, onComment }) {
    const [commentText, setCommentText] = useState("");

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 18px rgba(44,130,201,0.07)",
                padding: "1.5rem",
                marginBottom: 30,
                maxWidth: 600,
                marginLeft: "auto",
                marginRight: "auto",
                color: "#222",
                fontFamily: "'Segoe UI', Arial, 'Helvetica Neue', Roboto, Tahoma, sans-serif",
                border: "1.5px solid #f3d46e",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <span
                    style={{
                        background: "#fffbe8",
                        color: "#bfa917",
                        borderRadius: "50%",
                        width: 38,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 20,
                        marginRight: 12,
                        userSelect: "none",
                        border: "2px solid #f3d46e",
                    }}
                >
                    {post.author[0].toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{post.author}</span>
                <span style={{ color: "#888", fontSize: 13, marginLeft: 14 }}>{post.time}</span>
            </div>

            <div style={{ marginBottom: 14, fontSize: "1.1rem", lineHeight: 1.5 }}>
                {post.content}
            </div>

            {post.image && (
                <img
                    src={post.image}
                    alt="post"
                    style={{
                        maxWidth: "100%",
                        borderRadius: 14,
                        marginBottom: 14,
                        boxShadow: "0 4px 10px rgba(243,212,110,0.18)",
                        userSelect: "none",
                    }}
                />
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 12 }}>
                <button
                    onClick={onReport}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#bfa917",
                        fontSize: 20,
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "color 0.3s",
                    }}
                    title="Báo cáo bài viết"
                    aria-label="Report post"
                >
                    🚩
                </button>
            </div>

            {/* Comments Section */}
            <div style={{ marginTop: 16 }}>
                <div
                    style={{
                        fontWeight: 600,
                        color: "#bfa917",
                        marginBottom: 8,
                        fontSize: 16,
                        userSelect: "none",
                    }}
                >
                    Bình luận
                </div>

                {post.comments.map((c, idx) => (
                    <div
                        key={idx}
                        style={{
                            marginBottom: 10,
                            paddingLeft: 6,
                            borderLeft: "2px solid #f3d46e",
                            paddingTop: 4,
                            paddingBottom: 4,
                        }}
                    >
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{c.author}:</span>{" "}
                        <span style={{ fontSize: 14 }}>{c.text}</span>
                    </div>
                ))}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (commentText.trim()) {
                            onComment(commentText);
                            setCommentText("");
                        }
                    }}
                    style={{ display: "flex", gap: 10, marginTop: 6 }}
                >
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Viết bình luận..."
                        style={{
                            flex: 1,
                            padding: "0.6rem",
                            borderRadius: 8,
                            border: "1.5px solid #f3d46e",
                            fontSize: "1rem",
                            background: "#fffbe8",
                            color: "#222",
                            outline: "none",
                            transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#bfa917")}
                        onBlur={(e) => (e.target.style.borderColor = "#f3d46e")}
                    />
                    <button
                        type="submit"
                        style={{
                            background: "#bfa917",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.55rem 1.3rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3d46e")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#bfa917")}
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}
