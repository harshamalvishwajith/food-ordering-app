import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  // Create a new review
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const newReview = new this.reviewModel(createReviewDto);
    return newReview.save();
  }

  // Get all reviews for a specific restaurant
  async getReviewsByRestaurant(restaurantId: string): Promise<Review[]> {
    return this.reviewModel.find({ restaurantId }).exec();
  }

  // Update a review
  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      {
        new: true,
      },
    );

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }

    return updatedReview;
  }

  // Delete a review
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.reviewModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }

    return { deleted: true };
  }
}
