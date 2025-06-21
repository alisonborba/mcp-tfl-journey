import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

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

class TfLJourneyServer {
  constructor() {
    this.server = new Server(
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

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [searchJourneyTool],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      if (name === "search_journey") {
        return await this.searchJourney(args);
      }
      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async searchJourney(args) {
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
        alerts: this.extractAlerts(journeyData),
        stopPoints: this.extractStopPoints(journeyData),
        disruptions: this.extractDisruptions(journeyData),
        summary: this.createSummary(journeyData),
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

  extractAlerts(journeyData) {
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

  extractStopPoints(journeyData) {
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

  extractDisruptions(journeyData) {
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

  createSummary(journeyData) {
    const summary = {
      totalJourneys: journeyData.journeys ? journeyData.journeys.length : 0,
      totalAlerts: this.extractAlerts(journeyData).length,
      totalDisruptions: this.extractDisruptions(journeyData).length,
      totalStopPoints: this.extractStopPoints(journeyData).length,
    };

    if (journeyData.journeys && journeyData.journeys.length > 0) {
      const firstJourney = journeyData.journeys[0];
      summary.duration = firstJourney.duration;
      summary.startDateTime = firstJourney.startDateTime;
      summary.arrivalDateTime = firstJourney.arrivalDateTime;
    }

    return summary;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("TfL Journey MCP Server started");
  }
}

// Start the server
const server = new TfLJourneyServer();
server.run().catch(console.error); 