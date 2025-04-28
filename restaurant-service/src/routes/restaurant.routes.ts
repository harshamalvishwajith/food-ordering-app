import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller";
import { sendMessage } from "../kafka/producer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const restaurant = await createRestaurant(req, res);
    await sendMessage("restaurant-events", {
      eventType: "restaurant.created",
      data: restaurant,
    });
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", getAllRestaurants);

router.get("/:id", getRestaurantById);

router.put("/:id", async (req, res) => {
  try {
    const updatedRestaurant = await updateRestaurant(req, res);
    await sendMessage("restaurant-events", {
      eventType: "restaurant.updated",
      data: updatedRestaurant,
    });
  } catch (error) {
    console.error("Failed to update restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedRestaurant = await deleteRestaurant(req, res);
    await sendMessage("restaurant-events", {
      eventType: "restaurant.deleted",
      data: deletedRestaurant,
    });
  } catch (error) {
    console.error("Failed to delete restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
