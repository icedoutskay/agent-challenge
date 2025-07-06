# 🌍 World News Headlines Agent

An intelligent AI agent built with Mastra that fetches, summarizes, and analyzes world news headlines from multiple sources. Perfect for staying updated with current events across different topics and regions.

##  Features

- **Multi-source News Fetching**: Aggregates news from NewsAPI, Guardian, and RSS feeds
- **Smart Categorization**: Supports multiple news categories (technology, business, sports, etc.)
- **Geographic Filtering**: Get news from specific countries or regions
- **Sentiment Analysis**: Analyzes the tone and sentiment of news headlines
- **Real-time Updates**: Fetches the latest headlines as they happen
- **Intelligent Summarization**: Provides concise summaries of news topics
- **Source Diversity**: Ensures balanced perspectives from multiple news sources

##  Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone your forked repository
git clone https://github.com/yourusername/agent-challenge.git
cd agent-challenge

# Install dependencies
pnpm install
```

### 2. Configure Environment Variables

Copy the `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional but recommended: News API Key (free tier available)
NEWS_API_KEY=your_news_api_key_here

```

### 3. Get API Keys

- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **News API Key**: Get free at [NewsAPI.org](https://newsapi.org/register)

### 4. Run Development Server

```bash
pnpm run dev
```

The agent will be available at `http://localhost:8080`

##  Usage Examples

### Basic News Queries

- "What are the latest headlines?"
- "Show me technology news"
- "Get business news from the United States"
- "Find news about artificial intelligence"

### Advanced Queries

- "What's happening in sports in the UK?"
- "Show me positive news stories today"
- "Get entertainment news from multiple sources"
- "Analyze the sentiment of current headlines"

### API Usage

You can also interact with the agent via REST API:

```bash
curl -X POST http://localhost:8080/api/agents/newsAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Get me the latest technology news" }
    ]
  }'
```

##  Docker Deployment

### Build and Run Locally

```bash
# Build the Docker image
docker build -t yourusername/world-news-agent:latest .

# Run the container
docker run -p 8080:8080 --env-file .env yourusername/world-news-agent:latest
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push the image
docker push yourusername/world-news-agent:latest
```

##  Deploy on Nosana

### Method 1: Using Nosana CLI

1. Install the Nosana CLI:
```bash
npm install -g @nosana/cli
```

2. Edit `nosana_mastra.json` with your Docker image:
```json
{
  "image": "docker.io/yourusername/world-news-agent:latest"
}
```

3. Deploy:
```bash
nosana job post --file nosana_mastra.json --market nvidia-3060 --timeout 30
```

### Method 2: Using Nosana Dashboard

1. Go to [Nosana Dashboard](https://dashboard.nosana.com/deploy)
2. Copy and paste your job definition
3. Select appropriate GPU
4. Click Deploy

##  Agent Architecture

### Core Components

- **Main Agent** (`src/mastra/agents/news-agent/index.ts`): Central agent configuration
- **News Tools** (`src/mastra/agents/news-agent/news-tools.ts`): Tool implementations for news fetching
- **Mastra Config** (`src/mastra/index.ts`): Framework configuration

### Available Tools

1. **getTopHeadlines**: Fetch top headlines by country/category
2. **searchNews**: Search for specific topics across all sources
3. **getNewsBySource**: Get news from specific sources (BBC, CNN, etc.)
4. **analyzeNewsSentiment**: Analyze sentiment and themes in headlines

##  Technical Implementation

### News Sources

- **Primary**: NewsAPI (60+ sources, real-time)

### Sentiment Analysis

- Keyword-based sentiment classification
- Confidence scoring for sentiment predictions
- Trend analysis across multiple headlines

### Error Handling

- Graceful fallbacks when APIs are unavailable
- Rate limiting protection
- Comprehensive error logging

##  Demo Video

[Link to your demo video showing the agent in action]

##  Live Demo

[Link to your deployed agent on Nosana]


##  License

MIT License - see [LICENSE](LICENSE) for details.

##  Contributing

This project was created for the Nosana Agent Challenge. Feel free to fork and enhance!

##  Support

- Discord: [Nosana Discord](https://discord.gg/nosana-ai)
- Twitter: [@nosana_ai](https://x.com/nosana_ai)
- Documentation: [Nosana Docs](https://docs.nosana.io)

---

Built with ❤️ using [Mastra](https://mastra.ai) and deployed on [Nosana](https://nosana.io) decentralized infrastructure.

#NosanaAgentChallenge