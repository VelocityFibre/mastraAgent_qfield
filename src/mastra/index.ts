
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { agentBuilderAgent } from './agents/agent-builder.agent';
import { diaryGuideAgent } from './agents/diary-guide.agent';
import { ldpCompassAgent } from './agents/ldp-compass.agent';
import { FF } from './agents/project-a.agent';
import { qfieldAssistantAgent } from './agents/qfield-assistant.agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';

// Deploy mode: show only QField agent (set DEPLOY_MODE=qfield for Railway)
const deployMode = process.env.DEPLOY_MODE;

const allAgents = {
  weatherAgent,
  agentBuilderAgent,
  diaryGuideAgent,
  ldpCompassAgent,
  FF, // Unified FibreFlow agent - select model in UI
  qfieldAssistantAgent, // QField and QGIS expert assistant
};

const qfieldOnly = {
  qfieldAssistantAgent, // QField and QGIS expert assistant
};

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: deployMode === 'qfield' ? qfieldOnly : allAgents,
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
});
