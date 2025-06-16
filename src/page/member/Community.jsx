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
            likes: 5,
            liked: false,
            comments: [
                { author: "Bạch Tấn Phú", text: "Gắng lên bạn nhé!" }
            ],
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
                background: "#F2EFE7",
                padding: "2rem 0",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#006A71",
            }}
        >
            <div
                style={{
                    maxWidth: 700,
                    margin: "0 auto",
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 6px 32px rgba(72,166,167,0.13)",
                    padding: "2.5rem 2.2rem 1.7rem 2.2rem",
                    marginBottom: 38,
                    border: "2px solid #9ACBD0",
                    position: "relative",
                }}
            >
                <h2
                    style={{
                        color: "#006A71",
                        textAlign: "center",
                        marginBottom: 26,
                        fontWeight: 900,
                        fontSize: "2.1rem",
                        userSelect: "none",
                        letterSpacing: 1,
                        textShadow: "0 2px 8px rgba(72,166,167,0.08)",
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
                            borderRadius: 12,
                            border: "1.7px solid #9ACBD0",
                            padding: "1.1rem",
                            fontSize: "1.13rem",
                            marginBottom: 16,
                            resize: "vertical",
                            backgroundColor: "#E6F4F4",
                            color: "#006A71",
                            outline: "none",
                            boxShadow: "0 2px 8px rgba(154,203,208,0.10)",
                            transition: "border-color 0.3s",
                        }}
                        onFocus={e => (e.target.style.borderColor = "#48A6A7")}
                        onBlur={e => (e.target.style.borderColor = "#9ACBD0")}
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
                                    maxWidth: 200,
                                    borderRadius: 16,
                                    boxShadow: "0 4px 16px rgba(154,203,208,0.18)",
                                    userSelect: "none",
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <label
                            style={{
                                background: "#E6F4F4",
                                color: "#48A6A7",
                                borderRadius: 10,
                                padding: "0.55rem 1.3rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                userSelect: "none",
                                border: "1.7px solid #48A6A7",
                                transition: "background-color 0.3s, color 0.3s",
                                fontSize: "1rem",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = "#9ACBD0";
                                e.currentTarget.style.color = "#006A71";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = "#E6F4F4";
                                e.currentTarget.style.color = "#48A6A7";
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
                                background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                padding: "0.7rem 2rem",
                                fontWeight: 800,
                                fontSize: "1.13rem",
                                cursor: "pointer",
                                boxShadow: "0 2px 10px rgba(72,166,167,0.13)",
                                transition: "background 0.3s",
                                letterSpacing: 0.5,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#006A71")}
                            onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)")}
                        >
                            Đăng bài
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách bài viết */}
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
                {posts.length === 0 ? (
                    <div
                        style={{
                            background: "#E6F4F4",
                            color: "#48A6A7",
                            borderRadius: 14,
                            padding: "2.2rem 1.5rem",
                            textAlign: "center",
                            fontWeight: 600,
                            fontSize: "1.15rem",
                            boxShadow: "0 2px 8px rgba(154,203,208,0.10)",
                        }}
                    >
                        Hãy là người đầu tiên chia sẻ cảm nghĩ hoặc kinh nghiệm của bạn!
                    </div>
                ) : (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                            onLike={() => handleLike(post.id)}
                            onReport={() => handleReport(post.id)}
                            onComment={(text) => handleComment(post.id, text)}
                        />
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
}
