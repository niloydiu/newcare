import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

// Load Environment Variables
dotenv.config();

// Connect Mongoose
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newcare")
  .then(() => console.log("Database Connected for seeding"))
  .catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// Cloudinary configuration removed; using direct Unsplash image URLs.

// Doctor Schema
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: Number, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const Doctor = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

    speciality: "Gynecologist",
    degree: "MBBS",
    experience: 3,
    about: "Dr. Larson has a strong commitment to delivering comprehensive medical care, focusing on gynecological health and preventive medicine.",
    fees: 60,
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 3,
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: 1,
    about: "Dr. Patel specializes in dermatology, helping patients diagnose and manage various skin conditions effectively.",
    fees: 30,
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 4,
    name: "Dr. Christopher Lee",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: 2,
    about: "Dr. Lee has a strong commitment to delivering comprehensive pediatric care, focusing on children health and early development.",
    fees: 40,
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 5,
    name: "Dr. Jennifer Garcia",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Garcia has a commitment to neurological wellness, early stroke prevention, and managing chronic headaches.",
    fees: 50,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 6,
    name: "Dr. Andrew Williams",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Williams is committed to diagnosing complex neurological disorders and providing targeted therapies.",
    fees: 50,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 7,
    name: "Dr. Christopher Davis",
    speciality: "General physician",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Davis provides general health assessments and excels in chronic disease management.",
    fees: 50,
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 8,
    name: "Dr. Timothy White",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: 3,
    about: "Dr. White handles high-risk pregnancies and reproductive endocrinology consultation.",
    fees: 60,
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 9,
    name: "Dr. Ava Mitchell",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: 1,
    about: "Dr. Mitchell is a skincare expert, specialized in acne treatments and cosmetic skin enhancements.",
    fees: 30,
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 10,
    name: "Dr. Jeffrey King",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: 2,
    about: "Dr. King provides children's vaccinations, health checkups, and pediatric guidance.",
    fees: 40,
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 11,
    name: "Dr. Zoe Kelly",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Kelly handles neuropathy treatments, spinal health, and sleep disorder diagnosis.",
    fees: 50,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 12,
    name: "Dr. Patrick Harris",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Harris offers specialized care for nervous system issues and migraines.",
    fees: 50,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 13,
    name: "Dr. Chloe Evans",
    speciality: "General physician",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Evans delivers primary care with a focus on comprehensive health maintenance.",
    fees: 50,
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 14,
    name: "Dr. Ryan Martinez",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: 3,
    about: "Dr. Martinez is focused on family planning, prenatal care, and women's health checkups.",
    fees: 60,
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 15,
    name: "Dr. Amelia Hill",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: 1,
    about: "Dr. Hill treats eczema, psoriasis, and coordinates allergy treatments.",
    fees: 30,
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
];

const seedDoctors = async () => {
  try {
    console.log("Clearing existing doctors...");
    await Doctor.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("doctor123", salt);

    console.log("Uploading doctor images to Cloudinary and saving to database...");
    
    for (const doc of doctorsData) {
      const email = `doctor${doc.idNum}@newcare.com`;
      const imagePath = path.resolve(`../frontend/src/assets/assets_frontend/doc${doc.idNum}.png`);

      if (!fs.existsSync(imagePath)) {
        console.error(`Image not found at ${imagePath}, skipping doctor ${doc.name}`);
        continue;
      }

      // Use a deterministic Unsplash image based on doctor id and gender placeholder
      const unsplashUrl = `https://source.unsplash.com/featured/300x300?person,${doc.idNum}`;

      const doctorDoc = new Doctor({
        name: doc.name,
        email: email,
        password: defaultPassword,
        image: unsplashUrl,
        speciality: doc.speciality,
        degree: doc.degree,
        experience: doc.experience,
        about: doc.about,
        fees: doc.fees,
        address: doc.address,
        date: Date.now(),
      });

      await doctorDoc.save();
      console.log(`Successfully seeded ${doc.name} (Email: ${email})`);
    }

    console.log("Seeding completed successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDoctors();
