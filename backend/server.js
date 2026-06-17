require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// Home Route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});


// Create Student
app.post("/students", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const result = await pool.query(
      `INSERT INTO students(name,email,age)
       VALUES($1,$2,$3)
       RETURNING *`,
      [name, email, age]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

//Get All Students (Pagination)
app.get("/students", async (req, res) => {
  try {
    console.log("Pagination route called");
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const students = await pool.query(
      "SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const total = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    const totalRecords = parseInt(total.rows[0].count);

    res.json({
      data: students.rows,
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

// Get Student By ID
app.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await pool.query(
      "SELECT * FROM students WHERE id=$1",
      [id]
    );

    const marks = await pool.query(
      "SELECT * FROM marks WHERE student_id=$1",
      [id]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      ...student.rows[0],
      marks: marks.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});


// Update Student
app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const result = await pool.query(
      `UPDATE students
       SET name=$1,
           email=$2,
           age=$3
       WHERE id=$4
       RETURNING *`,
      [name, email, age, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});


// Delete Student
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM students WHERE id=$1",
      [id]
    );

    res.json({
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ADD MARKS
app.post("/students/:id/marks", async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, marks } = req.body;

    const result = await pool.query(
      `
      INSERT INTO marks(student_id, subject, marks)
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [id, subject, marks]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// GET MARKS OF STUDENT
app.get("/students/:id/marks", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM marks
      WHERE student_id=$1
      `,
      [id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});