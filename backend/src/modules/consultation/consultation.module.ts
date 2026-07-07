import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { IntakeTemplate, IntakeTemplateSchema } from '../../schemas/intake-template.schema';
import { IntakeResponse, IntakeResponseSchema } from '../../schemas/intake-response.schema';
import { ConsultationRecord, ConsultationRecordSchema } from '../../schemas/consultation-record.schema';
import { EHRVersion, EHRVersionSchema } from '../../schemas/ehr-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IntakeTemplate.name, schema: IntakeTemplateSchema },
      { name: IntakeResponse.name, schema: IntakeResponseSchema },
      { name: ConsultationRecord.name, schema: ConsultationRecordSchema },
      { name: EHRVersion.name, schema: EHRVersionSchema },
    ]),
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService],
  exports: [ConsultationService],
})
export class ConsultationModule {}
