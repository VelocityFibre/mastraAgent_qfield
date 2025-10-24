import { createTool } from "@mastra/core";
import { z } from "zod";

// Schema for agent specifications collected from user
const agentSpecSchema = z.object({
  name: z.string().describe("The name of the agent (e.g., 'financial-advisor', 'customer-support')"),
  displayName: z.string().describe("Human-readable name (e.g., 'Financial Advisor Agent')"),
  goal: z.string().describe("What is the primary goal of this agent?"),
  capabilities: z.array(z.string()).describe("List of capabilities the agent should have"),
  domain: z.string().describe("The domain or field this agent specializes in"),
  modelProvider: z.string().default("openai").describe("AI model provider (openai, anthropic, etc.)"),
  modelName: z.string().default("gpt-4o").describe("Specific model to use"),
  includeWorkflow: z.boolean().default(false).describe("Whether to generate a workflow alongside the agent"),
  includeEvals: z.boolean().default(false).describe("Whether to generate evaluation scorers"),
});

export const collectAgentSpecsTool = createTool({
  id: "collect-agent-specs",
  description: "Collect specifications for a new agent by storing user responses about the agent's purpose, capabilities, and configuration",
  inputSchema: agentSpecSchema,
  outputSchema: z.object({
    success: z.boolean(),
    specs: agentSpecSchema,
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const specs = context;

    return {
      success: true,
      specs,
      message: `Agent specifications collected successfully for '${specs.displayName}'`,
    };
  },
});

// Tool to generate the actual agent code file
export const generateAgentFileTool = createTool({
  id: "generate-agent-file",
  description: "Generate the TypeScript code for a new Mastra agent based on collected specifications",
  inputSchema: z.object({
    specs: agentSpecSchema,
  }),
  outputSchema: z.object({
    success: z.boolean(),
    code: z.string(),
    filename: z.string(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { specs } = context;

    // Generate system prompt based on specs
    const systemPrompt = generateSystemPrompt(specs);

    // Generate agent code
    const code = generateAgentCode(specs, systemPrompt);

    const filename = `${specs.name}.agent.ts`;

    return {
      success: true,
      code,
      filename,
      message: `Generated agent code for ${specs.displayName}. Save this to src/mastra/agents/${filename}`,
    };
  },
});

function generateSystemPrompt(specs: z.infer<typeof agentSpecSchema>): string {
  return `# Role
You are ${specs.displayName}, a specialized AI agent focused on ${specs.domain}.

# Goal
${specs.goal}

# Core Capabilities
${specs.capabilities.map((cap, i) => `${i + 1}. ${cap}`).join('\n')}

# Guidelines
- Stay focused on your domain of expertise: ${specs.domain}
- Always prioritize accuracy and helpfulness
- When uncertain, acknowledge limitations and suggest alternatives
- Use your capabilities to provide comprehensive solutions

# Response Style
- Be concise but thorough
- Provide actionable insights
- Use clear, professional language`;
}

function generateAgentCode(
  specs: z.infer<typeof agentSpecSchema>,
  systemPrompt: string
): string {
  const suggestedTools = getSuggestedTools(specs.domain, specs.capabilities);

  return `import { Agent } from "@mastra/core";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
${suggestedTools.imports}

/**
 * ${specs.displayName}
 *
 * Goal: ${specs.goal}
 * Domain: ${specs.domain}
 *
 * Suggested Tools:
${suggestedTools.suggestions.map(s => ` * - ${s}`).join('\n')}
 */
export const ${toCamelCase(specs.name)}Agent = new Agent({
  name: "${specs.name}",
  instructions: \`${systemPrompt}\`,
  model: "${specs.modelProvider}/${specs.modelName}",

  // Suggested tools for ${specs.domain}
  // Uncomment and implement the tools you need:
  ${suggestedTools.toolsCode}

  // Memory: Enabled by default with conversation history and working memory
  memory: new Memory({
    storage: new LibSQLStore({
      url: process.env.DATABASE_URL || 'file:../mastra.db',
    }),
    options: {
      lastMessages: 20, // Keep last 20 messages
      workingMemory: {
        enabled: true,
        scope: 'resource',
        template: \`# ${specs.displayName} Session
- User Context:
- Current Task:
- Key Information:
- Session Goals:\`,
      },
    },
  }),
});
`;
}

function getSuggestedTools(domain: string, capabilities: string[]): {
  imports: string;
  suggestions: string[];
  toolsCode: string;
} {
  const domainLower = domain.toLowerCase();
  const capabilitiesStr = capabilities.join(' ').toLowerCase();

  const suggestions: string[] = [];
  let imports = "// import { createTool } from '@mastra/core';";
  let toolsCode = "// tools: {\n  //   ";

  // Analyze domain and suggest relevant tools
  if (domainLower.includes('customer') || domainLower.includes('support')) {
    suggestions.push('Ticket creation and tracking');
    suggestions.push('Knowledge base search');
    suggestions.push('Sentiment analysis');
    toolsCode += "// ticketManager: createTicketTool(),\n  //   // knowledgeBaseSearch: createSearchTool(),";
  } else if (domainLower.includes('financial') || domainLower.includes('finance')) {
    suggestions.push('Transaction analysis');
    suggestions.push('Budget calculations');
    suggestions.push('Market data retrieval');
    toolsCode += "// transactionAnalyzer: createTransactionTool(),\n  //   // budgetCalculator: createBudgetTool(),";
  } else if (domainLower.includes('data') || capabilitiesStr.includes('analysis')) {
    suggestions.push('Data processing and transformation');
    suggestions.push('Statistical analysis');
    suggestions.push('Visualization generation');
    toolsCode += "// dataProcessor: createDataTool(),\n  //   // statsAnalyzer: createStatsTool(),";
  } else if (domainLower.includes('code') || domainLower.includes('programming')) {
    suggestions.push('Code execution');
    suggestions.push('Syntax validation');
    suggestions.push('Documentation search');
    toolsCode += "// codeExecutor: createCodeTool(),\n  //   // docSearch: createSearchTool(),";
  } else if (domainLower.includes('email') || domainLower.includes('communication')) {
    suggestions.push('Email sending');
    suggestions.push('Template management');
    suggestions.push('Contact lookup');
    toolsCode += "// emailSender: createEmailTool(),\n  //   // contactLookup: createContactTool(),";
  } else {
    suggestions.push('Web search for information retrieval');
    suggestions.push('API integration for external data');
    suggestions.push('File processing (read/write/parse)');
    toolsCode += "// webSearch: createSearchTool(),\n  //   // fileProcessor: createFileTool(),";
  }

  toolsCode += "\n  // },";

  return { imports, suggestions, toolsCode };
}

function toCamelCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}
