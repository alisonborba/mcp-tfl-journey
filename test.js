import axios from "axios";

const TFL_API_KEY = process.env.TFL_API_KEY;
const TFL_BASE_URL = "https://api.tfl.gov.uk";

async function testTfLAPI() {
  try {
    console.log("Testing TfL API...");
    
    const from = "9400ZZLUKSX"; // Kings Cross
    const to = "9400ZZLULVT";   // Liverpool Street
    
    const response = await axios.get(
      `${TFL_BASE_URL}/Journey/JourneyResults/${from}/to/${to}`,
      {
        params: {
          app_key: TFL_API_KEY,
        },
      }
    );

    console.log("✅ API working!");
    console.log(`Journeys found: ${response.data.journeys ? response.data.journeys.length : 0}`);
    
    if (response.data.journeys && response.data.journeys.length > 0) {
      const firstJourney = response.data.journeys[0];
      console.log(`Duration of first journey: ${firstJourney.duration} minutes`);
      console.log(`From: ${firstJourney.startDateTime}`);
      console.log(`To: ${firstJourney.arrivalDateTime}`);
    }

    // Check alerts, stopPoints and disruptions
    console.log(`\nAlerts: ${response.data.alerts ? response.data.alerts.length : 0}`);
    console.log(`Stop points: ${response.data.stopPoints ? response.data.stopPoints.length : 0}`);
    console.log(`Disruptions: ${response.data.disruptions ? response.data.disruptions.length : 0}`);

  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

testTfLAPI(); 