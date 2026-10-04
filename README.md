# Mini game thuyết trình

Mở index.html để chọn game. Cả hai game chạy offline bằng Chrome/Edge.

- src/minigame 1/: Lật hình bí mật, ảnh sự kiện 2/9/1945.
- src/minigame 2/: Ô chữ bí mật, game cũ với từ khóa YÊU TỔ QUỐC.

Game 1 giữ nguyên ảnh và source. Game 2 được khôi phục từ code và các chỉnh sửa trong cuộc trò chuyện, chuyển vào thư mục riêng.

Sửa nội dung từng game trong questions.js tương ứng. Game 1 chạy trực tiếp từ HTML/CSS/JS. Game 2 có source React và bản app.js/app.css đóng gói để mở offline. Sau khi sửa source game 2, chạy npm.cmd run build để cập nhật bản đóng gói.

npm.cmd run dev mở trang chọn game. npm.cmd run build tạo dist/ với cả hai game đầy đủ.
