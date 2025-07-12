const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    copiedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
