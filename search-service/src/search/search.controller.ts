import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('index')
  async indexRestaurant(
    @Body()
    data: {
      id: string;
      name: string;
      location: string;
      tags: string[];
    },
  ) {
    return await this.searchService.indexRestaurant(data);
  }

  @Get()
  async searchRestaurant(@Query('q') query: string) {
    return await this.searchService.searchRestaurant(query);
  }
}
