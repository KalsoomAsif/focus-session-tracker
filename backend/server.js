import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sessionsRoutes from "./routes/sessions.js";

dotenv.config();

const app = express();

/* =========================
        CORS CONFIG
   ========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://focus-session-tracker.netlify.app",
  "https://cheery-cannoli-aaa4c9.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith("http://localhost:5173") ||
      origin.endsWith(".netlify.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));


// Allow preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARE
   ========================= */
app.use(express.json());

/* =========================
   ROUTES
   ========================= */
app.get("/", (req, res) => {
  res.json({ message: "Focus Session Tracker API is running" });
});

app.use("/sessions", sessionsRoutes);

/* =========================
   SERVER + DB
   ========================= */
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
