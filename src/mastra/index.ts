import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { newsAgent } from "./agents/news-agent/news-agent"; 
import { newsWorkflow } from "./agents/news-agent/news-workflow"; 


export const mastra = new Mastra({
	workflows: { newsWorkflow }, 
	agents: { newsAgent },
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	server: {
		port: 8080,
		timeout: 10000,
	},
});

console.log(" World News Headline Agent for Nosana Challenge");
console.log(" Available Agents:");
console.log(
  "  - newsAgent"
);
console.log(" Available Workflows:");
console.log(
  "  - newsWorkflow: Complete news headline generation"
);

console.log(" Server starting on port 8080...");
