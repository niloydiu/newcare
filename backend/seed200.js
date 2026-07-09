import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newcare")
  .then(() => console.log("✅ Database Connected for seeding"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

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
    gender: { type: String, default: "male" },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
  },
  { minimize: false }
);

const Doctor = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

// Curated male photo IDs from Unsplash (real professional-looking images)
const malePhotos = [
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617173/newcare_assets/doc1.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617181/newcare_assets/doc4.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617182/newcare_assets/doc6.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617183/newcare_assets/doc7.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617184/newcare_assets/doc8.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617174/newcare_assets/doc10.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617176/newcare_assets/doc12.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617177/newcare_assets/doc14.png"
];

const femalePhotos = [
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617179/newcare_assets/doc2.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617180/newcare_assets/doc3.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617182/newcare_assets/doc5.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617185/newcare_assets/doc9.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617175/newcare_assets/doc11.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617177/newcare_assets/doc13.png",
  "https://res.cloudinary.com/dg5gwims9/image/upload/v1783617178/newcare_assets/doc15.png"
];

const specialties = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Cardiologist",
  "Orthopedic",
  "Psychiatrist",
  "ENT Specialist",
  "Oncologist",
];

const degrees = [
  "MBBS, MD",
  "MBBS, MS",
  "MBBS, DNB",
  "MBBS, DM",
  "MD, FRCS",
  "MBBS, MRCP",
  "MD, PhD",
  "MBBS, MCh",
  "MBBS, FRCP",
  "DO, MD",
];

const cities = [
  { line1: "42 Oak Street, Suite 301", line2: "New York, NY 10001" },
  { line1: "18 Medical Plaza, Floor 4", line2: "Los Angeles, CA 90001" },
  { line1: "7 Harley Street", line2: "London, W1G 9QD" },
  { line1: "23 Newgate Lane, Block B", line2: "Chicago, IL 60601" },
  { line1: "56 Riverside Drive, Suite 12", line2: "Houston, TX 77001" },
  { line1: "101 Park Avenue, Floor 8", line2: "Toronto, ON M5H 2N2" },
  { line1: "8 Queen's Road Central", line2: "Hong Kong" },
  { line1: "15 Circular Road, Unit 5", line2: "Singapore 048950" },
  { line1: "300 George Street, Level 2", line2: "Sydney, NSW 2000" },
  { line1: "22 Rue de Rivoli", line2: "Paris, 75001" },
  { line1: "9 Friedrichstraße", line2: "Berlin, 10117" },
  { line1: "44 MG Road, Bangalore", line2: "Karnataka 560001" },
  { line1: "17 Khalid Bin Walid Road", line2: "Dubai, UAE" },
  { line1: "88 Jalan Bukit Bintang", line2: "Kuala Lumpur 55100" },
  { line1: "33 Main Street, Suite 201", line2: "Boston, MA 02101" },
  { line1: "11 Avenida Paulista", line2: "São Paulo, SP 01310" },
  { line1: "55 Wentworth Avenue", line2: "Melbourne, VIC 3000" },
  { line1: "7 King Street, Floor 3", line2: "Edinburgh, EH1 1TG" },
  { line1: "29 Collins Street", line2: "Melbourne, VIC 3000" },
  { line1: "14 Bay Street, Unit 8", line2: "Vancouver, BC V6Z 2R4" },
];

const doctors = [
  // General physicians - Male
  { name: "Dr. James Anderson", gender: "male", speciality: "General physician", experience: 12, fees: 75, degree: "MBBS, MD", about: "Dr. Anderson is a board-certified general physician with over 12 years of clinical experience. He specializes in preventive care, chronic disease management, and comprehensive health assessments." },
  { name: "Dr. Michael Chen", gender: "male", speciality: "General physician", experience: 8, fees: 65, degree: "MBBS, MD", about: "Dr. Chen provides holistic primary care with expertise in managing diabetes, hypertension, and cardiovascular risk factors." },
  { name: "Dr. Robert Williams", gender: "male", speciality: "General physician", experience: 15, fees: 80, degree: "MD, FRCS", about: "With 15 years of experience, Dr. Williams excels in geriatric care and long-term chronic illness management." },
  { name: "Dr. David Kumar", gender: "male", speciality: "General physician", experience: 6, fees: 55, degree: "MBBS, DNB", about: "Dr. Kumar focuses on family medicine and preventive health, delivering compassionate care to patients of all ages." },
  { name: "Dr. Kevin O'Brien", gender: "male", speciality: "General physician", experience: 10, fees: 70, degree: "MBBS, MRCP", about: "Dr. O'Brien is dedicated to evidence-based medicine, specializing in lifestyle disease prevention and wellness coaching." },
  // General physicians - Female
  { name: "Dr. Sarah Johnson", gender: "female", speciality: "General physician", experience: 9, fees: 70, degree: "MBBS, MD", about: "Dr. Johnson brings empathy and expertise to general practice, with a special interest in women's health and mental wellness." },
  { name: "Dr. Emily Rodriguez", gender: "female", speciality: "General physician", experience: 7, fees: 60, degree: "MBBS, DNB", about: "Dr. Rodriguez specializes in preventive medicine and acute illness management with a patient-centered approach." },
  { name: "Dr. Priya Sharma", gender: "female", speciality: "General physician", experience: 11, fees: 75, degree: "MBBS, MD", about: "Dr. Sharma offers comprehensive primary care services with expertise in lifestyle medicine and chronic disease prevention." },
  { name: "Dr. Lisa Thompson", gender: "female", speciality: "General physician", experience: 5, fees: 50, degree: "MBBS, MRCP", about: "Dr. Thompson is passionate about helping patients lead healthier lives through evidence-based preventive care strategies." },
  { name: "Dr. Maria Gonzalez", gender: "female", speciality: "General physician", experience: 14, fees: 85, degree: "MD, PhD", about: "Dr. Gonzalez brings research insights into clinical practice, with expertise in complex multi-morbidity management." },

  // Cardiologists - Male
  { name: "Dr. Alexander Harrison", gender: "male", speciality: "Cardiologist", experience: 16, fees: 150, degree: "MD, DM", about: "Dr. Harrison is an interventional cardiologist specializing in coronary artery disease, heart failure, and complex cardiac procedures." },
  { name: "Dr. Benjamin Scott", gender: "male", speciality: "Cardiologist", experience: 13, fees: 140, degree: "MBBS, DM", about: "Dr. Scott excels in echocardiography and non-invasive cardiac imaging for precise heart disease diagnosis." },
  { name: "Dr. Rajesh Patel", gender: "male", speciality: "Cardiologist", experience: 18, fees: 160, degree: "MD, FRCP", about: "A pioneer in electrophysiology, Dr. Patel treats complex arrhythmias and performs catheter ablation procedures." },
  { name: "Dr. William Foster", gender: "male", speciality: "Cardiologist", experience: 10, fees: 130, degree: "MBBS, MD", about: "Dr. Foster focuses on preventive cardiology and cardiac rehabilitation for patients recovering from heart events." },
  { name: "Dr. Carlos Mendez", gender: "male", speciality: "Cardiologist", experience: 14, fees: 145, degree: "MD, PhD", about: "Dr. Mendez combines research-driven insights with clinical excellence in treating congenital and acquired heart conditions." },
  // Cardiologists - Female
  { name: "Dr. Natasha Reynolds", gender: "female", speciality: "Cardiologist", experience: 12, fees: 140, degree: "MBBS, DM", about: "Dr. Reynolds specializes in women's heart health and is a leading expert in sex-based differences in cardiac disease." },
  { name: "Dr. Aisha Mohammed", gender: "female", speciality: "Cardiologist", experience: 9, fees: 125, degree: "MBBS, MD", about: "Dr. Mohammed provides compassionate cardiac care with expertise in heart failure management and cardiac devices." },
  { name: "Dr. Jennifer Park", gender: "female", speciality: "Cardiologist", experience: 11, fees: 135, degree: "MD, FRCP", about: "Dr. Park is dedicated to preventive cardiology, helping patients reduce cardiovascular risk through lifestyle optimization." },
  { name: "Dr. Sophia Laurent", gender: "female", speciality: "Cardiologist", experience: 15, fees: 155, degree: "MD, PhD", about: "Dr. Laurent is a renowned expert in valvular heart disease and structural heart interventions." },
  { name: "Dr. Oluseyi Adeyemi", gender: "female", speciality: "Cardiologist", experience: 8, fees: 120, degree: "MBBS, DNB", about: "Dr. Adeyemi treats a wide spectrum of cardiac conditions with a focus on hypertensive heart disease and heart failure." },

  // Neurologists - Male
  { name: "Dr. Thomas Clarke", gender: "male", speciality: "Neurologist", experience: 14, fees: 135, degree: "MBBS, DM", about: "Dr. Clarke specializes in movement disorders including Parkinson's disease and essential tremor, offering cutting-edge neuromodulation therapies." },
  { name: "Dr. Jonathan Wright", gender: "male", speciality: "Neurologist", experience: 11, fees: 125, degree: "MD, DM", about: "Dr. Wright is an expert in epilepsy and seizure management, offering both medical and surgical treatment pathways." },
  { name: "Dr. Arjun Nair", gender: "male", speciality: "Neurologist", experience: 9, fees: 115, degree: "MBBS, DNB", about: "Dr. Nair provides comprehensive care for stroke patients and manages chronic neurological conditions with precision." },
  { name: "Dr. Samuel Okafor", gender: "male", speciality: "Neurologist", experience: 16, fees: 145, degree: "MD, PhD", about: "Dr. Okafor leads a research program on multiple sclerosis and delivers evidence-based disease-modifying therapies." },
  { name: "Dr. Patrick Huang", gender: "male", speciality: "Neurologist", experience: 7, fees: 110, degree: "MBBS, MD", about: "Dr. Huang specializes in headache medicine and neuromuscular disorders, providing relief for migraine and neuropathy patients." },
  // Neurologists - Female
  { name: "Dr. Eleanor Mitchell", gender: "female", speciality: "Neurologist", experience: 13, fees: 130, degree: "MBBS, DM", about: "Dr. Mitchell is an expert in dementia and cognitive neurology, helping patients and families navigate memory disorders." },
  { name: "Dr. Zara Ahmed", gender: "female", speciality: "Neurologist", experience: 10, fees: 120, degree: "MD, DM", about: "Dr. Ahmed specializes in neuroimmunology and autoimmune neurological conditions including NMOSD and encephalitis." },
  { name: "Dr. Charlotte Evans", gender: "female", speciality: "Neurologist", experience: 8, fees: 115, degree: "MBBS, MRCP", about: "Dr. Evans focuses on sleep neurology and manages complex sleep disorders including narcolepsy and REM sleep behavior disorder." },
  { name: "Dr. Mei Lin Zhou", gender: "female", speciality: "Neurologist", experience: 12, fees: 128, degree: "MD, PhD", about: "Dr. Zhou conducts groundbreaking research on neurodegeneration and applies these insights to patient care." },
  { name: "Dr. Isabelle Dupont", gender: "female", speciality: "Neurologist", experience: 6, fees: 105, degree: "MBBS, DNB", about: "Dr. Dupont provides comprehensive neurology consultations with expertise in vestibular disorders and vertigo management." },

  // Dermatologists - Male
  { name: "Dr. Andrew Cooper", gender: "male", speciality: "Dermatologist", experience: 10, fees: 100, degree: "MBBS, MD", about: "Dr. Cooper specializes in cosmetic and medical dermatology, treating acne, psoriasis, eczema, and performing laser procedures." },
  { name: "Dr. Ryan Walsh", gender: "male", speciality: "Dermatologist", experience: 7, fees: 90, degree: "MBBS, DNB", about: "Dr. Walsh is known for his expertise in dermoscopy and early skin cancer detection, offering comprehensive mole mapping services." },
  { name: "Dr. Sanjay Gupta", gender: "male", speciality: "Dermatologist", experience: 14, fees: 115, degree: "MD, FRCP", about: "Dr. Gupta brings 14 years of dermatology expertise, specializing in immunobullous diseases and complex inflammatory skin conditions." },
  { name: "Dr. Lucas Ferreira", gender: "female", speciality: "Dermatologist", experience: 5, fees: 80, degree: "MBBS, MD", about: "Dr. Ferreira focuses on aesthetic dermatology, helping patients achieve skin rejuvenation with minimal-invasive techniques." },
  { name: "Dr. Marcus Johnson", gender: "male", speciality: "Dermatologist", experience: 11, fees: 105, degree: "MD, PhD", about: "Dr. Johnson researches melanoma immunotherapy and provides advanced treatment options for skin malignancies." },
  // Dermatologists - Female
  { name: "Dr. Olivia Bennett", gender: "female", speciality: "Dermatologist", experience: 9, fees: 95, degree: "MBBS, MD", about: "Dr. Bennett specializes in pediatric dermatology and adult inflammatory skin conditions with a compassionate touch." },
  { name: "Dr. Amara Osei", gender: "female", speciality: "Dermatologist", experience: 12, fees: 110, degree: "MBBS, MRCP", about: "Dr. Osei is an expert in dermatology for skin of color, addressing conditions like keloids, hyperpigmentation, and hair loss." },
  { name: "Dr. Valentina Rossi", gender: "female", speciality: "Dermatologist", experience: 6, fees: 85, degree: "MBBS, DNB", about: "Dr. Rossi performs a range of cosmetic procedures including chemical peels, fillers, and laser resurfacing." },
  { name: "Dr. Yuki Tanaka", gender: "female", speciality: "Dermatologist", experience: 8, fees: 92, degree: "MBBS, MD", about: "Dr. Tanaka combines traditional and modern dermatology approaches to treat chronic conditions like rosacea and vitiligo." },
  { name: "Dr. Hannah Mueller", gender: "female", speciality: "Dermatologist", experience: 10, fees: 100, degree: "MD, PhD", about: "Dr. Mueller specializes in contact dermatitis and occupational skin diseases, conducting patch testing and immunotherapy." },

  // Gynecologists - Female
  { name: "Dr. Rachel Green", gender: "female", speciality: "Gynecologist", experience: 13, fees: 120, degree: "MBBS, MS", about: "Dr. Green is a board-certified OB/GYN specializing in high-risk pregnancies, maternal-fetal medicine, and minimally invasive surgery." },
  { name: "Dr. Ananya Krishnan", gender: "female", speciality: "Gynecologist", experience: 10, fees: 110, degree: "MBBS, MD", about: "Dr. Krishnan provides comprehensive gynecological care from puberty to menopause, with expertise in reproductive endocrinology." },
  { name: "Dr. Clara Rodriguez", gender: "female", speciality: "Gynecologist", experience: 8, fees: 100, degree: "MBBS, DNB", about: "Dr. Rodriguez specializes in laparoscopic gynecological surgery and infertility treatment including IVF coordination." },
  { name: "Dr. Fatima Al-Hassan", gender: "female", speciality: "Gynecologist", experience: 15, fees: 135, degree: "MD, FRCS", about: "Dr. Al-Hassan is a renowned expert in urogynecology and pelvic floor disorders, offering advanced reconstructive procedures." },
  { name: "Dr. Keiko Yamamoto", gender: "female", speciality: "Gynecologist", experience: 7, fees: 95, degree: "MBBS, MS", about: "Dr. Yamamoto focuses on adolescent gynecology and polycystic ovarian syndrome management." },
  { name: "Dr. Diana Walsh", gender: "female", speciality: "Gynecologist", experience: 11, fees: 115, degree: "MBBS, MD", about: "Dr. Walsh provides expert prenatal care, delivery services, and postpartum support for new mothers." },
  { name: "Dr. Nadia Petrov", gender: "female", speciality: "Gynecologist", experience: 9, fees: 105, degree: "MBBS, DNB", about: "Dr. Petrov specializes in endometriosis treatment and chronic pelvic pain management using evidence-based approaches." },
  { name: "Dr. Hana Kim", gender: "female", speciality: "Gynecologist", experience: 6, fees: 88, degree: "MBBS, MS", about: "Dr. Kim provides compassionate contraceptive counseling and family planning services." },
  // Gynecologists - Male
  { name: "Dr. Richard Chambers", gender: "male", speciality: "Gynecologist", experience: 17, fees: 145, degree: "MBBS, MS", about: "Dr. Chambers is an experienced gynecological oncologist specializing in cervical, ovarian, and uterine cancers." },
  { name: "Dr. Stephen Oyelaran", gender: "male", speciality: "Gynecologist", experience: 12, fees: 125, degree: "MD, MCh", about: "Dr. Oyelaran performs complex gynecological surgeries including hysterectomies and myomectomies with high success rates." },

  // Pediatricians - Male
  { name: "Dr. Noah Phillips", gender: "male", speciality: "Pediatricians", experience: 10, fees: 85, degree: "MBBS, MD", about: "Dr. Phillips provides comprehensive pediatric care from newborns to adolescents with special interest in childhood development." },
  { name: "Dr. Aditya Mehta", gender: "male", speciality: "Pediatricians", experience: 8, fees: 75, degree: "MBBS, DNB", about: "Dr. Mehta specializes in pediatric infectious diseases and immunization programs for children." },
  { name: "Dr. Chris de Souza", gender: "male", speciality: "Pediatricians", experience: 12, fees: 90, degree: "MBBS, MD", about: "Dr. de Souza manages childhood asthma, allergies, and chronic respiratory conditions with a family-centered approach." },
  { name: "Dr. Jacob Freeman", gender: "male", speciality: "Pediatricians", experience: 6, fees: 65, degree: "MBBS, MRCP", about: "Dr. Freeman focuses on neonatal care and developmental pediatrics, helping premature infants thrive." },
  { name: "Dr. Omar Hassan", gender: "male", speciality: "Pediatricians", experience: 14, fees: 100, degree: "MD, PhD", about: "Dr. Hassan leads pediatric diabetes and endocrinology clinics, managing type 1 diabetes and growth disorders in children." },
  // Pediatricians - Female
  { name: "Dr. Emma Roberts", gender: "female", speciality: "Pediatricians", experience: 9, fees: 80, degree: "MBBS, MD", about: "Dr. Roberts provides warm, child-centered care with expertise in behavioral pediatrics and ADHD management." },
  { name: "Dr. Grace Adichie", gender: "female", speciality: "Pediatricians", experience: 11, fees: 88, degree: "MBBS, DNB", about: "Dr. Adichie is passionate about global child health and nutrition, specializing in malnutrition and growth disorders." },
  { name: "Dr. Sophie Laurent", gender: "female", speciality: "Pediatricians", experience: 7, fees: 72, degree: "MBBS, MRCP", about: "Dr. Laurent provides adolescent medicine and counseling for teenagers facing health and behavioral challenges." },
  { name: "Dr. Ling Wei", gender: "female", speciality: "Pediatricians", experience: 5, fees: 60, degree: "MBBS, MD", about: "Dr. Wei focuses on pediatric cardiology and congenital heart disease screening in newborns and children." },
  { name: "Dr. Isabella Moretti", gender: "female", speciality: "Pediatricians", experience: 13, fees: 95, degree: "MD, PhD", about: "Dr. Moretti is a pediatric neurologist specializing in childhood epilepsy and neurodevelopmental disorders." },

  // Orthopedics - Male
  { name: "Dr. Daniel Brooks", gender: "male", speciality: "Orthopedic", experience: 15, fees: 140, degree: "MBBS, MS", about: "Dr. Brooks is a leading orthopedic surgeon specializing in joint replacement, sports injuries, and arthroscopic surgery." },
  { name: "Dr. Anthony Torres", gender: "male", speciality: "Orthopedic", experience: 12, fees: 130, degree: "MBBS, MCh", about: "Dr. Torres excels in spine surgery including disc herniation repairs and spinal decompression procedures." },
  { name: "Dr. Ibrahim Al-Sayed", gender: "male", speciality: "Orthopedic", experience: 9, fees: 120, degree: "MBBS, MS", about: "Dr. Al-Sayed specializes in trauma orthopedics, managing complex fractures and musculoskeletal injuries." },
  { name: "Dr. Peter Kovalenko", gender: "male", speciality: "Orthopedic", experience: 18, fees: 160, degree: "MD, FRCS", about: "Dr. Kovalenko is a pioneer in minimally invasive joint replacement surgery with over 2000 successful procedures." },
  { name: "Dr. Rohan Desai", gender: "male", speciality: "Orthopedic", experience: 7, fees: 110, degree: "MBBS, DNB", about: "Dr. Desai provides expert care for sports-related knee and shoulder injuries with advanced rehabilitation protocols." },
  { name: "Dr. Charles Nwosu", gender: "male", speciality: "Orthopedic", experience: 11, fees: 128, degree: "MBBS, MS", about: "Dr. Nwosu specializes in pediatric orthopedics and manages scoliosis, club foot, and limb deformities in children." },
  // Orthopedics - Female
  { name: "Dr. Victoria Sterling", gender: "female", speciality: "Orthopedic", experience: 10, fees: 125, degree: "MBBS, MS", about: "Dr. Sterling specializes in osteoporosis management and fragility fracture prevention in elderly patients." },
  { name: "Dr. Preethi Rajan", gender: "female", speciality: "Orthopedic", experience: 8, fees: 115, degree: "MBBS, DNB", about: "Dr. Rajan provides comprehensive care for rheumatoid arthritis and other inflammatory joint conditions." },

  // Psychiatrists - Male
  { name: "Dr. Ethan Marshall", gender: "male", speciality: "Psychiatrist", experience: 13, fees: 130, degree: "MBBS, MD", about: "Dr. Marshall specializes in mood disorders, anxiety, and PTSD, offering both pharmacotherapy and evidence-based psychotherapy." },
  { name: "Dr. Xavier Beaumont", gender: "male", speciality: "Psychiatrist", experience: 10, fees: 120, degree: "MD, PhD", about: "Dr. Beaumont is an expert in bipolar disorder and schizophrenia spectrum conditions with a recovery-focused approach." },
  { name: "Dr. Vikram Singh", gender: "male", speciality: "Psychiatrist", experience: 8, fees: 110, degree: "MBBS, MD", about: "Dr. Singh provides culturally sensitive psychiatric care with expertise in addiction medicine and substance use disorders." },
  { name: "Dr. Leon Adler", gender: "male", speciality: "Psychiatrist", experience: 16, fees: 150, degree: "MD, FRCP", about: "Dr. Adler is a leading child and adolescent psychiatrist specializing in neurodevelopmental conditions like autism and ADHD." },
  { name: "Dr. Marcus Webb", gender: "male", speciality: "Psychiatrist", experience: 6, fees: 100, degree: "MBBS, DNB", about: "Dr. Webb focuses on trauma-informed psychiatry and uses EMDR alongside medication management for PTSD treatment." },
  // Psychiatrists - Female
  { name: "Dr. Rebecca Stone", gender: "female", speciality: "Psychiatrist", experience: 14, fees: 140, degree: "MBBS, MD", about: "Dr. Stone specializes in perinatal psychiatry, supporting women through postpartum depression and pregnancy-related mental health." },
  { name: "Dr. Layla Hassan", gender: "female", speciality: "Psychiatrist", experience: 9, fees: 115, degree: "MD, PhD", about: "Dr. Hassan provides comprehensive assessment and treatment for eating disorders and body dysmorphic disorders." },
  { name: "Dr. Anna Sokolov", gender: "female", speciality: "Psychiatrist", experience: 11, fees: 125, degree: "MBBS, MD", about: "Dr. Sokolov offers integrative psychiatry combining biological, psychological, and social treatment approaches." },
  { name: "Dr. Nkechi Eze", gender: "female", speciality: "Psychiatrist", experience: 7, fees: 105, degree: "MBBS, MRCP", about: "Dr. Eze specializes in geriatric psychiatry, managing dementia-related behavioral symptoms and late-life depression." },

  // ENT Specialists - Male
  { name: "Dr. Sebastian Müller", gender: "male", speciality: "ENT Specialist", experience: 12, fees: 115, degree: "MBBS, MS", about: "Dr. Müller is an expert in rhinology and endoscopic sinus surgery, treating chronic sinusitis and nasal polyps." },
  { name: "Dr. Aaron Goldstein", gender: "male", speciality: "ENT Specialist", experience: 10, fees: 110, degree: "MBBS, MS", about: "Dr. Goldstein specializes in otology and cochlear implantation for patients with severe hearing loss." },
  { name: "Dr. Kwame Asante", gender: "male", speciality: "ENT Specialist", experience: 8, fees: 100, degree: "MBBS, DNB", about: "Dr. Asante performs throat and voice surgeries including laryngoscopy and tonsillectomy with excellent outcomes." },
  { name: "Dr. Takeshi Nakamura", gender: "male", speciality: "ENT Specialist", experience: 14, fees: 125, degree: "MD, MCh", about: "Dr. Nakamura is a head and neck surgeon specializing in thyroid and salivary gland tumors." },
  // ENT Specialists - Female
  { name: "Dr. Chloe Beaumont", gender: "female", speciality: "ENT Specialist", experience: 9, fees: 105, degree: "MBBS, MS", about: "Dr. Beaumont treats pediatric and adult ENT conditions including ear infections, tonsillitis, and hearing difficulties." },
  { name: "Dr. Rina Kapoor", gender: "female", speciality: "ENT Specialist", experience: 7, fees: 95, degree: "MBBS, DNB", about: "Dr. Kapoor specializes in voice disorders and swallowing difficulties, providing laryngeal assessments and therapy." },
  { name: "Dr. Monica Chambers", gender: "female", speciality: "ENT Specialist", experience: 11, fees: 112, degree: "MBBS, MS", about: "Dr. Chambers focuses on allergy-related ENT conditions and offers comprehensive immunotherapy programs." },

  // Oncologists - Male
  { name: "Dr. Frederick Lang", gender: "male", speciality: "Oncologist", experience: 18, fees: 180, degree: "MD, DM", about: "Dr. Lang is a renowned medical oncologist specializing in lung cancer and pioneering targeted therapy protocols." },
  { name: "Dr. Emeka Obi", gender: "male", speciality: "Oncologist", experience: 14, fees: 165, degree: "MBBS, DM", about: "Dr. Obi provides compassionate cancer care with expertise in gastrointestinal malignancies and immunotherapy." },
  { name: "Dr. Hiroshi Tanaka", gender: "male", speciality: "Oncologist", experience: 16, fees: 170, degree: "MD, PhD", about: "Dr. Tanaka leads clinical trials on precision oncology and provides personalized cancer treatment plans." },
  { name: "Dr. Alexandre Blanc", gender: "male", speciality: "Oncologist", experience: 12, fees: 155, degree: "MD, FRCP", about: "Dr. Blanc specializes in hematological malignancies including leukemia, lymphoma, and multiple myeloma." },
  { name: "Dr. Chidi Nnaji", gender: "male", speciality: "Oncologist", experience: 10, fees: 148, degree: "MBBS, DNB", about: "Dr. Nnaji focuses on breast cancer treatment and survivorship care, offering multidisciplinary management." },
  // Oncologists - Female
  { name: "Dr. Sandra Christensen", gender: "female", speciality: "Oncologist", experience: 15, fees: 170, degree: "MD, DM", about: "Dr. Christensen is an expert in gynecological oncology and provides comprehensive treatment for ovarian and cervical cancers." },
  { name: "Dr. Mei Zhang", gender: "female", speciality: "Oncologist", experience: 11, fees: 155, degree: "MD, PhD", about: "Dr. Zhang specializes in pediatric oncology and brings hope to children battling cancer and blood disorders." },
  { name: "Dr. Adaeze Okonkwo", gender: "female", speciality: "Oncologist", experience: 8, fees: 142, degree: "MBBS, DM", about: "Dr. Okonkwo provides palliative cancer care focused on quality of life and symptom management." },
  { name: "Dr. Tatiana Voronova", gender: "female", speciality: "Oncologist", experience: 13, fees: 160, degree: "MD, FRCP", about: "Dr. Voronova specializes in radiation oncology and designs precise treatment plans minimizing side effects." },

  // Extended list - additional doctors across all specialties
  { name: "Dr. George Kimani", gender: "male", speciality: "General physician", experience: 5, fees: 50, degree: "MBBS, DNB", about: "Dr. Kimani provides accessible primary care with expertise in tropical medicine and infectious diseases." },
  { name: "Dr. Hassan Al-Rashidi", gender: "male", speciality: "General physician", experience: 9, fees: 68, degree: "MBBS, MD", about: "Dr. Al-Rashidi specializes in travel medicine, occupational health, and comprehensive health screening." },
  { name: "Dr. Liam O'Sullivan", gender: "male", speciality: "General physician", experience: 12, fees: 72, degree: "MBBS, MRCP", about: "Dr. O'Sullivan is passionate about community health and managing long-term conditions like COPD and type 2 diabetes." },
  { name: "Dr. Tae-yang Park", gender: "male", speciality: "General physician", experience: 7, fees: 60, degree: "MBBS, DNB", about: "Dr. Park offers comprehensive preventive screenings and acute illness care with a patient-first philosophy." },
  { name: "Dr. Chioma Obi", gender: "female", speciality: "General physician", experience: 8, fees: 65, degree: "MBBS, MD", about: "Dr. Obi provides compassionate family medicine with expertise in mental health and chronic disease integration." },
  { name: "Dr. Ingrid Larsson", gender: "female", speciality: "General physician", experience: 10, fees: 70, degree: "MBBS, MRCP", about: "Dr. Larsson focuses on evidence-based preventive medicine and healthy aging strategies." },
  { name: "Dr. Fatou Diallo", gender: "female", speciality: "General physician", experience: 6, fees: 55, degree: "MBBS, DNB", about: "Dr. Diallo serves underserved communities with comprehensive primary care and maternal health services." },
  { name: "Dr. Yoshiko Hayashi", gender: "female", speciality: "General physician", experience: 11, fees: 74, degree: "MBBS, MD", about: "Dr. Hayashi specializes in integrative medicine combining conventional and complementary approaches." },

  { name: "Dr. Nathan Cole", gender: "male", speciality: "Cardiologist", experience: 9, fees: 130, degree: "MBBS, DM", about: "Dr. Cole focuses on advanced heart failure therapies and cardiac resynchronization treatment." },
  { name: "Dr. Finn Johansson", gender: "male", speciality: "Cardiologist", experience: 13, fees: 145, degree: "MD, DM", about: "Dr. Johansson specializes in preventive cardiology and lipid disorders in high-risk patients." },
  { name: "Dr. Amina Diop", gender: "female", speciality: "Cardiologist", experience: 8, fees: 122, degree: "MBBS, MD", about: "Dr. Diop treats hypertensive emergencies and manages complex cardiovascular cases." },
  { name: "Dr. Preethi Chandran", gender: "female", speciality: "Cardiologist", experience: 14, fees: 150, degree: "MD, DM", about: "Dr. Chandran is an interventional cardiologist performing angioplasty and stenting with high success rates." },

  { name: "Dr. Eli Rosenberg", gender: "male", speciality: "Neurologist", experience: 11, fees: 128, degree: "MBBS, DM", about: "Dr. Rosenberg provides expert care for Alzheimer's disease and other forms of dementia." },
  { name: "Dr. Chukwuemeka Nwofor", gender: "male", speciality: "Neurologist", experience: 7, fees: 108, degree: "MBBS, DNB", about: "Dr. Nwofor treats spinal cord injuries and peripheral neuropathies with advanced rehabilitation protocols." },
  { name: "Dr. Sumitra Patel", gender: "female", speciality: "Neurologist", experience: 9, fees: 118, degree: "MBBS, DM", about: "Dr. Patel is a stroke neurologist providing acute intervention and long-term neurological rehabilitation." },
  { name: "Dr. Linh Tran", gender: "female", speciality: "Neurologist", experience: 12, fees: 130, degree: "MD, PhD", about: "Dr. Tran specializes in rare neurological diseases and conducts clinical trials for emerging neuroprotective therapies." },

  { name: "Dr. Felipe Castro", gender: "male", speciality: "Dermatologist", experience: 8, fees: 92, degree: "MBBS, MD", about: "Dr. Castro specializes in tropical dermatology and rare parasitic skin conditions." },
  { name: "Dr. Sundar Krishnamurthy", gender: "male", speciality: "Dermatologist", experience: 13, fees: 110, degree: "MBBS, DNB", about: "Dr. Krishnamurthy offers comprehensive management of chronic urticaria and autoimmune blistering disorders." },
  { name: "Dr. Elif Yilmaz", gender: "female", speciality: "Dermatologist", experience: 7, fees: 88, degree: "MBBS, MD", about: "Dr. Yilmaz performs advanced dermatological laser treatments and non-surgical aesthetic procedures." },
  { name: "Dr. Chidinma Eze", gender: "female", speciality: "Dermatologist", experience: 10, fees: 100, degree: "MBBS, MRCP", about: "Dr. Eze specializes in hair loss disorders including alopecia areata and hair restoration strategies." },

  { name: "Dr. Brendan O'Connell", gender: "male", speciality: "Gynecologist", experience: 14, fees: 135, degree: "MBBS, MCh", about: "Dr. O'Connell is a gynecological laparoscopist specializing in endometriosis and ovarian cyst management." },
  { name: "Dr. Kavya Reddy", gender: "female", speciality: "Gynecologist", experience: 8, fees: 100, degree: "MBBS, MS", about: "Dr. Reddy provides expert colposcopy and cervical cancer prevention services." },
  { name: "Dr. Amabel Cruz", gender: "female", speciality: "Gynecologist", experience: 11, fees: 115, degree: "MBBS, MD", about: "Dr. Cruz specializes in menopausal health and hormone replacement therapy." },
  { name: "Dr. Njideka Agu", gender: "female", speciality: "Gynecologist", experience: 6, fees: 90, degree: "MBBS, DNB", about: "Dr. Agu supports women through fertility challenges with evidence-based reproductive medicine approaches." },

  { name: "Dr. Samuel Boateng", gender: "male", speciality: "Pediatricians", experience: 9, fees: 80, degree: "MBBS, MD", about: "Dr. Boateng manages childhood obesity and metabolic syndrome with family-centered lifestyle interventions." },
  { name: "Dr. Ji-won Kim", gender: "male", speciality: "Pediatricians", experience: 7, fees: 72, degree: "MBBS, DNB", about: "Dr. Kim specializes in neonatal intensive care and management of premature infants." },
  { name: "Dr. Aigerim Bekova", gender: "female", speciality: "Pediatricians", experience: 10, fees: 84, degree: "MBBS, MD", about: "Dr. Bekova provides compassionate care for children with autism spectrum disorder and related conditions." },
  { name: "Dr. Temitope Adesanya", gender: "female", speciality: "Pediatricians", experience: 8, fees: 78, degree: "MBBS, MRCP", about: "Dr. Adesanya offers expert management of childhood asthma and food allergy desensitization." },

  { name: "Dr. Michal Novak", gender: "male", speciality: "Orthopedic", experience: 13, fees: 132, degree: "MBBS, MS", about: "Dr. Novak specializes in knee replacement and ACL reconstruction for athletes and active individuals." },
  { name: "Dr. Adekunle Olayinka", gender: "male", speciality: "Orthopedic", experience: 10, fees: 122, degree: "MBBS, DNB", about: "Dr. Olayinka performs robotic-assisted joint replacement surgeries with faster recovery times." },
  { name: "Dr. Sunhee Jang", gender: "female", speciality: "Orthopedic", experience: 8, fees: 115, degree: "MBBS, MS", about: "Dr. Jang specializes in shoulder and elbow surgery for athletes and occupational injuries." },
  { name: "Dr. Beatriz Lima", gender: "female", speciality: "Orthopedic", experience: 11, fees: 125, degree: "MBBS, MCh", about: "Dr. Lima focuses on hand surgery and microsurgery for complex upper extremity injuries." },

  { name: "Dr. Obi Uchenna", gender: "male", speciality: "Psychiatrist", experience: 10, fees: 118, degree: "MBBS, MD", about: "Dr. Uchenna provides culturally inclusive psychiatric care and specializes in transcultural psychiatry." },
  { name: "Dr. Andrei Popescu", gender: "male", speciality: "Psychiatrist", experience: 7, fees: 105, degree: "MBBS, DNB", about: "Dr. Popescu focuses on OCD and anxiety spectrum disorders using CBT and medication management." },
  { name: "Dr. Kezia Wanjiku", gender: "female", speciality: "Psychiatrist", experience: 9, fees: 112, degree: "MBBS, MD", about: "Dr. Wanjiku specializes in depression and suicidality risk assessment with crisis intervention expertise." },
  { name: "Dr. Margot Fournier", gender: "female", speciality: "Psychiatrist", experience: 12, fees: 128, degree: "MD, PhD", about: "Dr. Fournier combines psychoanalytic theory and modern neuroscience in her integrative treatment approach." },

  { name: "Dr. Babatunde Adegoke", gender: "male", speciality: "ENT Specialist", experience: 12, fees: 115, degree: "MBBS, MS", about: "Dr. Adegoke performs reconstructive ear surgeries and treats complex otological conditions." },
  { name: "Dr. Evgeny Petrov", gender: "male", speciality: "ENT Specialist", experience: 8, fees: 102, degree: "MBBS, DNB", about: "Dr. Petrov specializes in sleep apnea and snoring disorders, offering surgical and non-surgical solutions." },
  { name: "Dr. Yasmin Yusuf", gender: "female", speciality: "ENT Specialist", experience: 7, fees: 96, degree: "MBBS, MS", about: "Dr. Yusuf provides expert rhinoplasty consultations and functional nasal reconstruction surgeries." },
  { name: "Dr. Brigitte Fontaine", gender: "female", speciality: "ENT Specialist", experience: 10, fees: 108, degree: "MBBS, MRCP", about: "Dr. Fontaine specializes in vestibular rehabilitation and dizziness management." },

  { name: "Dr. Santiago Reyes", gender: "male", speciality: "Oncologist", experience: 12, fees: 158, degree: "MBBS, DM", about: "Dr. Reyes focuses on prostate and urological cancers with expertise in robotic oncological surgery." },
  { name: "Dr. Olumide Adeyemi", gender: "male", speciality: "Oncologist", experience: 9, fees: 148, degree: "MBBS, DNB", about: "Dr. Adeyemi specializes in cancer genetics and hereditary cancer syndrome counseling." },
  { name: "Dr. Larisa Voron", gender: "female", speciality: "Oncologist", experience: 14, fees: 168, degree: "MD, DM", about: "Dr. Voron leads immunotherapy clinical trials and provides cutting-edge cancer treatment protocols." },
  { name: "Dr. Serena Asante", gender: "female", speciality: "Oncologist", experience: 10, fees: 152, degree: "MD, FRCP", about: "Dr. Asante specializes in lymphoma treatment and bone marrow transplant coordination." },

  // Final batch to reach 200
  { name: "Dr. Pavel Dvorak", gender: "male", speciality: "General physician", experience: 8, fees: 62, degree: "MBBS, MD", about: "Dr. Dvorak provides thorough primary care consultations with a focus on preventive screenings and vaccinations." },
  { name: "Dr. Jamal Osman", gender: "male", speciality: "General physician", experience: 6, fees: 55, degree: "MBBS, DNB", about: "Dr. Osman specializes in managing chronic pain conditions and lifestyle-related diseases." },
  { name: "Dr. Blessing Onyeka", gender: "female", speciality: "General physician", experience: 9, fees: 67, degree: "MBBS, MD", about: "Dr. Onyeka advocates for holistic primary care including mental, physical, and social wellbeing." },
  { name: "Dr. Miriam Abebe", gender: "female", speciality: "General physician", experience: 7, fees: 60, degree: "MBBS, DNB", about: "Dr. Abebe specializes in maternal and child health and reproductive care in primary settings." },
  { name: "Dr. Ahmed Siddiqui", gender: "male", speciality: "Cardiologist", experience: 10, fees: 132, degree: "MBBS, DM", about: "Dr. Siddiqui specializes in pericardial diseases and advanced cardiac imaging interpretation." },
  { name: "Dr. Olena Kovalchuk", gender: "female", speciality: "Cardiologist", experience: 12, fees: 142, degree: "MD, DM", about: "Dr. Kovalchuk focuses on cardiac rehabilitation and secondary prevention after heart attacks." },
  { name: "Dr. Tariq Mahdi", gender: "male", speciality: "Neurologist", experience: 8, fees: 112, degree: "MBBS, DM", about: "Dr. Mahdi specializes in headache disorders and trigeminal neuralgia management." },
  { name: "Dr. Wanjiru Kamau", gender: "female", speciality: "Neurologist", experience: 11, fees: 124, degree: "MBBS, MD", about: "Dr. Kamau treats complex epilepsy cases and offers video-EEG monitoring for seizure classification." },
  { name: "Dr. Boris Shapiro", gender: "male", speciality: "Dermatologist", experience: 14, fees: 112, degree: "MD, PhD", about: "Dr. Shapiro specializes in dermato-oncology and Mohs micrographic surgery for skin cancers." },
  { name: "Dr. Nadia Mansour", gender: "female", speciality: "Dermatologist", experience: 6, fees: 84, degree: "MBBS, MD", about: "Dr. Mansour focuses on acne management and teen skin health education." },
  { name: "Dr. Obiora Okonkwo", gender: "male", speciality: "Gynecologist", experience: 15, fees: 138, degree: "MBBS, MS", about: "Dr. Okonkwo performs advanced hysteroscopic surgeries and treats intrauterine pathologies." },
  { name: "Dr. Alinta Watson", gender: "female", speciality: "Gynecologist", experience: 9, fees: 104, degree: "MBBS, MD", about: "Dr. Watson advocates for Indigenous women's health and culturally safe obstetric care." },
  { name: "Dr. Kabir Salisu", gender: "male", speciality: "Pediatricians", experience: 11, fees: 87, degree: "MBBS, MD", about: "Dr. Salisu specializes in pediatric tropical diseases and vaccination research programs." },
  { name: "Dr. Minako Ito", gender: "female", speciality: "Pediatricians", experience: 8, fees: 76, degree: "MBBS, MRCP", about: "Dr. Ito manages childhood allergies and atopic conditions with evidence-based protocols." },
  { name: "Dr. Grzegorz Wiśniewski", gender: "male", speciality: "Orthopedic", experience: 16, fees: 148, degree: "MD, FRCS", about: "Dr. Wiśniewski specializes in complex spine deformity corrections and scoliosis surgery." },
  { name: "Dr. Amara Sesay", gender: "female", speciality: "Orthopedic", experience: 9, fees: 118, degree: "MBBS, MS", about: "Dr. Sesay provides expert sports medicine care for professional athletes and active individuals." },
  { name: "Dr. Jens Olsen", gender: "male", speciality: "Psychiatrist", experience: 11, fees: 122, degree: "MBBS, MD", about: "Dr. Olsen specializes in forensic psychiatry and serves courts and correctional institutions." },
  { name: "Dr. Chinwe Nwosu", gender: "female", speciality: "Psychiatrist", experience: 8, fees: 110, degree: "MBBS, DNB", about: "Dr. Nwosu provides support for grief, loss, and life transitions through evidence-based therapies." },
  { name: "Dr. Mehmet Yildirim", gender: "male", speciality: "ENT Specialist", experience: 13, fees: 118, degree: "MBBS, MS", about: "Dr. Yildirim specializes in cochlear implant programming and auditory rehabilitation." },
  { name: "Dr. Fatumah Nakibuuka", gender: "female", speciality: "ENT Specialist", experience: 9, fees: 100, degree: "MBBS, DNB", about: "Dr. Nakibuuka provides ENT care for underserved communities and specializes in cleft palate speech therapy." },
  { name: "Dr. Ricardo Alves", gender: "male", speciality: "Oncologist", experience: 11, fees: 152, degree: "MBBS, DM", about: "Dr. Alves specializes in colorectal and hepatobiliary cancers with expertise in laparoscopic oncology." },
  { name: "Dr. Grace Mwangi", gender: "female", speciality: "Oncologist", experience: 9, fees: 144, degree: "MBBS, DNB", about: "Dr. Mwangi provides palliative oncological care and leads quality-of-life improvement programs for cancer patients." },
  { name: "Dr. Youssef Khalil", gender: "male", speciality: "General physician", experience: 10, fees: 70, degree: "MBBS, MRCP", about: "Dr. Khalil specializes in managing complex chronic conditions including heart failure, diabetes, and COPD." },
  { name: "Dr. Adwoa Darko", gender: "female", speciality: "General physician", experience: 8, fees: 64, degree: "MBBS, MD", about: "Dr. Darko delivers comprehensive women's health and family planning services in primary care settings." },
  { name: "Dr. Kenneth Owusu", gender: "male", speciality: "Cardiologist", experience: 8, fees: 128, degree: "MBBS, DM", about: "Dr. Owusu focuses on hypertension management and cardiac risk stratification." },
  { name: "Dr. Binnaz Aksoy", gender: "female", speciality: "Cardiologist", experience: 11, fees: 138, degree: "MBBS, MD", about: "Dr. Aksoy specializes in echocardiography and non-invasive cardiac imaging diagnostics." },
  { name: "Dr. Dmitri Volkov", gender: "male", speciality: "Neurologist", experience: 14, fees: 138, degree: "MD, DM", about: "Dr. Volkov has extensive expertise in neurointensive care and traumatic brain injury management." },
  { name: "Dr. Afolake Balogun", gender: "female", speciality: "Neurologist", experience: 7, fees: 108, degree: "MBBS, DNB", about: "Dr. Balogun focuses on neuromuscular disease clinics and motor neuron disease management." },
  { name: "Dr. Alistair MacGregor", gender: "male", speciality: "Dermatologist", experience: 11, fees: 105, degree: "MBBS, MRCP", about: "Dr. MacGregor specializes in allergic skin diseases and provides comprehensive patch testing services." },
  { name: "Dr. Folake Adeyemi", gender: "female", speciality: "Dermatologist", experience: 9, fees: 96, degree: "MBBS, MD", about: "Dr. Adeyemi treats hair and scalp disorders including traction alopecia and fungal infections." },
  { name: "Dr. Petros Stavros", gender: "male", speciality: "Gynecologist", experience: 13, fees: 130, degree: "MBBS, MCh", about: "Dr. Stavros specializes in gynaecological oncology and cervical cancer screening programs." },
  { name: "Dr. Mireille Nguyen", gender: "female", speciality: "Gynecologist", experience: 10, fees: 108, degree: "MBBS, MS", about: "Dr. Nguyen provides expert care in reproductive endocrinology and infertility treatment." },
  { name: "Dr. Emmanuel Tchoumba", gender: "male", speciality: "Pediatricians", experience: 12, fees: 88, degree: "MBBS, MD", about: "Dr. Tchoumba manages complex pediatric cardiac conditions and congenital heart disease surveillance." },
  { name: "Dr. Shreya Deshpande", gender: "female", speciality: "Pediatricians", experience: 9, fees: 80, degree: "MBBS, DNB", about: "Dr. Deshpande specializes in childhood nutrition and feeding difficulties in infants and toddlers." },
  { name: "Dr. Lars Andersen", gender: "male", speciality: "Orthopedic", experience: 14, fees: 135, degree: "MBBS, MS", about: "Dr. Andersen specializes in upper limb reconstruction and tendon transfer surgeries." },
  { name: "Dr. Chiamaka Nweke", gender: "female", speciality: "Orthopedic", experience: 7, fees: 110, degree: "MBBS, DNB", about: "Dr. Nweke treats bone infections (osteomyelitis) and complex trauma reconstruction cases." },
  { name: "Dr. Aleksandr Ivanov", gender: "male", speciality: "Psychiatrist", experience: 15, fees: 142, degree: "MD, PhD", about: "Dr. Ivanov specializes in psychosomatic medicine and the treatment of psychiatric complications of physical illness." },
  { name: "Dr. Adaobi Obiechina", gender: "female", speciality: "Psychiatrist", experience: 7, fees: 105, degree: "MBBS, MD", about: "Dr. Obiechina focuses on adolescent mental health and school-based psychiatric intervention programs." },
  { name: "Dr. Nuno Ferreira", gender: "male", speciality: "ENT Specialist", experience: 11, fees: 112, degree: "MBBS, MS", about: "Dr. Ferreira performs complex nasal reconstructive surgery and manages chronic rhinosinusitis." },
  { name: "Dr. Abena Asante", gender: "female", speciality: "ENT Specialist", experience: 8, fees: 98, degree: "MBBS, DNB", about: "Dr. Asante provides pediatric ENT services including adenotonsillectomy and grommet insertion." },
  { name: "Dr. Kofi Mensah", gender: "male", speciality: "Oncologist", experience: 10, fees: 150, degree: "MBBS, DM", about: "Dr. Mensah specializes in head and neck cancers and coordinates multidisciplinary oncology teams." },
  { name: "Dr. Ifeoma Uche", gender: "female", speciality: "Oncologist", experience: 12, fees: 158, degree: "MD, FRCP", about: "Dr. Uche provides targeted therapy and biological treatments for advanced-stage solid tumors." },
];

// ── helper to pick a unique photo per doctor
let maleIdx = 0;
let femaleIdx = 0;
function getPhoto(gender) {
  if (gender === "female") {
    const url = femalePhotos[femaleIdx % femalePhotos.length];
    femaleIdx++;
    return url;
  } else {
    const url = malePhotos[maleIdx % malePhotos.length];
    maleIdx++;
    return url;
  }
}

const seedDoctors = async () => {
  try {
    console.log("🗑️  Clearing existing doctors...");
    await Doctor.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("doctor123", salt);

    console.log(`🌱 Seeding ${doctors.length} doctors...`);

    for (let i = 0; i < doctors.length; i++) {
      const doc = doctors[i];
      const email = `${doc.name.toLowerCase().replace(/dr\.\s*/i, "").replace(/\s+/g, ".").replace(/[^a-z.]/g, "")}@newcare.com`;
      const image = getPhoto(doc.gender);
      const addressIdx = i % cities.length;

      const doctorDoc = new Doctor({
        name: doc.name,
        email: email,
        password: defaultPassword,
        image,
        speciality: doc.speciality,
        degree: doc.degree,
        experience: doc.experience,
        about: doc.about,
        fees: doc.fees,
        address: cities[addressIdx],
        date: Date.now(),
        gender: doc.gender,
        available: Math.random() > 0.2, // 80% available
        rating: +(3.8 + Math.random() * 1.2).toFixed(1),
        reviewCount: Math.floor(20 + Math.random() * 280),
      });

      await doctorDoc.save();
      process.stdout.write(`\r✅ ${i + 1}/${doctors.length} seeded: ${doc.name}`);
    }

    console.log("\n\n🎉 All doctors seeded successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDoctors();
