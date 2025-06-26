import React, { useState, useEffect, useContext } from "react";
import Footer from "../../components/Footer";
import AuthContext from "../../AuthContext/AuthContext";

export default function Community() {
    const { token, fullName } = useContext(AuthContext);
    const [allPosts, setAllPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    // Thêm state cho comment
    const [commentInputs, setCommentInputs] = useState({});
    const [comments, setComments] = useState({}); // { postId: [comment, ...] }
    const [commentLoading, setCommentLoading] = useState({}); // { postId: boolean }

    // Lấy danh sách bài post
    useEffect(() => {
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/get")
            .then(res => res.json())
            .then(data => {
                const reversed = data.reverse();
                setAllPosts(reversed);
                setPosts(reversed);
            })
            .catch(() => {
                setAllPosts([]);
                setPosts([]);
            });
    }, [token]);

    // Lọc bài viết khi search thay đổi
    useEffect(() => {
        if (!search.trim()) {
            setPosts(allPosts);
        } else {
            const keyword = search.trim().toLowerCase();
            setPosts(
                allPosts.filter(
                    post =>
                        (post.content && post.content.toLowerCase().includes(keyword)) ||
                        (post.fullName && post.fullName.toLowerCase().includes(keyword))
                )
            );
        }
    }, [search, allPosts]);

    // Khi render danh sách bài viết, lấy comment cho từng postId
    useEffect(() => {
        posts.forEach(post => {
            if (
                post.communityPostId &&
                comments[post.communityPostId] === undefined
            ) {
                fetchComments(post.communityPostId);
            }
        });
        // eslint-disable-next-line
    }, [posts]);

    // Hàm lấy comment cho từng postId
    const fetchComments = async (postId) => {
        setCommentLoading((prev) => ({ ...prev, [postId]: true }));
        try {
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Comment/${postId}`
            );
            const data = await res.json();
            setComments((prev) => ({ ...prev, [postId]: data }));
        } catch {
            setComments((prev) => ({ ...prev, [postId]: [] }));
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        if (!token) {
            alert("Bạn cần đăng nhập để đăng bài!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });
            if (!res.ok) throw new Error(await res.text());
            const newPost = await res.json();
            setAllPosts([newPost, ...allPosts]);
            setPosts([newPost, ...posts]);
            setContent("");
        } catch {
            alert("Đăng bài thất bại!");
        }
        setLoading(false);
    };

    // Xử lý nhập comment
    const handleCommentInput = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    };

    // Gửi comment
    const handleCommentSubmit = async (postId) => {
        const commentContent = commentInputs[postId];
        if (!commentContent || !commentContent.trim()) return;
        if (!token) {
            alert("Bạn cần đăng nhập để bình luận!");
            return;
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: true }));
        try {
            const res = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    communityPostId: postId, // Đúng postId của bài post này
                    content: commentContent,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
            // Sau khi gửi thành công, lấy lại comment cho đúng postId này
            await fetchComments(postId);
        } catch {
            alert("Bình luận thất bại!");
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: false }));
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

                {/* Form search */}
                <form onSubmit={e => e.preventDefault()} style={{ marginBottom: 18, display: "flex", gap: 10 }}>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm kiếm bài viết..."
                        style={{
                            flex: 1,
                            borderRadius: 8,
                            border: "1.5px solid #9ACBD0",
                            padding: "0.7rem 1rem",
                            fontSize: "1.08rem",
                            outline: "none",
                        }}
                    />
                </form>

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

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                padding: "0.7rem 2rem",
                                fontWeight: 800,
                                fontSize: "1.13rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: "0 2px 10px rgba(72,166,167,0.13)",
                                transition: "background 0.3s",
                                letterSpacing: 0.5,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#006A71")}
                            onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg, #48A6A7 60%, #006A71 100%)")}
                        >
                            {loading ? "Đang đăng..." : "Đăng bài"}
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
                    posts.map((post, idx) => (
                        <div
                            key={post.communityPostId || idx}
                            style={{
                                background: "#fff",
                                border: "1.5px solid #9ACBD0",
                                borderRadius: 12,
                                padding: "1.2rem 1.3rem 1rem 1.3rem",
                                marginBottom: 18,
                                boxShadow: "0 2px 8px rgba(154,203,208,0.10)",
                            }}
                        >
                            <div style={{ fontWeight: 700, color: "#006A71", marginBottom: 4 }}>
                                {post.fullName || "Ẩn danh"}
                            </div>
                            <div style={{ fontSize: "1.08rem", marginBottom: 6 }}>
                                {post.content}
                            </div>
                            <div style={{ fontSize: 13, color: "#888", textAlign: "right" }}>
                                {post.createTime}
                            </div>
                            {/* Hiển thị comment */}
                            <div style={{ marginTop: 16, background: "#F2EFE7", borderRadius: 8, padding: "10px 12px" }}>
                                <div style={{ fontWeight: 600, color: "#48A6A7", marginBottom: 6 }}>Bình luận</div>
                                {commentLoading[post.communityPostId] ? (
                                    <div style={{ color: "#888" }}>Đang tải bình luận...</div>
                                ) : (
                                    <div>
                                        {(comments[post.communityPostId] || []).length === 0 ? (
                                            <div style={{ color: "#aaa", fontSize: 14 }}>Chưa có bình luận nào.</div>
                                        ) : (
                                            comments[post.communityPostId].map((cmt, cidx) => (
                                                <div key={cmt.commentId || cidx} style={{ marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid #e0e0e0" }}>
                                                    <span style={{ fontWeight: 600, color: "#006A71" }}>{cmt.fullName || "Ẩn danh"}: </span>
                                                    <span>{cmt.content}</span>
                                                    <div style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>{cmt.createTime}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {/* Form nhập comment */}
                                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                    <input
                                        type="text"
                                        value={commentInputs[post.communityPostId] || ""}
                                        onChange={e => handleCommentInput(post.communityPostId, e.target.value)}
                                        placeholder="Viết bình luận..."
                                        style={{
                                            flex: 1,
                                            borderRadius: 7,
                                            border: "1.2px solid #9ACBD0",
                                            padding: "0.5rem 0.9rem",
                                            fontSize: "1rem",
                                            outline: "none",
                                            background: "#fff",
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentSubmit(post.communityPostId);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        disabled={commentLoading[post.communityPostId]}
                                        onClick={() => handleCommentSubmit(post.communityPostId)}
                                        style={{
                                            background: "#48A6A7",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 8,
                                            padding: "0.5rem 1.2rem",
                                            fontSize: "1rem",
                                            cursor: commentLoading[post.communityPostId] ? "not-allowed" : "pointer",
                                            boxShadow: "0 2px 8px rgba(72,166,167,0.13)",
                                            transition: "background 0.3s",
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#006A71")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "#48A6A7")}
                                    >
                                        {commentLoading[post.communityPostId] ? "Đang gửi..." : "Gửi bình luận"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
}
