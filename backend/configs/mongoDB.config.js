import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    mongoose.connection.on("error", (err) =>
      console.log("Database Connection Error:", err.message)
    );
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("Failed to establish initial Database Connection:", error.message);
  }
};

export default connectDB;
