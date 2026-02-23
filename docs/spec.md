# Project Overview – AI-Powered Browser Agent

---

## English

### What the project does

The project is **an API backend** that accepts a **page URL** and a **natural-language goal**. The system will:

1. Open that page in a headless browser (Chromium via Playwright).
2. Collect interactive elements (buttons, links, inputs, dropdowns).
3. Send the goal and element list to **Google Gemini**.
4. Gemini decides the **next action** (click, type, scroll, or "done").
5. The system **executes** that action on the page.
6. Repeat steps 2–5 until: Gemini returns "done", **max 10 steps** are reached, or an error stops the run.
7. Return the result: success/failure, step count, and action log.

**Example:**  
- **Input:** `url: "https://example.com"`, `goal: "Buy the cheapest product on this page"`  
- **Output:** JSON describing which steps were run (e.g. click product, fill form) and the final outcome.

### Applications

The system can be used whenever you need **automated web actions driven by a natural-language goal**:

- **E-commerce & shopping:** Find/select the cheapest or best-fit product, add to cart, fill checkout forms.
- **Data & research:** Navigate pages (tabs, filters, cookie consent) to prepare for scraping or export.
- **Form & process automation:** Fill registration/contact/feedback forms, run multi-step flows on internal portals, smoke-test flows.
- **QA & testing:** Run tests described in natural language, reproduce bugs from step descriptions, verify UI after deploy.
- **Customer support & chatbots:** Fulfill requests like "Buy product A on page B" via API; remote guidance (with authorization); product demos.
- **Light RPA:** Repeat actions across similar pages; integrate with workflows (orchestrator calls `POST /agent/run`, then uses the result).

**Limitations:** Max 10 steps per run (split complex goals into multiple calls); SPA/captcha/2FA may require extensions; use must comply with site terms and law.

### Practical use cases

Real-world situations where teams can deploy the system:

- **Retail & e-commerce:** Smoke-test "browse → add to cart → checkout" on staging; brand/agency fills signup forms on promo pages; internal price-comparison tools.
- **Government & public services:** Support staff trigger agent to complete online registration (with proper authorization); recurring report forms submitted via scheduled agent runs.
- **Research & data:** Accept cookies, set date filters, click "Download" so a separate scraper can extract data; market research pipelines standardize page state before extraction.
- **Software development & QA:** Regression tests written as natural-language scenarios; live demos for clients/PMs; support reproduces bugs by turning user descriptions into goals.
- **Customer support & virtual assistants:** Chatbot "buy for me" flows (parse intent → call agent → respond with cart link); remote assistance for less tech-savvy users (with consent).
- **Internal automation (light RPA):** Daily "open orders page → open first pending → Approve"; batch data entry from CSV/Excel into web forms.

**In short:** Practical use is **humans (or systems) describing "what to do on which page" in natural language**; the agent performs it and reports the result.

### Technical details (summary)

- **API:** `POST /agent/run` with body `{ "url": "...", "goal": "..." }`. Response: `success`, `message`, `steps_executed`, `previous_actions`, optional `final_dom_snapshot`.
- **Flow:** Launch browser → open URL → loop (extract DOM → call Gemini → parse JSON → execute click/type/scroll or done) up to 10 steps → close browser → return result.
- **Components:** AgentController, AgentService, BrowserService, AIService; types in `interfaces.ts`, DTO in `dto/run-agent.dto.ts`.
- **DOM:** Only interactive elements (button, a, input, select) with stable selectors (id → data-testid → input[name] → data-agent-id).
- **Gemini:** Model `gemini-1.5-pro-latest`, strict JSON response `{ action, target_id, value }`; invalid JSON retried once.
- **Errors:** URL/DOM errors return failure and close browser; execution errors are fed back to Gemini for the next step.
- **Stack:** NestJS, Playwright, @google/generative-ai, TypeScript, dotenv. Required env: `GEMINI_API_KEY`. Run: `npm install` → `npx playwright install chromium` → set `.env` → `npm run start`.

### One-sentence summary

**The project is an API service (NestJS) that uses Playwright to drive a browser and Gemini to decide the next step, automating a single goal on a given page (open → extract DOM → ask Gemini → execute click/type/scroll → repeat up to 10 steps → return result).**

---

## Tiếng Việt

### Dự án làm gì (What the project does)

Dự án là **một API backend** cho phép bạn gửi một **địa chỉ trang web (URL)** và một **mục tiêu bằng ngôn ngữ tự nhiên (goal)**. Hệ thống sẽ:

1. Mở trang web đó bằng trình duyệt ảo (Chromium qua Playwright).
2. Thu thập danh sách các phần tử tương tác được trên trang (nút bấm, link, ô nhập, dropdown).
3. Gửi mục tiêu và danh sách phần tử đó cho **Google Gemini**.
4. Gemini quyết định **hành động tiếp theo** (click, gõ chữ, cuộn trang, hoặc "xong").
5. Hệ thống **thực thi** hành động đó trên trang (click nút, gõ vào ô, cuộn).
6. Lặp lại bước 2 → 5 cho đến khi:  
   - Gemini trả lời "done" (hoàn thành mục tiêu), hoặc  
   - Đã chạy đủ **tối đa 10 bước**, hoặc  
   - Có lỗi không thể tiếp tục.
7. Trả về kết quả: thành công/thất bại, số bước đã chạy, nhật ký từng hành động.

**Ví dụ:**  
- **Input:** `url: "https://example.com"`, `goal: "Buy the cheapest product on this page"`  
- **Output:** JSON cho biết đã thực hiện những bước nào (click vào sản phẩm, điền form, v.v.) và kết quả cuối cùng.

---

## Ứng dụng của hệ thống (Applications)

Hệ thống có thể dùng trong nhiều tình huống thực tế khi cần **tự động thao tác trên web theo mục tiêu bằng ngôn ngữ tự nhiên**:

### Thương mại điện tử & mua sắm

- **Tìm và chọn sản phẩm rẻ nhất / phù hợp nhất** trên một trang danh sách.
- **Thêm vào giỏ, điền form checkout** (địa chỉ, số điện thoại) theo dữ liệu có sẵn.
- **So sánh giá hoặc thông tin** giữa nhiều sản phẩm trên cùng trang.

### Thu thập dữ liệu & nghiên cứu

- **Điều hướng trang** (click tab, mở menu, cuộn) để đến đúng khu vực cần scrape.
- **Chuẩn bị trạng thái trang** trước khi bước scrape khác trích xuất dữ liệu (vd: chọn bộ lọc, mở modal).
- **Đăng nhập / chấp nhận cookie** theo mục tiêu mô tả bằng text.

### Tự động hoá form & quy trình nội bộ

- **Điền form đăng ký, liên hệ, feedback** theo nội dung cho trước.
- **Thực hiện quy trình nhiều bước** trên portal nội bộ (vd: "Mở trang X, chọn option Y, nhấn Submit").
- **Kiểm tra luồng** (flow) đơn giản trên web app (smoke test theo mô tả).

### Kiểm thử & QA

- **Test theo kịch bản mô tả bằng ngôn ngữ tự nhiên** (vd: "Đăng nhập rồi tạo đơn hàng mới").
- **Tái tạo lỗi** bằng cách mô tả các bước người dùng thực hiện.
- **Kiểm tra giao diện** sau deploy: gửi goal đơn giản để xác nhận trang load và nút/link cơ bản hoạt động.

### Hỗ trợ người dùng & chatbot

- **Chatbot/assistant** nhận yêu cầu kiểu "Mua giúp tôi sản phẩm A trên trang B" → gọi API với `url` + `goal` tương ứng.
- **Hướng dẫn từ xa:** Mô tả mục tiêu, hệ thống thực hiện giúp (trong môi trường được phép).
- **Demo sản phẩm:** Tự động thao tác trên trang để trình chiếu luồng sử dụng.

### RPA nhẹ (Robotic Process Automation)

- **Lặp lại thao tác** trên các trang có cấu trúc tương tự (vd: duyệt danh sách, click từng mục, điền thông tin).
- **Kết nối với hệ thống khác:** Backend nhận request từ workflow/orchestrator, gọi `POST /agent/run` với URL và goal, sau đó xử lý kết quả (success, previous_actions) để quyết định bước tiếp theo.

### Giới hạn cần lưu ý

- **Max 10 bước** mỗi lần chạy → goal phức tạp có thể cần chia nhỏ hoặc gọi nhiều lần.
- **Trang động (SPA), captcha, đăng nhập 2 bước** có thể cần mở rộng (screenshot, thêm action, tích hợp service khác).
- **Mục đích sử dụng** cần tuân thủ điều khoản của website và quy định pháp luật (không spam, không bypass bảo mật trái phép).

---

## Ứng dụng thực tiễn (Practical use cases)

Phần này mô tả **các tình huống thực tế** mà doanh nghiệp hoặc đội phát triển có thể triển khai hệ thống, với vai trò người dùng và lợi ích cụ thể.

### Bán lẻ & E-commerce

- **Sàn thương mại điện tử:** Đội vận hành cần kiểm tra nhanh luồng "tìm sản phẩm → thêm giỏ → checkout" trên môi trường staging. Thay vì test tay từng bước, gọi API với URL trang danh sách + goal "Click sản phẩm đầu tiên, thêm vào giỏ, vào giỏ hàng" để smoke test sau mỗi đợt deploy.
- **Brand/agency:** Khách hàng gửi link trang khuyến mãi, yêu cầu "Điền form đăng ký nhận tin với email X". Backend tích hợp agent: nhận webhook hoặc request từ form nội bộ → gọi `POST /agent/run` với URL + goal tương ứng → báo kết quả (thành công / thất bại) cho người dùng.
- **So sánh giá nội bộ:** Công cụ nội bộ mở trang đối thủ, goal "Tìm và click vào sản phẩm có tên Y, ghi nhận giá hiển thị". Kết quả (kèm snapshot DOM hoặc bước tiếp theo) dùng cho báo cáo giá.

### Hành chính & Dịch vụ công

- **Đăng ký dịch vụ công trực tuyến:** Nhân viên hỗ trợ nhận yêu cầu "Đăng ký giúp tôi giấy phép X trên trang Y". Thay vì hướng dẫn từng bước qua điện thoại, hệ thống gọi agent với URL trang đăng ký + goal mô tả (điền form, chọn loại giấy phép, gửi). Cần tuân thủ quy định bảo mật và ủy quyền.
- **Nộp form báo cáo định kỳ:** Các form báo cáo lặp lại (tháng/quý) trên portal: orchestrator lên lịch, mỗi kỳ gọi agent với URL form + goal "Điền các trường theo dữ liệu đính kèm và Submit". Giảm thao tác tay cho nhân viên.

### Nghiên cứu & Dữ liệu

- **Trường/viện nghiên cứu:** Trang dữ liệu công bố yêu cầu chấp nhận cookie, chọn năm/khoảng thời gian, bấm "Tải xuống" hoặc "Xem bảng". Agent thực hiện bước chuẩn bị (accept, chọn filter); bước sau dùng crawler/scraper riêng để lấy file hoặc HTML.
- **Market research:** Cần thu thập thông tin sản phẩm từ nhiều trang cùng cấu trúc. Mỗi URL gọi một lần agent với goal "Click vào tab Thông số kỹ thuật (hoặc sản phẩm đầu tiên)" để đưa trang về trạng thái chuẩn, sau đó pipeline trích xuất dữ liệu bằng selector cố định.

### Phát triển phần mềm & QA

- **Regression test theo mô tả:** QA viết test case dạng "Vào trang login, điền user/pass, vào Dashboard, click nút Tạo đơn". Mỗi case = một (hoặc vài) request agent. Khi giao diện đổi (selector, copy), chỉ cần chỉnh goal hoặc chia lại URL/step, không bắt buộc sửa code test cứng.
- **Demo cho khách hàng/PM:** Trong cuộc họp, thay vì click tay từng bước, dev gửi request với goal "Đăng nhập rồi mở màn hình Báo cáo doanh thu". Hệ thống tự thao tác trên trình duyệt, tiết kiệm thời gian và tránh sai sót khi demo.
- **Tái tạo bug:** User báo lỗi kèm link + mô tả ("Tôi vào trang X, bấm Y thì bị lỗi"). Support tạo goal tương ứng, chạy agent trên môi trường tương tự để ghi lại các bước và kết quả (success/error), đính kèm vào ticket cho dev.

### Hỗ trợ khách hàng & Trợ lý ảo

- **Chatbot hỗ trợ mua hàng:** User nhắn "Mua giúp tôi sản phẩm [tên] trên link [url]". Bot parse intent → gọi agent với goal "Tìm sản phẩm [tên] (hoặc rẻ nhất) và thêm vào giỏ" → trả lời "Đã thêm vào giỏ, bạn vào link giỏ hàng để thanh toán" (kèm URL nếu có).
- **Hướng dẫn từ xa (có ủy quyền):** Khách hàng cao tuổi hoặc không rành công nghệ; nhân viên từ xa mô tả mục tiêu ("Đăng ký tài khoản giúp tôi trên trang Z"). Hệ thống chạy agent trong session được ủy quyền, hoàn tất giúp thao tác thay vì gọi điện hướng dẫn từng bước.

### Tự động hóa nội bộ (RPA nhẹ)

- **Duyệt đơn / phê duyệt:** Workflow nội bộ: "Mỗi ngày mở trang quản lý đơn, click vào đơn chờ duyệt đầu tiên, bấm Duyệt." Mỗi bước (hoặc mỗi trang) gọi một lần agent; kết quả dùng để cập nhật trạng thái trong DB hoặc gửi thông báo.
- **Nhập liệu từ file lên web:** Có file Excel/CSV danh sách khách hàng hoặc sản phẩm. Job định kỳ: với từng dòng, mở URL form nhập liệu + goal "Điền các trường theo dữ liệu dòng N và Submit". Agent thay thế phần thao tác tay lặp đi lặp lại.

---

**Tóm lại:** Ứng dụng thực tiễn đều quy về việc **con người (hoặc hệ thống) mô tả "làm gì trên trang nào" bằng ngôn ngữ tự nhiên**, agent thực thi thay và báo lại kết quả — từ smoke test, hỗ trợ khách hàng, thu thập dữ liệu đến RPA nhẹ trong nội bộ.

---

## Chi tiết kỹ thuật (Technical details)

### 1. API duy nhất: `POST /agent/run`

**Request body:**

```json
{
  "url": "https://example.com",
  "goal": "Buy the cheapest product on this page"
}
```

**Response (thành công hoặc dừng sớm):**

```json
{
  "success": true,
  "message": "Goal completed.",
  "steps_executed": 3,
  "previous_actions": [
    { "step": 1, "action": "click el_2", "result": "success" },
    { "step": 2, "action": "type in el_5: \"...\"", "result": "success" },
    { "step": 3, "action": "click el_8", "result": "success" }
  ],
  "final_dom_snapshot": [ ... ]
}
```

- **success:** `true` nếu mục tiêu được coi là hoàn thành, `false` nếu hết bước hoặc lỗi.
- **message:** Mô tả ngắn (ví dụ "Goal completed." hoặc thông báo lỗi).
- **steps_executed:** Số hành động đã thực thi.
- **previous_actions:** Từng bước: số thứ tự, mô tả hành động, kết quả (success / error: ...).
- **final_dom_snapshot:** (tuỳ chọn) Snapshot DOM tương tác ở bước cuối.

---

### 2. Luồng xử lý từng bước (Step-by-step flow)

1. **Nhận request**  
   Controller nhận `POST /agent/run` với `url` và `goal`.

2. **Khởi tạo browser**  
   BrowserService launch Chromium (Playwright), mở tab mới, điều hướng tới `url`.

3. **Vòng lặp (tối đa 10 bước):**
   - **Lấy DOM tương tác:** Chỉ lấy button, link, input, select; mỗi phần tử có `id` (el_1, el_2, ...), `tag`, `text`, `selector` ổn định.
   - **Gọi Gemini:** Gửi goal, danh sách phần tử, lịch sử hành động (và lỗi gần nhất nếu có). Yêu cầu Gemini **chỉ trả về JSON** dạng:
     ```json
     { "action": "click" | "type" | "scroll" | "done", "target_id": "el_1", "value": "..." }
     ```
   - **Phân tích phản hồi:** Parse JSON; nếu không hợp lệ thì retry 1 lần, sau đó nếu vẫn lỗi thì trả lỗi và kết thúc run.
   - **Nếu action = "done":** Coi là hoàn thành, thoát vòng lặp, trả về kết quả thành công.
   - **Thực thi hành động:**
     - **click:** Tìm phần tử theo `target_id` trong snapshot → dùng `selector` tương ứng để click.
     - **type:** Tìm phần tử theo `target_id` → gõ nội dung `value` vào.
     - **scroll:** Cuộn trang lên/ xuống theo `value` (up/down).
   - **Ghi nhận kết quả:** Thêm bước vào `previous_actions` (success hoặc error). Nếu lỗi, lưu nội dung lỗi và gửi lại cho Gemini ở bước tiếp theo để nó có thể chọn hành động khác.

4. **Kết thúc**  
   Đóng browser (luôn, kể cả khi lỗi). Trả về `AgentRunResult` (success, message, steps_executed, previous_actions, có thể kèm final_dom_snapshot).

---

### 3. Các thành phần chính (Components)

| Thành phần | File | Nhiệm vụ |
|------------|------|----------|
| **AgentController** | `src/agent/agent.controller.ts` | Nhận `POST /agent/run`, gọi AgentService, trả JSON. |
| **AgentService** | `src/agent/agent.service.ts` | Điều phối: mở URL, vòng lặp (DOM → Gemini → thực thi), ghi log, đóng browser, trả kết quả. |
| **BrowserService** | `src/browser/browser.service.ts` | Launch/đóng Chromium, mở URL, trích xuất DOM tương tác, thực hiện click/type/scroll. |
| **AIService** | `src/ai/ai.service.ts` | Kết nối Gemini, build prompt, gửi request, parse và validate JSON phản hồi. |
| **Interfaces / DTO** | `src/agent/interfaces.ts`, `dto/run-agent.dto.ts` | Định nghĩa kiểu: DomElement, GeminiActionResponse, AgentRunResult, RunAgentDto. |

---

### 4. DOM tương tác (Interactive DOM)

Chỉ lấy các phần tử có thể tương tác:

- **button**, **a[href]**, **input** (trừ hidden), **select**
- Có thể mở rộng: `[role="button"]`, `[role="link"]`, `[onclick]`

Mỗi phần tử trả về có dạng:

```json
{
  "id": "el_1",
  "tag": "button",
  "text": "Buy Now",
  "selector": "#buy-btn"
}
```

**Selector ổn định (ưu tiên):**  
`id` → `data-testid` → `input[name="..."]` → nếu không có thì gán `data-agent-id` tạm trên phần tử và dùng `[data-agent-id="..."]`.

---

### 5. Gemini – yêu cầu format

- **Model:** `gemini-1.5-pro-latest`.
- **System instruction:** Bắt buộc chỉ trả về **một JSON hợp lệ**, không markdown, không giải thích thêm.
- **Prompt:** Goal + danh sách phần tử (id, tag, text, selector) + lịch sử hành động + (nếu có) lỗi lần trước.
- **Format trả về:**  
  `{ "action": "click" | "type" | "scroll" | "done", "target_id": "el_X" | "", "value": "..." (khi cần) }`

---

### 6. Xử lý lỗi (Error handling)

- **Mở URL / extract DOM lỗi:** Trả về `success: false`, message mô tả lỗi, đóng browser.
- **Gemini trả JSON không hợp lệ:** Retry 1 lần; vẫn lỗi thì trả về lỗi và kết thúc run.
- **Thực thi hành động lỗi (vd: element không tìm thấy):** Ghi vào `previous_actions` với result là error, gửi nội dung lỗi vào prompt bước sau để Gemini đổi hành động; không thoát vòng lặp ngay (trừ khi vượt max steps).

---

### 7. Công nghệ và môi trường

- **NestJS** – framework API, dependency injection.
- **Playwright** – điều khiển Chromium headless.
- **@google/generative-ai** – gọi Gemini.
- **TypeScript** – type-safe, async/await.
- **dotenv** – đọc `GEMINI_API_KEY` từ file `.env`.

Biến môi trường cần có: **GEMINI_API_KEY**.  
Chạy: `npm install` → `npx playwright install chromium` → cấu hình `.env` → `npm run start`.

---

## Tóm tắt một câu

**Dự án là một dịch vụ API (NestJS) dùng Playwright để điều khiển trình duyệt và Gemini để "suy nghĩ" bước tiếp theo, nhằm thực hiện tự động một mục tiêu trên một trang web (mở trang → trích DOM tương tác → hỏi Gemini → thực thi click/type/scroll → lặp tối đa 10 bước → trả kết quả).**
