import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { ResendService } from '../utils/resend.service';
import { TwilioService } from '../utils/twilio.service';
import { FCMService } from '../utils/fcm.service';

@Module({
  providers: [NotificationService, ResendService, TwilioService, FCMService],
  exports: [NotificationService],
})
export class NotificationsModule {}
