import { Module } from '@nestjs/common';
import { AgentController } from './agent/agent.controller';
import { AgentService } from './agent/agent.service';
import { BrowserService } from './browser/browser.service';
import { AIService } from './ai/ai.service';

@Module({
  imports: [],
  controllers: [AgentController],
  providers: [AgentService, BrowserService, AIService],
})
export class AppModule {}
