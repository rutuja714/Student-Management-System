CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT CHECK(age > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks INT CHECK(marks BETWEEN 0 AND 100),

    FOREIGN KEY(student_id)
    REFERENCES students(id)
    ON DELETE CASCADE
);

CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    marks INT NOT NULL CHECK (marks >= 0 AND marks <= 100)
);