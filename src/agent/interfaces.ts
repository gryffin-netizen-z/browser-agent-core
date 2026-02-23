/**
 * Single interactive element extracted from the DOM.
 */
export interface DomElement {
  id: string;
  tag: string;
  text: string;
  selector: string;
}

/**
 * Action types the AI can request.
 */
export type AgentActionType = 'click' | 'type' | 'scroll' | 'done';

/**
 * Parsed response from Gemini. Must be strict JSON.
 */
export interface GeminiActionResponse {
  action: AgentActionType;
  target_id: string;
  value?: string;
}

/**
 * One recorded step in the agent's execution history.
 */
export interface PreviousAction {
  step: number;
  action: string;
  result: string;
}

/**
 * Payload for POST /agent/run
 */
export interface RunAgentDto {
  url: string;
  goal: string;
}

/**
 * Final result returned by the agent.
 */
export interface AgentRunResult {
  success: boolean;
  message: string;
  steps_executed: number;
  previous_actions: PreviousAction[];
  final_dom_snapshot?: DomElement[];
}
