import { Injectable } from '@nestjs/common';
import { Delivery, DeliveryStatus } from './entities/delivery.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { DriverStatus } from '../drivers/entities/driver.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeliveryService {
  private deliveries: Delivery[] = [];
  private drivers: Driver[] = [];

  create(createDeliveryDto: CreateDeliveryDto): Delivery {
    const newDelivery: Delivery = {
      id: uuidv4(),
      orderId: createDeliveryDto.orderId,
      pickupLocation: createDeliveryDto.pickupLocation,
      dropoffLocation: createDeliveryDto.dropoffLocation,
      status: DeliveryStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.deliveries.push(newDelivery);
    return newDelivery;
  }

  findAll(): Delivery[] {
    return this.deliveries;
  }

  findOne(id: string): Delivery {
    return this.deliveries.find((delivery) => delivery.id === id);
  }

  updateStatus(
    id: string,
    updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ): Delivery {
    const delivery = this.findOne(id);
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    delivery.status = updateDeliveryStatusDto.status;
    delivery.updatedAt = new Date();
    return delivery;
  }

  findNearbyDrivers(id: string, maxDistance: number): Driver[] {
    const delivery = this.findOne(id);
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    return this.drivers.filter((driver) => {
      const distance = this.calculateDistance(
        delivery.pickupLocation,
        driver.latitude,
        driver.longitude,
      );
      return (
        distance <= maxDistance && driver.status === DriverStatus.AVAILABLE
      );
    });
  }
  private calculateDistance(
    pickupLocation: string,
    driverLatitude: number,
    driverLongitude: number,
  ): number {
    // Implement a simple distance calculation (e.g., Haversine formula) based on pickupLocation and driver's coordinates
    // For simplicity, let's assume pickupLocation is a string with "latitude,longitude" format
    const [pickupLatitude, pickupLongitude] = pickupLocation
      .split(',')
      .map(Number);
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degreesToRadians(driverLatitude - pickupLatitude);
    const dLon = this.degreesToRadians(driverLongitude - pickupLongitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(pickupLatitude)) *
        Math.cos(this.degreesToRadians(driverLatitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

// TODO: Publish 'DeliveryCreated' event to Kafka
