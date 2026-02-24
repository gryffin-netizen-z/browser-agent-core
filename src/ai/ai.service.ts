import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  DomElement,
  GeminiActionResponse,
  PreviousAction,
} from '../agent/interfaces';

const SYSTEM_INSTRUCTION = `You are a browser automation AI.
You must ONLY return valid JSON.
Do not explain anything.
Do not include markdown formatting.
Do not wrap the JSON in backticks or code blocks.
If unsure, still return valid JSON.

You will receive:
1. A goal to achieve on the page
2. A list of interactive elements with id, tag, text, selector
3. Optional: previous actions and their results

Respond with exactly this JSON structure, nothing else:
{"action":"click"|"type"|"scroll"|"done","target_id":"el_X","value":"optional text for type or 'up'/'down' for scroll"}

Rules:
- Use "done" ONLY when the user's goal is fully achieved (e.g. "compare products" = you have clicked Compare on at least 2 items or opened product details; "buy cheapest" = you have added that product to cart or reached its page). Do NOT return done after only scrolling or when you have not yet performed the main action (click/type) required by the goal.
- Use "click" for buttons/links (Add to Cart, Compare, product links, etc.). target_id must be an element id from the list.
- Use "type" for input fields. target_id is the input id, value is the text to type.
- Use "scroll" to scroll the page when you need to bring more elements into view (e.g. to find products, Compare buttons). target_id can be "", value is "up" or "down".
- target_id must be one of the provided element ids (e.g. el_1, el_2) or "" for done/scroll.`;

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

@Injectable()
export class AIService {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY?.trim();
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is required. Add it to your .env file.');
      }
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  /**
   * Gửi message lên OpenAI, trả về nội dung phản hồi (dùng cho hello, diagnose).
   */
  async sendMessage(message: string): Promise<string> {
    const client = this.getClient();
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: message }],
    });
    const content = completion.choices[0]?.message?.content;
    if (content == null) {
      throw new Error('OpenAI returned empty response');
    }
    return content;
  }

  async getNextAction(
    goal: string,
    domSnapshot: DomElement[],
    previousActions: PreviousAction[],
    lastError?: string,
    pageContext?: { url: string; title: string },
  ): Promise<GeminiActionResponse> {
    const pageContextText =
      pageContext != null
        ? `Current page URL: ${pageContext.url}\nCurrent page title: ${pageContext.title}\n\n`
        : '';

    const domDescription = domSnapshot.length
      ? domSnapshot
          .map(
            (e) =>
              `id=${e.id} tag=${e.tag} text="${(e.text || '').slice(0, 80)}" selector=${e.selector}`,
          )
          .join('\n')
      : 'No interactive elements found.';

    const historyText =
      previousActions.length > 0
        ? 'Previous actions:\n' +
          previousActions
            .map(
              (a) =>
                `Step ${a.step}: ${a.action} -> ${a.result}`,
            )
            .join('\n')
        : '';

    const errorContext = lastError
      ? `\nLast execution error (try a different action): ${lastError}`
      : '';

    const userContent = `Goal: ${goal}

${pageContextText}Current interactive elements on the page:
${domDescription}
${historyText}
${errorContext}

Remember: Return "done" only when the goal is truly completed (e.g. compared products, clicked the right item). If the goal is to compare products or find the cheapest, you must click the relevant buttons/links (Compare, product name, Add to Cart) before saying done.
Return ONLY a single JSON object with keys: action, target_id, value (omit value for click/done if not needed).`;

    const client = this.getClient();
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
    });
    const raw = completion.choices[0]?.message?.content;
    if (raw == null) {
      throw new Error('OpenAI returned empty response');
    }
    return this.parseJsonResponse(raw);
  }

  private parseJsonResponse(raw: string): GeminiActionResponse {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
    cleaned = cleaned.trim();

    try {
      const parsed = JSON.parse(cleaned) as GeminiActionResponse;
      if (
        !parsed ||
        typeof parsed.action !== 'string' ||
        typeof parsed.target_id !== 'string'
      ) {
        throw new Error('Invalid shape: missing action or target_id');
      }
      const action = parsed.action as GeminiActionResponse['action'];
      if (!['click', 'type', 'scroll', 'done'].includes(action)) {
        throw new Error(`Invalid action: ${action}`);
      }
      return {
        action,
        target_id: parsed.target_id,
        value: parsed.value,
      };
    } catch (e) {
      throw new Error(
        `OpenAI response is not valid JSON: ${(e as Error).message}. Raw: ${raw.slice(0, 200)}`,
      );
    }
  }
}
