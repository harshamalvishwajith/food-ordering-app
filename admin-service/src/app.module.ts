import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb',
    ),
    AdminModule,
  ],
})
export class AppModule {}
