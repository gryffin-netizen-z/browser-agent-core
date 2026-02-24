# Browser Agent Core — One-pager

**Browser Agent Core** — API + browser agent điều khiển bằng AI: so sánh giá đa sàn, đặt hàng tạp hóa end-to-end, fill form + upload file.

**Vấn đề:** Người dùng phải tự mở từng sàn (eBay, Amazon, Swappa…), gõ lại từ khóa, copy giá thủ công; đặt hàng tạp hóa lặp đi lặp lại mỗi tuần; điền hàng chục form giống nhau hoặc upload từng file — tốn thời gian, dễ sót, dễ nhầm. Công cụ so sánh giá ít sàn và ít cho data chuẩn; RPA truyền thống đắt, script dễ gãy khi UI thay đổi → con người và manual work thành bottleneck.

**Giải pháp:** Một hệ thống nhận mục tiêu bằng ngôn ngữ tự nhiên (hoặc danh sách cần làm), AI điều khiển browser: crawl nhiều site → trích xuất/so sánh giá (structured output); thực hiện flow đặt hàng tạp hóa từ cart đến xác nhận đơn; fill form + upload file theo dữ liệu cho trước. Zero (hoặc tối thiểu) thao tác tay — API trả JSON để tích hợp app, chatbot, workflow.

**Key difference:** Không chỉ “scraper” hay “RPA cố định” — cùng một agent, mô tả goal khác là làm việc khác (so sánh / đặt hàng / điền form), dễ thêm sàn mới qua config và prompt thay vì viết lại script. Developer và doanh nghiệp có thể gọi API, nhúng vào product (so sánh giá, đặt hộ, automation form) — tool chuyển từ cost center (tự build + maintain) thành service có sẵn, trả tiền theo usage.

**Kiếm tiền:** (1) SaaS/API trả phí theo request/token — gói free / Pro / Enterprise; (2) Affiliate & commission khi user mua qua kết quả so sánh hoặc đơn tạp hóa; (3) Subscription theo cá nhân/team/agency (white-label); (4) B2B license, custom integration, revenue share; (5) Data/report aggregate (nếu tuân ToS); (6) White-label cho super app, banking. Có thể kết hợp nhiều kênh; ưu tiên product-led (dùng thử miễn phí) rồi upsell.
