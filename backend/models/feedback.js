import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);