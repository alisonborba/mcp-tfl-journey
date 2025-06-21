# TfL Journey MCP Server

🚇 **MCP Server for Transport for London Journey API** - A Model Context Protocol server that enables AI models to access real-time journey information, alerts, and disruptions from London's transport network.

[![MCP](https://img.shields.io/badge/MCP-Protocol-blue)](https://modelcontextprotocol.io/)
[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

A simple MCP (Model Context Protocol) server that accesses the Transport for London (TfL) API to search for journey information between stations.

## Features

- Search for journey information between two TfL stations
- Focuses on extracting information about:
  - **Alerts**: Alerts and warnings about the journey
  - **StopPoints**: Journey stop points
  - **Disruptions**: Service disruptions and issues

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the server:
```bash
npm start
```

## Usage

The server exposes a tool called `search_journey` that accepts the following parameters:

- `from`: Origin station code (e.g., `9400ZZLUKSX`)
- `to`: Destination station code (e.g., `9400ZZLULVT`)

### Usage example

```json
{
  "name": "search_journey",
  "arguments": {
    "from": "9400ZZLUKSX",
    "to": "9400ZZLULVT"
  }
}
```

### Response

The server returns a JSON object with the following information:

```json
{
  "journeyFound": true,
  "from": "9400ZZLUKSX",
  "to": "9400ZZLULVT",
  "alerts": [...],
  "stopPoints": [...],
  "disruptions": [...],
  "summary": {
    "totalJourneys": 1,
    "totalAlerts": 0,
    "totalDisruptions": 0,
    "totalStopPoints": 5,
    "duration": 15,
    "startDateTime": "2024-01-01T10:00:00Z",
    "arrivalDateTime": "2024-01-01T10:15:00Z"
  }
}
```

## Configuration

The TfL API key is configured in the code. To use your own API key, modify the `TFL_API_KEY` constant in the `index.js` file.

## API Endpoint

The server uses the official TfL endpoint:
```
https://api.tfl.gov.uk/Journey/JourneyResults/{from}/to/{to}
```

## Station Codes

Some examples of station codes:
- `9400ZZLUKSX`: Kings Cross
- `9400ZZLULVT`: Liverpool Street
- `9400ZZLUPAD`: Paddington
- `9400ZZLUVIC`: Victoria

For more station codes, please refer to the official TfL API documentation. 