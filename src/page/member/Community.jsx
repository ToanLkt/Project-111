import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Footer from "../../components/Footer"

export default function Community() {
    // Lấy dữ liệu từ Redux thay vì AuthContext
    const { user, token } = useSelector((state) => state.account || {})
    const dispatch = useDispatch()

    // Extract fullName từ Redux user object
    const getFullName = () => {
        if (!user) return null
        return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ||
            user.fullName ||
            user.name ||
            "Người dùng"
    }

    const fullName = getFullName()

    // Extract user ID từ Redux user object
    const getUserId = () => {
        if (!user) return null
        return user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            user.userId ||
            user.id ||
            null
    }

    const accountId = getUserId()

    // Check if user is admin
    const isAdmin = () => {
        if (!user) return false
        const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            user.role ||
            user.roles
        return role === 'Admin' || (Array.isArray(role) && role.includes('Admin'))
    }

    const userIsAdmin = isAdmin()

    const [allPosts, setAllPosts] = useState([])
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [commentInputs, setCommentInputs] = useState({})
    const [comments, setComments] = useState({})
    const [commentLoading, setCommentLoading] = useState({})
    const [deleteLoading, setDeleteLoading] = useState({})

    // Lấy danh sách bài post
    useEffect(() => {
        console.log('🔐 Redux Token:', token ? 'Có token' : 'Không có token')
        console.log('👤 Redux User:', user)
        console.log('📝 Full Name:', fullName)
        console.log('👑 Is Admin:', userIsAdmin)

        fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/get")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                console.log('✅ Posts loaded:', data?.length || 0)
                const reversed = Array.isArray(data) ? data.reverse() : []
                setAllPosts(reversed)
                setPosts(reversed)
                // Fetch comments cho mỗi post
                reversed.forEach((post) => {
                    const postId = post.communityPostId || post.postId || post.id
                    if (postId) fetchComments(postId)
                })
            })
            .catch((error) => {
                console.error('❌ Error loading posts:', error)
                setAllPosts([])
                setPosts([])
            })
    }, [token, user])

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

    // Fetch comments cho posts khi cần
    useEffect(() => {
        posts.forEach((post) => {
            const postId = post.communityPostId || post.postId || post.id
            if (postId && comments[postId] === undefined) {
                fetchComments(postId)
            }
        })
    }, [posts])

    const fetchComments = async (postId) => {
        setCommentLoading((prev) => ({ ...prev, [postId]: true }))
        try {
            console.log(`🔍 Fetching comments for post ${postId}...`)
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Comment/${postId}`,
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            console.log(`✅ Comments loaded for post ${postId}:`, data?.length || 0)
            setComments((prev) => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }))
        } catch (error) {
            console.error(`❌ Error loading comments for post ${postId}:`, error)
            setComments((prev) => ({ ...prev, [postId]: [] }))
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: false }))
    }

    const handlePost = async (e) => {
        e.preventDefault()
        if (!content.trim()) {
            alert("Vui lòng nhập nội dung bài viết!")
            return
        }
        if (!token) {
            alert("Bạn cần đăng nhập để đăng bài!")
            return
        }

        setLoading(true)
        try {
            console.log('📝 Creating new post...')
            const res = await fetch(
                "https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/up",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: content.trim() }),
                },
            )

            if (!res.ok) {
                const errorText = await res.text()
                console.error('❌ Post creation failed:', errorText)
                throw new Error(`HTTP ${res.status}: ${errorText}`)
            }

            console.log('✅ Post created successfully')
            setContent("")

            // Reload posts
            const postsRes = await fetch("https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/get")
            if (postsRes.ok) {
                const data = await postsRes.json()
                const reversed = Array.isArray(data) ? data.reverse() : []
                setAllPosts(reversed)
                setPosts(reversed)
            }
        } catch (error) {
            console.error('❌ Error creating post:', error)
            alert(`Đăng bài thất bại: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleCommentInput = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }))
    }

    const handleCommentSubmit = async (postId) => {
        const commentContent = commentInputs[postId]
        if (!commentContent || !commentContent.trim()) {
            alert("Vui lòng nhập nội dung bình luận!")
            return
        }
        if (!token) {
            alert("Bạn cần đăng nhập để bình luận!")
            return
        }

        setCommentLoading((prev) => ({ ...prev, [postId]: true }))
        try {
            console.log(`💬 Creating comment for post ${postId}...`)
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
                        comment: commentContent.trim(),
                    }),
                },
            )

            if (!res.ok) {
                const errorText = await res.text()
                console.error('❌ Comment creation failed:', errorText)
                throw new Error(`HTTP ${res.status}: ${errorText}`)
            }

            console.log('✅ Comment created successfully')
            setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
            await fetchComments(postId)
        } catch (error) {
            console.error("❌ Error posting comment:", error)
            alert(`Bình luận thất bại: ${error.message}`)
        }
        setCommentLoading((prev) => ({ ...prev, [postId]: false }))
    }

    // Xóa bài viết
    const handleDeletePost = async (postId, postAuthorId) => {
        // Kiểm tra quyền xóa
        const canDelete = userIsAdmin || (accountId && accountId.toString() === postAuthorId?.toString())

        if (!canDelete) {
            alert("❌ Bạn không có quyền xóa bài viết này!")
            return
        }

        const confirmMessage = userIsAdmin
            ? "🛡️ Admin: Bạn có chắc chắn muốn xóa bài viết này không?"
            : "🗑️ Bạn có chắc chắn muốn xóa bài viết của mình không?"

        if (!confirm(confirmMessage)) return

        setDeleteLoading((prev) => ({ ...prev, [`post_${postId}`]: true }))

        try {
            console.log(`🗑️ Deleting post ${postId}...`)
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/CommunityPost/${postId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            if (!res.ok) {
                const errorText = await res.text()
                console.error('❌ Post deletion failed:', errorText)
                throw new Error(`HTTP ${res.status}: ${errorText}`)
            }

            console.log('✅ Post deleted successfully')

            // Cập nhật state để remove post
            setAllPosts((prev) => prev.filter((post) => {
                const currentPostId = post.communityPostId || post.postId || post.id
                return currentPostId.toString() !== postId.toString()
            }))
            setPosts((prev) => prev.filter((post) => {
                const currentPostId = post.communityPostId || post.postId || post.id
                return currentPostId.toString() !== postId.toString()
            }))

            // Xóa comments của post này
            setComments((prev) => {
                const newComments = { ...prev }
                delete newComments[postId]
                return newComments
            })

            alert("✅ Xóa bài viết thành công!")

        } catch (error) {
            console.error("❌ Error deleting post:", error)
            alert(`❌ Xóa bài viết thất bại: ${error.message}`)
        } finally {
            setDeleteLoading((prev) => ({ ...prev, [`post_${postId}`]: false }))
        }
    }

    // Xóa comment
    const handleDeleteComment = async (commentId, commentAuthorId, postId) => {
        // Kiểm tra quyền xóa
        const canDelete = userIsAdmin || (accountId && accountId.toString() === commentAuthorId?.toString())

        if (!canDelete) {
            alert("❌ Bạn không có quyền xóa bình luận này!")
            return
        }

        const confirmMessage = userIsAdmin
            ? "🛡️ Admin: Bạn có chắc chắn muốn xóa bình luận này không?"
            : "🗑️ Bạn có chắc chắn muốn xóa bình luận của mình không?"

        if (!confirm(confirmMessage)) return

        setDeleteLoading((prev) => ({ ...prev, [`comment_${commentId}`]: true }))

        try {
            console.log(`🗑️ Deleting comment ${commentId}...`)
            const res = await fetch(
                `https://api20250614101404-egb7asc2hkewcvbh.southeastasia-01.azurewebsites.net/api/Comment/${commentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            if (!res.ok) {
                const errorText = await res.text()
                console.error('❌ Comment deletion failed:', errorText)
                throw new Error(`HTTP ${res.status}: ${errorText}`)
            }

            console.log('✅ Comment deleted successfully')

            // Cập nhật comments state
            setComments((prev) => ({
                ...prev,
                [postId]: (prev[postId] || []).filter((comment) => {
                    const currentCommentId = comment.commentId || comment.id
                    return currentCommentId.toString() !== commentId.toString()
                })
            }))

            alert("✅ Xóa bình luận thành công!")

        } catch (error) {
            console.error("❌ Error deleting comment:", error)
            alert(`❌ Xóa bình luận thất bại: ${error.message}`)
        } finally {
            setDeleteLoading((prev) => ({ ...prev, [`comment_${commentId}`]: false }))
        }
    }

    // Kiểm tra quyền xóa post
    const canDeletePost = (post) => {
        if (!token || !accountId) return false
        const postAuthorId = post.accountId || post.userId || post.authorId
        return userIsAdmin || (accountId && accountId.toString() === postAuthorId?.toString())
    }

    // Kiểm tra quyền xóa comment
    const canDeleteComment = (comment) => {
        if (!token || !accountId) return false
        const commentAuthorId = comment.accountId || comment.userId || comment.authorId
        return userIsAdmin || (accountId && accountId.toString() === commentAuthorId?.toString())
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

                .btn-primary:hover:not(:disabled) {
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

                .btn-secondary:hover:not(:disabled) {
                    background: #4b5563;
                }

                .btn-secondary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-danger {
                    background: #dc2626;
                    border: none;
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .btn-danger:hover:not(:disabled) {
                    background: #b91c1c;
                    transform: translateY(-1px);
                }

                .btn-danger:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .admin-badge {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    margin-left: 0.5rem;
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
                    position: relative;
                }

                .post-author-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .post-actions {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    display: flex;
                    gap: 0.5rem;
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
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
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
                    white-space: pre-wrap;
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
                    position: relative;
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

                .comment-actions {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
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
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
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
                    white-space: pre-wrap;
                    margin-right: 2rem;
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
                    font-family: inherit;
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

                .user-status {
                    background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                    border: 1px solid #27ae60;
                    border-radius: 8px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: #27ae60;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .auth-warning {
                    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                    border: 1px solid #ffc107;
                    border-radius: 8px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: #856404;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
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

                    .comment-input-group {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .post-actions {
                        position: static;
                        margin-top: 1rem;
                        justify-content: flex-end;
                    }

                    .comment-content {
                        margin-right: 0;
                    }
                }
            `}</style>

            <div className="community-layout">
                {/* Header Section */}
                <div className="header-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="header-title">🌟 Cộng đồng chia sẻ</h1>
                                <p className="header-subtitle">Nơi kết nối và chia sẻ kinh nghiệm, kiến thức cùng cộng đồng cai thuốc lá</p>
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
                                <h2 className="create-post-title">📝 Tạo bài viết mới</h2>
                            </div>
                            <div className="create-post-body">
                                <form onSubmit={handlePost}>
                                    <div className="form-group">
                                        <label className="form-label">Nội dung bài viết</label>
                                        <textarea
                                            className="form-control form-textarea"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Chia sẻ cảm nghĩ, kinh nghiệm hoặc đặt câu hỏi của bạn về quá trình cai thuốc lá..."
                                            rows={4}
                                            disabled={!token}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {fullName && token ? (
                                                <div className="user-status">
                                                    ✅ Đăng bài với tên: <strong>{fullName}</strong>
                                                    {userIsAdmin && <span className="admin-badge">🛡️ Admin</span>}
                                                </div>
                                            ) : (
                                                <div className="auth-warning">
                                                    ⚠️ Vui lòng đăng nhập để đăng bài
                                                </div>
                                            )}
                                        </div>
                                        <button type="submit" disabled={loading || !token || !content.trim()} className="btn-primary">
                                            {loading ? (
                                                <>
                                                    <span className="loading-spinner me-2"></span>
                                                    Đang đăng...
                                                </>
                                            ) : (
                                                "📤 Đăng bài"
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
                                    <h3>📭 Chưa có bài viết nào</h3>
                                    <p>Hãy là người đầu tiên chia sẻ cảm nghĩ hoặc kinh nghiệm cai thuốc lá của bạn!</p>
                                </div>
                            ) : (
                                posts.map((post, idx) => {
                                    const postId = post.communityPostId || post.postId || post.id || idx
                                    const postAuthorId = post.accountId || post.userId || post.authorId
                                    return (
                                        <div key={postId} className="post-card">
                                            {/* Post Header */}
                                            <div className="post-header">
                                                <div className="post-author-info">
                                                    <div className="post-avatar">
                                                        {(post.fullName || "A").charAt(0).toUpperCase()
                                                        }
                                                    </div>
                                                    <div className="post-author-details">
                                                        <h4>
                                                            {post.fullName || "Ẩn danh"}
                                                            {userIsAdmin && postAuthorId && postAuthorId.toString() === accountId?.toString() && (
                                                                <span className="admin-badge">🛡️ Admin</span>
                                                            )}
                                                        </h4>
                                                        <p className="post-time">📅 {post.createTime || "Vừa xong"}</p>
                                                    </div>
                                                </div>

                                                {/* Post Actions */}
                                                {canDeletePost(post) && (
                                                    <div className="post-actions">
                                                        <button
                                                            className="btn-danger"
                                                            onClick={() => handleDeletePost(postId, postAuthorId)}
                                                            disabled={deleteLoading[`post_${postId}`]}
                                                            title={userIsAdmin ? "Admin: Xóa bài viết" : "Xóa bài viết của bạn"}
                                                        >
                                                            {deleteLoading[`post_${postId}`] ? (
                                                                <>
                                                                    <span className="loading-spinner"></span>
                                                                    Đang xóa...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {userIsAdmin ? "🛡️" : "🗑️"} Xóa
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Post Content */}
                                            <div className="post-content">{post.content}</div>

                                            {/* Comments Section */}
                                            <div className="comments-section">
                                                <div className="comments-header">
                                                    <h5 className="comments-title">
                                                        💬 Bình luận ({(comments[postId] || []).length})
                                                    </h5>
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
                                                                    <em>💭 Chưa có bình luận nào. Hãy là người đầu tiên!</em>
                                                                </div>
                                                            ) : (
                                                                comments[postId].map((cmt, cidx) => {
                                                                    const commentId = cmt.commentId || cmt.id || cidx
                                                                    const commentAuthorId = cmt.accountId || cmt.userId || cmt.authorId
                                                                    return (
                                                                        <div key={commentId} className="comment-item">
                                                                            <div className="comment-header">
                                                                                <div className="comment-avatar">
                                                                                    {(cmt.fullName || "A").charAt(0).toUpperCase()
                                                                                    }
                                                                                </div>
                                                                                <span className="comment-author">
                                                                                    {cmt.fullName || "Ẩn danh"}
                                                                                    {userIsAdmin && commentAuthorId && commentAuthorId.toString() === accountId?.toString() && (
                                                                                        <span className="admin-badge">🛡️</span>
                                                                                    )}
                                                                                </span>
                                                                                <span className="comment-time">🕐 {cmt.createTime || "Vừa xong"}</span>
                                                                            </div>
                                                                            <div className="comment-content">{cmt.content}</div>

                                                                            {/* Comment Actions */}
                                                                            {canDeleteComment(cmt) && (
                                                                                <div className="comment-actions">
                                                                                    <button
                                                                                        className="btn-danger"
                                                                                        onClick={() => handleDeleteComment(commentId, commentAuthorId, postId)}
                                                                                        disabled={deleteLoading[`comment_${commentId}`]}
                                                                                        title={userIsAdmin ? "Admin: Xóa bình luận" : "Xóa bình luận của bạn"}
                                                                                    >
                                                                                        {deleteLoading[`comment_${commentId}`] ? (
                                                                                            <span className="loading-spinner"></span>
                                                                                        ) : (
                                                                                            userIsAdmin ? "🛡️" : "🗑️"
                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })
                                                            )}
                                                        </div>

                                                        {/* Comment Form */}
                                                        <div className="comment-form">
                                                            <div className="comment-input-group">
                                                                <textarea
                                                                    className="comment-input"
                                                                    value={commentInputs[postId] || ""}
                                                                    onChange={(e) => handleCommentInput(postId, e.target.value)}
                                                                    placeholder={token ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận..."}
                                                                    disabled={!token}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                                            e.preventDefault()
                                                                            handleCommentSubmit(postId)
                                                                        }
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    disabled={commentLoading[postId] || !token || !(commentInputs[postId] || "").trim()}
                                                                    onClick={() => handleCommentSubmit(postId)}
                                                                    className="btn-secondary"
                                                                >
                                                                    {commentLoading[postId] ? (
                                                                        <>
                                                                            <span className="loading-spinner me-1"></span>
                                                                            Đang gửi...
                                                                        </>
                                                                    ) : (
                                                                        "💬 Gửi"
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
                                <h3 className="sidebar-card-title">🔍 Tìm kiếm</h3>
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
                                {search && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            🎯 Tìm thấy <strong>{posts.length}</strong> kết quả cho "<strong>{search}</strong>"
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* User Info Card */}
                        {fullName && token ? (
                            <div className="sidebar-card">
                                <div className="sidebar-card-header">
                                    <h3 className="sidebar-card-title">👤 Thông tin người dùng</h3>
                                </div>
                                <div className="sidebar-card-body">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="post-avatar">{fullName.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <h6 className="mb-1">
                                                {fullName}
                                                {userIsAdmin && <span className="admin-badge">🛡️ Admin</span>}
                                            </h6>
                                            <small className="text-muted">🌟 Thành viên hoạt động</small>
                                            <br />
                                            <small className="text-muted">🎯 ID: {accountId || "Không xác định"}</small>
                                            {userIsAdmin && (
                                                <>
                                                    <br />
                                                    <small style={{ color: '#f59e0b', fontWeight: 600 }}>
                                                        🛡️ Quản trị viên - Có thể xóa mọi bài viết
                                                    </small>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sidebar-card">
                                <div className="sidebar-card-header">
                                    <h3 className="sidebar-card-title">🔐 Đăng nhập</h3>
                                </div>
                                <div className="sidebar-card-body">
                                    <div className="text-center">
                                        <p className="text-muted mb-3">Đăng nhập để tham gia thảo luận!</p>
                                        <button
                                            className="btn-primary"
                                            onClick={() => window.location.href = '/login'}
                                        >
                                            🚀 Đăng nhập ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistics Card
                        <div className="sidebar-card">
                            <div className="sidebar-card-header">
                                <h3 className="sidebar-card-title">📊 Thống kê</h3>
                            </div>
                            <div className="sidebar-card-body">
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-number">{allPosts.length}</span>
                                        <div className="stat-label">📝 Tổng bài viết</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">
                                            {Object.values(comments).reduce((total, postComments) => total + (postComments?.length || 0), 0)}
                                        </span>
                                        <div className="stat-label">💬 Tổng bình luận</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{posts.length}</span>
                                        <div className="stat-label">🎯 Kết quả hiển thị</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">
                                            {new Set(allPosts.map((post) => post.fullName).filter(Boolean)).size}
                                        </span>
                                        <div className="stat-label">👥 Thành viên tham gia</div>
                                    </div>
                                </div>
                            </div>
                        </div>
 */}


                        {/* Rules Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card-header">
                                <h3 className="sidebar-card-title">📋 Quy tắc cộng đồng</h3>
                            </div>
                            <div className="sidebar-card-body">
                                <ul style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "#6b7280", paddingLeft: "1rem" }}>
                                    <li>🤝 Tôn trọng và hỗ trợ lẫn nhau</li>
                                    <li>💪 Chia sẻ kinh nghiệm tích cực</li>
                                    <li>🚫 Không spam hoặc quảng cáo</li>
                                    <li>🎯 Tập trung vào mục tiêu cai thuốc</li>
                                    <li>❤️ Động viên những người khó khăn</li>
                                    <li>🛡️ Admin có quyền kiểm duyệt nội dung</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
