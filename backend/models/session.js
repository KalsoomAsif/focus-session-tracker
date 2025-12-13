import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "Focus Session" },
    subject: { type: String, trim: true, default: "General" },
    durationMinutes: { type: Number, required: true, min: 1 },
    focusRating: { type: Number, min: 1, max: 5, default: 3 },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
