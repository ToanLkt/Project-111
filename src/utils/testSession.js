// Test script để kiểm tra localStorage persistence
// Thêm script này vào console để test

console.log("🔍 Checking localStorage authentication data:");

const userData = localStorage.getItem('user');
const tokenData = localStorage.getItem('token');

console.log("User data:", userData ? JSON.parse(userData) : 'Not found');
console.log("Token data:", tokenData || 'Not found');

if (userData && tokenData) {
    const user = JSON.parse(userData);
    console.log("✅ Authentication data found:");
    console.log("- User ID:", user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || user.id);
    console.log("- User Role:", user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || user.role);
    console.log("- Email:", user.email);
    console.log("- Full Name:", user.fullName);
    console.log("- Token length:", tokenData.length);
} else {
    console.log("❌ No authentication data found in localStorage");
}

// Test session restoration
if (window.store) {
    const state = window.store.getState();
    console.log("🔍 Redux state:", state.account);
}
