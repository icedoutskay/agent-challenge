import { Agent } from "@mastra/core/agent";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { model } from "../../config";

const agent = new Agent({
  name: "News Agent",
  model,
  instructions: `
    You are a helpful, concise news assistant. When given a set of top news headlines, summarize them clearly and highlight the most important story.

    Your response should be structured exactly as follows:

     TOP NEWS SUMMARY
    • Headline 1
    • Headline 2
    • Headline 3
    • Headline 4
    • Headline 5

     MOST IMPORTANT STORY
    [Brief 2-3 sentence summary explaining why this story is significant]

    Keep your tone neutral and fact-based. Do not speculate or inject opinions.
  `,
});

const newsSchema = z.object({
  headlines: z.array(z.string()),
});

const fetchNews = createStep({
  id: "fetch-news",
  description: "Fetches top news headlines for a given topic or country",
  inputSchema: z.object({
    topic: z.string().describe("Keyword or topic to get news for").optional(),
    country: z.string().describe("2-letter country code (e.g., 'us', 'gb')").optional(),
  }),
  outputSchema: newsSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing NEWS_API_KEY in environment variables");
    }

    const params = new URLSearchParams({
      apiKey,
      ...(inputData.topic && { q: inputData.topic }),
      ...(inputData.country && { country: inputData.country }),
      pageSize: "5",
    });

    const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(`Error fetching news: ${data.message || "Unknown error"}`);
    }

    const headlines = data.articles.map((a: any) => a.title);

    return {
      headlines,
    };
  },
});

const summarizeNews = createStep({
  id: "summarize-news",
  description: "Summarizes news headlines and highlights the most important story",
  inputSchema: newsSchema,
  outputSchema: z.object({
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("News data not found");
    }

    const prompt = `
    Here are the top news headlines:
    ${inputData.headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

    Please summarize them following the exact instructions provided.
    `;

    const response = await agent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let summaryText = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      summaryText += chunk;
    }

    return {
      summary: summaryText,
    };
  },
});

const newsWorkflow = createWorkflow({
  id: "news-workflow",
  inputSchema: z.object({
    topic: z.string().describe("Keyword or topic to get news for").optional(),
    country: z.string().describe("2-letter country code (e.g., 'us', 'gb')").optional(),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
})
  .then(fetchNews)
  .then(summarizeNews);

newsWorkflow.commit();

export { newsWorkflow };
