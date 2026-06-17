# Student Management System

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL

### Frontend
- React.js
- Axios
- React Icons

---

## Features

### Student Management
- Add Student
- Edit Student
- Delete Student
- View Student Details

### Marks Management
- Add Marks
- View Marks
- Calculate Average Marks

### Pagination
- Previous / Next Navigation
- Total Pages
- Current Page

### Validation
- Name Required
- Valid Email Required
- Age > 0
- Marks Between 0 and 100

---

## Database Design

### Students Table

```sql
CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Marks Table

```sql
CREATE TABLE marks(
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    marks INT NOT NULL CHECK(marks >= 0 AND marks <= 100)
);
```

---

## API Endpoints

### Students

GET /students

GET /students/:id

POST /students

PUT /students/:id

DELETE /students/:id

### Marks

GET /students/:id/marks

POST /students/:id/marks

---

## Pagination

Example:

GET /students?page=1&limit=5

Response:

- data
- totalRecords
- currentPage
- totalPages

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Author

Rutuja Jadhav