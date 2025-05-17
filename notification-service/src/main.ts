import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create Kafka client manually (KafkaJS)
  const kafka = new Kafka({
    clientId: 'notification-consumer-server',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  });

  const consumer = kafka.consumer({ groupId: 'notification-group' });

  // Connect and subscribe manually
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  // Example: handle messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        key: message.key?.toString(),
        value: message.value?.toString(),
      });

      // You can also call NestJS services here manually if you want
    },
  });

  // Start the HTTP server
  await app.listen(3003);
}
bootstrap();
