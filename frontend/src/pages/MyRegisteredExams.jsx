import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyRegisteredExams() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchMyExams = async () => {
    try {
      const res = await API.get("/registrations/my");
      setRegistrations(res.data);
    } catch (error) {
      setMessage("Failed to load registered exams");
    } finally {
      setLoading(false);
    }
  };

  const withdrawExam = async (examId) => {
    try {
      const res = await API.delete(`/registrations/withdraw/${examId}`);
      setMessage(res.data.message);
      fetchMyExams();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Withdraw failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchMyExams();
  }, []);

  return (
    <div className="container animate-fadeInUp">
      <div className="text-center mb-6">
        <h1 className="gradient-text text-2xl font-bold mb-4">My Registered Exams</h1>
        <p className="text-secondary">Manage your exam registrations</p>
      </div>

      <div className="flex-center mb-6">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/student")}
        >
          ← Back to Available Exams
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
          {registrations.length === 0 ? (
            <div className="card text-center">
              <h3 className="text-muted mb-4">📋 No Registered Exams</h3>
              <p className="text-secondary mb-4">You haven't registered for any exams yet</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/student")}
              >
                Browse Available Exams
              </button>
            </div>
          ) : (
            registrations.map((reg, index) => (
              <div key={reg._id} className="card animate-slideInRight" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex-between mb-4">
                  <h3 className="gradient-text text-lg font-bold">{reg.exam.courseName}</h3>
                  <span className="status status-registered">Registered</span>
                </div>
                
                <div className="grid grid-2 mb-4" style={{ gap: '12px' }}>
                  <div>
                    <strong className="text-secondary">Course Code:</strong>
                    <div className="text-primary">{reg.exam.courseCode}</div>
                  </div>
                  <div>
                    <strong className="text-secondary">Semester:</strong>
                    <div className="text-primary">{reg.exam.semester}</div>
                  </div>
                  <div>
                    <strong className="text-secondary">Exam Date:</strong>
                    <div className="text-primary">{new Date(reg.exam.examDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <strong className="text-secondary">Duration:</strong>
                    <div className="text-primary">{reg.exam.duration} mins</div>
                  </div>
                </div>
                
                <div className="flex-between mb-4">
                  <span className="text-secondary">Registered on: <strong>{new Date(reg.createdAt).toLocaleDateString()}</strong></span>
                  <span className="text-secondary">Status: Active</span>
                </div>

                <div className="flex" style={{ gap: '12px' }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => withdrawExam(reg.exam._id)}
                    style={{ flex: 1 }}
                  >
                    🚫 Withdraw from Exam
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      const examDate = new Date(reg.exam.examDate);
                      const today = new Date();
                      const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                      alert(`Exam in ${daysLeft > 0 ? daysLeft + ' days' : 'today or past'}`);
                    }}
                  >
                    📅 Check Schedule
                  </button>
                </div>

                {/* Exam countdown */}
                <div className="mt-4 p-3 text-center" style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '8px'
                }}>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>Exam Date</div>
                  <div className="text-primary font-bold">
                    {(() => {
                      const examDate = new Date(reg.exam.examDate);
                      const today = new Date();
                      const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                      
                      if (daysLeft > 0) {
                        return `${daysLeft} days remaining`;
                      } else if (daysLeft === 0) {
                        return "Today!";
                      } else {
                        return "Completed";
                      }
                    })()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyRegisteredExams;