import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
- Use "done" when the goal is achieved or no further action makes sense; set target_id to "" and omit value.
- Use "click" for buttons/links. target_id must be an element id from the list.
- Use "type" for input fields. target_id is the input id, value is the text to type.
- Use "scroll" to scroll the page. target_id can be "", value is "up" or "down".
- target_id must be one of the provided element ids (e.g. el_1, el_2) or "" for done/scroll.`;

@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI | null = null;

  private getClient(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is required. Add it to your .env file.');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  async getNextAction(
    goal: string,
    domSnapshot: DomElement[],
    previousActions: PreviousAction[],
    lastError?: string,
  ): Promise<GeminiActionResponse> {
    const model = this.getClient().getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

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

    const prompt = `Goal: ${goal}

Current interactive elements on the page:
${domDescription}
${historyText}
${errorContext}

Return ONLY a single JSON object with keys: action, target_id, value (omit value for click/done if not needed).`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return this.parseJsonResponse(text);
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
        `Gemini response is not valid JSON: ${(e as Error).message}. Raw: ${raw.slice(0, 200)}`,
      );
    }
  }
}
