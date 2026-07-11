import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdminService } from './admin.service';
import { AdminGuard } from '../../guards/admin.guard';
import { DoctorService } from '../doctor/doctor.service';

@Controller('api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly doctorService: DoctorService,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.adminService.login(body);
  }

  @Post('add-doctor')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async addDoctor(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.adminService.addDoctor(body, file);
  }

  @Get('all-doctors')
  @UseGuards(AdminGuard)
  async allDoctors() {
    return this.adminService.allDoctors();
  }

  @Post('change-availability')
  @UseGuards(AdminGuard)
  async changeAvailability(@Body() body: any) {
    return this.doctorService.changeAvailability(body);
  }

  @Get('appointments')
  @UseGuards(AdminGuard)
  async appointmentsAdmin() {
    return this.adminService.appointmentsAdmin();
  }

  @Post('cancel-appointment')
  @UseGuards(AdminGuard)
  async cancelAppointment(@Body() body: any) {
    return this.adminService.cancelAppointment(body);
  }

  @Get('dashboard')
  @UseGuards(AdminGuard)
  async adminDashboard() {
    return this.adminService.adminDashboard();
  }

  @Post('delete-doctor')
  @UseGuards(AdminGuard)
  async deleteDoctor(@Body() body: any) {
    return this.adminService.deleteDoctor(body);
  }

  @Post('update-doctor')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async updateDoctor(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.adminService.updateDoctor(body, file);
  }

  @Get('all-patients')
  @UseGuards(AdminGuard)
  async allPatients() {
    return this.adminService.allPatients();
  }

  @Post('delete-patient')
  @UseGuards(AdminGuard)
  async deletePatient(@Body() body: any) {
    return this.adminService.deletePatient(body);
  }

  @Post('delete-appointment')
  @UseGuards(AdminGuard)
  async deleteAppointment(@Body() body: any) {
    return this.adminService.deleteAppointment(body);
  }

  @Post('reschedule-appointment')
  @UseGuards(AdminGuard)
  async rescheduleAppointment(@Body() body: any) {
    return this.adminService.rescheduleAppointmentAdmin(body);
  }

  @Post('add-specialty')
  @UseGuards(AdminGuard)
  async addSpecialty(@Body() body: any) {
    return this.adminService.addSpecialty(body);
  }

  @Get('all-specialties')
  async allSpecialties() {
    return this.adminService.allSpecialties();
  }

  @Post('update-specialty')
  @UseGuards(AdminGuard)
  async updateSpecialty(@Body() body: any) {
    return this.adminService.updateSpecialty(body);
  }

  @Post('delete-specialty')
  @UseGuards(AdminGuard)
  async deleteSpecialty(@Body() body: any) {
    return this.adminService.deleteSpecialty(body);
  }

  @Post('add-patient')
  @UseGuards(AdminGuard)
  async addPatient(@Body() body: any) {
    return this.adminService.addPatient(body);
  }

  @Post('update-patient')
  @UseGuards(AdminGuard)
  async updatePatient(@Body() body: any) {
    return this.adminService.updatePatient(body);
  }

  @Post('add-appointment')
  @UseGuards(AdminGuard)
  async addAppointment(@Body() body: any) {
    return this.adminService.addAppointment(body);
  }
}
