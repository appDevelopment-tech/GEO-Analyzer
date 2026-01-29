/**
 * GLM-4.7-Flash API Client
 *
 * ZhipuAI GLM-4.7-Flash:
 * - Released January 2026
 * - 30B parameters (MoE: 3B activated)
 * - Open source and FREE
 * - 200K token context
 */

const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

export interface GLMOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call ZhipuAI GLM-4.7-Flash API
 */
export async function callGLM47Flash(
  messages: Array<{ role: string; content: string }>,
  options: GLMOptions = {}
): Promise<any> {
  const apiKey = process.env.Z_AI_GLM_API_KEY || process.env.ZHIPUAI_API_KEY;
  if (!apiKey) {
    throw new Error("ZhipuAI API key not configured. Set Z_AI_GLM_API_KEY or ZHIPUAI_API_KEY env var.");
  }

  const response = await fetch(ZHIPU_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-4.7-flash",
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GLM-4.7-Flash API error: ${response.status} ${error}`);
  }

  return response.json();
}
