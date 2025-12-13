import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sessionsRoutes from "./routes/sessions.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN, "http://localhost:5173"],
    credentials: true
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Focus Session Tracker API is running" });
});

app.use("/sessions", sessionsRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
