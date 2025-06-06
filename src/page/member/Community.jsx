import React, { useState } from "react";
import Post from "./Post";
import Footer from "../../components/Footer";

export default function Community() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Hà Việt Thành",
            time: "2 giờ trước",
            content: "Mình đã bỏ thuốc được 1 tuần rồi, mình cảm thấy nhớ thuốc quá!",
            image: "",
            likes: 10,
            liked: false,
            comments: [{ author: "Bạch Tấn Phú", text: "Gáng đi em" }],
        },
    ]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");

    const handlePost = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setPosts([
            {
                id: Date.now(),
                author: "Bạn",
                time: "Vừa xong",
                content,
                image,
                likes: 0,
                liked: false,
                comments: [],
            },
            ...posts,
        ]);
        setContent("");
        setImage("");
    };

    const handleLike = (id) => {
        setPosts(
            posts.map((post) =>
                post.id === id
                    ? {
                        ...post,
                        liked: !post.liked,
                        likes: post.liked ? post.likes - 1 : post.likes + 1,
                    }
                    : post
            )
        );
    };

    const handleReport = (id) => {
        alert("Báo cáo bài viết thành công! (demo)");
    };

    const handleComment = (id, text) => {
        setPosts(
            posts.map((post) =>
                post.id === id
                    ? { ...post, comments: [...post.comments, { author: "Bạn", text }] }
                    : post
            )
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return setImage("");
        const reader = new FileReader();
        reader.onload = (ev) => setImage(ev.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f7fa",
                padding: "2rem 0",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#222",
            }}
        >
            <div
                style={{
                    maxWidth: 650,
                    margin: "0 auto",
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(44,130,201,0.07)",
                    padding: "2.2rem 2rem 1.5rem 2rem",
                    marginBottom: 36,
                    border: "1.5px solid #f3d46e",
                }}
            >
                <h2
                    style={{
                        color: "#bfa917",
                        textAlign: "center",
                        marginBottom: 22,
                        fontWeight: 800,
                        fontSize: "2rem",
                        userSelect: "none",
                        letterSpacing: 0.5,
                    }}
                >
                    Cộng đồng chia sẻ
                </h2>

                <form onSubmit={handlePost}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Chia sẻ cảm nghĩ, kinh nghiệm hoặc đặt câu hỏi..."
                        rows={4}
                        style={{
                            width: "100%",
                            borderRadius: 10,
                            border: "1.5px solid #f3d46e",
                            padding: "0.95rem",
                            fontSize: "1.1rem",
                            marginBottom: 14,
                            resize: "vertical",
                            backgroundColor: "#fffbe8",
                            color: "#222",
                            outline: "none",
                            boxShadow: "0 1px 6px rgba(243,212,110,0.07)",
                            transition: "border-color 0.3s",
                        }}
                        onFocus={e => (e.target.style.borderColor = "#bfa917")}
                        onBlur={e => (e.target.style.borderColor = "#f3d46e")}
                    />

                    {image && (
                        <div
                            style={{
                                marginBottom: 14,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={image}
                                alt="preview"
                                style={{
                                    maxWidth: 180,
                                    borderRadius: 14,
                                    boxShadow: "0 4px 12px rgba(243,212,110,0.18)",
                                    userSelect: "none",
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <label
                            style={{
                                background: "#fffbe8",
                                color: "#bfa917",
                                borderRadius: 8,
                                padding: "0.5rem 1.2rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                userSelect: "none",
                                border: "1.5px solid #bfa917",
                                transition: "background-color 0.3s, color 0.3s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = "#f3d46e";
                                e.currentTarget.style.color = "#222";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = "#fffbe8";
                                e.currentTarget.style.color = "#bfa917";
                            }}
                        >
                            📷 Ảnh
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </label>

                        <button
                            type="submit"
                            style={{
                                background: "linear-gradient(90deg, #f3d46e 60%, #bfa917 100%)",
                                color: "#222",
                                border: "none",
                                borderRadius: 8,
                                padding: "0.6rem 1.8rem",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(191,169,23,0.10)",
                                transition: "background 0.3s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#bfa917")}
                            onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg, #f3d46e 60%, #bfa917 100%)")}
                        >
                            Đăng bài
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách bài viết */}
            <div style={{ maxWidth: 650, margin: "0 auto" }}>
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        onLike={() => handleLike(post.id)}
                        onReport={() => handleReport(post.id)}
                        onComment={(text) => handleComment(post.id, text)}
                    />
                ))}
            </div>

            <Footer />
        </div>
    );
}
