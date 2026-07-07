import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { UserGuard } from '../../guards/user.guard';
import { DoctorGuard } from '../../guards/doctor.guard';

@Controller('api/consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  // Patient gets the intake template configured by the doctor
  @Get('intake-template/:docId')
  async getIntakeTemplate(@Param('docId') docId: string) {
    return this.consultationService.getTemplate(docId);
  }

  // Doctor creates/updates their intake template
  @Post('intake-template')
  @UseGuards(DoctorGuard)
  async updateIntakeTemplate(@Body() body: any, @Req() req: any) {
    const { specialtyName, fields } = body;
    return this.consultationService.createOrUpdateTemplate(req.docId, specialtyName, fields);
  }

  // Patient submits intake form answers before appointment
  @Post('intake-response')
  @UseGuards(UserGuard)
  async submitIntakeResponse(@Body() body: any, @Req() req: any) {
    const { appointmentId, templateId, answers, currentMedications, allergies } = body;
    return this.consultationService.submitResponse(
      appointmentId,
      req.userId,
      templateId,
      answers,
      currentMedications,
      allergies,
    );
  }

  // Doctor retrieves the patient's intake response for an appointment
  @Get('doctor/intake-response/:appointmentId')
  @UseGuards(DoctorGuard)
  async doctorGetIntakeResponse(@Param('appointmentId') appointmentId: string) {
    return this.consultationService.getResponse(appointmentId);
  }

  // Patient retrieves their own intake response for an appointment
  @Get('patient/intake-response/:appointmentId')
  @UseGuards(UserGuard)
  async patientGetIntakeResponse(@Param('appointmentId') appointmentId: string) {
    return this.consultationService.getResponse(appointmentId);
  }

  // Doctor saves clinical consultation notes (creates new ehr version)
  @Post('record')
  @UseGuards(DoctorGuard)
  async createOrUpdateRecord(@Body() body: any, @Req() req: any) {
    const { appointmentId, patientId, chiefComplaint, clinicalNotes, diagnoses, prescriptions, labReferrals, editReason } = body;
    const clinicalData = { chiefComplaint, clinicalNotes, diagnoses, prescriptions, labReferrals };
    return this.consultationService.createOrUpdateRecord(
      appointmentId,
      patientId,
      req.docId,
      clinicalData,
      `Doctor (ID: ${req.docId})`,
      editReason,
    );
  }

  // Doctor gets consultation history and notes for an appointment
  @Get('doctor/record/:appointmentId')
  @UseGuards(DoctorGuard)
  async doctorGetRecord(@Param('appointmentId') appointmentId: string) {
    return this.consultationService.getRecord(appointmentId);
  }

  // Patient gets consultation history and notes for an appointment
  @Get('patient/record/:appointmentId')
  @UseGuards(UserGuard)
  async patientGetRecord(@Param('appointmentId') appointmentId: string) {
    return this.consultationService.getRecord(appointmentId);
  }

  // Patient gets their complete clinical health history across all consultations
  @Get('patient-history')
  @UseGuards(UserGuard)
  async getPatientHistory(@Req() req: any) {
    return this.consultationService.getPatientHistory(req.userId);
  }
}
