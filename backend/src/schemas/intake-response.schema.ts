import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IntakeResponseDocument = IntakeResponse & Document;

@Schema({ timestamps: true })
export class IntakeResponse {
  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true, unique: true })
  appointmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'IntakeTemplate', required: true })
  templateId: Types.ObjectId;

  @Prop({ type: Map, of: String, required: true })
  answers: Map<string, string>;

  @Prop({ type: [String], default: [] })
  currentMedications: string[];

  @Prop({ type: [String], default: [] })
  allergies: string[];
}

export const IntakeResponseSchema = SchemaFactory.createForClass(IntakeResponse);
