// backend/models/category.model.js

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
