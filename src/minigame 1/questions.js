// Thay nội dung tại đây. Giữ 9 câu với id từ 1 đến 9; correct là A/B/C/D.
const questions = [
  { id: 1, question: 'Theo Triết học Mác–Lênin, toàn bộ sinh hoạt vật chất và những điều kiện sinh hoạt vật chất của xã hội được gọi là gì?', options: { A: 'Ý thức xã hội', B: 'Tồn tại xã hội', C: 'Tâm lý xã hội', D: 'Hệ tư tưởng' }, correct: 'B' },
  { id: 2, question: 'Trong mối quan hệ giữa tồn tại xã hội và ý thức xã hội, yếu tố nào giữ vai trò quyết định?', options: { A: 'Ý thức xã hội', B: 'Tâm lý xã hội', C: 'Tồn tại xã hội', D: 'Ý thức cá nhân' }, correct: 'C' },
  { id: 3, question: 'Những tình cảm, tâm trạng, thói quen... hình thành trực tiếp từ đời sống hằng ngày thuộc trình độ nào của ý thức xã hội?', options: { A: 'Hệ tư tưởng xã hội', B: 'Tâm lý xã hội', C: 'Ý thức khoa học', D: 'Ý thức pháp quyền' }, correct: 'B' },
  { id: 4, question: 'Trong lịch sử Việt Nam, quá trình dựng nước và giữ nước đã góp phần hình thành nổi bật tinh thần nào?', options: { A: 'Tinh thần cá nhân', B: 'Tinh thần hưởng thụ', C: 'Tinh thần yêu nước', D: 'Tư tưởng bảo thủ' }, correct: 'C' },
  { id: 5, question: 'Khi độc lập và sự tồn tại của cộng đồng dân tộc bị đe dọa, nhu cầu nào trở nên đặc biệt quan trọng?', options: { A: 'Mở rộng lãnh thổ', B: 'Phát triển nghệ thuật', C: 'Bảo vệ đất nước và độc lập dân tộc', D: 'Thay đổi phong tục' }, correct: 'C' },
  { id: 6, question: 'Tinh thần yêu nước thúc đẩy con người đoàn kết và tham gia đấu tranh giành độc lập thể hiện đặc điểm nào?', options: { A: 'Ý thức xã hội không phụ thuộc thực tiễn', B: 'Ý thức xã hội tác động trở lại tồn tại xã hội', C: 'Ý thức xã hội luôn lạc hậu', D: 'Tồn tại xã hội do ý thức quyết định' }, correct: 'B' },
  { id: 7, question: 'Việc khẳng định độc lập dân tộc và chủ quyền quốc gia thể hiện trực tiếp nhất hình thái ý thức xã hội nào?', options: { A: 'Ý thức thẩm mỹ', B: 'Ý thức tôn giáo', C: 'Ý thức chính trị', D: 'Ý thức nghệ thuật' }, correct: 'C' },
  { id: 8, question: 'Sự kiện lịch sử nào đánh dấu thắng lợi của Cách mạng Tháng Tám và dẫn tới việc thành lập một nhà nước mới ở Việt Nam năm 1945?', options: { A: 'Chiến thắng Bạch Đằng', B: 'Chiến thắng Điện Biên Phủ', C: 'Tuyên bố độc lập ngày 2/9/1945', D: 'Toàn quốc kháng chiến' }, correct: 'C' },
  { id: 9, question: 'Trong ngày 2/9/1945 tại Quảng trường Ba Đình, văn kiện nào được Chủ tịch Hồ Chí Minh đọc trước quốc dân?', options: { A: 'Hiến pháp', B: 'Lời kêu gọi Toàn quốc kháng chiến', C: 'Tuyên ngôn Độc lập', D: 'Chiếu Cần Vương' }, correct: 'C' },
];

// Giải thích hiển thị sau khi kiểm tra đáp án; chỉnh theo số câu tương ứng.
const explanations = {
  1: 'Tồn tại xã hội là toàn bộ sinh hoạt vật chất và những điều kiện sinh hoạt vật chất của xã hội. Nó bao gồm hoạt động sản xuất vật chất, điều kiện tự nhiên và các quan hệ vật chất trong đời sống xã hội.',
  2: 'Tồn tại xã hội giữ vai trò quyết định đối với ý thức xã hội. Khi tồn tại xã hội biến đổi thì sớm hay muộn ý thức xã hội cũng biến đổi theo.',
  3: 'Tâm lý xã hội bao gồm tình cảm, tâm trạng, thói quen, nếp sống, phong tục, tập quán… được hình thành dưới tác động trực tiếp của cuộc sống hằng ngày. Vì vậy, những yếu tố trong câu hỏi thuộc tâm lý xã hội.',
  4: 'Quá trình sinh tồn, lao động, dựng nước và giữ nước đòi hỏi người Việt phải hợp tác, đoàn kết và bảo vệ cộng đồng. Những điều kiện tồn tại xã hội đó tạo cơ sở khách quan cho sự hình thành và phát triển của tinh thần yêu nước Việt Nam.',
  5: 'Khi cộng đồng và nền độc lập bị đe dọa, nhu cầu đoàn kết để bảo vệ sự tồn tại của cộng đồng, đất nước và độc lập dân tộc trở nên đặc biệt quan trọng. Hoàn cảnh thường xuyên phải đối mặt với các thế lực bên ngoài góp phần hình thành ý chí độc lập và tinh thần đoàn kết.',
  6: 'Tinh thần yêu nước thuộc đời sống tinh thần, nhưng có thể thúc đẩy con người đoàn kết và hành động trong thực tiễn. Qua hoạt động của con người, ý thức xã hội tác động trở lại và làm thay đổi đời sống xã hội: ý thức xã hội → thực tiễn → tồn tại xã hội.',
  7: 'Ý thức chính trị phản ánh các quan hệ kinh tế, giai cấp và quốc gia. Tư tưởng độc lập dân tộc và chủ quyền quốc gia là biểu hiện trực tiếp của ý thức chính trị, gắn với tinh thần yêu nước.',
  8: 'Ngày 2/9/1945 là mốc tuyên bố nền độc lập và sự ra đời của Nhà nước Việt Nam Dân chủ Cộng hòa.',
  9: 'Ngày 2/9/1945 tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập trước quốc dân.',
};
questions.forEach(question => {
  question.explanation = explanations[question.id];
  question.explanationNote = question.id >= 8 ? 'Kiến thức lịch sử bổ trợ, liên hệ bức ảnh bí mật.' : '';
});
