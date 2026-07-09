import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IntakeTemplate, IntakeTemplateDocument } from '../../schemas/intake-template.schema';
import { IntakeResponse, IntakeResponseDocument } from '../../schemas/intake-response.schema';
import { ConsultationRecord, ConsultationRecordDocument } from '../../schemas/consultation-record.schema';
import { EHRVersion, EHRVersionDocument } from '../../schemas/ehr-version.schema';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(IntakeTemplate.name) private intakeTemplateModel: Model<IntakeTemplateDocument>,
    @InjectModel(IntakeResponse.name) private intakeResponseModel: Model<IntakeResponseDocument>,
    @InjectModel(ConsultationRecord.name) private consultationRecordModel: Model<ConsultationRecordDocument>,
    @InjectModel(EHRVersion.name) private ehrVersionModel: Model<EHRVersionDocument>,
  ) {}

  async getTemplate(docId: string) {
    const template = await this.intakeTemplateModel.findOne({ docId: new Types.ObjectId(docId) });
    if (!template) {
      return { success: true, template: null };
    }
    return { success: true, template };
  }

  async createOrUpdateTemplate(docId: string, specialtyName: string, fields: any[]) {
    if (!specialtyName || !fields || !Array.isArray(fields)) {
      throw new BadRequestException({ success: false, message: 'Invalid template structure' });
    }

    let template = await this.intakeTemplateModel.findOne({ docId: new Types.ObjectId(docId) });
    if (template) {
      template.specialtyName = specialtyName;
      template.fields = fields;
      await template.save();
    } else {
      template = new this.intakeTemplateModel({
        docId: new Types.ObjectId(docId),
        specialtyName,
        fields,
      });
      await template.save();
    }
    return { success: true, message: 'Intake template updated successfully', template };
  }

  async submitResponse(appointmentId: string, patientId: string, templateId: string, answers: any, currentMedications: string[], allergies: string[]) {
    if (!appointmentId || !patientId || !templateId || !answers) {
      throw new BadRequestException({ success: false, message: 'Missing required response fields' });
    }

    const existingResponse = await this.intakeResponseModel.findOne({ appointmentId: new Types.ObjectId(appointmentId) });
    if (existingResponse) {
      throw new BadRequestException({ success: false, message: 'Intake response already submitted for this appointment' });
    }

    const response = new this.intakeResponseModel({
      appointmentId: new Types.ObjectId(appointmentId),
      patientId: new Types.ObjectId(patientId),
      templateId: new Types.ObjectId(templateId),
      answers,
      currentMedications: currentMedications || [],
      allergies: allergies || [],
    });

    await response.save();
    return { success: true, message: 'Intake response submitted successfully', response };
  }

  async getResponse(appointmentId: string) {
    const response = await this.intakeResponseModel.findOne({ appointmentId: new Types.ObjectId(appointmentId) })
      .populate('templateId');
    if (!response) {
      throw new NotFoundException({ success: false, message: 'Intake response not found' });
    }
    return { success: true, response };
  }

  async createOrUpdateRecord(appointmentId: string, patientId: string, docId: string, clinicalData: any, editedBy: string, editReason?: string) {
    const { chiefComplaint, clinicalNotes, diagnoses, prescriptions, labReferrals } = clinicalData;

    if (!appointmentId || !patientId || !docId || !chiefComplaint || !clinicalNotes) {
      throw new BadRequestException({ success: false, message: 'Missing required clinical fields' });
    }

    let record = await this.consultationRecordModel.findOne({ appointmentId: new Types.ObjectId(appointmentId) });
    let nextVersionNumber = 1;

    if (!record) {
      record = new this.consultationRecordModel({
        appointmentId: new Types.ObjectId(appointmentId),
        patientId: new Types.ObjectId(patientId),
        docId: new Types.ObjectId(docId),
      });
      await record.save();
    } else {
      // Find the last version number
      const latestVersion = await this.ehrVersionModel.findById(record.latestVersionId);
      if (latestVersion) {
        nextVersionNumber = latestVersion.versionNumber + 1;
      }
    }

    const newVersion = new this.ehrVersionModel({
      consultationRecordId: record._id,
      versionNumber: nextVersionNumber,
      chiefComplaint,
      clinicalNotes,
      diagnoses: diagnoses || [],
      prescriptions: prescriptions || [],
      labReferrals: labReferrals || [],
    });
    await newVersion.save();

    record.latestVersionId = newVersion._id;
    record.editHistory.push({
      versionId: newVersion._id as Types.ObjectId,
      editedBy,
      timestamp: new Date(),
      editReason: editReason || `Version ${nextVersionNumber} saved`,
    });

    await record.save();
    return { success: true, message: 'Clinical consultation note saved successfully', version: newVersion };
  }

  async getRecord(appointmentId: string) {
    const record = await this.consultationRecordModel.findOne({ appointmentId: new Types.ObjectId(appointmentId) })
      .populate('latestVersionId');

    if (!record) {
      return { success: true, record: null, history: [] };
    }

    const history = await this.ehrVersionModel.find({ consultationRecordId: record._id })
      .sort({ versionNumber: -1 });

    return { success: true, record, history };
  }

  async getPatientHistory(patientId: string) {
    const records = await this.consultationRecordModel.find({ patientId: new Types.ObjectId(patientId) })
      .populate('latestVersionId')
      .populate('docId', 'name speciality image');
    return { success: true, records };
  }
}
