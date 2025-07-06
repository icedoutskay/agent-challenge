import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

export const topHeadlinesTool = createTool({
  id: "get-top-headlines",
  description: "Fetch the latest news headlines by topic, category, or country.",
  inputSchema: z.object({
    query: z.string().describe("Keyword or topic to search for").optional(),
    category: z.enum([
      "general",
      "business",
      "technology",
      "sports",
      "entertainment",
      "health",
      "science",
      "politics",
    ]).describe("News category").optional(),
    country: z.string().describe("2-letter ISO country code (e.g., us, gb, in)").optional(),
    pageSize: z.number().min(1).max(20).describe("Number of headlines to fetch (max 20)").optional(),
  }),
  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        source: z.string(),
        url: z.string(),
        publishedAt: z.string(),
      })
    ),
    totalResults: z.number(),
  }),
  execute: async ({ context }) => {
    const { query, category, country, pageSize = 5 } = context;

    console.log(` [Headlines Tool] Fetching news with query: "${query || "none"}", category: "${category || "none"}", country: "${country || "none"}"`);

    try {
      const apiKey = process.env.NEWS_API_KEY;
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          q: query,
          category,
          country,
          pageSize,
          apiKey,
        },
      });

      const { articles, totalResults } = response.data;

      const headlines = articles.map((article: any) => ({
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
      }));

      console.log(` [Headlines Tool] Retrieved ${headlines.length} headlines`);

      return {
        headlines,
        totalResults,
      };
    } catch (error) {
      console.error(` [Headlines Tool] Error fetching news:`, error);
      return {
        headlines: [],
        totalResults: 0,
      };
    }
  },
});



export const newsSummaryTool = createTool({
  id: "summarize-news",
  description: "Generate a concise summary for a provided news article URL.",
  inputSchema: z.object({
    url: z.string().url().describe("URL of the news article to summarize"),
  }),
  outputSchema: z.object({
    url: z.string(),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { url } = context;

    console.log(` [Summary Tool] Generating summary for: ${url}`);

    try {
      const apiKey = process.env.SMMRY_API_KEY;
      const response = await axios.get("https://api.smmry.com", {
        params: {
          SM_API_KEY: apiKey,
          SM_URL: url,
        },
      });

      const summary = response.data.sm_api_content || "Summary not available.";

      console.log(` [Summary Tool] Summary generated`);

      return {
        url,
        summary,
      };
    } catch (error) {
      console.error(` [Summary Tool] Error summarizing article:`, error);
      return {
        url,
        summary: "Summary could not be generated due to an error.",
      };
    }
  },
});
