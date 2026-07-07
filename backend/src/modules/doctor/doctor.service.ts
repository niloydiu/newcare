import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Doctor } from '../../schemas/doctor.schema';
import { Appointment } from '../../schemas/appointment.schema';

@Injectable()
export class DoctorService {
  private readonly mockDoctors = [
    {
      _id: '1',
      name: 'Dr. Sarah Johnson',
      speciality: 'General Physician',
      fees: 50,
      experience: 10,
      available: true,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewCount: 120,
      degree: 'MD',
      address: { line1: '123 Main St', line2: 'New York, NY' },
    },
    {
      _id: '2',
      name: 'Dr. Michael Chen',
      speciality: 'Cardiologist',
      fees: 80,
      experience: 15,
      available: false,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewCount: 200,
      degree: 'MD, PhD',
      address: { line1: '456 Oak Ave', line2: 'Los Angeles, CA' },
    },
    {
      _id: '3',
      name: 'Dr. Emily Davis',
      speciality: 'Dermatologist',
      fees: 65,
      experience: 8,
      available: true,
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewCount: 90,
      degree: 'MD',
      address: { line1: '789 Pine Rd', line2: 'Chicago, IL' },
    },
  ];

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async changeAvailability(body: any) {
    const { docId } = body;
    const docData = await this.doctorModel.findById(docId);
    if (!docData) {
      throw new NotFoundException({ success: false, message: 'Doctor not found' });
    }
    await this.doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    return { success: true, message: 'Availability changed successfully' };
  }

  async doctorList() {
    const dbDoctors = await this.doctorModel.find({}).select('-password');
    if (dbDoctors.length > 0) {
      return { success: true, doctors: dbDoctors };
    }
    return { success: true, doctors: this.mockDoctors };
  }

  async login(body: any) {
    const { email, password } = body;
    const doctor = await this.doctorModel.findOne({ email });
    if (!doctor) {
      throw new BadRequestException({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      return { success: true, token };
    }
    throw new BadRequestException({ success: false, message: 'Invalid credentials' });
  }

  async appointmentsDoctor(docId: string) {
    const appointments = await this.appointmentModel.find({ docId });
    return { success: true, appointments };
  }

  async appointmentComplete(body: any, docId: string) {
    const { appointmentId } = body;
    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    if (appointmentData.docId.toString() === docId.toString()) {
      await this.appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return { success: true, message: 'Appointment marked as completed' };
    }
    throw new BadRequestException({ success: false, message: 'Invalid request' });
  }

  async appointmentCancel(body: any, docId: string) {
    const { appointmentId } = body;
    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await this.appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return { success: true, message: 'Appointment cancelled successfully' };
    }
    throw new BadRequestException({ success: false, message: 'Invalid request' });
  }

  async doctorDashboard(docId: string) {
    const appointments = await this.appointmentModel.find({ docId });
    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    const patients: string[] = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    return { success: true, dashData };
  }

  async doctorProfile(docId: string) {
    const profileData = await this.doctorModel.findById(docId).select('-password');
    if (!profileData) {
      throw new NotFoundException({ success: false, message: 'Doctor profile not found' });
    }
    return { success: true, profileData };
  }

  async updateDoctorProfile(body: any, docId: string) {
    const { fees, address, available } = body;
    await this.doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    return { success: true, message: 'Profile updated successfully' };
  }

  async getDoctorReviews(docId: string) {
    if (!docId) {
      throw new BadRequestException({ success: false, message: 'Doctor ID is required' });
    }

    const appointments = await this.appointmentModel.find({ docId, isReviewed: true });
    let totalRating = 0;
    const reviews = appointments.map((appt) => {
      totalRating += appt.rating;
      return {
        _id: appt._id,
        userName: appt.userData.name,
        userImage: appt.userData.image,
        rating: appt.rating,
        review: appt.review,
        date: appt.date,
      };
    });

    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    return {
      success: true,
      reviews,
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
    };
  }

  async submitPrescription(body: any, docId: string) {
    const { appointmentId, diagnosis, medicines, notes } = body;
    if (!appointmentId || !diagnosis || !medicines) {
      throw new BadRequestException({ success: false, message: 'Missing required fields' });
    }

    const prescription = {
      diagnosis,
      medicines: typeof medicines === 'string' ? JSON.parse(medicines) : medicines,
      notes: notes || '',
      date: Date.now(),
    };

    const updatedAppt = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      { prescription, isCompleted: true },
      { new: true },
    );

    if (!updatedAppt) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    return { success: true, message: 'Prescription submitted successfully', appointment: updatedAppt };
  }
}
