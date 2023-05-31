import { AI_PROMPT, HUMAN_PROMPT, Client } from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || "";

const client = new Client(apiKey);

/**
 * Anthropic API call to get the prompt for the AI to complete
 * @param query User input
 * @returns AI prompt
 */
export const getAnthropicPrompt = async (query: string) => {
  const response = await client.complete({
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
  const response = await client.complete({
    prompt: `${HUMAN_PROMPT}Summerize the following \n\n${query}${AI_PROMPT}`,
    max_tokens_to_sample: 300,
    model: "claude-v1",
    stop_sequences: [HUMAN_PROMPT],
  }).then( res => res.completion);
  
  return response;
}
