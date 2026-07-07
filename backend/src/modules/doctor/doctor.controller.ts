import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorGuard } from '../../guards/doctor.guard';

@Controller('api/doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('list')
  async doctorList() {
    return this.doctorService.doctorList();
  }

  @Post('login')
  async loginDoctor(@Body() body: any) {
    return this.doctorService.login(body);
  }

  @Get('reviews')
  async getDoctorReviews(@Query('docId') docId: string) {
    return this.doctorService.getDoctorReviews(docId);
  }

  @Get('appointments')
  @UseGuards(DoctorGuard)
  async appointmentsDoctor(@Req() req: any) {
    return this.doctorService.appointmentsDoctor(req.docId);
  }

  @Post('complete-appointment')
  @UseGuards(DoctorGuard)
  async appointmentComplete(@Body() body: any, @Req() req: any) {
    return this.doctorService.appointmentComplete(body, req.docId);
  }

  @Post('cancel-appointment')
  @UseGuards(DoctorGuard)
  async appointmentCancel(@Body() body: any, @Req() req: any) {
    return this.doctorService.appointmentCancel(body, req.docId);
  }

  @Get('dashboard')
  @UseGuards(DoctorGuard)
  async doctorDashboard(@Req() req: any) {
    return this.doctorService.doctorDashboard(req.docId);
  }

  @Get('profile')
  @UseGuards(DoctorGuard)
  async doctorProfile(@Req() req: any) {
    return this.doctorService.doctorProfile(req.docId);
  }

  @Post('update-profile')
  @UseGuards(DoctorGuard)
  async updateDoctorProfile(@Body() body: any, @Req() req: any) {
    return this.doctorService.updateDoctorProfile(body, req.docId);
  }

  @Post('submit-prescription')
  @UseGuards(DoctorGuard)
  async submitPrescription(@Body() body: any, @Req() req: any) {
    return this.doctorService.submitPrescription(body, req.docId);
  }
}
