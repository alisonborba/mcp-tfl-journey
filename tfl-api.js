import axios from "axios";
import { extractAlerts, extractStopPoints, extractDisruptions, createSummary } from "./helpers.js";

const TFL_API_KEY = process.env.TFL_API_KEY;
const TFL_BASE_URL = "https://api.tfl.gov.uk";

/**
 * Search for journey information between two TfL stations
 * @param {Object} args - Arguments containing from and to station codes
 * @param {string} args.from - From station code (e.g., 9400ZZLUKSX)
 * @param {string} args.to - To station code (e.g., 9400ZZLULVT)
 * @returns {Object} Processed journey data with alerts, stop points, and disruptions
 */
export async function searchJourney(args) {
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