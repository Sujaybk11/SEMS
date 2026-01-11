import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const res = await API.get("/exams/approved");
      setExams(res.data);
    } catch (error) {
      setMessage("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const registerExam = async (examId) => {
    try {
      const res = await API.post(`/registrations/register/${examId}`);
      setMessage(res.data.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="container animate-fadeInUp">
      <div className="text-center mb-6">
        <h1 className="gradient-text text-2xl font-bold mb-4">Available Exams</h1>
        <p className="text-secondary">Register for approved examinations</p>
      </div>

      <div className="flex-center mb-6">
        <button
          className="btn btn-primary animate-pulse"
          onClick={() => navigate("/student/my-exams")}
        >
          📚 My Registered Exams
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 text-center" style={{
          background: message.includes('success') || message.includes('successfully') 
            ? 'rgba(76, 175, 80, 0.1)' 
            : 'rgba(231, 76, 60, 0.1)',
          border: `1px solid ${message.includes('success') || message.includes('successfully') 
            ? 'rgba(76, 175, 80, 0.3)' 
            : 'rgba(231, 76, 60, 0.3)'}`,
          borderRadius: '12px',
          color: message.includes('success') || message.includes('successfully') 
            ? '#4caf50' 
            : '#e74c3c'
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex-center" style={{ minHeight: '200px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : (
        <div className="grid grid-auto">
          {exams.length === 0 ? (
            <div className="card text-center">
              <h3 className="text-muted mb-4">📋 No Approved Exams</h3>
              <p className="text-secondary">Check back later for new exam announcements</p>
            </div>
          ) : (
            exams.map((exam, index) => (
              <div key={exam._id} className="card animate-slideInRight" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex-between mb-4">
                  <h3 className="gradient-text text-lg font-bold">{exam.courseName}</h3>
                  <span className="status status-approved">Approved</span>
                </div>
                
                <div className="grid grid-2 mb-4" style={{ gap: '12px' }}>
                  <div>
                    <strong className="text-secondary">Course Code:</strong>
                    <div className="text-primary">{exam.courseCode}</div>
                  </div>
                  <div>
                    <strong className="text-secondary">Semester:</strong>
                    <div className="text-primary">{exam.semester}</div>
                  </div>
                  <div>
                    <strong className="text-secondary">Date:</strong>
                    <div className="text-primary">{new Date(exam.examDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <strong className="text-secondary">Duration:</strong>
                    <div className="text-primary">{exam.duration} mins</div>
                  </div>
                </div>
                
                <div className="flex-between mb-4">
                  <span className="text-secondary">Capacity: <strong>{exam.capacity}</strong></span>
                  <span className="text-secondary">Available Seats</span>
                </div>

                <button
                  className="btn btn-success"
                  onClick={() => registerExam(exam._id)}
                  style={{ width: '100%' }}
                >
                  🎯 Register for Exam
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;