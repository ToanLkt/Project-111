import { useState, useEffect, useContext } from "react"
import Footer from "../../components/Footer"
import AuthContext from "../../AuthContext/AuthContext"

export default function Community() {
    const { token, fullName } = useContext(AuthContext)
    const [allPosts, setAllPosts] = useState([])
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [commentInputs, setCommentInputs] = useState({})
    const [comments, setComments] = useState({})
    const [commentLoading, setCommentLoading] = useState({})

    // Lấy danh sách bài post
    useEffect(() => {
        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/get")
            .then((res) => res.json())
            .then((data) => {
                const reversed = data.reverse()
                setAllPosts(reversed)
                setPosts(reversed)
                reversed.forEach((post) => {
                    const postId = post.communityPostId || post.postId || post.id
                    if (postId) fetchComments(postId)
                })
            })
            .catch(() => {
                setAllPosts([])
                setPosts([])
            })
    }, [token])

    // Lọc bài viết khi search thay đổi
    useEffect(() => {
        if (!search.trim()) {
            setPosts(allPosts)
        } else {
            const keyword = search.trim().toLowerCase()
            setPosts(
                allPosts.filter(
                    (post) =>
                        (post.content && post.content.toLowerCase().includes(keyword)) ||
                        (post.fullName && post.fullName.toLowerCase().includes(keyword)),
                ),
            )
        }
    }, [search, allPosts])

    useEffect(() => {
        posts.forEach((post) => {
            if (post.communityPostId && comments[post.communityPostId] === undefined) {
                fetchComments(post.communityPostId)
            }
        })
    }, [posts])

    const fetchComments = async (postId) => {
        setCommentLoading((prev) => ({ ...prev, [postId]: true }))
        try {
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Comment/${postId}`,
            )
            const data = await res.json()
            setComments((prev) => ({ ...prev, [postId]: data }))
        } catch {
            setComments((prev) => ({ ...prev, [postId]: [] }))
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: false }))
    }

    const handlePost = async (e) => {
        e.preventDefault()
        if (!content.trim()) return
        if (!token) {
            alert("Bạn cần đăng nhập để đăng bài!")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(
                "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/up",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content }),
                },
            )

            if (!res.ok) {
                alert("Đăng bài thất bại!")
                setLoading(false)
                return
            }

            setContent("")
            fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/get")
                .then((res) => res.json())
                .then((data) => {
                    const reversed = data.reverse()
                    setAllPosts(reversed)
                    setPosts(reversed)
                })
            setLoading(false)
        } catch {
            alert("Đăng bài thất bại!")
        }
        setLoading(false)
    }

    const handleCommentInput = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }))
    }

    const handleCommentSubmit = async (postId) => {
        const commentContent = commentInputs[postId]
        if (!commentContent || !commentContent.trim()) return
        if (!token) {
            alert("Bạn cần đăng nhập để bình luận!")
            return
        }

        setCommentLoading((prev) => ({ ...prev, [postId]: true }))
        try {
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Comment?postId=${postId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "*/*",
                    },
                    body: JSON.stringify({
                        comment: commentContent,
                    }),
                },
            )

            if (!res.ok) throw new Error(await res.text())
            setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
            await fetchComments(postId)
        } catch (error) {
            console.error("Error posting comment:", error)
            alert("Bình luận thất bại!")
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: false }))
    }

    return (
        <>
            <style jsx>{`
                .community-layout {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                .header-section {
                    background: linear-gradient(135deg, #006A71 0%, #48A6A7 100%);
                    color: white;
                    padding: 2rem 0;
                    box-shadow: 0 4px 20px rgba(0, 106, 113, 0.15);
                }

                .header-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .header-subtitle {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-top: 0.5rem;
                }

                .main-content {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 2rem;
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .posts-column {
                    min-height: 0;
                }

                .sidebar-column {
                    position: sticky;
                    top: 2rem;
                    height: fit-content;
                }

                .create-post-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0;
                    margin-bottom: 2rem;
                    overflow: hidden;
                }

                .create-post-header {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                .create-post-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .create-post-body {
                    padding: 1.5rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-control {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                    background: #fff;
                }

                .form-control:focus {
                    outline: none;
                    border-color: #48A6A7;
                    box-shadow: 0 0 0 3px rgba(72, 166, 167, 0.1);
                }

                .form-textarea {
                    min-height: 120px;
                    resize: vertical;
                    font-family: inherit;
                    line-height: 1.5;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #48A6A7 0%, #006A71 100%);
                    border: none;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(72, 166, 167, 0.3);
                }

                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-secondary {
                    background: #6b7280;
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-secondary:hover {
                    background: #4b5563;
                }

                .sidebar-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0;
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                }

                .sidebar-card-header {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                .sidebar-card-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .sidebar-card-body {
                    padding: 1.5rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .stat-item {
                    text-align: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 8px;
                }

                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #006A71;
                    display: block;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-top: 0.25rem;
                }

                .post-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0;
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }

                .post-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }

                .post-header {
                    padding: 1.5rem 1.5rem 1rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .post-author-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .post-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #48A6A7, #006A71);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 1rem;
                }

                .post-author-details h4 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .post-time {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin: 0;
                }

                .post-content {
                    padding: 0 1.5rem 1.5rem;
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #374151;
                }

                .comments-section {
                    border-top: 1px solid #f1f5f9;
                    background: #f8fafc;
                }

                .comments-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    background: white;
                }

                .comments-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .comments-list {
                    padding: 1rem 1.5rem;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .comment-item {
                    background: white;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    border: 1px solid #e2e8f0;
                }

                .comment-item:last-child {
                    margin-bottom: 0;
                }

                .comment-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .comment-avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #9ACBD0, #48A6A7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 0.75rem;
                }

                .comment-author {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 0.875rem;
                }

                .comment-time {
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-left: auto;
                }

                .comment-content {
                    font-size: 0.875rem;
                    line-height: 1.5;
                    color: #374151;
                }

                .comment-form {
                    padding: 1rem 1.5rem;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                }

                .comment-input-group {
                    display: flex;
                    gap: 0.75rem;
                    align-items: flex-end;
                }

                .comment-input {
                    flex: 1;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    resize: none;
                    min-height: 40px;
                    max-height: 120px;
                }

                .comment-input:focus {
                    outline: none;
                    border-color: #48A6A7;
                    box-shadow: 0 0 0 3px rgba(72, 166, 167, 0.1);
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #6b7280;
                }

                .empty-state h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }

                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 1024px) {
                    .main-content {
                        grid-template-columns: 1fr;
                        padding: 1rem;
                    }
                    
                    .sidebar-column {
                        position: static;
                    }
                }

                @media (max-width: 768px) {
                    .header-title {
                        font-size: 2rem;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="community-layout">
                {/* Header Section */}
                <div className="header-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="header-title">Cộng đồng chia sẻ</h1>
                                <p className="header-subtitle">Nơi kết nối và chia sẻ kinh nghiệm, kiến thức cùng cộng đồng</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Posts Column */}
                    <div className="posts-column">
                        {/* Create Post Card */}
                        <div className="create-post-card">
                            <div className="create-post-header">
                                <h2 className="create-post-title">Tạo bài viết mới</h2>
                            </div>
                            <div className="create-post-body">
                                <form onSubmit={handlePost}>
                                    <div className="form-group">
                                        <label className="form-label">Nội dung bài viết</label>
                                        <textarea
                                            className="form-control form-textarea"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Chia sẻ cảm nghĩ, kinh nghiệm hoặc đặt câu hỏi của bạn..."
                                            rows={4}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted small">
                                            {fullName ? `Đăng bài với tên: ${fullName}` : "Vui lòng đăng nhập để đăng bài"}
                                        </div>
                                        <button type="submit" disabled={loading} className="btn-primary">
                                            {loading ? (
                                                <>
                                                    <span className="loading-spinner me-2"></span>
                                                    Đang đăng...
                                                </>
                                            ) : (
                                                "Đăng bài"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="posts-list">
                            {posts.length === 0 ? (
                                <div className="empty-state">
                                    <h3>Chưa có bài viết nào</h3>
                                    <p>Hãy là người đầu tiên chia sẻ cảm nghĩ hoặc kinh nghiệm của bạn!</p>
                                </div>
                            ) : (
                                posts.map((post, idx) => {
                                    const postId = post.communityPostId || post.postId || post.id || idx
                                    return (
                                        <div key={postId} className="post-card">
                                            {/* Post Header */}
                                            <div className="post-header">
                                                <div className="post-author-info">
                                                    <div className="post-avatar">{(post.fullName || "A").charAt(0).toUpperCase()}</div>
                                                    <div className="post-author-details">
                                                        <h4>{post.fullName || "Ẩn danh"}</h4>
                                                        <p className="post-time">{post.createTime}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Post Content */}
                                            <div className="post-content">{post.content}</div>

                                            {/* Comments Section */}
                                            <div className="comments-section">
                                                <div className="comments-header">
                                                    <h5 className="comments-title">Bình luận ({(comments[postId] || []).length})</h5>
                                                </div>

                                                {commentLoading[postId] ? (
                                                    <div className="text-center py-3">
                                                        <span className="loading-spinner me-2"></span>
                                                        <span className="text-muted">Đang tải bình luận...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="comments-list">
                                                            {(comments[postId] || []).length === 0 ? (
                                                                <div className="text-muted text-center py-2">
                                                                    <em>Chưa có bình luận nào. Hãy là người đầu tiên!</em>
                                                                </div>
                                                            ) : (
                                                                comments[postId].map((cmt, cidx) => (
                                                                    <div key={cmt.commentId || cidx} className="comment-item">
                                                                        <div className="comment-header">
                                                                            <div className="comment-avatar">
                                                                                {(cmt.fullName || "A").charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <span className="comment-author">{cmt.fullName || "Ẩn danh"}</span>
                                                                            <span className="comment-time">{cmt.createTime}</span>
                                                                        </div>
                                                                        <div className="comment-content">{cmt.content}</div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>

                                                        {/* Comment Form */}
                                                        <div className="comment-form">
                                                            <div className="comment-input-group">
                                                                <textarea
                                                                    className="comment-input"
                                                                    value={commentInputs[postId] || ""}
                                                                    onChange={(e) => handleCommentInput(postId, e.target.value)}
                                                                    placeholder="Viết bình luận của bạn..."
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                                            e.preventDefault()
                                                                            handleCommentSubmit(postId)
                                                                        }
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    disabled={commentLoading[postId]}
                                                                    onClick={() => handleCommentSubmit(postId)}
                                                                    className="btn-secondary"
                                                                >
                                                                    {commentLoading[postId] ? (
                                                                        <>
                                                                            <span className="loading-spinner me-1"></span>
                                                                            Đang gửi...
                                                                        </>
                                                                    ) : (
                                                                        "Gửi"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="sidebar-column">
                        {/* Search Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card-header">
                                <h3 className="sidebar-card-title">Tìm kiếm</h3>
                            </div>
                            <div className="sidebar-card-body">
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm kiếm bài viết hoặc tác giả..."
                                    />
                                </form>
                            </div>
                        </div>

                        {/* Statistics Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card-header">
                                <h3 className="sidebar-card-title">Thống kê</h3>
                            </div>
                            <div className="sidebar-card-body">
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-number">{allPosts.length}</span>
                                        <div className="stat-label">Tổng bài viết</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">
                                            {Object.values(comments).reduce((total, postComments) => total + postComments.length, 0)}
                                        </span>
                                        <div className="stat-label">Tổng bình luận</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{posts.length}</span>
                                        <div className="stat-label">Kết quả hiển thị</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{new Set(allPosts.map((post) => post.fullName)).size}</span>
                                        <div className="stat-label">Thành viên tham gia</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info Card */}
                        {fullName && (
                            <div className="sidebar-card">
                                <div className="sidebar-card-header">
                                    <h3 className="sidebar-card-title">Thông tin người dùng</h3>
                                </div>
                                <div className="sidebar-card-body">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="post-avatar">{fullName.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <h6 className="mb-1">{fullName}</h6>
                                            <small className="text-muted">Thành viên hoạt động</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
