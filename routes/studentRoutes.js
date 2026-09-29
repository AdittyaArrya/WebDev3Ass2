const express = require("express");
const router = express.Router();
const students = require("../data/students");

let nextId = Math.max(0, ...students.map((s) => s.id)) + 1;

const isValid = (body) =>
    body &&
    typeof body.name === "string" && body.name.trim() !== "" &&
    typeof body.course === "string" && body.course.trim() !== "";

// GET /students
router.get("/", (req, res) => {
    res.status(200).json(students);
});

// GET /students/:id
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }
    const student = students.find((s) => s.id === id);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
});

// POST /students
router.post("/", (req, res) => {
    if (!isValid(req.body)) {
        return res.status(400).json({ error: "name and course are required" });
    }
    const newStudent = {
        id: nextId++,
        name: req.body.name.trim(),
        course: req.body.course.trim(),
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// PUT /students/:id
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }
    const student = students.find((s) => s.id === id);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    if (!isValid(req.body)) {
        return res.status(400).json({ error: "name and course are required" });
    }
    student.name = req.body.name.trim();
    student.course = req.body.course.trim();
    res.status(200).json(student);
});

// DELETE /students/:id
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
    }
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
    }
    const deleted = students.splice(index, 1)[0];
    res.status(200).json({ message: "Student deleted", student: deleted });
});

module.exports = router;