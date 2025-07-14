# Test Chat Integration Between Member và Coach

## Mục đích kiểm tra:
1. Member gửi tin nhắn từ `/coach` (Coach.jsx)
2. Coach nhận và phản hồi từ `/coachpage/chat` (CoachChat.jsx)
3. Tin nhắn đồng bộ qua API

## Test Cases:

### Test 1: Member gửi tin nhắn
1. Đăng nhập với tài khoản Member
2. Vào trang `/coach` 
3. Chọn một Coach từ danh sách
4. Gửi tin nhắn: "Tôi cần hỗ trợ bỏ thuốc lá"
5. Kiểm tra API `/api/Chat/send` được gọi

### Test 2: Coach nhận tin nhắn  
1. Đăng nhập với tài khoản Coach
2. Vào trang `/coachpage/chat`
3. Kiểm tra Member xuất hiện trong danh sách
4. Click vào Member để xem cuộc hội thoại
5. Kiểm tra tin nhắn từ Member hiển thị

### Test 3: Coach phản hồi
1. Từ trang `/coachpage/chat`
2. Gửi tin nhắn phản hồi: "Tôi sẽ giúp bạn!"
3. Kiểm tra API `/api/Chat/send` được gọi
4. Kiểm tra tin nhắn hiển thị trong chat

### Test 4: Member nhận phản hồi
1. Quay lại trang `/coach` với tài khoản Member
2. Kiểm tra tin nhắn từ Coach hiển thị
3. Verify real-time chat hoạt động

## API Endpoints được sử dụng:
- GET `/api/Member/all-coaches` - Lấy danh sách coaches (Member)
- GET `/api/Chat/conversation?receiverId={id}` - Lấy cuộc hội thoại
- POST `/api/Chat/send` - Gửi tin nhắn

## Expected Results:
✅ Tin nhắn gửi thành công từ Member
✅ Coach nhận được tin nhắn trong danh sách
✅ Coach phản hồi thành công  
✅ Member nhận được phản hồi
✅ Giao diện responsive và user-friendly
