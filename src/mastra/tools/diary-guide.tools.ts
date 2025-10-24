import { createTool } from "@mastra/core";
import { z } from "zod";

// Pillar types for the Diary system
const pillarSchema = z.enum(["work", "finances", "health", "relationships"]);

/**
 * Reflection Analyzer Tool
 * Analyzes journal entries for sentiment, insights, and actionable steps
 */
export const reflectionAnalyzerTool = createTool({
  id: "reflection-analyzer",
  description: "Analyzes a journal reflection entry to extract sentiment, key insights, and actionable steps",
  inputSchema: z.object({
    entry: z.string().describe("The user's journal entry text"),
    pillar: pillarSchema.describe("Which life pillar this reflection is about"),
    previousInsights: z.array(z.string()).optional().describe("Recent insights to build upon"),
  }),
  outputSchema: z.object({
    sentimentScore: z.number().min(1).max(10).describe("Overall sentiment/mood score"),
    keyInsights: z.array(z.string()).describe("2-3 key insights extracted from the entry"),
    actionableSteps: z.array(z.string()).describe("1-2 concrete action items"),
    resourceSuggestion: z.string().optional().describe("Suggested resource (book, article, podcast)"),
  }),
  execute: async ({ context }) => {
    const { entry, pillar, previousInsights = [] } = context;

    // Simple sentiment analysis (in production, use NLP library or LLM)
    const positiveWords = ["happy", "great", "good", "excellent", "progress", "achieved", "better"];
    const negativeWords = ["stressed", "difficult", "hard", "struggling", "worried", "tired"];

    const lowerEntry = entry.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerEntry.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerEntry.includes(w)).length;

    const sentimentScore = Math.max(1, Math.min(10, 5 + positiveCount - negativeCount));

    // Extract key themes (simplified - in production use LLM)
    const insights = [
      `${pillar.charAt(0).toUpperCase() + pillar.slice(1)} reflection shows ${sentimentScore > 6 ? 'positive' : sentimentScore < 4 ? 'challenging' : 'mixed'} emotions`,
      "Continued awareness is key to growth in this area"
    ];

    const actions = [
      `Set a specific goal for ${pillar} this week`,
      "Track daily progress with brief check-ins"
    ];

    return {
      sentimentScore,
      keyInsights: insights,
      actionableSteps: actions,
      resourceSuggestion: getResourceForPillar(pillar),
    };
  },
});

/**
 * Resource Fetcher Tool
 * Fetches relevant resources based on topic and pillar
 */
export const resourceFetcherTool = createTool({
  id: "resource-fetcher",
  description: "Fetches curated resources (books, articles, podcasts) for a specific topic and pillar",
  inputSchema: z.object({
    topic: z.string().describe("The specific topic to find resources for"),
    pillar: pillarSchema.describe("Which life pillar"),
  }),
  outputSchema: z.object({
    resources: z.array(z.object({
      type: z.enum(["book", "article", "podcast", "video"]),
      title: z.string(),
      description: z.string(),
      url: z.string().optional(),
    })),
  }),
  execute: async ({ context }) => {
    const { topic, pillar } = context;

    // Curated resources (in production, integrate with a real API or database)
    const resources = getCuratedResources(pillar, topic);

    return { resources };
  },
});

/**
 * Progress Tracker Tool
 * Calculates trends and generates progress summaries
 */
export const progressTrackerTool = createTool({
  id: "progress-tracker",
  description: "Tracks progress across pillars with trend analysis and mood averages",
  inputSchema: z.object({
    pillar: pillarSchema.describe("Which pillar to track"),
    timeRange: z.enum(["week", "month", "all"]).describe("Time range for analysis"),
    sentimentHistory: z.array(z.number()).optional().describe("Historical sentiment scores"),
  }),
  outputSchema: z.object({
    averageSentiment: z.number(),
    trend: z.enum(["improving", "stable", "declining"]),
    summary: z.string(),
    weekNumber: z.number().optional(),
  }),
  execute: async ({ context }) => {
    const { pillar, timeRange, sentimentHistory = [] } = context;

    if (sentimentHistory.length === 0) {
      return {
        averageSentiment: 5,
        trend: "stable" as const,
        summary: `Starting your ${pillar} journey. Keep reflecting to see progress over time!`,
        weekNumber: 1,
      };
    }

    const average = sentimentHistory.reduce((a, b) => a + b, 0) / sentimentHistory.length;

    // Simple trend calculation
    const recentScores = sentimentHistory.slice(-3);
    const olderScores = sentimentHistory.slice(0, -3);
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.length > 0
      ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
      : average;

    const trend = recentAvg > olderAvg + 0.5 ? "improving"
                : recentAvg < olderAvg - 0.5 ? "declining"
                : "stable";

    return {
      averageSentiment: Math.round(average * 10) / 10,
      trend,
      summary: `Your ${pillar} score is ${trend}. Average: ${average.toFixed(1)}/10 over ${timeRange}.`,
      weekNumber: Math.ceil(sentimentHistory.length / 7),
    };
  },
});

/**
 * Baseline Assessment Tool
 * Generates quiz-like questions for initial pillar assessment
 */
export const baselineAssessmentTool = createTool({
  id: "baseline-assessment",
  description: "Generates baseline assessment questions for a pillar",
  inputSchema: z.object({
    pillar: pillarSchema.describe("Which pillar to assess"),
  }),
  outputSchema: z.object({
    questions: z.array(z.object({
      question: z.string(),
      scale: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    const { pillar } = context;

    const questionSets = {
      work: [
        { question: "On a scale of 1-10, how satisfied are you with your current work?", scale: "1 (very unsatisfied) - 10 (very satisfied)" },
        { question: "How would you rate your work-life balance?", scale: "1 (poor) - 10 (excellent)" },
        { question: "How engaged do you feel with your current projects?", scale: "1 (not engaged) - 10 (highly engaged)" },
      ],
      finances: [
        { question: "How confident do you feel about your financial situation?", scale: "1 (not confident) - 10 (very confident)" },
        { question: "How would you rate your current savings habits?", scale: "1 (poor) - 10 (excellent)" },
        { question: "How comfortable are you with your financial knowledge?", scale: "1 (uncomfortable) - 10 (very comfortable)" },
      ],
      health: [
        { question: "How would you rate your overall physical health?", scale: "1 (poor) - 10 (excellent)" },
        { question: "How consistent is your exercise routine?", scale: "1 (not consistent) - 10 (very consistent)" },
        { question: "How well do you manage stress?", scale: "1 (poorly) - 10 (very well)" },
      ],
      relationships: [
        { question: "How satisfied are you with your close relationships?", scale: "1 (unsatisfied) - 10 (very satisfied)" },
        { question: "How well do you communicate with important people in your life?", scale: "1 (poorly) - 10 (very well)" },
        { question: "How much quality time do you spend with loved ones?", scale: "1 (very little) - 10 (plenty)" },
      ],
    };

    return { questions: questionSets[pillar] };
  },
});

/**
 * Nudge Generator Tool
 * Creates personalized check-in prompts based on user activity
 */
export const nudgeGeneratorTool = createTool({
  id: "nudge-generator",
  description: "Generates personalized nudges to encourage continued reflection",
  inputSchema: z.object({
    daysSinceLastReflection: z.number().describe("Days since last entry"),
    currentPillar: pillarSchema.optional().describe("Last pillar reflected on"),
    weekNumber: z.number().optional().describe("Current week in the 12-week cycle"),
  }),
  outputSchema: z.object({
    nudge: z.string(),
    suggestedPillar: pillarSchema.optional(),
  }),
  execute: async ({ context }) => {
    const { daysSinceLastReflection, currentPillar, weekNumber = 1 } = context;

    if (daysSinceLastReflection === 0) {
      return {
        nudge: "Great job on today's reflection! See you tomorrow! 🌟",
      };
    }

    if (daysSinceLastReflection === 1) {
      return {
        nudge: "Ready for today's reflection? Just a quick check-in on how you're feeling! ✨",
        suggestedPillar: currentPillar,
      };
    }

    if (daysSinceLastReflection > 3) {
      return {
        nudge: `It's been ${daysSinceLastReflection} days! No pressure, but a quick mood check can work wonders. How are you feeling today? 💭`,
        suggestedPillar: "health" as const,
      };
    }

    return {
      nudge: `Week ${weekNumber} check-in time! What's one win you've had recently? 🎯`,
    };
  },
});

// Helper functions
function getResourceForPillar(pillar: z.infer<typeof pillarSchema>): string {
  const resources = {
    work: "Book: 'Deep Work' by Cal Newport - Focus strategies for career growth",
    finances: "Podcast: 'The Money Guy Show' - Practical financial advice",
    health: "Article: 'The Science of Better Sleep' - Sleep optimization tips",
    relationships: "Book: 'The 5 Love Languages' by Gary Chapman",
  };
  return resources[pillar];
}

function getCuratedResources(pillar: z.infer<typeof pillarSchema>, topic: string) {
  // Simplified - in production, use a real database or API
  const baseResources = {
    work: [
      { type: "book" as const, title: "Deep Work", description: "Focus in a distracted world", url: "https://example.com" },
      { type: "podcast" as const, title: "The Tim Ferriss Show", description: "Productivity and performance", url: "https://example.com" },
    ],
    finances: [
      { type: "book" as const, title: "The Psychology of Money", description: "Wealth and happiness", url: "https://example.com" },
      { type: "article" as const, title: "Budgeting 101", description: "Getting started with budgets", url: "https://example.com" },
    ],
    health: [
      { type: "book" as const, title: "Why We Sleep", description: "The science of sleep", url: "https://example.com" },
      { type: "video" as const, title: "Yoga for Beginners", description: "10-minute daily practice", url: "https://example.com" },
    ],
    relationships: [
      { type: "book" as const, title: "The 5 Love Languages", description: "Understanding love styles", url: "https://example.com" },
      { type: "podcast" as const, title: "Where Should We Begin?", description: "Relationship therapy insights", url: "https://example.com" },
    ],
  };

  return baseResources[pillar] || [];
}
