# TfL MCP Server Usage Examples

## How to run the server

1. **Install dependencies:**
```bash
npm install
```

2. **Test the API:**
```bash
npm test
```

3. **Run the MCP server:**
```bash
npm start
```

## MCP Client Integration

To integrate this server with an MCP client, add the following configuration to your MCP configuration file:

```json
{
  "mcpServers": {
    "tfl-journey": {
      "command": "node",
      "args": ["/path/to/mcp-tfl-journey/index.js"],
      "env": {}
    }
  }
}
```

## Query Examples

### 1. Journey from Kings Cross to Liverpool Street
```json
{
  "name": "search_journey",
  "arguments": {
    "from": "9400ZZLUKSX",
    "to": "9400ZZLULVT"
  }
}
```

### 2. Journey from Paddington to Victoria
```json
{
  "name": "search_journey",
  "arguments": {
    "from": "9400ZZLUPAD",
    "to": "9400ZZLUVIC"
  }
}
```

### 3. Journey from Waterloo to London Bridge
```json
{
  "name": "search_journey",
  "arguments": {
    "from": "9400ZZLUWLO",
    "to": "9400ZZLULBG"
  }
}
```

## Response Structure

The server returns a structured JSON object with the following information:

### Main Fields:
- `journeyFound`: Boolean indicating whether the journey was found
- `from`: Origin station code
- `to`: Destination station code
- `alerts`: Array of journey-related alerts
- `stopPoints`: Array of stop points
- `disruptions`: Array of service disruptions
- `summary`: Journey information summary

### Response Example:
```json
{
  "journeyFound": true,
  "from": "9400ZZLUKSX",
  "to": "9400ZZLULVT",
  "alerts": [],
  "stopPoints": [
    {
      "id": "9400ZZLUKSX",
      "name": "Kings Cross",
      "lat": 51.532,
      "lon": -0.123
    }
  ],
  "disruptions": [],
  "summary": {
    "totalJourneys": 4,
    "totalAlerts": 0,
    "totalDisruptions": 0,
    "totalStopPoints": 2,
    "duration": 8,
    "startDateTime": "2025-06-21T19:03:00",
    "arrivalDateTime": "2025-06-21T19:11:00"
  }
}
```

## Common Station Codes

| Code | Station Name |
|------|--------------|
| 9400ZZLUKSX | Kings Cross |
| 9400ZZLULVT | Liverpool Street |
| 9400ZZLUPAD | Paddington |
| 9400ZZLUVIC | Victoria |
| 9400ZZLUWLO | Waterloo |
| 9400ZZLULBG | London Bridge |
| 9400ZZLUOXC | Oxford Circus |
| 9400ZZLUPIC | Piccadilly Circus |

## Error Handling

The server handles the following types of errors:

1. **Missing parameters**: If `from` or `to` are not provided
2. **API error**: If the TfL API returns an error
3. **Network error**: If there are connectivity issues

All errors are returned with descriptive messages to facilitate debugging. 