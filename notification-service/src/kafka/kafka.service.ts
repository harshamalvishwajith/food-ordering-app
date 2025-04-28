import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private readonly notificationService: NotificationService) {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'notification-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'order-events',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) {
          console.error('Received message with null value');
          return;
        }
        const payload = JSON.parse(message.value.toString());
        console.log('Received event:', payload);

        await this.notificationService.processNotification(payload);
      },
    });
  }
}
