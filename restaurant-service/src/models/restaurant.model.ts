import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  cuisine?: string;
  location?: string;
  phone?: string;
  isOpen: boolean;
  rating?: number;
  deliveryTime?: number;
  image?: string;
  freeDelivery?: boolean;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    cuisine: { type: String },
    location: { type: String },
    phone: { type: String },
    isOpen: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    deliveryTime: { type: Number, default: 0 },
    image: { type: String },
    freeDelivery: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
