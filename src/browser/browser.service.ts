import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { DomElement } from '../agent/interfaces';

const INTERACTIVE_SELECTORS = [
  'button',
  'a[href]',
  'input:not([type="hidden"])',
  'select',
  '[role="button"]',
  '[role="link"]',
  '[onclick]',
];

@Injectable()
export class BrowserService implements OnModuleDestroy {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private headless: boolean = true;

  async launch(options?: { headless?: boolean }): Promise<void> {
    const wantHeadless = options?.headless ?? true;
    if (this.browser && this.headless === wantHeadless) return;
    if (this.browser) {
      await this.close();
    }
    this.headless = wantHeadless;
    this.browser = await chromium.launch({
      headless: this.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    });
    this.page = await this.context.newPage();
  }

  async openUrl(url: string): Promise<void> {
    await this.ensureLaunched();
    if (!this.page) throw new Error('Page not initialized');
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  /** Current page URL and title (context for LLM). */
  async getPageState(): Promise<{ url: string; title: string }> {
    await this.ensureLaunched();
    if (!this.page) throw new Error('Page not initialized');
    const url = this.page.url();
    const title = await this.page.title();
    return { url, title };
  }

  async extractInteractiveDom(): Promise<DomElement[]> {
    await this.ensureLaunched();
    if (!this.page) throw new Error('Page not initialized');

    const elements = await this.page.evaluate((selectors: string[]) => {
      const result: Array<{ tag: string; text: string; selector: string }> = [];
      const seen = new Set<string>();
      let agentIdCounter = 0;

      for (const sel of selectors) {
        const nodes = document.querySelectorAll(sel);
        nodes.forEach((el) => {
          const tag = el.tagName.toLowerCase();
          let text = '';
          if (el instanceof HTMLButtonElement || el instanceof HTMLAnchorElement) {
            text = (el.textContent ?? '').trim().slice(0, 200);
          }
          if (el instanceof HTMLInputElement) {
            text = el.placeholder || el.name || el.type || '';
          }
          if (el instanceof HTMLSelectElement) {
            text = el.name || el.id || 'select';
          }
          if (!text && el.getAttribute('aria-label')) {
            text = el.getAttribute('aria-label') ?? '';
          }
          if (!text && el.getAttribute('title')) {
            text = el.getAttribute('title') ?? '';
          }

          let selector: string;
          const id = el.id && /^[a-zA-Z][\w-]*$/.test(el.id) ? `#${el.id}` : null;
          if (id) {
            selector = id;
          } else if (el.getAttribute('data-testid')) {
            selector = `[data-testid="${el.getAttribute('data-testid')}"]`;
          } else if (el.getAttribute('name') && tag === 'input') {
            selector = `input[name="${el.getAttribute('name')}"]`;
          } else {
            agentIdCounter += 1;
            const agentId = `agent_el_${agentIdCounter}`;
            el.setAttribute('data-agent-id', agentId);
            selector = `[data-agent-id="${agentId}"]`;
          }

          const key = selector + '|' + text.slice(0, 50);
          if (seen.has(key)) return;
          seen.add(key);
          result.push({ tag, text, selector });
        });
      }
      return result;
    }, INTERACTIVE_SELECTORS);

    return elements.map((el, i) => ({
      id: `el_${i + 1}`,
      tag: el.tag,
      text: el.text,
      selector: el.selector,
    }));
  }

  async click(selector: string): Promise<void> {
    await this.ensureLaunched();
    if (!this.page) throw new Error('Page not initialized');
    await this.page.click(selector, { timeout: 5000 });
  }

  async type(selector: string, text: string): Promise<void> {
    await this.ensureLaunched();
    if (!this.page) throw new Error('Page not initialized');
    await this.page.fill(selector, text, { timeout: 5000 });
  }

  async scroll(direction: 'up' | 'down'): Promise<void> {
    await this.ensureLaunched();
    if (!this.page) throw new Error('Page not initialized');
    const delta = direction === 'down' ? 400 : -400;
    await this.page.evaluate((d) => window.scrollBy(0, d), delta);
  }

  /**
   * Execute action by target_id (element id from DOM snapshot).
   * Resolves target_id to selector using current DOM snapshot.
   */
  async executeAction(
    action: 'click' | 'type' | 'scroll',
    targetId: string,
    value?: string,
  ): Promise<void> {
    const dom = await this.extractInteractiveDom();
    const el = dom.find((e) => e.id === targetId);

    if (action === 'scroll') {
      await this.scroll((value as 'up' | 'down') || 'down');
      return;
    }

    if (!el) {
      throw new Error(`Element not found: ${targetId}`);
    }

    if (action === 'click') {
      await this.click(el.selector);
    } else if (action === 'type' && value !== undefined) {
      await this.type(el.selector, value);
    } else {
      throw new Error(`Unknown action or missing value: ${action}`);
    }
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close().catch(() => {});
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
    this.page = null;
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  private async ensureLaunched(): Promise<void> {
    if (!this.browser) {
      await this.launch();
    }
  }
}
