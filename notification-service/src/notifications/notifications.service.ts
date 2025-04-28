import { Injectable } from '@nestjs/common';
import { ResendService } from '../utils/resend.service';
import { TwilioService } from '../utils/twilio.service';
import { FCMService } from '../utils/fcm.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly resendService: ResendService,
    private readonly twilioService: TwilioService,
    private readonly fcmService: FCMService,
  ) {}

  async processNotification(payload: any) {
    const { type, email, phoneNumber, deviceToken, message } = payload;

    if (type === 'email') {
      await this.resendService.sendEmail(email, 'Notification', message);
    } else if (type === 'sms') {
      await this.twilioService.sendSMS(phoneNumber, message);
    } else if (type === 'push') {
      await this.fcmService.sendPushNotification(
        deviceToken,
        'Notification',
        message,
      );
    }
  }
}
