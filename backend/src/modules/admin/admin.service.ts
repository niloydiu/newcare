import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { Doctor } from '../../schemas/doctor.schema';
import { User } from '../../schemas/user.schema';
import { Appointment } from '../../schemas/appointment.schema';
import { Specialty } from '../../schemas/specialty.schema';
import { Category } from '../../schemas/category.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Specialty.name) private specialtyModel: Model<Specialty>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async login(body: any) {
    const { email, password } = body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return { success: true, token };
    }
    throw new BadRequestException({ success: false, message: 'Invalid credentials' });
  }

  async addDoctor(body: any, imageFile: any) {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = body;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      throw new BadRequestException({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException({ success: false, message: 'Invalid email' });
    }

    if (password.length < 8) {
      throw new BadRequestException({
        success: false,
        message: 'Password must be atleast 8 characters',
      });
    }

    const existingDoctor = await this.doctorModel.findOne({ email });
    if (existingDoctor) {
      throw new BadRequestException({
        success: false,
        message: 'A doctor with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = '';
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      imageUrl = imageUpload.secure_url;
    }

    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience: Number(experience),
      about,
      fees: Number(fees),
      address: parsedAddress,
      date: Date.now(),
    };

    const newDoctor = new this.doctorModel(doctorData);
    await newDoctor.save();

    return { success: true, message: 'Doctor added successfully' };
  }

  async allDoctors() {
    const doctors = await this.doctorModel.find({}).select('-password');
    return { success: true, doctors };
  }

  async appointmentsAdmin() {
    const appointments = await this.appointmentModel.find({});
    return { success: true, appointments };
  }

  async cancelAppointment(body: any) {
    const { appointmentId } = body;
    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    await this.appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release doctor's slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await this.doctorModel.findById(docId);
    if (docData) {
      const slots_booked = docData.slots_booked || {};
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((time: string) => time !== slotTime);
        await this.doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    return { success: true, message: 'Appointment cancelled successfully' };
  }

  async adminDashboard() {
    const doctors = await this.doctorModel.find({});
    const users = await this.userModel.find({});
    const appointments = await this.appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    return { success: true, dashData };
  }

  async deleteDoctor(body: any) {
    const { docId } = body;
    if (!docId) {
      throw new BadRequestException({ success: false, message: 'Doctor ID is required' });
    }
    await this.doctorModel.findByIdAndDelete(docId);
    return { success: true, message: 'Doctor deleted successfully' };
  }

  async updateDoctor(body: any, imageFile: any) {
    const {
      docId,
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
    } = body;

    if (!docId) {
      throw new BadRequestException({ success: false, message: 'Doctor ID is required' });
    }

    const updateData: any = {
      name,
      email,
      speciality,
      degree,
      experience: Number(experience),
      about,
      fees: Number(fees),
      address: typeof address === 'string' ? JSON.parse(address) : address,
      available: available === 'true' || available === true,
    };

    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      updateData.image = uploadResult.secure_url;
    }

    await this.doctorModel.findByIdAndUpdate(docId, updateData);
    return { success: true, message: 'Doctor updated successfully' };
  }

  async allPatients() {
    const patients = await this.userModel.find({}).select('-password');
    return { success: true, patients };
  }

  async deletePatient(body: any) {
    const { userId } = body;
    if (!userId) {
      throw new BadRequestException({ success: false, message: 'User ID is required' });
    }
    await this.userModel.findByIdAndDelete(userId);
    await this.appointmentModel.deleteMany({ userId });
    return { success: true, message: 'Patient and their appointments deleted successfully' };
  }

  async deleteAppointment(body: any) {
    const { appointmentId } = body;
    if (!appointmentId) {
      throw new BadRequestException({ success: false, message: 'Appointment ID is required' });
    }

    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    if (!appointmentData.cancelled && !appointmentData.isCompleted) {
      const { docId, slotDate, slotTime } = appointmentData;
      const docData = await this.doctorModel.findById(docId);
      if (docData) {
        const slots_booked = docData.slots_booked || {};
        if (slots_booked[slotDate]) {
          slots_booked[slotDate] = slots_booked[slotDate].filter((time: string) => time !== slotTime);
          await this.doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }
      }
    }

    await this.appointmentModel.findByIdAndDelete(appointmentId);
    return { success: true, message: 'Appointment deleted successfully' };
  }

  async rescheduleAppointmentAdmin(body: any) {
    const { appointmentId, newSlotDate, newSlotTime } = body;
    if (!appointmentId || !newSlotDate || !newSlotTime) {
      throw new BadRequestException({ success: false, message: 'Missing required fields' });
    }

    const appointmentData = await this.appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      throw new NotFoundException({ success: false, message: 'Appointment not found' });
    }

    const { docId, slotDate: oldSlotDate, slotTime: oldSlotTime } = appointmentData;

    // Acquire new slot atomically
    const acquireQuery = {
      _id: docId,
      available: true,
      $or: [
        { [`slots_booked.${newSlotDate}`]: { $exists: false } },
        { [`slots_booked.${newSlotDate}`]: { $ne: newSlotTime } },
      ],
    };

    const acquireAction = {
      $addToSet: {
        [`slots_booked.${newSlotDate}`]: newSlotTime,
      },
    };

    const updatedDoc = await this.doctorModel.findOneAndUpdate(acquireQuery, acquireAction, { new: true });
    if (!updatedDoc) {
      throw new BadRequestException({
        success: false,
        message: 'The requested new slot is already booked or doctor is not available',
      });
    }

    // Release old slot
    const releaseAction = {
      $pull: {
        [`slots_booked.${oldSlotDate}`]: oldSlotTime,
      },
    };
    await this.doctorModel.findByIdAndUpdate(docId, releaseAction);

    // Update appointment
    await this.appointmentModel.findByIdAndUpdate(appointmentId, {
      slotDate: newSlotDate,
      slotTime: newSlotTime,
    });

    return { success: true, message: 'Appointment rescheduled successfully' };
  }

  async addSpecialty(body: any) {
    const { name, image, description } = body;
    if (!name || !image || !description) {
      return { success: false, message: 'Missing Details' };
    }
    const newSpecialty = new this.specialtyModel({ name, image, description });
    await newSpecialty.save();
    return { success: true, message: 'Specialty category added successfully' };
  }

  async allSpecialties() {
    const specialties = await this.specialtyModel.find({});
    return { success: true, specialties };
  }

  async updateSpecialty(body: any) {
    const { id, name, image, description } = body;
    await this.specialtyModel.findByIdAndUpdate(id, { name, image, description });
    return { success: true, message: 'Specialty category updated successfully' };
  }

  async deleteSpecialty(body: any) {
    const { id } = body;
    await this.specialtyModel.findByIdAndDelete(id);
    return { success: true, message: 'Specialty category deleted successfully' };
  }
}
