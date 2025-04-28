import { CreateLocationDto } from '../dto/create-location.dto';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Delivery {
  id: string;
  orderId: string;
  riderId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoordinates: CreateLocationDto;
  dropoffCoordinates: CreateLocationDto;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}
