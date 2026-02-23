import { Injectable } from '@nestjs/common';
import { BrowserService } from '../browser/browser.service';
import { AIService } from '../ai/ai.service';
import {
  DomElement,
  GeminiActionResponse,
  PreviousAction,
  AgentRunResult,
  RunAgentDto,
} from './interfaces';

const MAX_STEPS = 10;
const GEMINI_JSON_RETRY_ONCE = 1;

@Injectable()
export class AgentService {
  constructor(
    private readonly browserService: BrowserService,
    private readonly aiService: AIService,
  ) {}

  async run(dto: RunAgentDto): Promise<AgentRunResult> {
    const previousActions: PreviousAction[] = [];
    let lastError: string | undefined;
    let stepsExecuted = 0;

    try {
      await this.browserService.launch();
      await this.browserService.openUrl(dto.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.browserService.close();
      return this.buildResult(false, `Failed to open URL: ${message}`, 0, previousActions);
    }

    try {
      return await this.runLoop(dto, previousActions);
    } finally {
      await this.browserService.close();
    }
  }

  private async runLoop(
    dto: RunAgentDto,
    previousActions: PreviousAction[],
  ): Promise<AgentRunResult> {
    let lastError: string | undefined;
    let stepsExecuted = 0;

    for (let step = 1; step <= MAX_STEPS; step++) {
      let domSnapshot: DomElement[];

      try {
        domSnapshot = await this.browserService.extractInteractiveDom();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return this.buildResult(
          false,
          `Failed to extract DOM at step ${step}: ${message}`,
          stepsExecuted,
          previousActions,
        );
      }

      let response: GeminiActionResponse;
      let parseAttempt = 0;
      const maxParseAttempts = 1 + GEMINI_JSON_RETRY_ONCE;

      while (parseAttempt < maxParseAttempts) {
        try {
          response = await this.aiService.getNextAction(
            dto.goal,
            domSnapshot,
            previousActions,
            lastError,
          );
          break;
        } catch (err) {
          parseAttempt++;
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes('not valid JSON') && parseAttempt < maxParseAttempts) {
            lastError = `Gemini returned invalid JSON (retry ${parseAttempt})`;
            continue;
          }
          return this.buildResult(
            false,
            `Gemini error at step ${step}: ${message}`,
            stepsExecuted,
            previousActions,
          );
        }
      }

      const resp = response!;

      if (resp.action === 'done') {
        return this.buildResult(
          true,
          'Goal completed.',
          stepsExecuted,
          previousActions,
          domSnapshot,
        );
      }

      const actionDescription = this.describeAction(resp);
      let result: string;

      try {
        await this.executeAction(resp);
        result = 'success';
        lastError = undefined;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result = `error: ${message}`;
        lastError = message;
        previousActions.push({ step, action: actionDescription, result });
        stepsExecuted++;
        continue;
      }

      previousActions.push({ step, action: actionDescription, result });
      stepsExecuted++;
    }

    return this.buildResult(
      false,
      `Max steps (${MAX_STEPS}) reached without completing goal.`,
      stepsExecuted,
      previousActions,
    );
  }

  private describeAction(resp: GeminiActionResponse): string {
    if (resp.action === 'scroll') {
      return `scroll ${resp.value || 'down'}`;
    }
    if (resp.action === 'type') {
      return `type in ${resp.target_id}: "${(resp.value || '').slice(0, 30)}..."`;
    }
    return `${resp.action} ${resp.target_id}`;
  }

  private async executeAction(resp: GeminiActionResponse): Promise<void> {
    const { action, target_id, value } = resp;

    if (action === 'scroll') {
      await this.browserService.scroll((value as 'up' | 'down') || 'down');
      return;
    }

    if (action === 'click') {
      await this.browserService.executeAction('click', target_id);
      return;
    }

    if (action === 'type') {
      await this.browserService.executeAction('type', target_id, value ?? '');
      return;
    }

    throw new Error(`Unsupported action: ${action}`);
  }

  private buildResult(
    success: boolean,
    message: string,
    stepsExecuted: number,
    previousActions: PreviousAction[],
    finalDomSnapshot?: DomElement[],
  ): AgentRunResult {
    return {
      success,
      message,
      steps_executed: stepsExecuted,
      previous_actions: previousActions,
      ...(finalDomSnapshot && { final_dom_snapshot: finalDomSnapshot }),
    };
  }
}
