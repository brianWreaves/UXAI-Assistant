import { AI_PROMPT, HUMAN_PROMPT, Client, SamplingParameters, CompletionResponse } from "@anthropic-ai/sdk";

const proxyEndpoint = process.env.ANTHROPIC_PROXY_ENDPOINT as string;

/**
 * Handler for the API call
 * @param params prompt parameters
 * @param options prompt options
 * @returns Completion response
 */
const apiHandler = async (params: SamplingParameters, options?: {signal?: AbortSignal }): Promise<CompletionResponse> => {
  const response = await fetch(proxyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    signal: options?.signal,
  });
  const json = await response.json();
  return json;
}

/**
 * Anthropic API call to get the prompt for the AI to complete
 * @param query User input
 * @returns AI prompt
 */
export const getAnthropicPrompt = async (query: string) => {
  const response =  await apiHandler({
    prompt: `${HUMAN_PROMPT} ${query}${AI_PROMPT}`,
    max_tokens_to_sample: 300,
    model: "claude-v1",
    stop_sequences: [HUMAN_PROMPT],
  }).then( res => res.completion);
  
  return response;
};

/**
 * Claude API call to summerize a document
 * @param query Document to summerize
 * @returns Document summery
 */
export const summerizeDocs= async (query: string) => {
  const response = await apiHandler({
    prompt: `${HUMAN_PROMPT}Summerize the following \n\n${query}${AI_PROMPT}`,
    max_tokens_to_sample: 300,
    model: "claude-v1",
    stop_sequences: [HUMAN_PROMPT],
  }).then( res => res.completion);
  
  return response;
}
