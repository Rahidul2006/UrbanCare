const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Civic Issue Reporting App", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const issueSchema = new mongoose.Schema({
  description: String,
  image: String, // store filename
});
const Issue = mongoose.model("Issue", issueSchema);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  const newIssue = new Issue({
    description: req.body.description,
    image: req.file.filename,
  });
  await newIssue.save();
  res.json({ message: "Uploaded successfully!" });
});

// Get all issues (for admin)
app.get("/issues", async (req, res) => {
  const issues = await Issue.find();
  res.json(issues);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
