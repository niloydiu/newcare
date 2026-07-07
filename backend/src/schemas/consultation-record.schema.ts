import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationRecordDocument = ConsultationRecord & Document;

@Schema({ timestamps: true })
export class ConsultationRecord {
  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true, unique: true })
  appointmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  docId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'EHRVersion' })
  latestVersionId: Types.ObjectId;

  @Prop({
    type: [{
      versionId: { type: Types.ObjectId, ref: 'EHRVersion' },
      editedBy: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      editReason: { type: String }
    }],
    default: []
  })
  editHistory: Array<{
    versionId: Types.ObjectId;
    editedBy: string;
    timestamp: Date;
    editReason?: string;
  }>;
}

export const ConsultationRecordSchema = SchemaFactory.createForClass(ConsultationRecord);
