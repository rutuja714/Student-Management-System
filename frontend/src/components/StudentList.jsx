import { useState, useEffect } from "react";
import api from "../api";
import { FaUserGraduate } from "react-icons/fa";

function StudentList() {
  const [students, setStudents] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);

  const [showAddMarks, setShowAddMarks] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadStudents = async () => {
  try {
    // const res = await api.get("/students?page=1&limit=50");
    // setStudents(res.data.data);
    const res = await api.get(
      `/students?page=${page}&limit=5`
    );

    setStudents(res.data.data);
    setTotalPages(res.data.totalPages);
  } catch (error) {
    console.error(error);
  }
};

  // useEffect(() => {
  // loadStudents();
  // }, []);
  useEffect(() => {
    loadStudents();
  }, [page]);

  const saveStudent = async (e) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (age <= 0) {
      alert("Age must be greater than 0");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, {
          name,
          email,
          age,
        });
      } else {
        await api.post("/students", {
          name,
          email,
          age,
        });
      }

      setName("");
      setEmail("");
      setAge("");
      setEditingId(null);

      loadStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const editStudent = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const viewMarks = async (id) => {
    try {
      const res = await api.get(`/students/${id}/marks`);

      setStudentMarks(res.data);
      setSelectedStudent(id);
    } catch (error) {
      console.error(error);
    }
  };

  const addMarks = async (studentId) => {
      if (!subject || !marks) {
        alert("Subject and Marks are required");
        return;
      }

      if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100");
        return;
      }
      try {
        await api.post(`/students/${studentId}/marks`, {
          subject,
          marks,
        });

        alert("Marks Added Successfully");

        setSubject("");
        setMarks("");

        viewMarks(studentId);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
      }}
          >
          <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "20px",
        }}
      >
        <FaUserGraduate
          style={{
            marginRight: "10px",
            verticalAlign: "middle",
            color: "#2563eb",
          }}
        />
        🎓 Student Management System
      </h1>

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#06b6d4)",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
          marginBottom: "20px",
          boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
        }}
      >
        <h2>Total Students</h2>
        <h1>{students.length}</h1>
      </div>

      <form
        onSubmit={saveStudent}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text" required
          placeholder="Student Name"
          value={name}
          onChange={(e) => {
            const value = e.target.value;

            if (/^[A-Za-z ]*$/.test(value)) {
              setName(value);
            }
          }}

          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="email" required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number" required
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            width: "120px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      {students.length === 0 && (
        <h3
          style={{
            textAlign: "center",
            color: "gray",
            marginTop: "20px",
          }}
        >
          No Students Found
        </h3>
      )}

      {students
        .filter((student) =>
          student.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((student) => (
          <div
          key={student.id}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-5px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0px)")
          }
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
            transition: "0.3s",
          }}
>
           <div
              style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 15px",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
>
              {student.name.charAt(0)}
            </div>

            <h2
              style={{
                marginBottom: "10px",
                color: "#1e293b",
              }}
            >
              {student.name}
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "17px",
              }}
            >
              <strong>Email:</strong> {student.email}
            </p>

            <p
              style={{
                color: "#64748b",
                fontSize: "17px",
              }}
            >
              <strong>Age:</strong> {student.age}
            </p>

            <button
              onClick={() => editStudent(student)}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
                fontWeight: "bold",
              }}
            >
              ✏️ Edit
            </button>

            <button
              onClick={() => viewMarks(student.id)}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                marginRight: "10px",
                fontWeight: "bold",
              }}
            >
              📊 View Marks
            </button>

            <button
              onClick={() => deleteStudent(student.id)}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🗑️ Delete
            </button>

            <button
              onClick={() =>
                setShowAddMarks(
                  showAddMarks === student.id ? null : student.id
                )
              }
              style={{
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              ➕ Add Marks
            </button>

            {showAddMarks === student.id && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginRight: "10px",
                  }}
                />

                <input
                  type="number"
                  placeholder="Marks"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginRight: "10px",
                  }}
                />

                <button
                  onClick={() => addMarks(student.id)}
                  style={{
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Save Marks
                </button>
              </div>
            )}

            {selectedStudent === student.id && (
              <div
                style={{
                  marginTop: "20px",
                  backgroundColor: "#f8fafc",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <h3 style={{ color: "#2563eb" }}>
                  Student Marks
                </h3>

                {studentMarks.length === 0 ? (
                  <p>No Marks Available</p>
                ) : (
                  <>
                    {studentMarks.map((mark) => (
                      <div
                        key={mark.id}
                        style={{
                          padding: "10px",
                          marginBottom: "8px",
                          backgroundColor: "#ffffff",
                          borderRadius: "5px",
                          boxShadow:
                            "0 2px 5px rgba(0,0,0,0.05)",
                        }}
                      >
                        <strong>{mark.subject}</strong>
                        {" : "}
                        {mark.marks}
                      </div>
                    ))}

                    <div
                      style={{
                        marginTop: "15px",
                        fontWeight: "bold",
                        color: "#10b981",
                        fontSize: "18px",
                      }}
                    >
                      Average Marks:{" "}
                      {(
                        studentMarks.reduce(
                          (sum, item) => sum + item.marks,
                          0
                        ) / studentMarks.length
                      ).toFixed(2)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Previous
          </button>

          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>

        <footer
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#64748b",
          }}
        >
          © 2026 Student Management System | Developed by Rutuja Jadhav
        </footer>

      </div>
  );
}

export default StudentList;