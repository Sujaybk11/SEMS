import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("exams");

  const fetchExams = async () => {
    try {
      const res = await API.get("/exams/all");
      setExams(res.data);
    } catch (error) {
      setMessage("Failed to load exams");
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await API.get("/registrations/all");
      setRegistrations(res.data);
    } catch (error) {
      console.error("Failed to load registrations");
    }
  };

  const approveExam = async (examId) => {
    try {
      const res = await API.put(`/exams/approve/${examId}`);
      setMessage(res.data.message);
      fetchExams();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Approval failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchExams(), fetchRegistrations()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const pendingExams = exams.filter(exam => exam.status === 'pending');
  const approvedExams = exams.filter(exam => exam.status === 'approved');

  return (
    <div className="container animate-fadeInUp">
      <div className="text-center mb-6">
        <h1 className="gradient-text text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-secondary">Monitor and manage the examination system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3 mb-6">
        <div className="card text-center">
          <h3 className="text-2xl font-bold gradient-text">{exams.length}</h3>
          <p className="text-secondary">Total Exams</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold" style={{ color: '#ffc107' }}>{pendingExams.length}</h3>
          <p className="text-secondary">Pending Approval</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold" style={{ color: '#4caf50' }}>{registrations.length}</h3>
          <p className="text-secondary">Total Registrations</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex-center mb-6" style={{ gap: '16px' }}>
        <button
          className={`btn ${activeTab === 'exams' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('exams')}
        >
          📚 Manage Exams
        </button>
        <button
          className={`btn ${activeTab === 'registrations' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('registrations')}
        >
          👥 View Registrations
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
        <>
          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div className="grid grid-auto">
              {exams.length === 0 ? (
                <div className="card text-center">
                  <h3 className="text-muted mb-4">📋 No Exams Found</h3>
                  <p className="text-secondary">Exams created by faculty will appear here</p>
                </div>
              ) : (
                exams.map((exam, index) => (
                  <div key={exam._id} className="card animate-slideInRight" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-between mb-4">
                      <h3 className="gradient-text text-lg font-bold">{exam.courseName}</h3>
                      <span className={`status ${exam.status === 'approved' ? 'status-approved' : 'status-pending'}`}>
                        {exam.status}
                      </span>
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
                      <span className="text-secondary">Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                    </div>

                    {exam.status === "pending" && (
                      <button
                        className="btn btn-success"
                        onClick={() => approveExam(exam._id)}
                        style={{ width: '100%' }}
                      >
                        ✅ Approve Exam
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6 text-center">📊 Student Registrations</h2>
              
              {registrations.length === 0 ? (
                <div className="text-center text-muted">
                  <p>No registrations found</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Student</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Course</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px' }}>
                            <div>
                              <div className="text-primary font-bold">{reg.student?.name}</div>
                              <div className="text-secondary" style={{ fontSize: '12px' }}>{reg.student?.email}</div>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div>
                              <div className="text-primary">{reg.exam?.courseName}</div>
                              <div className="text-secondary" style={{ fontSize: '12px' }}>{reg.exam?.courseCode}</div>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span className={`status ${reg.status === 'registered' ? 'status-registered' : 'status-pending'}`}>
                              {reg.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                            {new Date(reg.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;