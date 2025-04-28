import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Create a new review
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  // Get all reviews for a specific restaurant
  @Get('restaurant/:restaurantId')
  async getReviewsForRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reviewService.getReviewsByRestaurant(restaurantId);
  }

  // Update a review
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  // Delete a review
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }
}
