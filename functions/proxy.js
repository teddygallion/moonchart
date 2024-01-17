// proxy.js

// Import required modules
import fetch from "node-fetch";

// Main function for the Netlify serverless function
export async function handler(event, context) {
  // Parse the query parameters from the request
  const { date, nump } = event.queryStringParameters;

  try {
    // Make the API call to fetch moon phases
    const moonPhases = await fetchMoonPhases(date, nump);

    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify(moonPhases),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error fetching moon phases:", error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}

// Function to fetch moon phases
async function fetchMoonPhases(date, nump) {
  const apiUrl = `https://aa.usno.navy.mil/api/moon/phases/date?date=${date}&nump=${nump}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}
