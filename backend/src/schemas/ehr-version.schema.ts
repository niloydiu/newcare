import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EHRVersionDocument = EHRVersion & Document;

@Schema({ timestamps: true })
export class EHRVersion {
  @Prop({ type: Types.ObjectId, ref: 'ConsultationRecord', required: true })
  consultationRecordId: Types.ObjectId;

  @Prop({ required: true })
  versionNumber: number;

  @Prop({ required: true })
  chiefComplaint: string;

  @Prop({ required: true })
  clinicalNotes: string;

  @Prop({
    type: [{
      code: { type: String, required: true },
      name: { type: String, required: true },
      system: { type: String, default: 'ICD-10' }
    }],
    default: []
  })
  diagnoses: Array<{
    code: string;
    name: string;
    system: string;
  }>;

  @Prop({
    type: [{
      drugName: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: String
    }],
    default: []
  })
  prescriptions: Array<{
    drugName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;

  @Prop({
    type: [{
      testName: { type: String, required: true },
      urgency: { type: String, enum: ['Routine', 'Urgent', 'Stat'], default: 'Routine' },
      notes: String
    }],
    default: []
  })
  labReferrals: Array<{
    testName: string;
    urgency: string;
    notes?: string;
  }>;
}

export const EHRVersionSchema = SchemaFactory.createForClass(EHRVersion);
