export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY', // The driver is currently busy with another delivery
}
export class Driver {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: DriverStatus; // Whether the driver is available for pickup or busy
}
