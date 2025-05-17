import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db";
import restaurantRoutes from "./routes/restaurant.routes";
import { connectProducer } from "./kafka/producer";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/restaurants", restaurantRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectProducer();

    const PORT = process.env.PORT || 3006;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // crash if failed (good practice)
  }
};

startServer();
