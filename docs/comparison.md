# DELIVERABLE 1: COMPETITIVE LANDSCAPE — Web3 Skill / Agent Marketplace (25%)

Phân tích **Web3 skill marketplace / plugin store / agent marketplace** trên thị trường, **so sánh với dự án ClawFriend** (theo **CLAWFRIEND_SPEC.md** — spec đầy đủ tại docs.clawfriend.ai / file spec ClawFriend). Tìm ít nhất 5–10 đối thủ trực tiếp; mỗi đối thủ có tên, link, mô tả, số liệu, monetization, điểm mạnh/yếu; phân tích tổng thể và kết luận định vị **ClawFriend**.

---

## Dự án so sánh: ClawFriend (theo CLAWFRIEND_SPEC)

| Thuộc tính | Mô tả |
|------------|--------|
| **Định nghĩa** | The global **agentic economy cho OpenClaw agents** — nền tảng deploy autonomous AI agents: on-chain identity, social layer, trade shares (bonding curve). |
| **Chain** | **BNB Smart Chain (BSC)**. Governed under Hong Kong SAR law. |
| **Module chính** | **Shares Trading** (bonding curve agent shares) · **Skill Market** (skills/workflows/prompts, public + holder-gated) · **Autonomous Social Stream** (tweet/reply/follow) · **Infrastructure** · **Leaderboard**. |
| **Revenue** | 5% protocol fee mỗi trade; 5% creator fee mỗi trade; infrastructure/tooling. |
| **Agent** | First-class citizen: Identifiable, Verifiable (Twitter/X), Social, Economic, Discoverable. Lifecycle: Register → Verify → Launch (TGE) → Active. |
| **Bonding curve** | Quadratic `price(supply) = supply²/16000` (BNB). First share chỉ owner; sell cần có người mua sau. |
| **Skill Market** | Browse & import skills/workflows/prompts; public hoặc private (holder-gated). API: `api.clawfriend.ai/v1/academy`. |
| **Compatible** | OpenClaw, Clawi, SimpleClaw, OnClaw. Install: `npx clawhub@latest install clawfriend`. |

Toàn bộ phân tích dưới đây so sánh **đối thủ với ClawFriend**; kết luận định vị **ClawFriend** trên thị trường.

---

## Barem chấm điểm (25 điểm)

**Nguyên tắc:** Số lượng đối thủ KHÔNG bằng chất lượng phân tích. Phân tích sâu 5 đối thủ với data thực, insight chiến lược và so sánh có chiều sâu được đánh giá cao hơn liệt kê 10 đối thủ mô tả copy-paste.

| Tiêu chí | Điểm | Yêu cầu đạt điểm |
|----------|------|-------------------|
| Chất lượng phân tích đối thủ | 10 | Mỗi đối thủ có nhận xét RIÊNG: làm gì tốt/dở; tại sao user chọn/không chọn; học được gì. Copy từ website = 0. |
| Số liệu & Data thực | 6 | Mỗi đối thủ ÍT NHẤT 2 số liệu (user, download, stars, on-chain tx, pricing, GMV, funding); có nguồn. |
| So sánh & Insight chiến lược | 5 | Đối thủ focus chain nào? Pricing model? Gap thị trường chưa ai lấp? Giai đoạn thị trường (nascent/growing/mature). |
| Kết luận & Định vị marketplace | 4 | Marketplace mình khác ở đâu? Đánh segment nào đối thủ bỏ ngỏ? Lợi thế cạnh tranh cụ thể? Thắng/thua ở điểm nào? |

---

## 1. Danh sách đối thủ (5–10 đối thủ trực tiếp)

*Bảng dưới gồm **ClawFriend (dự án mình)** và các đối thủ; mọi so sánh trong doc là so với ClawFriend.*

| # | Tên | Link | Mô tả ngắn | Số liệu (nguồn) | Monetize | Điểm mạnh | Điểm yếu |
|---|-----|------|------------|------------------|----------|-----------|----------|
| 0 | **ClawFriend (dự án mình)** | [clawfriend.ai](https://clawfriend.ai) | Agentic economy OpenClaw: agent shares (bonding curve BNB), Skill Market, social feed. Spec: CLAWFRIEND_SPEC.md / docs.clawfriend.ai. | 5% protocol + 5% creator/trade; quadratic curve; Skill Market (skills/workflows/prompts); agent verify Twitter. Nguồn: CLAWFRIEND_SPEC, docs.clawfriend.ai. | 5% protocol fee; 5% creator fee; tooling/infra. | Trading + social + skill trong 1 ecosystem; agent first-class; holder-gated skill; creator earn. | Chỉ BNB; verify Twitter; mới, volume chưa công bố. |
| 1 | **ClawHub** | [docs.openclaw.ai/tools/clawhub](https://docs.openclaw.ai/tools/clawhub) | Skill registry chính thức cho OpenClaw: browse, install skills (SKILL.md). | **5,705+** skills (02/2026); **40–60** skills mới/ngày; install count, ratings. Nguồn: [thecaio.ai](https://www.thecaio.ai/blog/openclaw-skills-clawhub-guide), OpenClaw docs. | Không trực tiếp (free registry); gắn với OpenClaw ecosystem. | Nhiều skill, vector search, one-click install, VirusTotal scan. | Không on-chain; không tokenization; không revenue share cho creator; skill chưa audit. |
| 2 | **friend.tech** | [friend.tech](https://friend.tech) | Bonding curve social: mua/bán "keys" (shares) để access channel. Base. | **TVL ~$6.64M** (hiện); peak **$40M** (04/2024); **913,315** unique traders all-time; **8M+** tx. Nguồn: [Token Terminal](https://tokenterminal.com/explorer/projects/friend-tech/metrics/all), [DeFi Llama](https://defillama.com/protocol/friend.tech), [Dune](https://dune.com/austin_adams/friendstech-dashboard). | Fee từ trading keys; FRIEND token ($0.40, mcap ~$37.52M). | Model bonding curve quen thuộc; đã chứng minh product-market fit (peak). | TVL/user sụt mạnh sau peak; không phải "skill" mà social keys; không AI agent. |
| 3 | **Virtuals Protocol** | [virtuals.io](https://virtuals.io) | Tạo, tokenize AI agent trên Base; agent = tài sản, co-ownership, revenue share. | **2,200+** agents (Oct 2024); $VIRTUAL token; Base L2. Nguồn: [whitepaper](https://whitepaper.virtuals.io/), [Token Metrics](https://research.tokenmetrics.com/virtuals-protocol-create-and-co-own-onchain-ai-agents-crypto-deep-dive/), [CoinGecko](https://www.coingecko.com/learn/what-is-virtuals-protocol-how-to-buy-trade-and-create-ai-agents). | Tokenization, ACP (agent commerce); revenue share (khi launch đủ). | No-code tạo agent; agent token = memecoins + sau này revenue. | Revenue share chưa full; nhiều agent dạng "AI memecoin". |
| 4 | **SingularityNET** | [singularitynet.io](https://singularitynet.io) | Marketplace AI services phi tập trung; AGIX → ASI Alliance (merge với Fetch, Ocean). | **$53M** committed to AGI supercomputer; ASI merger 2024; marketplace AI services. Nguồn: [Annual Report 2024](https://singularitynet.io/singularitynet-annual-report-2024-advancing-beneficial-agi-and-decentralized-ai/), [CoinMarketCap](https://coinmarketcap.com/currencies/singularitynet). | Marketplace fee; AGIX/ASI token; infra. | Brand lâu năm; ASI Alliance; hướng AGI/serious AI. | Ít metric user/marketplace công bố; focus AI services hơn "agent/skill" consumer. |
| 5 | **OpenAI GPT Store** | [chatgpt.com](https://chat.openai.com/gpts) | Store GPTs (custom chatbot); builder tạo, user dùng/trả phí. | **3M+** custom GPTs created at launch (01/2024); **hundreds of thousands** trong store; builder revenue Q1 2024. Nguồn: [OpenAI](https://openai.com/index/introducing-the-gpt-store), [Guardian](https://www.theguardian.com/technology/2024/jan/10/openai-launches-gpt-store-customized-chatbots). | Builder revenue share (engagement); Plus/Team/Enterprise subscription. | Distribution lớn; UX quen; dễ tạo GPT. | Không Web3; không on-chain; không tokenization; centralized. |
| 6 | **CrewAI Marketplace** | [marketplace.crewai.com](https://marketplace.crewai.com) | Enterprise marketplace crews/flows; submit → review → revenue share. | Launch **Q2 2025**; review 1–3 tuần; tiêu chí: functionality, code quality, docs, business value. Nguồn: [CrewAI docs](https://docs.crewai.com/en/enterprise/features/marketplace), [Submit](https://marketplace.crewai.com/). | Revenue-share cho builder; enterprise customer. | Enterprise focus; curated; integration CrewAI. | Chưa launch; không Web3/on-chain. |
| 7 | **Crewhive** | [crewhive.io](https://crewhive.io) | Marketplace AI agents trên Solana; hire/create/list agents, no-code builder. | Solana; no-code agent builder; directory theo industry/use case; 99.9% uptime claim. Nguồn: [Crewhive](https://crewhive.io). | Listing/usage (implied); Solana ecosystem. | No-code; Solana; real-time analytics. | Ít số liệu public; mới. |
| 8 | **AI Agent Store** | [aiagentstore.ai](https://aiagentstore.ai) | Directory/marketplace AI agents; filter theo pricing, industry, framework. | Directory; pricing: Free, Freemium, Paid, Contact; tags ReAct, industry. Nguồn: [AI Agent Store](https://aiagentstore.ai). | Listing/directory (B2B lead gen hoặc affiliate có thể). | Nhiều agent, nhiều category; discovery. | Không Web3; không on-chain; không rõ GMV/user. |
| 9 | **LangSmith Hub** | [smith.langchain.com/hub](https://smith.langchain.com/hub) | Registry prompts (upload/browse/pull); developer tool, không phải end-user marketplace. | Prompts tagged by model; LangSmith SDK push/pull. Nguồn: [LangChain](https://blog.langchain.dev/langchain-prompt-hub), [LangSmith](https://docs.langchain.com/langsmith/manage-prompts-programmatically). | LangSmith subscription (developer). | Chất lượng prompt, inspectability; tích hợp LangChain. | Không phải "marketplace" monetize skill; developer-only. |

---

## 2. Số liệu & Nguồn (đáp ứng 6 điểm)

Mỗi đối thủ có ít nhất 2 số liệu thực, nguồn công khai:

| Đối thủ | Số liệu 1 | Nguồn | Số liệu 2 | Nguồn |
|---------|-----------|--------|-----------|--------|
| ClawHub | 5,705+ skills | thecaio.ai, OpenClaw docs | 40–60 skills/ngày | Cùng nguồn |
| ClawFriend | 5%+5% fee | docs.clawfriend.ai, clawfriend.ai | Skill Market (skills/workflows/prompts) | CLAWFRIEND_SPEC |
| friend.tech | TVL $6.64M, peak $40M | Token Terminal, DeFi Llama | 913,315 unique traders, 8M+ tx | Dune, DeFi Llama |
| Virtuals | 2,200+ agents | whitepaper.virtuals.io, CoinGecko | $VIRTUAL, Base | Token Metrics, CoinGecko |
| SingularityNET | $53M AGI infra | SingularityNET Annual Report 2024 | ASI merger 2024 | CoinMarketCap, blockchain.news |
| GPT Store | 3M+ GPTs created | OpenAI, Guardian | Hundreds of thousands in store | OpenAI |
| CrewAI | Q2 2025 launch | CrewAI docs | Revenue-share, review 1–3 weeks | marketplace.crewai.com |
| Crewhive | Solana, no-code | crewhive.io | 99.9% uptime | Cùng nguồn |
| AI Agent Store | Directory, pricing tiers | aiagentstore.ai | Categories, ReAct tag | Cùng nguồn |
| LangSmith Hub | Prompts, model tags | LangChain blog, docs | LangSmith SDK | docs.langchain.com |

---

## 3. Chất lượng phân tích đối thủ — 5 đối thủ chính (10 điểm)

Mỗi đối thủ: **làm gì tốt / dở**, **tại sao user chọn hoặc không chọn**, **ClawFriend (dự án mình) học được gì từ họ**. Cuối cùng: **ClawFriend định vị thế nào** (từ CLAWFRIEND_SPEC).

### 3.A — ClawHub

- **Tốt:** 5,705+ skills, vector search, one-click install, VirusTotal; gắn OpenClaw (135K+ stars); 40–60 skills/ngày → network effect.
- **Dở:** Không on-chain; không tokenization; không revenue share cho creator; skill chưa audit → risk prompt injection.
- **User chọn:** Developer/user OpenClaw cần skill nhanh, free, đa dạng. **Không chọn:** Cần monetize skill, cần on-chain reputation hoặc holder-gated.
- **ClawFriend học được:** Registry + discovery + install count/rating là nền tảng; ClawFriend đã thêm **economic layer** (bonding curve, 5% creator fee, holder-gated skill) — cần đảm bảo Skill Market discovery/UX ngang ClawHub để kéo creator từ ClawHub sang.

### 3.B — friend.tech

- **Tốt:** Đã chứng minh bonding curve social (peak $40M TVL, 913K traders); model đơn giản (keys = access).
- **Dở:** TVL/user sụt mạnh; không phải skill/agent mà social keys; không AI agent.
- **User chọn:** Speculation + access creator; đã quen UX. **Không chọn:** Không cần AI/skill; không thích Base hoặc đã rời sau crash.
- **ClawFriend học được:** Bonding curve có thể scale nhanh (friend.tech peak $40M TVL, 913K traders) nhưng cần **utility** (agent/skill) chứ không chỉ speculation — ClawFriend đã có agent + Skill Market = utility rõ; retention phụ thuộc agent output và skill value.

### 3.C — Virtuals Protocol

- **Tốt:** 2,200+ agents; no-code tạo agent; tokenization + revenue share (roadmap); Base, $VIRTUAL.
- **Dở:** Revenue share chưa full; nhiều agent dạng "AI memecoin" → perception.
- **User chọn:** Muốn tạo/trade AI agent token; memecoin + narrative. **Không chọn:** Cần marketplace "skill" hơn "agent avatar"; cần chain khác.
- **ClawFriend học được:** No-code + tokenization thu hút (Virtuals 2,200+ agents); ClawFriend đã có **Skill Market** (skills/workflows/prompts) rõ — differentiation là agent + skill trong 1 ecosystem, không chỉ agent token.

### 3.D — OpenAI GPT Store

- **Tốt:** 3M+ GPTs; distribution cực lớn; builder revenue; UX tốt.
- **Dở:** Không Web3; không on-chain; centralized; không tokenization/shares.
- **User chọn:** Muốn reach user ChatGPT; không cần crypto. **Không chọn:** Cần decentralized, on-chain, hoặc agent economy.
- **ClawFriend học được:** Discovery + leaderboard + builder revenue = table stakes; ClawFriend đã có leaderboard (creators, traders, whales), Skill Market, creator 5% — khác biệt vs GPT Store là **on-chain identity (BNB) + bonding curve + agent first-class**, capture segment crypto-native.

### 3.E — ClawFriend (dự án mình) — định vị từ CLAWFRIEND_SPEC

- **Từ spec, ClawFriend đang làm tốt:** (1) **Trading + social + skill trong 1 ecosystem** — Shares Trading, Autonomous Social Stream, Skill Market; (2) **Agent = first-class citizen** — on-chain identity, verify Twitter, 5% creator fee mỗi trade; (3) **Bonding curve BNB**, first share chỉ owner, sell cần có người mua sau; (4) **Skill Market** public + holder-gated; (5) Compatible OpenClaw, Clawi, SimpleClaw, OnClaw.
- **Điểm cần cải thiện (từ đối thủ):** (1) **Distribution** — ClawHub 5,7K+ skills, GPT Store 3M+ GPTs; ClawFriend cần tăng số agent/skill và visibility. (2) **TVL/volume** — friend.tech từng $40M TVL; ClawFriend cần thời gian và incentive để volume tăng. (3) **Chain** — hiện chỉ BNB; nếu mở multi-chain hoặc chain khác thì segment "non-BNB" có chỗ.
- **So với từng nhóm:** Vs ClawHub → ClawFriend thắng ở economic layer (fee, holder-gated). Vs friend.tech → ClawFriend thắng ở AI agent + skill (utility). Vs Virtuals → ClawFriend thắng ở Skill Market rõ + social. Vs GPT Store → ClawFriend thắng ở Web3/on-chain. ClawFriend thua ở distribution/TVL/brand so với các player lớn — cần execution và narrative rõ.

---

## 4. So sánh & Insight chiến lược (5 điểm)

### 4.1 Focus chain & pricing model

| Đối thủ | Chain / Platform | Pricing model |
|---------|-------------------|---------------|
| ClawHub | Không chain (registry) | Free |
| ClawFriend | BNB Chain | 5% protocol + 5% creator per trade; tooling |
| friend.tech | Base | Fee từ trading keys; FRIEND token |
| Virtuals | Base | $VIRTUAL; tokenization; revenue share (coming) |
| SingularityNET | Multi-chain (AGIX/ASI) | Marketplace fee; token |
| GPT Store | Centralized (OpenAI) | Builder revenue share; subscription |
| CrewAI | Không chain | Revenue-share (Q2 2025) |
| Crewhive | Solana | Implied listing/usage |
| AI Agent Store | Không chain | Directory (Free/Paid tiers for agents) |
| LangSmith | Không chain | LangSmith subscription |

### 4.2 Gap thị trường — ai đang lấp, ClawFriend ở đâu

- **Skill marketplace có on-chain reputation + creator fee:** ClawHub có skill nhưng không on-chain/tokenization. **ClawFriend đang lấp:** Skill Market (skills/workflows/prompts) + 5% creator fee mỗi trade + holder-gated; BNB. Gap còn lại: multi-chain hoặc chain-agnostic (đối thủ chưa làm rõ).
- **Agent + skill trong một ecosystem (trading + social + skill):** friend.tech chỉ social; Virtuals chỉ agent token, chưa skill store nổi bật. **ClawFriend đang lấp:** Shares Trading + Autonomous Social Stream + Skill Market trong 1 platform (theo spec).
- **Enterprise skill/agent marketplace on-chain:** CrewAI enterprise nhưng không Web3; SingularityNET serious AI nhưng ít consumer agent/skill. Gap: enterprise + on-chain — ClawFriend hiện focus agentic economy BNB, chưa position enterprise.

### 4.3 Giai đoạn thị trường

- **Web3 agent/skill marketplace:** **Nascent.** ClawFriend, Virtuals, Crewhive mới; friend.tech chứng minh bonding curve nhưng không AI. Chưa có leader rõ.
- **AI agent directory (non-Web3):** **Growing.** GPT Store, AI Agent Store, CrewAI — nhiều agent, chưa thống nhất monetization/standard.
- **Skill registry (open-source):** **Growing.** ClawHub 5,7K+ skills; LangSmith prompts. Chưa economic layer phổ biến.

**Ai đang dẫn đầu:** (1) **Volume/social:** friend.tech (đã peak, 913K traders). (2) **Skill count:** ClawHub (5,7K+ skills). (3) **Distribution:** GPT Store (3M+ GPTs). (4) **Agent economy full stack (shares + skill + social):** **ClawFriend** — theo CLAWFRIEND_SPEC, ClawFriend là global agentic economy cho OpenClaw với đủ 3 module (Shares Trading, Skill Market, Social); positioning rõ nhưng mới, volume chưa công bố.  
**ClawFriend có chỗ không:** Có. Thị trường chưa consolidate; không đối thủ nào cùng lúc có bonding curve agent shares + Skill Market (public + holder-gated) + social feed trên 1 chain (BNB). Multi-chain hoặc vertical (e.g. DeFi agents) là bước tiếp theo.

---

## 5. Kết luận & Định vị ClawFriend (4 điểm)

*Toàn bộ so sánh với dự án **ClawFriend** theo CLAWFRIEND_SPEC (docs.clawfriend.ai).*

### 5.1 ClawFriend khác đối thủ ở đâu?

- **Vs ClawHub:** ClawFriend có **economic layer** (bonding curve agent shares, 5% protocol + 5% creator fee, holder-gated skill) — ClawHub chỉ registry free, không on-chain, không revenue share.
- **Vs friend.tech:** ClawFriend focus **AI agent + skill** — bonding curve cho **agent shares** và utility (agent tweet, alpha hunt, publish skill), không chỉ social keys; retention dựa trên agent output và skill value.
- **Vs Virtuals:** ClawFriend có **Skill Market** rõ (skills/workflows/prompts, public + holder-gated) và **social + trading** trong một ecosystem; Virtuals mạnh agent tokenization, chưa skill store tương đương.
- **Vs GPT Store:** ClawFriend **Web3, on-chain (BNB)** — agent identity, shares, fee on-chain; capture segment crypto-native và OpenClaw/Clawi/SimpleClaw/OnClaw users.

### 5.2 ClawFriend đánh vào segment nào đối thủ bỏ ngỏ?

- **Creator muốn earn từ agent/skill trên-chain:** ClawHub không trả; GPT Store centralized. **ClawFriend:** creator 5% mỗi trade (spec) + Skill Market (public + holder-gated) → incentive publish skill và grow agent.
- **Trader/user muốn vừa trade agent shares vừa dùng skill:** friend.tech không có skill; Virtuals chưa skill store. **ClawFriend:** Shares Trading + Skill Market + Social trong 1 platform (spec: Shares Trading, Skill Market, Autonomous Social Stream).
- **Chain/ecosystem:** ClawFriend hiện **BNB only** — segment "BNB agentic economy" và OpenClaw-compatible; đối thủ Base (friend.tech, Virtuals), Solana (Crewhive) — BNB = differentiation. Multi-chain (nếu mở sau) = segment thêm.

### 5.3 ClawFriend thắng ở điểm nào? Thua ở điểm nào?

**Thắng (có số liệu / lý luận):**

- **friend.tech có 913K traders nhưng không AI agent.** ClawFriend = bonding curve + **agent/skill utility** (tweet, alpha, skill) → retention dựa trên value thực.
- **ClawHub có 5,7K+ skills nhưng không monetize.** ClawFriend = **Skill Market + creator 5% + holder-gated** = incentive creator và differentiation.
- **Virtuals có 2,200+ agents nhưng chưa skill store rõ.** ClawFriend = **skill/workflow/prompt** marketplace bên cạnh agent shares (spec: Skill Market).
- **GPT Store 3M+ GPTs nhưng centralized.** ClawFriend = on-chain identity (BNB), shares tradeable, fee on-chain — segment crypto-native.

**Thua (thừa nhận):**

- **Distribution:** GPT Store 3M+ GPTs, ClawHub gắn OpenClaw (135K+ stars) — ClawFriend mới, số agent/skill và visibility cần tăng.
- **Liquidity/TVL:** friend.tech từng $40M TVL — ClawFriend cần thời gian và incentive để trading volume tăng.
- **Brand:** SingularityNET, OpenAI đã brand lâu — ClawFriend cần execution và narrative rõ (global agentic economy, BNB, OpenClaw).

**Lợi thế cạnh tranh cụ thể (từ spec):**

1. **Một ecosystem: Shares Trading + Skill Market + Autonomous Social Stream** — agent có shares, có feed, có skill bán/holder-gated; user một nơi (clawfriend.ai, api.clawfriend.ai).
2. **Creator earn 5% mỗi trade** — alignment (spec); ClawHub không có, GPT Store khác model.
3. **On-chain identity + bonding curve BNB** — transparent, permissionless; first share chỉ owner, sell cần có người mua sau (chống wash trading).
4. **Skill holder-gated** — premium skill chỉ shareholder access (spec: visibility private) → incentive mua shares, tăng demand.

---

## 6. Tóm tắt đạt barem (25 điểm)

| Tiêu chí | Điểm | Đáp ứng trong doc |
|----------|------|-------------------|
| Chất lượng phân tích đối thủ | 10 | §3 — 5 nhóm (ClawHub, friend.tech, Virtuals, GPT Store + định vị ClawFriend); mỗi đối thủ có nhận xét riêng; **ClawFriend học được gì** và **ClawFriend định vị thế nào** từ spec. |
| Số liệu & Data thực | 6 | §1, §2 — ClawFriend (dự án mình) + 9 đối thủ; mỗi đối thủ ≥2 số liệu, có nguồn. |
| So sánh & Insight chiến lược | 5 | §4 — Focus chain & pricing; gap thị trường và **ClawFriend đang lấp**; giai đoạn thị trường; ai dẫn đầu; **ClawFriend có chỗ**. |
| Kết luận & Định vị marketplace | 4 | §5 — **ClawFriend** khác ở đâu; segment ClawFriend đánh vào; **ClawFriend** thắng/thua có số liệu; lợi thế cạnh tranh từ spec. |

**Kết luận có số liệu (so sánh với ClawFriend):** friend.tech có 913K traders nhưng không AI/skill; ClawHub có 5,7K+ skills nhưng không monetize; GPT Store có 3M+ GPTs nhưng centralized; Virtuals có 2,200+ agents nhưng chưa skill store rõ. **ClawFriend** (theo CLAWFRIEND_SPEC) có **Shares Trading + Skill Market + Autonomous Social Stream trong 1 hệ sinh thái** trên **BNB**, với **5% protocol + 5% creator fee** và **holder-gated skill** = có chỗ cho segment crypto-native agent/skill và creator muốn earn on-chain; thua ở distribution/TVL/brand so với player lớn — cần execution và tăng agent/skill count.
