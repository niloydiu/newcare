import express from "express";
import {
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
} from "../controllers/admin.controller.js";
import { changeAvailability } from "../controllers/doctor.controller.js";
import authAdmin from "../middlewares/authAdmin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// CRUD operations
adminRouter.post("/delete-doctor", authAdmin, deleteDoctor);
adminRouter.post("/update-doctor", authAdmin, upload.single("image"), updateDoctor);
adminRouter.get("/all-patients", authAdmin, allPatients);
adminRouter.post("/delete-patient", authAdmin, deletePatient);
adminRouter.post("/delete-appointment", authAdmin, deleteAppointment);
adminRouter.post("/reschedule-appointment", authAdmin, rescheduleAppointmentAdmin);

export default adminRouter;
