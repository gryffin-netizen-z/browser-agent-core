# Implementation Plan – AI-Powered Browser Agent

## 1. Project scope

- **Product:** NestJS service that automates browser tasks using Playwright and Google Gemini.
- **Input:** URL + goal (natural language).
- **Output:** Success/failure, step log, optional final DOM snapshot.
- **Constraints:** Max 10 steps per run, strict JSON from Gemini, no mocking.

---

## 2. Phases and tasks

### Phase 1 – Foundation (Done)

| # | Task | Deliverable | Status |
|---|------|-------------|--------|
| 1.1 | Init NestJS project | `package.json`, `tsconfig.json`, `nest-cli.json` | Done |
| 1.2 | Configure TypeScript & dependencies | Playwright, `@google/generative-ai`, dotenv | Done |
| 1.3 | Define shared types | `src/agent/interfaces.ts` (DomElement, GeminiActionResponse, etc.) | Done |
| 1.4 | Environment & bootstrap | `.env` / `.env.example`, `main.ts` with dotenv | Done |

### Phase 2 – Browser layer (Done)

| # | Task | Deliverable | Status |
|---|------|-------------|--------|
| 2.1 | Playwright browser lifecycle | Launch Chromium, context, page; close on destroy | Done |
| 2.2 | Navigate to URL | `openUrl()` with timeout and wait strategy | Done |
| 2.3 | Extract interactive DOM | Buttons, links, inputs, selects; stable selectors (id, data-testid, data-agent-id) | Done |
| 2.4 | Execute actions | `click`, `type`, `scroll` by selector or by `target_id` from snapshot | Done |
| 2.5 | Wire BrowserService in AppModule | Injectable, used by AgentService | Done |

### Phase 3 – AI layer (Done)

| # | Task | Deliverable | Status |
|---|------|-------------|--------|
| 3.1 | Gemini client init | Lazy init with `GEMINI_API_KEY`, model `gemini-1.5-pro-latest` | Done |
| 3.2 | System instruction | Strict "JSON only, no markdown" prompt | Done |
| 3.3 | Build prompt | Goal + DOM snapshot + previous actions + last error | Done |
| 3.4 | Parse and validate response | `parseJsonResponse()`, strip markdown, validate action/target_id | Done |
| 3.5 | Invalid JSON handling | Retry once, then throw with clear error | Done |

### Phase 4 – Agent orchestration (Done)

| # | Task | Deliverable | Status |
|---|------|-------------|--------|
| 4.1 | Run loop (max 10 steps) | Get DOM → Gemini → execute → record; break on `done` or max steps | Done |
| 4.2 | Action history | `previous_actions[]` with step, action description, result | Done |
| 4.3 | Execution error handling | Catch error, append to history, send last error to Gemini, continue | Done |
| 4.4 | Browser cleanup | Close browser in `finally` after each run | Done |
| 4.5 | Response shape | `AgentRunResult`: success, message, steps_executed, previous_actions, optional final_dom_snapshot | Done |

### Phase 5 – API and wiring (Done)

| # | Task | Deliverable | Status |
|---|------|-------------|--------|
| 5.1 | DTO | `RunAgentDto`: url, goal | Done |
| 5.2 | Controller | `POST /agent/run` → `AgentService.run()` | Done |
| 5.3 | DI wiring | AppModule: AgentController, AgentService, BrowserService, AIService | Done |

### Phase 6 – Documentation and setup (Done)

| # | Task | Deliverable | Status |
|---|------|-------------|--------|
| 6.1 | README | Setup, API, structure, env | Done |
| 6.2 | Implementation plan | This document | Done |
| 6.3 | Project overview | PROJECT_OVERVIEW.md | Done |

---

## 3. Technical decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js + NestJS | Structure, DI, async, production-style API |
| Browser | Playwright Chromium | Headless, stable API, good selector support |
| AI | Google Gemini (gemini-1.5-pro-latest) | Strong reasoning, JSON output with strict prompt |
| Selectors | id → data-testid → input[name] → data-agent-id (injected) | Stable, minimal DOM changes |
| Steps cap | 10 | Limit cost and runaway loops |
| JSON retry | 1 retry on invalid Gemini JSON | Resilience without infinite retries |
| Env | dotenv, GEMINI_API_KEY | Simple, one secret |

---

## 4. Possible next steps (future)

- Add request validation (e.g. `class-validator` on `RunAgentDto`).
- Add logging (e.g. Nest Logger, step-by-step).
- Add tests: unit (AIService parsing, AgentService loop), e2e (mock Gemini, real Playwright or mock).
- Optional screenshot capture on failure for debugging.
- Rate limiting and timeout for `POST /agent/run`.
- Support more actions (e.g. select option, hover) and richer DOM (labels, roles).

---

## 5. Checklist before release

- [ ] `GEMINI_API_KEY` set in production env (not in code).
- [ ] `npm install` and `npx playwright install chromium` documented and run.
- [ ] Build: `npm run build` succeeds.
- [ ] Manual test: `POST /agent/run` with a simple goal returns valid `AgentRunResult`.
