import mongoose, { model, Schema } from "mongoose";

const specialtySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { minimize: false }
);

const specialtyModel = mongoose.models.specialty || model("specialty", specialtySchema);

export default specialtyModel;
