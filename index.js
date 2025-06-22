import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchJourney } from "./tfl-api.js";

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