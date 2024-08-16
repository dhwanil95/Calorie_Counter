import axios from "axios";

// Use a CORS proxy
const CORS_PROXY = "https://api.allorigins.win/get?url=";
const API_BASE_URL = "https://www.fruityvice.com";

// getFruits function with Async/Await and Error handling
export const getFruits = async () => {
  try {
    // Make the API request using the URL
    const response = await axios.get(
      `${CORS_PROXY}${encodeURIComponent(API_BASE_URL)}/api/fruit/all`
    );

    // Parse the contents
    const fruitsData = JSON.parse(response.data.contents);

    return fruitsData;
  } catch (err) {
    console.log("An Error Occurred while getting fruits data: ", err);
    throw new Error("Could not fetch fruits. Try Again.");
  }
};
