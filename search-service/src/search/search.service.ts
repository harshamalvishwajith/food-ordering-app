import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexRestaurant(data: {
    id: string;
    name: string;
    location: string;
    tags: string[];
  }) {
    return await this.elasticsearchService.index({
      index: 'restaurants',
      id: data.id,
      document: {
        name: data.name,
        location: data.location,
        tags: data.tags,
      },
    });
  }

  async searchRestaurant(query: string) {
    const { hits } = await this.elasticsearchService.search({
      index: 'restaurants',
      query: {
        multi_match: {
          query,
          fields: ['name', 'location', 'tags'],
        },
      },
    });

    return hits.hits.map((item: any) => item._source);
  }
}
