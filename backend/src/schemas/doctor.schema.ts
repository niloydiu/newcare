import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ minimize: false })
export class Doctor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  speciality: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  about: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({ required: true })
  fees: number;

  @Prop({ type: Object, required: true })
  address: Record<string, any>;

  @Prop({ required: true })
  date: number;

  @Prop({ type: Object, default: {} })
  slots_booked: Record<string, any>;

  @Prop({ default: 'male' })
  gender: string;

  @Prop({ default: 4.5 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
