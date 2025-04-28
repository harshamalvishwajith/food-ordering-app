import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { Delivery } from './entities/delivery.entity';
import { Driver } from '../drivers/entities/driver.entity';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async create(
    @Body() createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    return await this.deliveryService.create(createDeliveryDto);
  }

  @Get()
  findAll(): Delivery[] {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Delivery {
    return this.deliveryService.findOne(id);
  }
  @Patch(':id/accept')
  async acceptDelivery(@Param('id') id: string): Promise<Delivery> {
    return this.deliveryService.acceptDelivery(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDeliveryStatusDto,
  ): Delivery {
    return this.deliveryService.updateStatus(id, updateStatusDto);
  }

  //get nearby drivers for a delivery
  @Get(':id/drivers')
  findNearbyDrivers(
    @Param('id') id: string,
    @Param('maxDistance') maxDistance: number,
  ): Driver[] {
    return this.deliveryService.findNearbyDrivers(id, maxDistance);
  }
}
