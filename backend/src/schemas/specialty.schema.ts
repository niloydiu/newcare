import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ minimize: false })
export class Specialty extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  description: string;
}

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);
