# TfL Journey MCP Server

A Model Context Protocol (MCP) server that provides journey information from Transport for London (TfL) API.

## Project Structure

The project is organized into modular files following clean code principles:

```
mcp-tfl-journey/
├── index.js          # Main MCP server configuration and entry point
├── tfl-api.js        # TfL API communication and data fetching
├── helpers.js        # Utility functions for data extraction and processing
├── package.json      # Dependencies and project configuration
└── README.md         # This file
```

### File Responsibilities

- **`index.js`**: MCP server setup, tool definitions, and request handlers
- **`tfl-api.js`**: API communication with TfL, data fetching, and response formatting
- **`helpers.js`**: Pure utility functions for extracting and processing journey data

## Features

- Search for journey information between TfL stations
- Extract alerts, disruptions, and stop points from journey data
- Provide comprehensive journey summaries
- Clean, modular, and maintainable code structure

## Installation & Usage

### Option 1: Using npx (Recommended)

Run directly without installation:

```bash
npx mcp-tfl-journey
```

### Option 2: Local Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your TfL API key as an environment variable:
   ```bash
   export TFL_API_KEY="your-api-key-here"
   ```

3. Run the server:
   ```bash
   npm start
   # or
   node index.js
   ```

## Configuration

Set your TfL API key as an environment variable:

```bash
export TFL_API_KEY="your-api-key-here"
```

You can get a free API key from [TfL Developer Portal](https://api.tfl.gov.uk/).

## Usage

The server provides a `search_journey` tool that accepts:
- `from`: Source station code (e.g., "9400ZZLUKSX")
- `to`: Destination station code (e.g., "9400ZZLULVT")

## Publishing to npm

To publish this package to npm:

1. Update the repository URL in `package.json` with your actual GitHub repository
2. Login to npm:
   ```bash
   npm login
   ```

3. Publish the package:
   ```bash
   npm publish
   ```

4. After publishing, users can run:
   ```bash
   npx mcp-tfl-journey
   ```

## Code Quality

This project follows clean code principles:
- **Single Responsibility**: Each file has a clear, focused purpose
- **Modularity**: Functions are organized by their domain and responsibility
- **Readability**: Clear naming and documentation
- **Maintainability**: Easy to test, modify, and extend individual components

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