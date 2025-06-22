import axios from "axios";

const TFL_API_KEY = process.env.TFL_API_KEY || "6674e72d9f3d4678a3539ffbb24d5c92";
const TFL_BASE_URL = "https://api.tfl.gov.uk";

async function testTfLAPI() {
  try {
    console.log("🧪 Testing TfL API...");
    
    const response = await axios.get(
      `${TFL_BASE_URL}/Journey/JourneyResults/9400ZZLUKSX/to/9400ZZLULVT`,
      { params: { app_key: TFL_API_KEY } }
    );

    const data = response.data;
    console.log("✅ API working!");
    console.log(`Journeys: ${data.journeys?.length || 0}`);
    console.log(`Alerts: ${data.alerts?.length || 0}`);
    console.log(`Disruptions: ${data.disruptions?.length || 0}`);
    
    if (data.journeys?.[0]) {
      console.log(`Duration: ${data.journeys[0].duration} minutes`);
    }

  } catch (error) {
    console.error("❌ API Error:", error.message);
  }
}

testTfLAPI(); 