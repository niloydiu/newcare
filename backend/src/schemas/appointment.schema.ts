import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ minimize: false })
export class Appointment extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  docId: string;

  @Prop({ required: true })
  slotDate: string;

  @Prop({ required: true })
  slotTime: string;

  @Prop({ type: Object, required: true })
  userData: Record<string, any>;

  @Prop({ type: Object, required: true })
  docData: Record<string, any>;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: number;

  @Prop({ default: false })
  cancelled: boolean;

  @Prop({ default: false })
  payment: boolean;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: '' })
  review: string;

  @Prop({ default: false })
  isReviewed: boolean;

  @Prop({ type: Object, default: null })
  prescription: Record<string, any>;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
