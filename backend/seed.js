import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Load Environment Variables
dotenv.config();

// Connect Mongoose
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newcare")
  .then(() => console.log("Database Connected for seeding"))
  .catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

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

const doctorsData = [
  {
    idNum: 1,
    name: "Dr. Richard James",
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617173/newcare_assets/doc1.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: 4,
    about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    idNum: 2,
    name: "Dr. Emily Larson",
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617179/newcare_assets/doc2.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617180/newcare_assets/doc3.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617181/newcare_assets/doc4.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617182/newcare_assets/doc5.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617182/newcare_assets/doc6.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617183/newcare_assets/doc7.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617184/newcare_assets/doc8.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617185/newcare_assets/doc9.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617174/newcare_assets/doc10.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617175/newcare_assets/doc11.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617176/newcare_assets/doc12.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617177/newcare_assets/doc13.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617177/newcare_assets/doc14.png",
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
    image: "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617178/newcare_assets/doc15.png",
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

    console.log("Seeding doctors with Cloudinary URLs...");
    
    for (const doc of doctorsData) {
      const email = `doctor${doc.idNum}@newcare.com`;

      const doctorDoc = new Doctor({
        name: doc.name,
        email: email,
        password: defaultPassword,
        image: doc.image,
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
