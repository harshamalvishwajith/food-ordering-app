import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  phone?: string;

  @Prop({ enum: ['customer', 'restaurant', 'admin'], default: 'customer' })
  role: string;

  @Prop([
    {
      street: String,
      city: String,
      zip: String,
      isDefault: Boolean,
    },
  ])
  addresses?: any[];

  @Prop([String])
  favorites?: string[];

  @Prop([String])
  orderHistory?: string[];

  @Prop()
  restaurantId?: string;

  @Prop({ default: false })
  verified?: boolean;

  @Prop()
  resetToken?: string;

  @Prop()
  tokenExpiry?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
