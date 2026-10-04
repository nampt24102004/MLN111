# Lật hình bí mật – Mini game 1

1. Ảnh đã được đặt tại `images/independence-day.png`; có thể thay bằng ảnh mới cùng tên.
2. Mở `index.html` bằng Chrome hoặc Edge. Không cần npm, server hay mạng.
3. Nhấn F11 để trình chiếu toàn màn hình.

## Cách chơi

Chọn câu bất kỳ → Bắt đầu → chọn A/B/C/D → Kiểm tra đáp án → nếu đúng, bấm Lật mảnh. Mỗi câu tối đa 2 lượt: lượt đầu sai chưa công bố đáp án hoặc giải thích; bấm Đội khác trả lời để chuyển lượt 2 và đưa timer về 15 giây (không tự chạy). Sau hai lượt sai, hiện đáp án và giải thích nhưng giữ mảnh ảnh bị che. Đóng rồi mở câu hỏi không khôi phục lượt. Đã bỏ nút Lật mảnh thủ công; chỉ trả lời đúng mới được lật từng mảnh.

Đoán bức ảnh luôn có sẵn ở màn hình chính. Người chơi trả lời miệng; người điều khiển bấm Chính xác để mở ảnh và công bố sự kiện, hoặc Chưa chính xác để tiếp tục. Lật toàn bộ và Chơi lại đều cần xác nhận.

Space bắt đầu/tạm dừng timer; Enter kiểm tra phương án đã chọn; Esc đóng câu hỏi. Timer không tự chạy, hết giờ không tự chấm đáp án. Đóng câu hỏi sẽ tạm dừng; mở lại giữ nguyên thời gian còn lại, lựa chọn và kết quả. Mảnh đã lật luôn giữ trạng thái đến khi Chơi lại. Tải lại trang bắt đầu một lượt mới.

## Chỉnh sửa

- `questions.js`: đủ 9 câu chính thức, phương án và đáp án đúng.
- `style.css`: màu sắc, cỡ chữ và bố cục.
- `script.js`: thời gian (GAME_SECONDS) và logic.
- `images/independence-day.png`: ảnh bí mật.

Nếu chưa đặt ảnh, game báo rõ ảnh còn thiếu; không tự thay bằng ảnh lịch sử khác.
