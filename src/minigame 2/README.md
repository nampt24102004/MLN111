# Mini game 2 – Ô chữ bí mật

Game ô chữ cũ được khôi phục từ nội dung và các chỉnh sửa trong cuộc trò chuyện.

Mở `index.html` trực tiếp trong Chrome/Edge. Bản đóng gói `app.js` và `app.css` đã kèm React, chạy offline.

- `questions.js`: 9 câu hỏi; câu 9 có đáp án CỘNG ĐỒNG.
- `main.jsx`: câu hỏi, timer 15 giây, gợi ý, hiện đáp án và chơi lại.
- `Crossword.jsx`: bảng 9 hàng với cột xanh ghép thành YEU TO QUOC.
- `answerHints.js`: gợi ý ngẫu nhiên không dấu, không lặp ô. Hiện toàn bộ đáp án có dấu trong hộp câu hỏi.
- `styles.css`: giao diện, chữ đen và khung câu hỏi lớn để trình chiếu.

Sau khi sửa source, chạy `npm.cmd run build` từ thư mục dự án để cập nhật app.js/app.css. Không sửa trực tiếp hai file đóng gói.

Hiện đáp án một câu sẽ điền cả hàng và mở chữ từ khóa tương ứng. Phần Mảnh ghép cuối cùng nằm chung khung với bảng, chỉ có nút Hiện đáp án. Chơi lại cần xác nhận.

Trạng thái được giữ khi đóng câu hỏi; mỗi lần mở lại, timer bắt đầu ở 15 giây và không tự chạy. Tải lại trang đặt lại trò chơi.
