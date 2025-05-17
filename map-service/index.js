const express = require("express");
const dotenv = require("dotenv");
const mapService = require("./src/mapService");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3002;

app.get("/route", async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;
  if (!startLat || !startLng || !endLat || !endLng) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const result = await mapService.getRoute(
      startLat,
      startLng,
      endLat,
      endLng
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

app.post("/navigate", async (req, res) => {
  const { pickup, drop } = req.body;

  if (!pickup || !drop) {
    return res
      .status(400)
      .json({ message: "Pickup and Drop locations are required" });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: `${pickup.lat},${pickup.lng}`,
          destination: `${drop.lat},${drop.lng}`,
          key: apiKey,
        },
      }
    );

    const data = response.data;

    if (data.status !== "OK") {
      return res.status(400).json({
        message: "Failed to fetch directions",
        details: data.error_message,
      });
    }

    const route = data.routes[0];

    const distance = route.legs[0].distance.text;
    const duration = route.legs[0].duration.text;
    const polyline = route.overview_polyline.points;

    const steps = route.legs[0].steps.map((step) =>
      step.html_instructions.replace(/<[^>]+>/g, "")
    );

    res.json({
      distance,
      duration,
      polyline,
      steps,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Map Service running on http://localhost:${PORT}`);
});
