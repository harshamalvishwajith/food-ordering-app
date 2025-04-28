import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ElasticsearchModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class AppModule {}
