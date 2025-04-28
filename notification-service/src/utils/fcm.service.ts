import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FCMService {
  private readonly API_URL = 'https://fcm.googleapis.com/fcm/send';

  async sendPushNotification(token: string, title: string, body: string) {
    await axios.post(
      this.API_URL,
      {
        to: token,
        notification: {
          title,
          body,
        },
      },
      {
        headers: {
          Authorization: `key=${process.env.FCM_SERVER_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
