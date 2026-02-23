# AI-Powered Browser Agent

Production-ready NestJS service that uses **Playwright** and **Google Gemini** to automate browser tasks. Send a URL and a goal; the agent navigates the page, extracts interactive elements, asks Gemini for the next action, and executes it until the goal is done or the step limit is reached.

## Tech stack

- **NestJS** – API and dependency injection
- **Playwright** – headless Chromium and DOM extraction
- **@google/generative-ai** – Gemini for deciding actions
- **TypeScript** – type-safe interfaces and async/await

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install Playwright browsers (Chromium)**

   ```bash
   npx playwright install
   ```

3. **Configure environment**

   Copy the example env and set your Gemini API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).

4. **Run the app**

   ```bash
   npm run start
   ```

   For development with watch mode:

   ```bash
   npm run start:dev
   ```

   The API listens on **http://localhost:3000** (or `PORT` if set).

## API

### `POST /agent/run`

Runs the browser agent for a given URL and goal.

**Request body:**

```json
{
  "url": "https://example.com",
  "goal": "Buy the cheapest product on this page"
}
```

**Response:**

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
  "final_dom_snapshot": []
}
```

- **success** – Whether the goal was completed.
- **message** – Short summary or error message.
- **steps_executed** – Number of actions performed.
- **previous_actions** – Log of each step and its result.
- **final_dom_snapshot** – Last DOM snapshot when the agent finished (optional).

## How it works

1. **BrowserService** – Launches Chromium with Playwright, opens the URL, and extracts a simplified DOM of interactive elements (buttons, links, inputs, selects) with stable selectors and IDs like `el_1`, `el_2`.
2. **AIService** – Sends the goal, current DOM snapshot, and action history to Gemini (`gemini-1.5-pro-latest`) with a strict system instruction to return only JSON: `{ action, target_id, value }`.
3. **AgentService** – Runs a loop (max 10 steps): get DOM → call Gemini → execute the action (click, type, scroll) → record result. On execution errors, the error is sent back to Gemini and the agent can retry. Invalid JSON from Gemini is retried once, then the run fails.

## Project structure

```
src/
  agent/
    agent.controller.ts   # POST /agent/run
    agent.service.ts      # Reasoning loop and execution
    dto/run-agent.dto.ts
    interfaces.ts
  browser/
    browser.service.ts    # Playwright launch, DOM extraction, actions
  ai/
    ai.service.ts         # Gemini client and JSON parsing
  app.module.ts
  main.ts
```

## Error handling

- **Invalid JSON from Gemini** – One automatic retry; if still invalid, the run returns with `success: false` and an error message.
- **Execution failures** (e.g. element not found) – The error is recorded and sent to Gemini in the next step so it can choose another action.
- **Browser/network errors** – The run ends and the browser is closed; the response includes the error message.

## License

MIT
