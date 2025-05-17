const express = require("express");
const router = express.Router();

// Get all bookings
router.get("/bookings", (req, res) => {
  res.json({ message: "List of all bookings" });
});

// Create a new booking
router.post("/bookings", (req, res) => {
  const bookingData = req.body;
  res.json({ message: "New booking added", booking: bookingData });
});

// Export the router
module.exports = router;
