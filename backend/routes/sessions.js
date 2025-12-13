import express from "express";
import Session from "../models/session.js";

const router = express.Router();

// GET /sessions - returns all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// GET /sessions/:id - returns one session
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: "Invalid session id" });
  }
});

// POST /sessions - create a session
router.post("/", async (req, res) => {
  try {
    const { title, subject, durationMinutes, focusRating, completed, date } = req.body;

    if (!durationMinutes) {
      return res.status(400).json({ error: "durationMinutes is required" });
    }

    const created = await Session.create({
      title,
      subject,
      durationMinutes,
      focusRating,
      completed,
      date
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /sessions/:id - update a session
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ error: "Session not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update session" });
  }
});

// DELETE /sessions/:id - delete a session
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Session.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete session" });
  }
});

export default router;
