import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  cuisine?: string;
  location?: string;
  phone?: string;
  isOpen: boolean;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    cuisine: { type: String },
    location: { type: String },
    phone: { type: String },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
