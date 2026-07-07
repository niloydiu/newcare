import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IntakeTemplateDocument = IntakeTemplate & Document;

@Schema({ timestamps: true })
export class IntakeTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  docId: Types.ObjectId;

  @Prop({ required: true })
  specialtyName: string;

  @Prop({
    type: [{
      label: { type: String, required: true },
      fieldType: { type: String, enum: ['text', 'textarea', 'checkbox', 'select', 'multiselect'], required: true },
      required: { type: Boolean, default: false },
      options: [String],
    }],
    required: true,
  })
  fields: Array<{
    label: string;
    fieldType: string;
    required: boolean;
    options?: string[];
  }>;
}

export const IntakeTemplateSchema = SchemaFactory.createForClass(IntakeTemplate);
