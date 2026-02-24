import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private readonly browserService: BrowserService,
    private readonly aiService: AIService,
  ) {}

  async run(dto: RunAgentDto): Promise<AgentRunResult> {
    this.logger.log(`Run started: url=${dto.url} goal="${dto.goal.slice(0, 60)}..."`);
    const previousActions: PreviousAction[] = [];
    let lastError: string | undefined;
    let stepsExecuted = 0;

    try {
      const headless = dto.headless ?? true;
      this.logger.log(`Launching browser (headless=${headless}) and opening URL...`);
      await this.browserService.launch({ headless });
      await this.browserService.openUrl(dto.url);
      this.logger.log('URL loaded.');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.browserService.close();
      return this.buildResult(false, `Failed to open URL: ${message}`, 0, previousActions);
    }

    try {
      return await this.runLoop(dto, previousActions);
    } finally {
      // Mặc định giữ browser mở khi headless=false (demo), hoặc khi client gửi keepBrowserOpen=true
      const keepOpen =
        dto.keepBrowserOpen === true || (dto.headless === false && dto.keepBrowserOpen !== false);
      if (!keepOpen) {
        await this.browserService.close();
      } else {
        this.logger.log('Browser left open (keepBrowserOpen or headless=false).');
      }
    }
  }

  private async runLoop(
    dto: RunAgentDto,
    previousActions: PreviousAction[],
  ): Promise<AgentRunResult> {
    let lastError: string | undefined;
    let stepsExecuted = 0;

    for (let step = 1; step <= MAX_STEPS; step++) {
      this.logger.log(`--- Step ${step}/${MAX_STEPS} ---`);
      let domSnapshot: DomElement[];

      let pageContext: { url: string; title: string } | undefined;
      try {
        pageContext = await this.browserService.getPageState();
        this.logger.log(`Page: ${pageContext.title.slice(0, 50)} | ${pageContext.url.slice(0, 60)}...`);
        domSnapshot = await this.browserService.extractInteractiveDom();
        this.logger.log(`DOM: ${domSnapshot.length} interactive elements`);
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
            pageContext,
          );
          break;
        } catch (err) {
          parseAttempt++;
          const message = err instanceof Error ? err.message : String(err);
          this.logger.warn(`OpenAI attempt ${parseAttempt} failed: ${message.slice(0, 100)}`);
          if (message.includes('not valid JSON') && parseAttempt < maxParseAttempts) {
            lastError = `OpenAI returned invalid JSON (retry ${parseAttempt})`;
            continue;
          }
          this.logger.error(`OpenAI error at step ${step}, giving up`);
          return this.buildResult(
            false,
            `OpenAI error at step ${step}: ${message}`,
            stepsExecuted,
            previousActions,
          );
        }
      }

      const resp = response!;
      this.logger.log(`OpenAI → action=${resp.action} target_id=${resp.target_id || '(none)'} value=${(resp.value ?? '').slice(0, 40) || '(none)'}`);

      if (resp.action === 'done') {
        this.logger.log('Agent returned done. Goal completed.');
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
        this.logger.log(`Execute OK: ${actionDescription}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result = `error: ${message}`;
        lastError = message;
        this.logger.warn(`Execute failed: ${actionDescription} → ${message.slice(0, 80)}`);
        previousActions.push({ step, action: actionDescription, result });
        stepsExecuted++;
        continue;
      }

      previousActions.push({ step, action: actionDescription, result });
      stepsExecuted++;
    }

    this.logger.warn(`Max steps (${MAX_STEPS}) reached.`);
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
