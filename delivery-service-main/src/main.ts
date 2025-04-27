import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Replace with the frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.KAFKA,
//     options: {
//       client: {
//         clientId: 'delivery-service',
//         brokers: ['kafka:9092'], // Matches docker-compose Kafka service
//       },
//       consumer: {
//         groupId: 'delivery-consumer', // Must be unique for each service
//       },
//     },
//   });

//   app.startAllMicroservices().catch((err) => {
//     console.error('Failed to start microservices:', err);
//   });
//   await app.listen(3000);
//   console.log('Delivery Service is running on port 3000');
// }
// bootstrap();
