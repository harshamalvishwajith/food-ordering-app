import { Injectable } from '@nestjs/common';
import { Delivery, DeliveryStatus } from './entities/delivery.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { DriverStatus } from '../drivers/entities/driver.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class DeliveryService {
  private deliveries: Delivery[] = [];
  private drivers: Driver[] = [];

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    // Geocode the dropoff location using OpenCage API

    const pickupCoordinates = await this.fetchLocation(
      createDeliveryDto.pickupLocation,
    );
    const dropoffCoordinates = await this.fetchLocation(
      createDeliveryDto.dropoffLocation,
    );
    console.log('Pickup Coordinates:', Promise.resolve(pickupCoordinates));
    console.log('Dropoff Coordinates:', dropoffCoordinates);
    if (!pickupCoordinates || !dropoffCoordinates) {
      throw new Error('Invalid pickup or dropoff location');
    }
    const newDelivery: Delivery = {
      id: uuidv4(),
      orderId: createDeliveryDto.orderId,
      pickupLocation: createDeliveryDto.pickupLocation,
      dropoffLocation: createDeliveryDto.dropoffLocation,
      pickupCoordinates: pickupCoordinates,
      dropoffCoordinates: dropoffCoordinates,
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
  acceptDelivery(id: string): Delivery {
    const delivery = this.findOne(id);
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    if (delivery.status !== DeliveryStatus.PENDING) {
      throw new Error('Delivery is not in a state to be accepted');
    }
    delivery.status = DeliveryStatus.ASSIGNED;
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

  async fetchLocation(location: string): Promise<CreateLocationDto> {
    const apiKey = process.env.GEO_LOCATION_API_KEY; // Replace with your OpenCage API key
    if (!apiKey) {
      console.error('OpenCage API key is not set');
      return { latitude: 0, longitude: 0, address: '' };
    }
    try {
      const geocodeResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          location,
        )}&key=${apiKey}`,
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results.length === 0) {
        console.error('No location found for the address');
        return { latitude: 0, longitude: 0, address: '' };
      }

      const { lat, lng } = geocodeData.results[0].geometry;
      return {
        latitude: lat,
        longitude: lng,
        address: geocodeData.results[0].formatted,
      };
    } catch (error) {
      console.error('Error fetching geocode data:', error);
      return { latitude: 0, longitude: 0, address: '' };
    }
  }
}

// TODO: Publish 'DeliveryCreated' event to Kafka
