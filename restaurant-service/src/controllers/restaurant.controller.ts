import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRestaurants = async (_: Request, res: Response) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (restaurant) res.json(restaurant);
  else res.status(404).json({ message: "Not found" });
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (restaurant) res.json(restaurant);
  else res.status(404).json({ message: "Not found" });
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (restaurant) res.json({ message: "Deleted" });
  else res.status(404).json({ message: "Not found" });
};
