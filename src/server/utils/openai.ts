import { createOpenAI } from "@ai-sdk/openai";
// import { env } from "~/env";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
