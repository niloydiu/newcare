import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DoctorModule } from '../doctor/doctor.module';
import { Doctor, DoctorSchema } from '../../schemas/doctor.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Appointment, AppointmentSchema } from '../../schemas/appointment.schema';
import { Specialty, SpecialtySchema } from '../../schemas/specialty.schema';
import { Category, CategorySchema } from '../../schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Specialty.name, schema: SpecialtySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => DoctorModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
