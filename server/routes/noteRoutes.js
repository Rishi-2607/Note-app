const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    console.log("✅ Note creation triggered");
    console.log("🔐 userId:", req.user?.userId);
    console.log("📝 title:", req.body?.title);

    const note = new Note({
      title: req.body.title,
      content: "",
      owner: req.user.userId,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("💥 Note creation error stack:", err.stack || err);
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
});

router.get("/mine", auth, async (req, res) => {
  try {
    console.log("Fetching notes for user:", req.user?.userId); // ✅ log userId
    const userNotes = await Note.find({ owner: req.user.userId }).sort({ updatedAt: -1 });
    res.json(userNotes);
  } catch (err) {
    console.error("Fetch /mine error:", err); // ✅ show full error
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to update this note" });
    }

    note.content = req.body.content;
    note.updatedAt = Date.now();
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note" });
  }
});

router.post("/save", auth, async (req, res) => {
  const { noteId, content } = req.body;

  try {
    const noteToClone = await Note.findById(noteId);
    if (!noteToClone) return res.status(404).json({ message: "Original note not found" });

    const existingCopy = await Note.findOne({
      owner: req.user.userId,
      content: content || noteToClone.content,
    });

    if (existingCopy) {
      return res.status(409).json({ message: "Note already exists in your collection" });
    }

    const newNote = new Note({
      title: noteToClone.title || "Untitled",
      content: content || noteToClone.content || "",
      owner: req.user.userId,
    });

    await newNote.save();
    res.status(201).json({ message: "Note saved to your My Notes", note: newNote });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Failed to save note" });
  }
});

module.exports = router;