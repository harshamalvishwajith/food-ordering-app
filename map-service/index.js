const express = require("express");
const dotenv = require("dotenv");
const mapService = require("./src/mapService");

dotenv.config();

const app = express();
const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Map Service running on http://localhost:${PORT}`);
});
