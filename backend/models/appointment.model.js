import mongoose, { model, Schema } from "mongoose";

const appointmentSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
    required: true,
  },
  slotDate: {
    type: String,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  docData: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
    default: "",
  },
  isReviewed: {
    type: Boolean,
    default: false,
  },
  prescription: {
    type: Object,
    default: null,
  },
});

const appointmentModel =
  mongoose.models.appointment || model("appointment", appointmentSchema);

export default appointmentModel;
