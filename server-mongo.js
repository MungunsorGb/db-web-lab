const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// MongoDB Student model
const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 16 },
    city: String,
    course: String
  })
);

// GET - бүх оюутны жагсаалт
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find()
      .sort({ _id: 1 })
      .lean();

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Серверийн алдаа"
    });
  }
});

// POST - шинэ оюутан нэмэх
app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// MongoDB Atlas холболт
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected!");
    console.log("Database:", mongoose.connection.name);
    console.log("Collection:", Student.collection.name);

    const count = await Student.countDocuments();
    console.log("Students count:", count);

    app.listen(3000, () => {
      console.log("http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
  });