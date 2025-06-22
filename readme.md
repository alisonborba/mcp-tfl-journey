# TFL Journey MCP Server

🚇 A Model Context Protocol (MCP) server for Transport for London journey data. Get real-time routes, alerts, and disruptions via AI assistants like Claude.

## Quick Start

```bash
# Demo mode (limited requests)
TFL_API_KEY="6674e72d9f3d4678a3539ffbb24d5c92" npx mcp-tfl-journey

# With your own API key
TFL_API_KEY="your-api-key" npx mcp-tfl-journey
```

**Get your free API key**: https://api-portal.tfl.gov.uk/signup

## Claude Configuration

Add to your Claude MCP config:

```json
{
  "mcpServers": {
    "tfl-journey": {
      "command": "npx",
      "args": ["mcp-tfl-journey"],
      "env": {
        "TFL_API_KEY": "6674e72d9f3d4678a3539ffbb24d5c92"
      }
    }
  }
}
```

## Features

- 🔍 **Journey Search**: Find routes between TFL stations
- 🚨 **Real-time Alerts**: Get service alerts and disruptions
- 📍 **Stop Points**: Detailed station information
- 📊 **Journey Summaries**: Duration, timing, and statistics

## Usage

The `search_journey` tool accepts:
- `from`: Source station code (e.g., "9400ZZLUKSX" for Kings Cross)
- `to`: Destination station code (e.g., "9400ZZLULVT" for Liverpool Street)

## Local Development

```bash
npm install
export TFL_API_KEY="your-api-key"
npm start
```

## Station Codes

| Code | Station |
|------|---------|
| 9400ZZLUKSX | Kings Cross |
| 9400ZZLULVT | Liverpool Street |
| 9400ZZLUPAD | Paddington |
| 9400ZZLUVIC | Victoria |
