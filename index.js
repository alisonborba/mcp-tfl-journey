import axios from "axios";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const TFL_API_KEY = process.env.TFL_API_KEY;
const TFL_BASE_URL = "https://api.tfl.gov.uk";

const searchJourneyTool = {
  name: "search_journey",
  description: "Search for journey information between two TfL stations",
  inputSchema: {
    type: "object",
    properties: {
      from: {
        type: "string",
        description: "From station code (e.g., 9400ZZLUKSX)",
      },
      to: {
        type: "string",
        description: "To station code (e.g., 9400ZZLULVT)",
      },
    },
    required: ["from", "to"],
  },
};

function extractAlerts(journeyData) {
  const alerts = [];
  
  if (journeyData.alerts) {
    alerts.push(...journeyData.alerts);
  }

  // Check for alerts in journey legs
  if (journeyData.journeys) {
    journeyData.journeys.forEach(journey => {
      if (journey.legs) {
        journey.legs.forEach(leg => {
          if (leg.alerts) {
            alerts.push(...leg.alerts);
          }
        });
      }
    });
  }

  return alerts;
}

function extractStopPoints(journeyData) {
  const stopPoints = [];
  
  if (journeyData.stopPoints) {
    stopPoints.push(...journeyData.stopPoints);
  }

  // Extract stop points from journey legs
  if (journeyData.journeys) {
    journeyData.journeys.forEach(journey => {
      if (journey.legs) {
        journey.legs.forEach(leg => {
          if (leg.departurePoint) {
            stopPoints.push(leg.departurePoint);
          }
          if (leg.arrivalPoint) {
            stopPoints.push(leg.arrivalPoint);
          }
          if (leg.path && leg.path.stopPoints) {
            stopPoints.push(...leg.path.stopPoints);
          }
        });
      }
    });
  }

  return stopPoints;
}

function extractDisruptions(journeyData) {
  const disruptions = [];
  
  if (journeyData.disruptions) {
    disruptions.push(...journeyData.disruptions);
  }

  // Check for disruptions in journey legs
  if (journeyData.journeys) {
    journeyData.journeys.forEach(journey => {
      if (journey.legs) {
        journey.legs.forEach(leg => {
          if (leg.disruptions) {
            disruptions.push(...leg.disruptions);
          }
        });
      }
    });
  }

  return disruptions;
}

function createSummary(journeyData) {
  const summary = {
    totalJourneys: journeyData.journeys ? journeyData.journeys.length : 0,
    totalAlerts: extractAlerts(journeyData).length,
    totalDisruptions: extractDisruptions(journeyData).length,
    totalStopPoints: extractStopPoints(journeyData).length,
  };

  if (journeyData.journeys && journeyData.journeys.length > 0) {
    const firstJourney = journeyData.journeys[0];
    summary.duration = firstJourney.duration;
    summary.startDateTime = firstJourney.startDateTime;
    summary.arrivalDateTime = firstJourney.arrivalDateTime;
  }

  return summary;
}

async function searchJourney(args) {
  const { from, to } = args;

  if (!from || !to) {
    throw new Error("Both 'from' and 'to' parameters are required");
  }

  try {
    const response = await axios.get(
      `${TFL_BASE_URL}/Journey/JourneyResults/${from}/to/${to}`,
      {
        params: {
          app_key: TFL_API_KEY,
        },
      }
    );

    const journeyData = response.data;
    
    // Extract relevant information focusing on alerts, StopPoint, and Disruption
    const result = {
      journeyFound: true,
      from: from,
      to: to,
      alerts: extractAlerts(journeyData),
      stopPoints: extractStopPoints(journeyData),
      disruptions: extractDisruptions(journeyData),
      summary: createSummary(journeyData),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching journey data:", error.message);
    throw new Error(`Failed to fetch journey data: ${error.message}`);
  }
}

async function handleListTools() {
  return {
    tools: [searchJourneyTool],
  };
}

async function handleCallTool(request) {
  const { name, arguments: args } = request.params;
  if (name === "search_journey") {
    return await searchJourney(args);
  }
  throw new Error(`Unknown tool: ${name}`);
}

async function runServer() {
  const server = new Server(
    {
      name: "tfl-journey-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, handleListTools);
  server.setRequestHandler(CallToolRequestSchema, handleCallTool);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TfL Journey MCP Server started");
}

// Start the server
runServer().catch(console.error); 