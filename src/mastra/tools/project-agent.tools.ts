import { createTool } from "@mastra/core";
import { z } from "zod";

/**
 * Project Context Tool
 * Returns current state: what's happening, what's next, what's blocked
 */
export const projectContextTool = createTool({
  id: "project-context",
  description: "Get current project state, next actions, and blockers",
  inputSchema: z.object({
    requestType: z.enum(["full", "quick", "next"]).describe("Level of detail"),
  }),
  outputSchema: z.object({
    currentState: z.string(),
    nextActions: z.array(z.string()),
    blockers: z.array(z.string()),
    lastUpdated: z.string(),
  }),
  execute: async ({ context }) => {
    // This will be populated from working memory
    // Agent maintains this through conversations
    return {
      currentState: "Retrieved from working memory",
      nextActions: ["From memory"],
      blockers: ["From memory"],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  },
});

/**
 * Log Update Tool
 * Logs what happened: progress, bugs found, decisions made, ideas
 */
export const logUpdateTool = createTool({
  id: "log-update",
  description: "Log project updates: progress, bugs, decisions, ideas",
  inputSchema: z.object({
    type: z.enum(["progress", "bug", "decision", "idea", "blocker"]).describe("Update type"),
    description: z.string().describe("What happened"),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    tags: z.array(z.string()).optional().describe("Tags for searchability"),
  }),
  outputSchema: z.object({
    logged: z.boolean(),
    summary: z.string(),
    relatedHistory: z.array(z.string()).optional(),
  }),
  execute: async ({ context }) => {
    const { type, description, priority } = context;

    const timestamp = new Date().toISOString().split('T')[0];
    const summary = `[${timestamp}] ${type.toUpperCase()}: ${description}`;

    // In production, this would search semantic memory for related items
    const relatedHistory = [];

    return {
      logged: true,
      summary,
      relatedHistory,
    };
  },
});

/**
 * Decision History Tool
 * Records why decisions were made, retrievable later
 */
export const decisionHistoryTool = createTool({
  id: "decision-history",
  description: "Log or retrieve technical/architectural decisions",
  inputSchema: z.object({
    action: z.enum(["log", "search"]).describe("Log new or search existing"),
    decision: z.string().optional().describe("The decision made"),
    reasoning: z.string().optional().describe("Why this decision"),
    alternatives: z.string().optional().describe("What was considered"),
    query: z.string().optional().describe("Search query for existing decisions"),
  }),
  outputSchema: z.object({
    result: z.string(),
    relatedDecisions: z.array(z.object({
      date: z.string(),
      decision: z.string(),
      reasoning: z.string(),
    })).optional(),
  }),
  execute: async ({ context }) => {
    const { action, decision, reasoning, query } = context;

    if (action === "log") {
      const timestamp = new Date().toISOString().split('T')[0];
      return {
        result: `Decision logged: ${decision}. Reasoning: ${reasoning}`,
      };
    } else {
      // Search mode - in production, this would query semantic memory
      return {
        result: `Searching decisions for: ${query}`,
        relatedDecisions: [],
      };
    }
  },
});

/**
 * Quick Status Tool
 * One-line summary of project health
 */
export const quickStatusTool = createTool({
  id: "quick-status",
  description: "Generate one-line project status summary",
  inputSchema: z.object({
    includeMetrics: z.boolean().default(false),
  }),
  outputSchema: z.object({
    status: z.string(),
    health: z.enum(["green", "yellow", "red"]),
    nextMilestone: z.string().optional(),
  }),
  execute: async ({ context }) => {
    // Derived from working memory
    return {
      status: "From memory: current phase, progress %",
      health: "green" as const,
      nextMilestone: "From memory",
    };
  },
});

/**
 * Search History Tool
 * Find past work: "When did we fix X?" "What was the solution for Y?"
 */
export const searchHistoryTool = createTool({
  id: "search-history",
  description: "Search past logs, decisions, bugs, ideas",
  inputSchema: z.object({
    query: z.string().describe("What to search for"),
    type: z.enum(["all", "progress", "bug", "decision", "idea"]).default("all"),
    limit: z.number().default(5),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      date: z.string(),
      type: z.string(),
      content: z.string(),
    })),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { query, type } = context;

    // In production: semantic search through all logged updates
    return {
      results: [],
      summary: `Searching ${type} history for: ${query}`,
    };
  },
});
