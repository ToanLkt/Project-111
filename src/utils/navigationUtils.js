// Utility functions for safe navigation
export const safeNavigate = (navigate, path, options = {}) => {
    try {
        console.log(`🧭 Safe navigate to: ${path}`)
        console.log(`🔍 Current location: ${window.location.pathname}`)
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)

        navigate(path, { replace: true, ...options })
    } catch (error) {
        console.error(`❌ Navigation error to ${path}:`, error)
        // Fallback: try direct window navigation
        try {
            console.log(`🔄 Trying window.location.href fallback...`)
            window.location.href = path
        } catch (windowError) {
            console.error(`❌ Window navigation also failed:`, windowError)
            // Last resort: reload to home
            console.log(`🏠 Last resort: reloading to home`)
            window.location.href = '/'
        }
    }
}

export const clearUserData = () => {
    try {
        console.log('🧹 Clearing user data...')

        // Clear various storage locations
        const keysToRemove = [
            'persist:root',
            'persist:account',
            'token',
            'user',
            'auth-token',
            'userData'
        ]

        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key)
                console.log(`✅ Removed ${key} from localStorage`)
            } catch (err) {
                console.warn(`⚠️ Could not remove ${key}:`, err)
            }
        })

        // Clear session storage
        try {
            sessionStorage.clear()
            console.log('✅ Session storage cleared')
        } catch (err) {
            console.warn('⚠️ Could not clear session storage:', err)
        }

        console.log('✅ User data clearing completed')
    } catch (error) {
        console.error('❌ Error clearing user data:', error)
    }
}

export const handleLogoutError = (error, navigate) => {
    console.error('❌ Logout process error:', error)
    console.log('🔧 Attempting error recovery...')

    // Force clear data and redirect
    clearUserData()

    // Try multiple navigation methods
    try {
        console.log('🎯 Attempting safe navigation...')
        safeNavigate(navigate, '/')
    } catch (navError) {
        console.error('❌ Safe navigation failed:', navError)

        // Last resort: hard reload to home
        console.log('🔄 Last resort: hard reload to home')
        try {
            window.location.href = '/'
        } catch (reloadError) {
            console.error('❌ Even window.location.href failed:', reloadError)
            // If all else fails, try reload
            window.location.reload()
        }
    }
}
