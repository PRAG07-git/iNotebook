const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//get all notes using GET  api/notes/fetchallnotes  -- login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

//add a new note using POST  api/notes/addnote  -- login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//update a note using PUT api/notes/updatenote  -- login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //write a note object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find note to be updated and update it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("not allowed");
  }
  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
});

//Delete a note using DELETE api/notes/deletenote  -- login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //find note to be deleted and delete it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("not allowed");
  }
  note = await Note.findByIdAndDelete(req.params.id);
  res.json({ success: "note is deleted" });
});

module.exports = router;
