import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "./configs/cloudinary.config.js";
import connectDB from "./configs/mongoDB.config.js";
import adminRouter from "./routes/admin.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import userRouter from "./routes/user.routes.js";

// App configuration
const app = express();
const port = process.env.PORT || 5000;

// Database Connection
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// API ENDPOINTS
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// Routes
app.get("/", (req, res) => {
  res.send("Base route get function working");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
