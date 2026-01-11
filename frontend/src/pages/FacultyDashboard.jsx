import { useState, useEffect } from "react";
import API from "../services/api";

function FacultyDashboard() {
  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    examDate: "",
    duration: "",
    capacity: "",
    semester: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [myExams, setMyExams] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createExam = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await API.post("/exams/create", form);
      setMessage("Exam created successfully! Pending admin approval.");
      
      setForm({
        courseCode: "",
        courseName: "",
        examDate: "",
        duration: "",
        capacity: "",
        semester: "",
      });
      
      fetchMyExams();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyExams = async () => {
    try {
      const res = await API.get("/exams/faculty");
      setMyExams(res.data);
    } catch (error) {
      console.error("Failed to fetch exams");
    }
  };

  useEffect(() => {
    fetchMyExams();
  }, []);

  return (
    <div className="container animate-fadeInUp">
      <div className="text-center mb-6">
        <h1 className="gradient-text text-2xl font-bold mb-4">Faculty Dashboard</h1>
        <p className="text-secondary">Create and manage examinations</p>
      </div>

      <div className="grid grid-2" style={{ gap: '32px' }}>
        {/* Create Exam Form */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 text-center">🎓 Create New Exam</h2>

          {message && (
            <div className="mb-4 p-4 text-center" style={{
              background: message.includes('success') || message.includes('successfully') 
                ? 'rgba(76, 175, 80, 0.1)' 
                : 'rgba(231, 76, 60, 0.1)',
              border: `1px solid ${message.includes('success') || message.includes('successfully') 
                ? 'rgba(76, 175, 80, 0.3)' 
                : 'rgba(231, 76, 60, 0.3)'}`,
              borderRadius: '8px',
              color: message.includes('success') || message.includes('successfully') 
                ? '#4caf50' 
                : '#e74c3c'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={createExam} className="grid grid-1" style={{ gap: '16px' }}>
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code (e.g., CS101)"
              value={form.courseCode}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={form.courseName}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="date"
              name="examDate"
              value={form.examDate}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={form.duration}
              onChange={handleChange}
              required
              className="input"
              min="30"
              max="300"
            />

            <input
              type="number"
              name="capacity"
              placeholder="Student Capacity"
              value={form.capacity}
              onChange={handleChange}
              required
              className="input"
              min="1"
              max="500"
            />

            <input
              type="number"
              name="semester"
              placeholder="Semester"
              value={form.semester}
              onChange={handleChange}
              required
              className="input"
              min="1"
              max="8"
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="spinner"></span>}
              {loading ? "Creating..." : "✨ Create Exam"}
            </button>
          </form>
        </div>

        {/* My Exams List */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 text-center">📋 My Created Exams</h2>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {myExams.length === 0 ? (
              <div className="text-center text-muted">
                <p>No exams created yet</p>
                <p style={{ fontSize: '12px' }}>Create your first exam using the form</p>
              </div>
            ) : (
              <div className="grid grid-1" style={{ gap: '12px' }}>
                {myExams.map((exam) => (
                  <div key={exam._id} className="p-4" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex-between mb-2">
                      <strong className="text-primary">{exam.courseName}</strong>
                      <span className={`status ${exam.status === 'approved' ? 'status-approved' : 'status-pending'}`}>
                        {exam.status}
                      </span>
                    </div>
                    <div className="text-secondary" style={{ fontSize: '14px' }}>
                      {exam.courseCode} • {new Date(exam.examDate).toLocaleDateString()} • {exam.duration}min
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;