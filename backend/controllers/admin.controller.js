import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import validator from "validator";
import appointmentModel from "../models/appointment.model.js";
import doctorModel from "../models/doctor.model.js";
import userModel from "../models/user.model.js";

// API for adding doctor by admin
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
      date,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add-doctor
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
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // validating password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 8 characters",
      });
    }
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this email already exists",
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res
      .status(200)
      .json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this email already exists",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin pannel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all appointment list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};

// API to cancel appointment by admin
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Releasing doctor's slot for booking
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId).select("-password");
    let slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to get dashboard data to admin pannel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete doctor by admin
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }
    await doctorModel.findByIdAndDelete(docId);
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update doctor details by admin
const updateDoctor = async (req, res) => {
  try {
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
    } = req.body;
    const imageFile = req.file;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const updateData = {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: typeof address === "string" ? JSON.parse(address) : address,
      available: available === "true" || available === true,
    };

    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = uploadResult.secure_url;
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);
    res.json({ success: true, message: "Doctor updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all patients list for admin pannel
const allPatients = async (req, res) => {
  try {
    const patients = await userModel.find({}).select("-password");
    res.json({ success: true, patients });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete patient account by admin
const deletePatient = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    await userModel.findByIdAndDelete(userId);
    // Delete all appointments booked by this patient
    await appointmentModel.deleteMany({ userId });
    res.json({ success: true, message: "Patient and their appointments deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete appointment by admin
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Release slot if appointment was not cancelled/completed
    if (!appointmentData.cancelled && !appointmentData.isCompleted) {
      const { docId, slotDate, slotTime } = appointmentData;
      const docData = await doctorModel.findById(docId);
      if (docData) {
        let slots_booked = docData.slots_booked || {};
        if (slots_booked[slotDate]) {
          slots_booked[slotDate] = slots_booked[slotDate].filter(
            (time) => time !== slotTime
          );
          await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }
      }
    }

    await appointmentModel.findByIdAndDelete(appointmentId);
    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to reschedule appointment by admin
const rescheduleAppointmentAdmin = async (req, res) => {
  try {
    const { appointmentId, newSlotDate, newSlotTime } = req.body;
    if (!appointmentId || !newSlotDate || !newSlotTime) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const { docId, slotDate: oldSlotDate, slotTime: oldSlotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = docData.slots_booked || {};

    // 1. Release the old slot
    if (slots_booked[oldSlotDate]) {
      slots_booked[oldSlotDate] = slots_booked[oldSlotDate].filter(
        (time) => time !== oldSlotTime
      );
    }

    // 2. Check if new slot is available
    if (slots_booked[newSlotDate] && slots_booked[newSlotDate].includes(newSlotTime)) {
      return res.status(400).json({ success: false, message: "The requested new slot is already booked" });
    }

    // 3. Book the new slot
    if (slots_booked[newSlotDate]) {
      slots_booked[newSlotDate].push(newSlotTime);
    } else {
      slots_booked[newSlotDate] = [newSlotTime];
    }

    // Update doctor slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Update appointment document
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      slotDate: newSlotDate,
      slotTime: newSlotTime,
    });

    res.json({ success: true, message: "Appointment rescheduled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin,
  deleteDoctor,
  updateDoctor,
  allPatients,
  deletePatient,
  deleteAppointment,
  rescheduleAppointmentAdmin,
};
