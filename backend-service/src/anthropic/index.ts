import { Client, HUMAN_PROMPT, AI_PROMPT } from "@anthropic-ai/sdk";
import { Request, Response, NextFunction } from "express";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error("No API key provided");
}

const client = new Client(apiKey);

/**
 * Middleware to handle interactions with the Anthropic API
 * @param req Request
 * @param res Response
 */
export const complete = async (req: Request, res: Response) => {
  const options = req.body as any;
  client.complete(options).then((response) => {
    const {completion} = response;
    const __html = insertHtmlTags(completion);
    res.status(200).send({...response, completion: __html});
  }).catch((error) => {
    res.json(error);
  });
}

/**
 * Replace newlines with HTML tags
 * @param str string
 * @returns string
 */
export const insertHtmlTags = (str: string) => {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}