import { Body, Controller, Get, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { RunAgentDto } from './dto/run-agent.dto';
import { AIService } from '../ai/ai.service';
import { BrowserService } from '../browser/browser.service';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly aiService: AIService,
    private readonly browserService: BrowserService,
  ) {}

  @Post('run')
  async run(@Body() dto: RunAgentDto) {
    return this.agentService.run(dto);
  }

  /**
   * Hello API: gửi message lên OpenAI, trả về response.
   * GET /agent/hello hoặc POST /agent/hello với body { "message": "..." } (mặc định "hello").
   */
  @Get('hello')
  async helloGet() {
    return this.hello('hello');
  }

  @Post('hello')
  async helloPost(@Body() body: { message?: string }) {
    const message = body?.message?.trim() || 'hello';
    return this.hello(message);
  }

  private async hello(message: string) {
    const response = await this.aiService.sendMessage(message);
    return { request: message, response };
  }

  /**
   * Diagnose: kiểm tra browser (Playwright) và OpenAI.
   */
  @Get('diagnose')
  async diagnose() {
    const result: { browser: string; openai: string } = { browser: '', openai: '' };
    try {
      await this.browserService.launch();
      await this.browserService.openUrl('about:blank');
      const state = await this.browserService.getPageState();
      await this.browserService.close();
      result.browser = state.title === 'about:blank' ? 'ok' : `ok (title: ${state.title})`;
    } catch (e) {
      result.browser = (e instanceof Error ? e.message : String(e)).slice(0, 200);
    }
    try {
      await this.aiService.sendMessage('Say OK');
      result.openai = 'ok';
    } catch (e) {
      result.openai = (e instanceof Error ? e.message : String(e)).slice(0, 200);
    }
    return result;
  }
}
