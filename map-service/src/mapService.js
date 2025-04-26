const axios = require("axios");
const dotenv = require("dotenv");

async function getRoute(startLat, startLng, endLat, endLng) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${apiKey}`;

  const response = await axios.get(url);
  return response.data;
}

module.exports = { getRoute };
